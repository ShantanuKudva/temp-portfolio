'use client';
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import type { Group, Material, Mesh } from 'three';
import { getP } from '@/lib/store';
import { sampleTuple3 } from '@/lib/track';
import { PHONE_POS, PHONE_ROT, PHONE_SCALE } from '@/lib/phone';
import { withMeshopt } from '@/lib/gltfLoaders';

const matName = (m: Material | Material[]): string | undefined =>
  Array.isArray(m) ? undefined : m.name;

// `phone.glb` is meshopt-compressed (EXT_meshopt_compression + WebP), same
// pipeline as `desk.glb` (Task 5/RoomEnvironment) — reusing that loader
// wiring via the shared `withMeshopt` helper (lib/gltfLoaders.ts).
function PhoneModel() {
  const { scene } = useGLTF('/assets/phone.glb', false, false, withMeshopt);

  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      // The GLB already ships a dedicated screen-face mesh (material `scr`,
      // verified via a headless three.js probe: its geometry sits at local
      // z=+0.0386, right at the model's +Z bbox face). Tag it the same way
      // the brief's mock screen plane was tagged, so Task 8's ScreenContent
      // can find/attach to this real mesh instead of a fake overlay plane.
      if (matName(mesh.material) === 'scr') mesh.userData.role = 'screen';
    });
  }, [scene]);

  // Model's local origin already sits at its geometric bbox center (bboxMin/
  // Max are symmetric to <0.001m per `gltf-transform inspect`), so no
  // centering offset is needed — the parent group's position is already the
  // phone's visual center, same as the brief's centered RoundedBox mock.
  //
  // Orientation: the raw model needs NO correction. A headless three.js
  // render of the unrotated GLB confirmed Y is already the tall/"up" axis
  // (notch sits at +Y) and the screen (`scr` mesh) already faces +Z — which
  // is exactly "upright, screen facing the camera" per PHONE_ROT's
  // burstStart value of [0,0,0] ("squares to camera"), since the scene
  // camera and PHONE_HERO_POS both sit further along +Z, toward the viewer.
  return <primitive object={scene} scale={PHONE_SCALE} />;
}
useGLTF.preload('/assets/phone.glb', false, false, withMeshopt);

export default function PhoneRig() {
  const g = useRef<Group>(null);
  useFrame(() => {
    if (!g.current) return;
    const p = getP();
    const pos = sampleTuple3(PHONE_POS, p);
    const rot = sampleTuple3(PHONE_ROT, p);
    g.current.position.set(pos[0], pos[1], pos[2]); // mutate — never reassign (Global Constraints)
    g.current.rotation.set(rot[0], rot[1], rot[2]);
  });

  return (
    <group ref={g}>
      <PhoneModel />
    </group>
  );
}
