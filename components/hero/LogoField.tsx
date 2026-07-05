"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import {
  BufferGeometry,
  Float32BufferAttribute,
  type Group,
  type LineSegments,
  type LineBasicMaterial,
  type MeshBasicMaterial,
} from "three";
import { getP } from "@/lib/store";
import { BEAT } from "@/lib/timeline";
import { BRANDS, buildIconTexture } from "@/lib/brandIcons";
import { PHONE_HERO_POS } from "@/lib/phone";

// Smooth ORBITAL FLOAT eruption: the tech-brand icons rise out of the phone and
// settle into an EVEN RING that faces the camera and floats IN FRONT of the phone
// (so nothing sits on the phone or the desk, and the bounded radius keeps every icon
// in frame). Phyllotaxis annulus for even spacing; icons fade + the ring drifts.
const N = BRANDS.length;
const PHONE = PHONE_HERO_POS; // [0, 0.95, 1.15] — icons emerge from here
const CENTER: [number, number, number] = [0, 0.98, 1.24]; // ring centre, forward of the phone
const ICON = 0.056;
const R_IN = 0.28; // clear of the phone silhouette
const R_OUT = 0.5; // bounded so nothing clips the frame
const YFLAT = 0.72; // frame is shorter than wide → squash vertically
const GOLD = Math.PI * (3 - Math.sqrt(5));

// Even phyllotaxis annulus in the camera-facing (x/y) plane, small z jitter for depth.
const OFFSETS: [number, number, number][] = BRANDS.map((_, i) => {
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

export default function LogoField() {
  const texs = useMemo(() => BRANDS.map((b) => buildIconTexture(b)), []);
  const groups = useRef<(Group | null)[]>([]);
  const mats = useRef<(MeshBasicMaterial | null)[]>([]);
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
        g.scale.setScalar(0.82 + 0.18 * f); // subtle grow, no scale-pop
        g.visible = f > 0.003;
      }
      const m = mats.current[i];
      if (m) m.opacity = Math.min(1, f * 1.7); // FADE in/out
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
      {BRANDS.map((brand, i) => (
        <group
          key={brand.name}
          ref={(el) => {
            groups.current[i] = el;
          }}
          visible={false}
        >
          <Billboard>
            <mesh>
              <planeGeometry args={[ICON, ICON]} />
              <meshBasicMaterial
                ref={(el) => {
                  mats.current[i] = el;
                }}
                map={texs[i] ?? undefined}
                transparent
                depthWrite={false}
                toneMapped={false}
                opacity={0}
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
