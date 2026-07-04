'use client';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, useGLTF, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { ACESFilmicToneMapping } from 'three';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

// `desk.glb` is compressed with EXT_meshopt_compression (verified via
// `gltf-transform inspect`), not Draco. Wire the meshopt decoder explicitly via
// extendLoader, and pass `false, false` for (useDraco, useMeshopt) so drei's own
// default auto-wiring doesn't re-run afterward and silently overwrite the decoder
// we just set (drei's `extensions()` helper calls extendLoader FIRST, then applies
// its own draco/meshopt defaults on top when those args are left undefined).
const withMeshopt = (loader: Parameters<NonNullable<Parameters<typeof useGLTF>[3]>>[0]) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
};

function Desk() {
  const { scene } = useGLTF('/assets/desk.glb', false, false, withMeshopt);
  return <primitive object={scene} />;
}

export default function SpikeScene() {
  return (
    <Canvas
      className="!fixed inset-0 h-screen w-screen"
      shadows
      gl={{ antialias: true, toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      camera={{ position: [1.08, 0.75, 1.44], fov: 40 }}
    >
      {/* Camera distance/target tightened vs. the brief's default (which assumed a larger
          desk): this glb's real bbox is ~1.13 x 0.71 x 0.8m, so the brief's [2.4,1.4,3.2]/
          target-y=0.6 left the desk tiny in frame. Scaled down proportionally + retargeted
          to the model's actual center height (~0.4) for a proper beauty-shot framing. */}
      <color attach="background" args={['#2A1A1C']} />
      <Environment files="/assets/hdri/room.hdr" background={false} />
      <directionalLight castShadow position={[4, 6, 3]} intensity={2.2} color="#F4EBDD"
        shadow-mapSize={[2048, 2048]} shadow-bias={-0.0002} />
      <Desk />
      <ContactShadows position={[0, 0.01, 0]} opacity={0.5} blur={2.4} far={4} />
      <OrbitControls makeDefault target={[0, 0.4, 0]} />
      <EffectComposer>
        <Bloom intensity={0.6} luminanceThreshold={0.85} luminanceSmoothing={0.2} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
useGLTF.preload('/assets/desk.glb', false, false, withMeshopt);
