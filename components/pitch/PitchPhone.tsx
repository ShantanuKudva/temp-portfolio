'use client';
import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { FrontSide } from 'three';
import type { Group, Mesh, Material } from 'three';
import { PHONE_SCALE, PHONE_HERO_POS } from '@/lib/phone';
import { getQ } from '@/lib/store';
import { sampleNumber } from '@/lib/track';
import { PITCH_X, PITCH_SCALE, PITCH_OP } from '@/lib/pitch';
import { withMeshopt } from '@/lib/gltfLoaders';
import ReelScreen from './ReelScreen';

// Same asset + loader pattern as `components/hero/PhoneRig.tsx` — `phone.glb`
// is meshopt-compressed, so a plain `useGLTF(url)` (no decoder) fails to
// decode it. Same URL so the pitch phone reads identically to the hero one.
const PHONE_URL = '/assets/phone.glb';

export default function PitchPhone() {
  const { scene } = useGLTF(PHONE_URL, false, false, withMeshopt);

  // This mounts a SECOND live instance of the same GLTF the landing's
  // PhoneRig uses. `scene.clone(true)` deep-clones the node graph but still
  // shares materials BY REFERENCE with the original — mutating opacity here
  // would bleed into the landing phone. So: clone the scene, then replace
  // each mesh's material with its own clone, and re-apply PhoneRig's
  // material hardening (opaque-by-default, front-face-only) to the clones so
  // the body renders correctly instead of ghosting through itself.
  // Cloned materials are gathered into a ref here (not re-traversed every
  // frame) so the per-frame opacity update below is a flat array walk.
  const materialsRef = useRef<Material[]>([]);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    const mats: Material[] = [];
    clone.traverse((obj) => {
      const mesh = obj as Mesh;
      if (!mesh.isMesh) return;
      const src = mesh.material;
      const cloned = Array.isArray(src) ? src.map((m) => m.clone()) : src.clone();
      mesh.material = cloned as typeof mesh.material;
      const list = Array.isArray(cloned) ? cloned : [cloned];
      for (const m of list) {
        m.side = FrontSide;
        m.depthWrite = true;
        m.needsUpdate = true;
        mats.push(m);
      }
    });
    materialsRef.current = mats;
    return clone;
  }, [scene]);

  const root = useRef<Group>(null);
  const { viewport } = useThree();

  useFrame(() => {
    const g = root.current;
    if (!g) return;
    const q = getQ();
    const xFrac = sampleNumber(PITCH_X, q);
    const sc = sampleNumber(PITCH_SCALE, q);
    const op = sampleNumber(PITCH_OP, q);
    g.position.set(PHONE_HERO_POS[0] + xFrac * viewport.width * 0.5, PHONE_HERO_POS[1], PHONE_HERO_POS[2]);
    g.scale.setScalar(sc);
    // Only transparent while actually dimming — fully opaque at op===1 so we
    // don't reintroduce the back-camera-ghost-through-screen the FrontSide
    // hardening above is meant to prevent.
    for (const m of materialsRef.current) {
      m.transparent = op < 1;
      m.opacity = op;
    }
  });

  return (
    <group ref={root}>
      {/* π-Y correction so the screen faces +Z (matches PhoneRig). ReelScreen
          is a SIBLING, not a child, of this group — its faceZ (+Z) math is
          computed against the un-rotated parent, not this correction. */}
      <group rotation={[0, Math.PI, 0]} scale={PHONE_SCALE}>
        <primitive object={model} />
      </group>
      <ReelScreen />
    </group>
  );
}
useGLTF.preload(PHONE_URL, false, false, withMeshopt);
