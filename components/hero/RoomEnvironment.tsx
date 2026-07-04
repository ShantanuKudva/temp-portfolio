'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, useGLTF } from '@react-three/drei';
import { Object3D } from 'three';
import type { SpotLight, Mesh, MeshStandardMaterial, DirectionalLight, AmbientLight, PointLight } from 'three';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { getP } from '@/lib/store';
import { BEAT } from '@/lib/timeline';
import { sampleNumber, type Keyframe } from '@/lib/track';

// ORYZO DESK CLOSE-UP. Warm high-angle close-up of the creator's desk — the real
// Sketchfab desk-setup + house plants ARE the environment, the iPhone the hero.

const withMeshopt = (loader: Parameters<NonNullable<Parameters<typeof useGLTF>[3]>>[0]) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
};

// The desk-setup ships 3 auto-named materials, each a baseColor TEXTURE:
//   wire_088144225 = the bulk (desk, drawers, keyboard, mac mini, shelves, chair)
//   wire_204204204 = the monitor screens (flat, untextured light grey)
//   wire_086086086 = the desk lamp (dark)
// The bulk texture read as flat off-white, so we TINT it to a warm wood (multiply)
// — a wooden desk, not white. Screens → dark. Then per-mesh overrides (names from
// the desk-mesh inspector, scripts/inspect-desk.mjs) recolour the tech items.
const DESK_MAT_COLORS: Record<string, string> = {
  wire_088144225: '#C99A6B', // bulk → warm wood tint (was reading white)
  wire_204204204: '#0B0D12', // monitor screens → off/dark
};
const DESK_MESH_COLORS: Record<string, string> = {
  Object_15: '#33343A', Object_16: '#33343A', Object_33: '#33343A', Object_34: '#33343A', // chair → charcoal
  Object_57: '#26262A', // keyboard → dark
};

// The gaming desk-setup: authored in mm (bbox ~2234×1915×1280) → ×0.001 to
// metres; base at y=0 sits on the room floor at world y=-0.6. Faces +Z.
function DeskSetup() {
  const { scene } = useGLTF('/assets/desk-setup.glb', false, false, withMeshopt);
  useEffect(() => {
    scene.traverse((o) => {
      const m = o as Mesh;
      if (!m.isMesh) return;
      m.castShadow = true;
      m.receiveShadow = true;
      const std = m.material as MeshStandardMaterial;
      const meshC = DESK_MESH_COLORS[m.name];
      if (meshC) {
        const cloned = std.clone(); // per-mesh override needs its own material
        cloned.color.set(meshC);
        m.material = cloned;
      } else {
        const matC = DESK_MAT_COLORS[std.name];
        if (matC && std.color) std.color.set(matC);
      }
    });
  }, [scene]);
  return <primitive object={scene} scale={0.001} position={[0, -0.6, 0.3]} />;
}
useGLTF.preload('/assets/desk-setup.glb', false, false, withMeshopt);

// House plants (metre-scale cluster). Cloned per instance so we can place more
// than one (floor cluster + a small pot on the desk).
function Plants({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const { scene } = useGLTF('/assets/plants.glb', false, false, withMeshopt);
  const obj = useMemo(() => scene.clone(true), [scene]);
  useEffect(() => {
    obj.traverse((o) => { const m = o as Mesh; if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  }, [obj]);
  return <primitive object={obj} scale={scale} position={position} />;
}
useGLTF.preload('/assets/plants.glb', false, false, withMeshopt);

// Return-beat spotlight: narrows onto the phone as it flows back.
const SPOT_INTENSITY: Keyframe<number>[] = [
  { at: BEAT.holdStart,   value: 0 },
  { at: BEAT.returnStart, value: 9,   ease: 'outCubic' },
  { at: BEAT.rotateStart, value: 3.5, ease: 'inQuad' },
];
// Lift/apps stage spotlights: ramp on as the phone lifts, hold through
// burst→constellation, ease off into the return. Bright enough to carry the
// phone once the room dims around it (see ENV_DIM).
const LIFT_SPOT_INTENSITY: Keyframe<number>[] = [
  { at: BEAT.establishStart, value: 0 },
  { at: BEAT.liftStart,      value: 0 },
  { at: BEAT.burstStart,     value: 15, ease: 'outCubic' },
  { at: BEAT.constellPeak,   value: 15 },
  { at: BEAT.returnStart,    value: 6,  ease: 'inOutCubic' },
  { at: BEAT.pushStart,      value: 0,  ease: 'inOutCubic' },
];
// SPOTLIGHT EFFECT (user): as the phone lifts to hero, the whole ROOM dims so the
// stage spotlights make the phone pop — "the rest of the things in the bg go a
// little dark and the main one has the light". 1 = full room, dips through
// burst→constellation, eased partway back for the reveal.
const ENV_DIM: Keyframe<number>[] = [
  { at: BEAT.establishStart, value: 1 },
  { at: BEAT.liftStart,      value: 1 },
  { at: BEAT.burstStart,     value: 0.22, ease: 'inOutCubic' },
  { at: BEAT.constellPeak,   value: 0.22 },
  { at: BEAT.returnStart,    value: 0.3,  ease: 'inOutCubic' },
  { at: BEAT.revealStart,    value: 0.45, ease: 'inOutCubic' },
];
const ENV_BASE = { key: 3.0, fill: 0.5, amb: 0.2, lamp: 1.5, hdri: 0.35 };

export default function RoomEnvironment() {
  const returnSpot = useRef<SpotLight>(null);
  const liftA = useRef<SpotLight>(null);
  const liftB = useRef<SpotLight>(null);
  const keyRef = useRef<DirectionalLight>(null);
  const fillRef = useRef<DirectionalLight>(null);
  const ambRef = useRef<AmbientLight>(null);
  const lampRef = useRef<PointLight>(null);
  const returnTarget = useMemo(() => new Object3D(), []);
  const liftTarget = useMemo(() => new Object3D(), []);

  useFrame((state) => {
    const p = getP();
    const lift = sampleNumber(LIFT_SPOT_INTENSITY, p);
    const dim = sampleNumber(ENV_DIM, p);
    if (returnSpot.current) returnSpot.current.intensity = sampleNumber(SPOT_INTENSITY, p);
    if (liftA.current) liftA.current.intensity = lift;
    if (liftB.current) liftB.current.intensity = lift * 0.6;
    if (keyRef.current) keyRef.current.intensity = ENV_BASE.key * dim;
    if (fillRef.current) fillRef.current.intensity = ENV_BASE.fill * dim;
    if (ambRef.current) ambRef.current.intensity = ENV_BASE.amb * dim;
    if (lampRef.current) lampRef.current.intensity = ENV_BASE.lamp * dim;
    state.scene.environmentIntensity = ENV_BASE.hdri * dim; // dims the HDRI fill too
  });

  return (
    <group>
      {/* Low HDRI for soft realistic fill + reflections (not the whole light). */}
      <Environment files="/assets/hdri/room.hdr" background={false} environmentIntensity={ENV_BASE.hdri} />

      {/* Warm modeling key (soft daylight) — gives the desk shape + warmth. */}
      <ambientLight ref={ambRef} intensity={ENV_BASE.amb} color="#FFE7CC" />
      <directionalLight ref={keyRef} castShadow position={[-3, 3.6, 2.4]} intensity={ENV_BASE.key} color="#FFDCA8"
        shadow-mapSize={[2048, 2048]} shadow-bias={-0.00018}
        shadow-camera-near={0.1} shadow-camera-far={12}
        shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} />
      {/* Cool soft fill from the opposite side to open the shadows. */}
      <directionalLight ref={fillRef} position={[3, 2.2, 0.5]} intensity={ENV_BASE.fill} color="#CFE0FF" />
      {/* Cozy desk-lamp glow pooling warm light on the phone/desk. */}
      <pointLight ref={lampRef} position={[0.02, 0.42, 0.12]} intensity={ENV_BASE.lamp} distance={1.8} decay={2} color="#FFC98A" />

      {/* Window blinds hung between the sun and the desk — the sun rakes through
          them and throws warm striped light-rays (REAL shadows) across the back
          wall + pegboard. Tilted to face the sun so the gaps read. */}
      <group position={[-1.1, 2.4, 1.5]} rotation={[0.62, 0.34, 0]}>
        {Array.from({ length: 11 }, (_, i) => (
          <mesh key={i} position={[0, 1.3 - i * 0.26, 0]} castShadow>
            <boxGeometry args={[3.6, 0.15, 0.02]} />
            <meshStandardMaterial color="#241812" roughness={1} />
          </mesh>
        ))}
      </group>

      {/* Stage spotlights that carry the phone as the room dims. */}
      <primitive object={returnTarget} position={[0, 0.95, 1.15]} />
      <spotLight ref={returnSpot} position={[0, 3.5, 1.6]} angle={0.5} penumbra={0.9} decay={1}
        color="#FFF0DC" target={returnTarget} />
      <primitive object={liftTarget} position={[0, 1.15, 1.15]} />
      <spotLight ref={liftA} position={[-2.4, 3.2, 2.2]} angle={0.6} penumbra={0.8} decay={1}
        color="#FFD9A0" target={liftTarget} />
      <spotLight ref={liftB} position={[2.4, 3.2, 0.4]} angle={0.6} penumbra={0.8} decay={1}
        color="#CBD5E1" target={liftTarget} />

      {/* Warm coloured back wall the desk sits against + a floor. Both receive the
          sun's shadows — the lamp casts onto the wall, the blinds cast the rays. */}
      <mesh position={[0.1, 1.3, -0.55]} receiveShadow>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#6E4B44" roughness={0.95} />
      </mesh>{/* back wall — warm muted maroon-clay */}
      <mesh position={[0.1, -0.6, 0.4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 7]} />
        <meshStandardMaterial color="#2A1D18" roughness={1} />
      </mesh>{/* floor */}

      <DeskSetup />
      <Plants position={[-1.9, -0.6, -0.4]} />
      {/* small plant on the desk — back-right corner, well clear of the phone */}
      <Plants position={[0.92, 0.2, 0.02]} scale={0.18} />
    </group>
  );
}
