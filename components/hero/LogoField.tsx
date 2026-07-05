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

// Smooth ORBITAL FLOAT eruption: the tech-brand icons rise gently out of the phone
// (fading in from its hero position) and drift into a calm floating constellation
// threaded by soft lines, then flow back in before the push-through. Icons FADE
// (opacity) rather than scale-pop, and the cloud drifts slowly — smooth, not wonky.
const N = BRANDS.length;
const CENTER = PHONE_HERO_POS; // [0, 0.95, 1.15]
const ICON = 0.062;
const EX = 0.62,
  EY = 0.58,
  EZ = 0.42; // ellipsoid cloud around the phone

const OFFSETS: [number, number, number][] = BRANDS.map((_, i) => {
  const y = 1 - (2 * (i + 0.5)) / N;
  const rad = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = Math.PI * (1 + Math.sqrt(5)) * i;
  return [Math.cos(theta) * rad * EX, y * EY, Math.sin(theta) * rad * EZ];
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
    const drift = t * 0.05; // slow cloud rotation
    const cs = Math.cos(drift),
      sn = Math.sin(drift);
    const wp: number[][] = [];
    for (let i = 0; i < N; i++) {
      const startP = BEAT.burstStart + (i / N) * 0.05; // gentle stagger
      const f = smooth(startP, startP + 0.2, p) * (1 - retract); // 0..1..0
      const [ox, oy, oz] = OFFSETS[i];
      const rx = ox * cs - oz * sn;
      const rz = ox * sn + oz * cs;
      const bob = Math.sin(t * 0.55 + i * 0.9) * 0.012;
      const x = CENTER[0] + rx * f;
      const y = CENTER[1] + (oy + bob) * f;
      const z = CENTER[2] + rz * f;
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
