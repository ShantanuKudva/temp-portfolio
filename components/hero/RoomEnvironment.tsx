'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, useGLTF } from '@react-three/drei';
import { Object3D, AdditiveBlending, DoubleSide } from 'three';
import type { DirectionalLight, SpotLight, Group, Mesh } from 'three';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { getP } from '@/lib/store';
import { BEAT } from '@/lib/timeline';
import { sampleNumber, type Keyframe } from '@/lib/track';

// Room palette — warm, cinematic, NO cream (hard rule). Walls/floor recolored
// from the old warm-cream/warm-sand mock to warm taupe + walnut so they "match
// the props" (walnut desk-setup) and hold color under the golden sun instead of
// blowing out to flat white. Cherry-maroon kept as the single accent wall.
const COL = {
  maroon: '#7B1E2B', // cherry-maroon accent back wall (brand)
  wall:   '#6F574E', // warm taupe side wall (was cream #F4EBDD)
  floor:  '#5E4633', // warm walnut floor (was warm-sand #EADFCF)
  rug:    '#966F68', // dusty mauve rug (was blush #E8C9C4)
  plant:  '#2F4A3A', // forest green
  wine:   '#571620', // deep wine
  gold:   '#B08D4C', // antique gold — window frame / molding
  sun:    '#F6D6A0', // golden daylight
  lamp:   '#FFCF8A', // warm lamp glow
} as const;

// Warm key sun. Intensities bumped ~1.4x over the old cream-palette values —
// the recolored taupe/walnut surfaces are much darker albedos, so they no
// longer clip to white and want more light to read their material + the golden
// cast. Same dip/peak/dim shape (bright establish → dips as logos take over →
// warm peak at constellation → dims into the push).
const SUN_INTENSITY: Keyframe<number>[] = [
  { at: BEAT.establishStart, value: 1.8 },
  { at: BEAT.burstStart,     value: 1.4, ease: 'inOutCubic' },
  { at: BEAT.constellPeak,   value: 1.7, ease: 'inOutCubic' },
  { at: BEAT.returnStart,    value: 1.2, ease: 'inOutCubic' },
  { at: BEAT.pushStart,      value: 0.8, ease: 'inOutCubic' },
];

// Return-beat spotlight: narrows onto the phone as the constellation flows back
// in. decay=1 on the fixture (three's physical decay=2 ate ~94% over the ~4m
// throw); peak ~9 gives a readable "narrowing" cone.
const SPOT_INTENSITY: Keyframe<number>[] = [
  { at: BEAT.holdStart,   value: 0 },
  { at: BEAT.returnStart, value: 9,   ease: 'outCubic' },
  { at: BEAT.rotateStart, value: 3.5, ease: 'inQuad' },
];

// Lift/apps stage spotlights: OFF while the phone rests, ramp ON as it LIFTS
// off the desk, and hold at full through the BURST→CONSTELLATION span (the
// "apps seen" beats the user called out), then ease off into the return. Two
// converging cones (warm key + cool rim) hit the phone + the erupting-logos
// volume like stage lights snapping onto the star.
const LIFT_SPOT_INTENSITY: Keyframe<number>[] = [
  { at: BEAT.establishStart, value: 0 },
  { at: BEAT.liftStart,      value: 0 },
  { at: BEAT.burstStart,     value: 12, ease: 'outCubic' },
  { at: BEAT.constellPeak,   value: 12 },
  { at: BEAT.returnStart,    value: 4,  ease: 'inOutCubic' },
  { at: BEAT.pushStart,      value: 0,  ease: 'inOutCubic' },
];

// `desk.glb` is meshopt-compressed (EXT_meshopt_compression, not Draco) — pass
// `false, false` for (useDraco, useMeshopt) so drei's default auto-wiring
// doesn't re-run and overwrite the decoder extendLoader just set.
const withMeshopt = (loader: Parameters<NonNullable<Parameters<typeof useGLTF>[3]>>[0]) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
};

function Desk() {
  const { scene } = useGLTF('/assets/desk.glb', false, false, withMeshopt);
  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene]);
  // Desk base at local y=0; room floor is at world y=-0.6, so offset the desk
  // down by that to rest it on the floor.
  return <primitive object={scene} position={[0.35, -0.6, 0.3]} />;
}
useGLTF.preload('/assets/desk.glb', false, false, withMeshopt);

export default function RoomEnvironment() {
  const root = useRef<Group>(null);
  const sun = useRef<DirectionalLight>(null);
  const returnSpot = useRef<SpotLight>(null);
  const liftA = useRef<SpotLight>(null);
  const liftB = useRef<SpotLight>(null);

  // SpotLight targets must live in the scene graph for their matrixWorld to
  // update (three reads target.matrixWorld directly) — mounted via <primitive>.
  const returnTarget = useMemo(() => new Object3D(), []);
  const liftTarget = useMemo(() => new Object3D(), []);

  useFrame(() => {
    const p = getP();
    const lift = sampleNumber(LIFT_SPOT_INTENSITY, p);
    if (sun.current) sun.current.intensity = sampleNumber(SUN_INTENSITY, p);
    if (returnSpot.current) returnSpot.current.intensity = sampleNumber(SPOT_INTENSITY, p);
    if (liftA.current) liftA.current.intensity = lift;
    if (liftB.current) liftB.current.intensity = lift * 0.6; // rim reads cooler/softer
  });

  return (
    <group ref={root}>
      <Environment files="/assets/hdri/room.hdr" background={false} environmentIntensity={0.3} />

      {/* Golden key sun — angled in FROM the window (upper-left) so the shafts,
          the bright pane and the cast shadows all agree on one light origin. */}
      <directionalLight ref={sun} castShadow position={[-5, 5.5, 2.5]} color={COL.sun}
        shadow-mapSize={[2048, 2048]} shadow-bias={-0.0002} />
      {/* Low warm maroon bounce so shadows aren't dead black. */}
      <ambientLight intensity={0.12} color={COL.maroon} />

      {/* Return-beat spotlight onto the phone hero position. */}
      <primitive object={returnTarget} position={[0, 0.95, 1.15]} />
      <spotLight ref={returnSpot} position={[0, 3.5, 1.6]} angle={0.5} penumbra={0.8} decay={1}
        color={COL.sun} target={returnTarget} />

      {/* Lift/apps stage spotlights (warm key + cool rim) converging on the
          phone + logos volume; intensity driven in useFrame. */}
      <primitive object={liftTarget} position={[0, 1.15, 1.15]} />
      <spotLight ref={liftA} position={[-2.4, 3.2, 2.2]} angle={0.6} penumbra={0.7} decay={1}
        color="#FFCF8A" target={liftTarget} />
      <spotLight ref={liftB} position={[2.4, 3.2, 0.4]} angle={0.6} penumbra={0.7} decay={1}
        color="#CBD5E1" target={liftTarget} />

      {/* ---- Room shell ---- */}
      <mesh position={[0, 1.4, -2]} receiveShadow>
        <planeGeometry args={[8, 4]} /><meshStandardMaterial color={COL.maroon} />
      </mesh>{/* cherry-maroon accent back wall */}
      <mesh position={[-4, 1.4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 4]} /><meshStandardMaterial color={COL.wall} />
      </mesh>{/* warm-taupe side wall (NO cream) */}
      <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} /><meshStandardMaterial color={COL.floor} />
      </mesh>{/* warm walnut floor */}
      <mesh position={[0.2, -0.58, 0.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3, 2]} /><meshStandardMaterial color={COL.rug} />
      </mesh>{/* dusty-mauve rug */}

      {/* ---- Gold-framed window on the side wall: the golden daylight source.
          A bright emissive pane (blooms) behind an antique-gold frame + cross
          mullions. Overlaid on the solid wall (reads as a window without a real
          cut-out). Sits behind-left of the desk so light rakes across it. ---- */}
      <group position={[-3.96, 1.7, -0.5]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[2.9, 2.3]} />
          <meshStandardMaterial color={COL.gold} metalness={0.4} roughness={0.5} />
        </mesh>{/* frame backing */}
        <mesh>
          <planeGeometry args={[2.6, 2.0]} />
          <meshStandardMaterial color="#2A1A10" emissive={COL.sun} emissiveIntensity={2.6} toneMapped={false} />
        </mesh>{/* glowing pane */}
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[0.05, 2.0, 0.03]} />
          <meshStandardMaterial color={COL.gold} metalness={0.4} roughness={0.5} />
        </mesh>{/* vertical mullion */}
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[2.6, 0.05, 0.03]} />
          <meshStandardMaterial color={COL.gold} metalness={0.4} roughness={0.5} />
        </mesh>{/* horizontal mullion */}
      </group>

      {/* Golden sun-ray shafts — soft additive quads streaming from the window
          (upper-left) down into the room. Low opacity + additive + unlit +
          depthWrite off so they overlap into atmospheric volumes and bloom. */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-2.4 + i * 0.7, 1.9 - i * 0.35, -0.3 + i * 0.35]} rotation={[0.1, 0.6, -0.6]}>
          <planeGeometry args={[4.5, 0.9]} />
          <meshBasicMaterial color={COL.sun} transparent opacity={0.06} blending={AdditiveBlending}
            depthWrite={false} side={DoubleSide} toneMapped={false} />
        </mesh>
      ))}

      <Desk />

      {/* Glowing desk lamp (mock — swap to a GLTF lamp later). Emissive shade +
          a warm point light pooling onto the phone/desk. Sits at the desk's
          back-left; base rests on the desk top (world y≈0.2). */}
      <group position={[-0.12, 0.199, 0.05]}>
        <mesh position={[0, 0.01, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.07, 0.02, 20]} />
          <meshStandardMaterial color="#2F2723" metalness={0.3} roughness={0.6} />
        </mesh>{/* base */}
        <mesh position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 0.24, 8]} />
          <meshStandardMaterial color="#241D1A" metalness={0.5} roughness={0.5} />
        </mesh>{/* stem */}
        <mesh position={[0.02, 0.27, 0]} rotation={[0, 0, -0.25]}>
          <coneGeometry args={[0.075, 0.1, 24, 1, true]} />
          <meshStandardMaterial color={COL.lamp} emissive={COL.lamp} emissiveIntensity={1.7}
            side={DoubleSide} toneMapped={false} />
        </mesh>{/* glowing shade */}
        <pointLight position={[0.02, 0.25, 0]} color={COL.lamp} intensity={0.7} distance={2.4} decay={2} />
      </group>

      {/* Mock props (swap to GLTFs later): plant + books/mug box. Y offsets rest
          them on the world y=-0.6 floor; box shifted to x=1.35 to clear the
          desk's front-right leg footprint. */}
      <mesh position={[-0.9, -0.45, 0.4]} castShadow receiveShadow>
        <cylinderGeometry args={[0.12, 0.16, 0.3, 12]} /><meshStandardMaterial color={COL.plant} />
      </mesh>
      <mesh position={[1.35, -0.52, 0.45]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.16, 0.35]} /><meshStandardMaterial color={COL.wine} />
      </mesh>
    </group>
  );
}
