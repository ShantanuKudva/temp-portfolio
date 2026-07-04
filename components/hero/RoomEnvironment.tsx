'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, useGLTF } from '@react-three/drei';
import { Object3D } from 'three';
import type { DirectionalLight, SpotLight, Group, Mesh } from 'three';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { getP } from '@/lib/store';
import { BEAT } from '@/lib/timeline';
import { sampleNumber, type Keyframe } from '@/lib/track';

// Warm key light dims slightly as logos take over, warm glow peaks at constellation.
// Values scaled to ~53% of the brief's original (2.4/1.9/2.2/1.7/1.2) — the room
// shell's warm-cream/warm-sand/blush palette colors are near-white albedos
// (~0.87-0.96, measured from their hex values), so the brief's magnitudes blew
// them out to flat clipped white under ACES + ambient + HDRI IBL (verified via
// render: the rug and side wall were indistinguishable from the floor, and the
// return-beat spotlight concentration was impossible to confirm against an
// already-blown scene). Scaling preserves the exact dip/peak/dim shape.
const SUN_INTENSITY: Keyframe<number>[] = [
  { at: BEAT.establishStart, value: 1.3 },
  { at: BEAT.burstStart,     value: 1.0, ease: 'inOutCubic' },
  { at: BEAT.constellPeak,   value: 1.2, ease: 'inOutCubic' },
  { at: BEAT.returnStart,    value: 0.9, ease: 'inOutCubic' },
  { at: BEAT.pushStart,      value: 0.6, ease: 'inOutCubic' },
];
// A spotlight narrows onto the phone during Return. Peak bumped from the
// brief's 2.5 to 9 (same ~2.5:1 peak:tail ratio) and paired with `decay={1}`
// on the fixture below — three.js SpotLight defaults to decay=2 (physically
// correct inverse-square), and at this fixture's ~4m throw to the floor that
// ate ~94% of the intensity before it reached any surface (confirmed via a
// pixel diff between the constellation/return renders: the cone landed in
// exactly the right place — a faint concentric falloff ring centered on the
// target — but was too dim to read as "narrowing" by eye).
const SPOT_INTENSITY: Keyframe<number>[] = [
  { at: BEAT.holdStart,   value: 0 },
  { at: BEAT.returnStart, value: 9,   ease: 'outCubic' },
  { at: BEAT.rotateStart, value: 3.5, ease: 'inQuad' },
];

// `desk.glb` is meshopt-compressed (EXT_meshopt_compression, not Draco) — see
// components/hero/SpikeScene.tsx (Task 3) for the full explanation. Reusing its
// exact loader wiring: pass `false, false` for (useDraco, useMeshopt) so drei's
// own default auto-wiring doesn't re-run afterward and silently overwrite the
// decoder extendLoader just set.
const withMeshopt = (loader: Parameters<NonNullable<Parameters<typeof useGLTF>[3]>>[0]) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
};

function Desk() {
  const { scene } = useGLTF('/assets/desk.glb', false, false, withMeshopt);

  // Enable real shadow-map casting so the desk grounds itself on the floor
  // below (the brief's primitive had neither cast nor receive set — fine for
  // SpikeScene's fake ContactShadows blob, but this room relies on the real
  // directional-light shadow map via `receiveShadow` floor/walls).
  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene]);

  // Desk bbox is ~1.13 x 0.71 x 0.80m with its base at local y=0 (Task 3,
  // verified via gltf-transform inspect + camera framing). The room's floor
  // plane below is at world y=-0.6, so the desk needs that same y offset to
  // actually rest on it — the brief's `position={[0.35, 0, 0.3]}` predates the
  // room shell and would leave the desk floating 0.6m above the floor.
  return <primitive object={scene} position={[0.35, -0.6, 0.3]} />;
}
useGLTF.preload('/assets/desk.glb', false, false, withMeshopt);

export default function RoomEnvironment() {
  const sun = useRef<DirectionalLight>(null);
  const spot = useRef<SpotLight>(null);
  const props = useRef<Group>(null);

  // three.js reads `light.target.matrixWorld` directly (WebGLLights.js) — a
  // target Object3D that's never added to the scene graph never gets its
  // matrixWorld updated, so a bare `target-position` prop would silently aim
  // the cone at the (unmoving, identity-matrix) world origin instead of the
  // phone position. Keeping a real Object3D and mounting it via `<primitive>`
  // below puts it in the scene graph so its matrixWorld tracks `.position`.
  const spotTarget = useMemo(() => new Object3D(), []);

  useFrame(() => {
    const p = getP();
    if (sun.current) sun.current.intensity = sampleNumber(SUN_INTENSITY, p);
    if (spot.current) spot.current.intensity = sampleNumber(SPOT_INTENSITY, p);
  });

  return (
    <group ref={props}>
      <Environment files="/assets/hdri/room.hdr" background={false} environmentIntensity={0.35} />
      {/* Key sun through the gold-framed window */}
      <directionalLight ref={sun} castShadow position={[4, 6, 3]} color="#F4EBDD"
        shadow-mapSize={[2048, 2048]} shadow-bias={-0.0002} />
      {/* Return-beat spotlight onto the phone hero position */}
      <primitive object={spotTarget} position={[0, 0.95, 1.15]} />
      <spotLight ref={spot} position={[0, 3.5, 1.6]} angle={0.5} penumbra={0.8} decay={1}
        color="#F4EBDD" target={spotTarget} />
      <ambientLight intensity={0.14} color="#7B1E2B" />

      {/* Room shell (mock primitives, palette colors) */}
      <mesh position={[0, 1.4, -2]} receiveShadow>
        <planeGeometry args={[8, 4]} /><meshStandardMaterial color="#7B1E2B" />
      </mesh>{/* maroon accent back wall */}
      <mesh position={[-4, 1.4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 4]} /><meshStandardMaterial color="#F4EBDD" />
      </mesh>{/* warm-cream side wall */}
      <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} /><meshStandardMaterial color="#EADFCF" />
      </mesh>{/* warm-sand floor */}
      <mesh position={[0.2, -0.58, 0.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3, 2]} /><meshStandardMaterial color="#E8C9C4" />
      </mesh>{/* blush rug */}

      <Desk />

      {/* Mock props (swap to GLTFs later): plant, mug/books. Y offsets match
          the desk's -0.6 floor offset so they rest on the same floor plane
          instead of floating at the brief's floor-is-y=0 assumption. The
          books/mug box is also shifted from the brief's x=0.9 to x=1.35 —
          gltf-transform inspect gives the desk's real world footprint as
          x:[-0.217,0.917] z:[-0.053,0.653] once positioned, and the brief's
          original x=0.9/z=0.5 box (half-extents 0.25/0.175) overlapped that
          footprint, clipping through the desk's front-right leg. */}
      <mesh position={[-0.9, -0.45, 0.4]} castShadow receiveShadow>
        <cylinderGeometry args={[0.12, 0.16, 0.3, 12]} /><meshStandardMaterial color="#2F4A3A" />
      </mesh>
      <mesh position={[1.35, -0.52, 0.45]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.16, 0.35]} /><meshStandardMaterial color="#571620" />
      </mesh>
    </group>
  );
}
