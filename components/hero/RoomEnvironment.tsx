'use client';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { Object3D } from 'three';
import type { SpotLight } from 'three';
import { getP } from '@/lib/store';
import { BEAT } from '@/lib/timeline';
import { sampleNumber, type Keyframe } from '@/lib/track';

// DARK-PREMIUM STUDIO (Oryzo-minimal pivot). The iPhone is the sole hero,
// presented in a clean charcoal→black void — no room, no props, no fake light
// rays. A soft warm key + cool rim light the titanium frame; a cherry-maroon
// accent light throws a faint brand-colored glow onto the backdrop behind the
// phone; stage spotlights snap on as it lifts and the logos erupt. A dark
// floor + contact shadow ground it. Bloom (HeroCanvas) blooms the glowing
// screen + spotlights. (Module still named RoomEnvironment for now to avoid
// churn across HeroCanvas/SpikeScene imports — rename to StudioEnvironment in
// a later cleanup pass.)

// Return-beat spotlight: narrows onto the phone as the constellation flows back.
const SPOT_INTENSITY: Keyframe<number>[] = [
  { at: BEAT.holdStart,   value: 0 },
  { at: BEAT.returnStart, value: 9,   ease: 'outCubic' },
  { at: BEAT.rotateStart, value: 3.5, ease: 'inQuad' },
];

// Lift/apps stage spotlights: OFF at rest, ramp ON as the phone LIFTS, hold
// through BURST→CONSTELLATION ("apps seen"), then ease off into the return.
const LIFT_SPOT_INTENSITY: Keyframe<number>[] = [
  { at: BEAT.establishStart, value: 0 },
  { at: BEAT.liftStart,      value: 0 },
  { at: BEAT.burstStart,     value: 14, ease: 'outCubic' },
  { at: BEAT.constellPeak,   value: 14 },
  { at: BEAT.returnStart,    value: 5,  ease: 'inOutCubic' },
  { at: BEAT.pushStart,      value: 0,  ease: 'inOutCubic' },
];

export default function RoomEnvironment() {
  const returnSpot = useRef<SpotLight>(null);
  const liftA = useRef<SpotLight>(null);
  const liftB = useRef<SpotLight>(null);
  const returnTarget = useMemo(() => new Object3D(), []);
  const liftTarget = useMemo(() => new Object3D(), []);

  useFrame(() => {
    const p = getP();
    const lift = sampleNumber(LIFT_SPOT_INTENSITY, p);
    if (returnSpot.current) returnSpot.current.intensity = sampleNumber(SPOT_INTENSITY, p);
    if (liftA.current) liftA.current.intensity = lift;
    if (liftB.current) liftB.current.intensity = lift * 0.6;
  });

  return (
    <group>
      {/* Subtle env map for metallic-frame reflections only (dark studio → low). */}
      <Environment files="/assets/hdri/room.hdr" background={false} environmentIntensity={0.14} />

      {/* Studio 3-point. Warm key (casts the phone's shadow) + cool rim + low fill. */}
      <ambientLight intensity={0.07} />
      <directionalLight castShadow position={[2.6, 3.2, 3]} intensity={1.25} color="#FFF4E6"
        shadow-mapSize={[2048, 2048]} shadow-bias={-0.0002} />
      <directionalLight position={[-2.2, 2.6, -2.4]} intensity={0.85} color="#B4C8E2" />

      {/* Cherry-maroon accent glow LOW behind the phone — soft brand pool on the
          backdrop; kept low/back so it doesn't specular-glint the frame edges
          (which bloomed as two red dots when the light sat at frame height). */}
      <pointLight position={[0, 0.45, -1.3]} intensity={3.4} distance={8} decay={2} color="#7B1E2B" />

      {/* Return-beat spotlight onto the phone hero position. */}
      <primitive object={returnTarget} position={[0, 0.95, 1.15]} />
      <spotLight ref={returnSpot} position={[0, 3.5, 1.6]} angle={0.5} penumbra={0.9} decay={1}
        color="#FFF4E6" target={returnTarget} />

      {/* Lift/apps stage spotlights (warm key + cool rim) on the phone+logos volume. */}
      <primitive object={liftTarget} position={[0, 1.15, 1.15]} />
      <spotLight ref={liftA} position={[-2.4, 3.2, 2.2]} angle={0.6} penumbra={0.8} decay={1}
        color="#FFD9A0" target={liftTarget} />
      <spotLight ref={liftB} position={[2.4, 3.2, 0.4]} angle={0.6} penumbra={0.8} decay={1}
        color="#CBD5E1" target={liftTarget} />

      {/* Dark cyclorama backdrop — catches the maroon accent as a soft pool; else near-black. */}
      <mesh position={[0, 1.3, -3.2]}>
        <planeGeometry args={[18, 11]} />
        <meshStandardMaterial color="#0B0A0C" roughness={1} metalness={0} />
      </mesh>

      {/* Dark floor: the phone rests on it (y≈0.2); receives the key-light shadow. */}
      <mesh position={[0, 0.199, 0.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 14]} />
        <meshStandardMaterial color="#0C0B0D" roughness={0.6} metalness={0.35} />
      </mesh>

      {/* Soft contact shadow right under the resting phone for extra grounding. */}
      <ContactShadows position={[0.35, 0.201, 0.55]} scale={2.6} blur={2.4} opacity={0.5} far={1.6} color="#000000" />
    </group>
  );
}
