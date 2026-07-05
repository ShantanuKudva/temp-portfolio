'use client';
import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Billboard } from '@react-three/drei';
import type { Group } from 'three';
import { BRANDS, buildIconTexture } from '@/lib/brandIcons';
import { getQ } from '@/lib/store';
import { sampleNumber } from '@/lib/track';
import { PITCH_X, PITCH_SCALE, PITCH_ORB } from '@/lib/pitch';
import { PHONE_HERO_POS } from '@/lib/phone';

const N = BRANDS.length;
const RADIUS = 0.9;      // ring radius around the phone (world units, pre-scale)
const ICON = 0.14;
const BASE = PHONE_HERO_POS; // ring centres on the phone hero position

export default function PitchOrbit() {
  const texs = useMemo(() => BRANDS.map((b) => buildIconTexture(b)), []);
  const ring = useRef<Group>(null);
  const items = useRef<(Group | null)[]>([]);
  const { viewport } = useThree();

  useFrame((state) => {
    const q = getQ();
    const t = state.clock.elapsedTime;
    const xFrac = sampleNumber(PITCH_X, q);
    const sc = sampleNumber(PITCH_SCALE, q);
    const orb = sampleNumber(PITCH_ORB, q);
    const g = ring.current;
    if (!g) return;
    // follow the phone: x-offset in world units = fraction * half viewport width
    g.position.set(BASE[0] + xFrac * viewport.width * 0.5, BASE[1], BASE[2]);
    g.scale.setScalar(sc);
    g.rotation.z = t * 0.24; // slow spin
    for (let i = 0; i < N; i++) {
      const it = items.current[i];
      if (it) it.rotation.z = -t * 0.24; // counter-rotate to stay upright
      if (it) (it as unknown as { visible: boolean }).visible = orb > 0.02;
    }
  });

  return (
    <group ref={ring}>
      {BRANDS.map((brand, i) => {
        const a = (i / N) * Math.PI * 2;
        return (
          <group key={brand.name} position={[Math.cos(a) * RADIUS, Math.sin(a) * RADIUS, -0.2]}
                 ref={(el) => { items.current[i] = el; }}>
            <Billboard>
              <mesh>
                <planeGeometry args={[ICON, ICON]} />
                <meshBasicMaterial map={texs[i] ?? undefined} transparent depthWrite={false} toneMapped={false} />
              </mesh>
            </Billboard>
          </group>
        );
      })}
    </group>
  );
}
