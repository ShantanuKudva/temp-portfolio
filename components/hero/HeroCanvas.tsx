'use client';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping } from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import RoomEnvironment from '@/components/hero/RoomEnvironment';
import PhoneRig from '@/components/hero/PhoneRig';
import CameraRig from '@/components/hero/CameraRig';

export default function HeroCanvas() {
  return (
    <Canvas
      className="!fixed inset-0 h-screen w-screen"
      shadows
      gl={{ antialias: true, toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      // near=0.01 (default is 0.1): CameraRig's push-through dives to within
      // ~0.13m of the 0.0082m-thick phone screen (lib/camera.ts) before
      // crossing it — the default near plane is coarse enough relative to
      // that gap to clip the phone out of view for a visibly-blank stretch
      // of scroll right as it should be filling the frame. far=100 keeps the
      // near:far ratio (10,000:1) safely away from depth-buffer z-fighting
      // for this room-scale (a few meters) scene.
      camera={{ position: [2.6, 1.5, 4.2], fov: 40, near: 0.01, far: 100 }}
    >
      <color attach="background" args={['#2A1A1C']} />
      {/* CameraRig takes over the default camera every frame via useThree — the
          `camera` prop above only supplies its initial pose (first paint, before
          CameraRig's first useFrame runs). Must mount before EffectComposer. */}
      <CameraRig />
      <RoomEnvironment />
      <PhoneRig />
      {/* EffectComposer must remain the LAST child; later rigs (Phone/Logo) mount ABOVE it. */}
      <EffectComposer>
        <Bloom intensity={0.5} luminanceThreshold={0.9} luminanceSmoothing={0.2} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
