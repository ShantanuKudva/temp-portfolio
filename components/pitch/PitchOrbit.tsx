'use client';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard } from '@react-three/drei';
import type { Group } from 'three';
import { BRANDS, buildIconTexture } from '@/lib/brandIcons';
import { getQ } from '@/lib/store';
import { sampleNumber } from '@/lib/track';
import { PITCH_X, PITCH_SCALE, PITCH_ORB, PITCH_HERO, PITCH_XSPREAD } from '@/lib/pitch';
import { PHONE_HERO_POS } from '@/lib/phone';

const N = BRANDS.length;
// Radius/icon are in the ring's LOCAL space; the group is scaled by
// sc*PITCH_HERO (same as the phone) so the ring tracks the phone's size. Kept
// small so icons hug just outside the phone silhouette rather than filling the frame.
const RADIUS = 0.16;
const ICON = 0.06;
const BASE = PHONE_HERO_POS; // ring centres on the phone hero position

export default function PitchOrbit() {
  const texs = useMemo(() => BRANDS.map((b) => buildIconTexture(b)), []);
  const ring = useRef<Group>(null);
  const items = useRef<(Group | null)[]>([]);

  useFrame((state) => {
    const q = getQ();
    const t = state.clock.elapsedTime;
    const xFrac = sampleNumber(PITCH_X, q);
    const sc = sampleNumber(PITCH_SCALE, q);
    const orb = sampleNumber(PITCH_ORB, q);
    const g = ring.current;
    if (!g) return;
    // track the phone's position + size (same world mapping as PitchPhone)
    g.position.set(BASE[0] + xFrac * PITCH_XSPREAD, BASE[1], BASE[2]);
    g.scale.setScalar(sc * PITCH_HERO);
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
