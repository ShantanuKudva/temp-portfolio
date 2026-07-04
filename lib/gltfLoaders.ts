import type { useGLTF } from '@react-three/drei';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

// Shared meshopt decoder wiring, factored out of RoomEnvironment.tsx (Task 5)
// so other GLTF-consuming rigs (PhoneRig, Task 6) don't duplicate it.
// `desk.glb`/`phone.glb` are compressed with EXT_meshopt_compression (not
// Draco) — see SpikeScene.tsx (Task 3) for the original discovery. Pass
// `false, false` for (useDraco, useMeshopt) to `useGLTF` so drei's own
// `extensions()` helper doesn't re-run its bundled meshopt decoder *after*
// this one and silently overwrite it (it calls `extendLoader` first, then
// unconditionally wires its own decoder when those two args are left
// undefined).
//
// NOTE: RoomEnvironment.tsx keeps its own local copy of this exact function
// rather than importing this module — that migration is deliberately
// deferred (see Task 6 brief) to avoid refactoring code outside this task's
// scope.
export const withMeshopt = (loader: Parameters<NonNullable<Parameters<typeof useGLTF>[3]>>[0]) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
};
