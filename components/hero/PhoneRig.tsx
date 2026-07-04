'use client';
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { FrontSide } from 'three';
import type { Group, Mesh } from 'three';
import { getP } from '@/lib/store';
import { sampleTuple3 } from '@/lib/track';
import { PHONE_POS, PHONE_ROT, PHONE_SCALE } from '@/lib/phone';
import { withMeshopt } from '@/lib/gltfLoaders';

// `phone.glb` is the iPhone 14 Pro (Sketchfab), meshopt-compressed + webp-
// textured via the same pipeline as `desk.glb` — loaded through the shared
// `withMeshopt` helper (lib/gltfLoaders.ts).
function PhoneModel() {
  const { scene } = useGLTF('/assets/phone.glb', false, false, withMeshopt);

  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      // The Sketchfab asset ships its single material as alphaMode BLEND +
      // doubleSided — which makes the whole solid phone body semi-transparent,
      // so the back camera bump ghosts THROUGH the front screen. Force it
      // opaque + front-face-only so only the outward surface renders. (The
      // glass gloss comes from the metallic/roughness maps, not from alpha.)
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of mats) {
        m.transparent = false;
        m.depthWrite = true;
        m.side = FrontSide;
        m.needsUpdate = true;
      }
    });
  }, [scene]);

  // Origin sits at the geometric bbox center (bbox symmetric to <0.003m per
  // `gltf-transform inspect`), so the parent group's position IS the phone's
  // visual center — no centering offset needed.
  //
  // Orientation correction: this asset has Y as the tall/"up" axis (correct)
  // but its SCREEN faces −Z — opposite our rig convention (the prior iphone11
  // faced +Z). An uncorrected burst-beat render showed the camera bump + Apple
  // logo facing the viewer. Yaw 180° (π about Y) so the screen faces +Z;
  // PHONE_ROT then composes on top, so every choreography table (which assumes
  // screen→+Z at rotation [0,0,0]) stays valid unchanged.
  //
  // NOTE for Task 8 (ScreenContent): this is a SINGLE merged mesh with the
  // screen baked into its emissive texture — there is no separate screen
  // sub-mesh to tag/replace. ScreenContent must overlay its own plane at the
  // screen face (local +Z after this correction, ~half-thickness out).
  return (
    <group rotation={[0, Math.PI, 0]}>
      <primitive object={scene} scale={PHONE_SCALE} />
    </group>
  );
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
