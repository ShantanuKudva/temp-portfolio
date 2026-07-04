'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, useGLTF } from '@react-three/drei';
import { Object3D } from 'three';
import type { SpotLight, Mesh, MeshStandardMaterial } from 'three';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { getP } from '@/lib/store';
import { BEAT } from '@/lib/timeline';
import { sampleNumber, type Keyframe } from '@/lib/track';

// ORYZO DESK CLOSE-UP direction. The landing is a warm, high-angle close-up of
// the creator's desk — the real Sketchfab desk-setup (monitor/keyboard/mouse/
// headphones/shelves) + house plants ARE the environment — with the iPhone the
// hero product lying on the desk. Warm, considered daylight (a modeling key +
// low HDRI fill + a cozy lamp glow), NOT flat even light or fake god-rays.

const withMeshopt = (loader: Parameters<NonNullable<Parameters<typeof useGLTF>[3]>>[0]) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
};

// The desk-setup ships only 3 auto-named materials (the digits ARE the RGB):
//   wire_086086086 = dark grey  → dark parts (monitor body/bezel, dark props)
//   wire_088144225 = blue+gloss → screen / glossy metal
//   wire_204204204 = light grey → the "colourless" bulk (desk, drawers, chair…)
// Recolour those three groups to sensible tones so it stops reading flat-grey.
// (First pass — will refine per-item once the render shows which group is what.)
// The desk-setup ships 3 auto-named materials, each a baseColor TEXTURE:
//   wire_088144225 = the bulk (desk, drawers, keyboard, chair, shelves, mac mini…)
//   wire_204204204 = the monitor screens (flat, untextured light grey)
//   wire_086086086 = the desk lamp (dark)
// The bulk + lamp textures already read as a warm wooden desk + a black lamp, so
// we leave them NATURAL — tinting them dark is what turned everything black. We
// only darken the screens (untextured), plus a couple of per-mesh overrides
// (mesh names from the desk-mesh inspector, scripts/inspect-desk.mjs).
const DESK_MAT_COLORS: Record<string, string> = {
  wire_204204204: '#0B0D12', // monitor screens → off/dark
};
const DESK_MESH_COLORS: Record<string, string> = {
  // chair (frontmost cluster ~z=0.93) → charcoal, to read against the warm desk
  Object_15: '#33343A', Object_16: '#33343A', Object_33: '#33343A', Object_34: '#33343A',
};

// The gaming desk-setup: authored in mm (bbox ~2234×1915×1280) → ×0.001 to
// metres; base at y=0 sits on the room floor at world y=-0.6. Faces +Z (monitor
// toward the camera; phone rests on the desk in front of the keyboard).
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

// House plants (metre-scale cluster) dressed to the left of the desk.
function Plants() {
  const { scene } = useGLTF('/assets/plants.glb', false, false, withMeshopt);
  useEffect(() => {
    scene.traverse((o) => { const m = o as Mesh; if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  }, [scene]);
  return <primitive object={scene} scale={1} position={[-1.9, -0.6, -0.4]} />;
}
useGLTF.preload('/assets/plants.glb', false, false, withMeshopt);

// Return-beat spotlight (later beat): narrows onto the phone as it flows back.
const SPOT_INTENSITY: Keyframe<number>[] = [
  { at: BEAT.holdStart,   value: 0 },
  { at: BEAT.returnStart, value: 9,   ease: 'outCubic' },
  { at: BEAT.rotateStart, value: 3.5, ease: 'inQuad' },
];
// Lift/apps stage spotlights (later beats): ramp on as the phone lifts, hold
// through burst→constellation, ease off into the return.
const LIFT_SPOT_INTENSITY: Keyframe<number>[] = [
  { at: BEAT.establishStart, value: 0 },
  { at: BEAT.liftStart,      value: 0 },
  { at: BEAT.burstStart,     value: 10, ease: 'outCubic' },
  { at: BEAT.constellPeak,   value: 10 },
  { at: BEAT.returnStart,    value: 4,  ease: 'inOutCubic' },
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
      {/* Low HDRI for soft realistic fill + reflections (not the whole light). */}
      <Environment files="/assets/hdri/room.hdr" background={false} environmentIntensity={0.35} />

      {/* Warm modeling key (soft daylight) — gives the desk shape + warmth. */}
      <ambientLight intensity={0.2} color="#FFE7CC" />
      <directionalLight castShadow position={[-2.5, 4, 3]} intensity={2.6} color="#FFE1B6"
        shadow-mapSize={[2048, 2048]} shadow-bias={-0.0002} />
      {/* Cool soft fill from the opposite side to open the shadows. */}
      <directionalLight position={[3, 2.2, 0.5]} intensity={0.5} color="#CFE0FF" />
      {/* Cozy desk-lamp glow pooling warm light on the phone/desk. */}
      <pointLight position={[0.02, 0.42, 0.12]} intensity={1.5} distance={1.8} decay={2} color="#FFC98A" />

      {/* Sequence spotlights (kick in on later beats). */}
      <primitive object={returnTarget} position={[0, 0.95, 1.15]} />
      <spotLight ref={returnSpot} position={[0, 3.5, 1.6]} angle={0.5} penumbra={0.9} decay={1}
        color="#FFF0DC" target={returnTarget} />
      <primitive object={liftTarget} position={[0, 1.15, 1.15]} />
      <spotLight ref={liftA} position={[-2.4, 3.2, 2.2]} angle={0.6} penumbra={0.8} decay={1}
        color="#FFD9A0" target={liftTarget} />
      <spotLight ref={liftB} position={[2.4, 3.2, 0.4]} angle={0.6} penumbra={0.8} decay={1}
        color="#CBD5E1" target={liftTarget} />

      {/* Warm dark backdrop behind the desk (mostly out of frame in the close-up). */}
      <mesh position={[0, 0.7, -2.4]}>
        <planeGeometry args={[16, 9]} />
        <meshStandardMaterial color="#1C130F" roughness={1} metalness={0} />
      </mesh>

      <DeskSetup />
      <Plants />
    </group>
  );
}
