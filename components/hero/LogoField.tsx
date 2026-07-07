"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import {
  BufferGeometry,
  Float32BufferAttribute,
  CanvasTexture,
  SRGBColorSpace,
  type Texture,
  type Group,
  type LineSegments,
  type LineBasicMaterial,
} from "three";
import { getP } from "@/lib/store";
import { BEAT } from "@/lib/timeline";
import { APP_LOGOS } from "@/lib/appLogos";
import { PHONE_HERO_POS } from "@/lib/phone";

// The constellation uses the SAME apps she reviews as the portfolio logo wall
// (real brand marks from /public/assets/logos), so the two halves rhyme.
const LOGOS = APP_LOGOS.slice(0, 15);

// Smooth ORBITAL FLOAT eruption: the tech-brand icons rise out of the phone and
// settle into an EVEN RING that faces the camera and floats IN FRONT of the phone
// (so nothing sits on the phone or the desk, and the bounded radius keeps every icon
// in frame). Phyllotaxis annulus for even spacing; icons fade + the ring drifts.
const N = LOGOS.length;
const PHONE = PHONE_HERO_POS; // [0, 0.95, 1.15] — icons emerge from here
const CENTER: [number, number, number] = [0, 0.98, 1.24]; // ring centre, forward of the phone
const ICON = 0.056;
const ICON_MIN = 0.45; // start size (grows as it flies out; hidden behind the phone)
const R_IN = 0.36; // pushed out so no icon sits over the phone screen in the held ring
const R_OUT = 0.52; // bounded so the ring stays within the (vertical) frame + margin
const YFLAT = 0.72; // frame is shorter than wide → squash vertically
const GOLD = Math.PI * (3 - Math.sqrt(5));

// Even phyllotaxis annulus in the camera-facing (x/y) plane, small z jitter for depth.
const OFFSETS: [number, number, number][] = LOGOS.map((_, i) => {
  const r = R_IN + (R_OUT - R_IN) * Math.sqrt((i + 0.5) / N);
  const th = i * GOLD;
  return [Math.cos(th) * r, Math.sin(th) * r * YFLAT, Math.sin(i * 2.3) * 0.11];
});

const d2 = (a: number[], b: number[]) => {
  const x = a[0] - b[0],
    y = a[1] - b[1],
    z = a[2] - b[2];
  return x * x + y * y + z * z;
};
const EDGES: [number, number][] = (() => {
  const out: [number, number][] = [];
  const seen = new Set<string>();
  for (let i = 0; i < N; i++) {
    const near = OFFSETS.map((o, j) => ({ j, d: d2(OFFSETS[i], o) }))
      .filter((x) => x.j !== i)
      .sort((a, b) => a.d - b.d);
    for (let k = 0; k < 2; k++) {
      const j = near[k].j;
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!seen.has(key)) {
        seen.add(key);
        out.push([i, j]);
      }
    }
  }
  return out;
})();

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// A favicon PNG → a uniform rounded app-icon CanvasTexture: white rounded base
// with the mark drawn edge-to-edge. The texture starts blank and fills once the
// image loads.
function roundedTexture(url: string): Texture | null {
  if (typeof document === "undefined") return null;
  const S = 128;
  const cv = document.createElement("canvas");
  cv.width = cv.height = S;
  const ctx = cv.getContext("2d");
  if (!ctx) return null;
  const tex = new CanvasTexture(cv);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 16;
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, S, S);
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(0, 0, S, S, S * 0.22);
    ctx.clip();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, S, S);
    ctx.drawImage(img, 0, 0, S, S);
    ctx.restore();
    tex.needsUpdate = true;
  };
  img.src = url;
  return tex;
}

export default function LogoField() {
  // Normalise every brand mark into a UNIFORM rounded app-icon tile so the
  // constellation reads as one cohesive set instead of a mishmash of white
  // squares, black squares and bare marks. White base → transparent marks stay
  // legible; edge-to-edge draw → full-bleed coloured icons keep their colour.
  // Canvas populates a frame or two after the image loads (fine behind the
  // preloader); guarded for SSR.
  const texs = useMemo(() => LOGOS.map((l) => roundedTexture(`/assets/logos/${l.slug}.png`)), []);
  const groups = useRef<(Group | null)[]>([]);
  const lines = useRef<LineSegments>(null);
  const lineGeo = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute(
      "position",
      new Float32BufferAttribute(new Float32Array(EDGES.length * 6), 3),
    );
    return g;
  }, []);

  useFrame((state) => {
    const p = getP();
    const t = state.clock.elapsedTime;
    const retract = smooth(BEAT.returnStart, BEAT.rotateStart, p);
    const drift = t * 0.06; // slow rotation of the ring in the screen plane
    const cs = Math.cos(drift),
      sn = Math.sin(drift);
    const wp: number[][] = [];
    for (let i = 0; i < N; i++) {
      const startP = BEAT.burstStart + (i / N) * 0.05; // gentle stagger
      const f = smooth(startP, startP + 0.2, p) * (1 - retract); // 0..1..0
      const [ox, oy, oz] = OFFSETS[i];
      // rotate the offset around the camera axis (z) so the ring orbits the phone
      const rx = ox * cs - oy * sn;
      const ry = ox * sn + oy * cs;
      const bob = Math.sin(t * 0.5 + i * 0.8) * 0.02;
      // target = ring position; lerp from the phone → target by f (emerge/return)
      const tx = CENTER[0] + rx;
      const ty = CENTER[1] + ry;
      const tz = CENTER[2] + oz + bob;
      const x = PHONE[0] + (tx - PHONE[0]) * f;
      const y = PHONE[1] + (ty - PHONE[1]) * f;
      const z = PHONE[2] + (tz - PHONE[2]) * f;
      wp.push([x, y, z]);
      const g = groups.current[i];
      if (g) {
        g.position.set(x, y, z);
        // grow OUT of the screen as solid objects (no opacity fade → no "bubble")
        g.scale.setScalar(ICON_MIN + (1 - ICON_MIN) * f);
        g.visible = f > 0.004;
      }
    }
    const field = smooth(0.32, 0.46, p) * (1 - retract);
    if (lines.current) {
      const attr = lineGeo.getAttribute("position");
      const arr = attr.array as Float32Array;
      for (let k = 0; k < EDGES.length; k++) {
        const [i, j] = EDGES[k];
        arr.set(wp[i], k * 6);
        arr.set(wp[j], k * 6 + 3);
      }
      attr.needsUpdate = true;
      (lines.current.material as LineBasicMaterial).opacity = field * 0.4;
      lines.current.visible = field > 0.003;
    }
  });

  return (
    <group>
      {LOGOS.map((logo, i) => (
        <group
          key={logo.slug}
          ref={(el) => {
            groups.current[i] = el;
          }}
          visible={false}
        >
          <Billboard>
            <mesh>
              <planeGeometry args={[ICON, ICON]} />
              <meshBasicMaterial
                map={texs[i] ?? undefined}
                transparent
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
          </Billboard>
        </group>
      ))}
      <lineSegments ref={lines} geometry={lineGeo} visible={false}>
        <lineBasicMaterial
          color="#E8C9C4"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}
