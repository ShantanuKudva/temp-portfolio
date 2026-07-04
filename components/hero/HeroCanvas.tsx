'use client';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping } from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import RoomEnvironment from '@/components/hero/RoomEnvironment';
import PhoneRig from '@/components/hero/PhoneRig';

export default function HeroCanvas() {
  return (
    <Canvas
      className="!fixed inset-0 h-screen w-screen"
      shadows
      gl={{ antialias: true, toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      camera={{ position: [2.6, 1.5, 4.2], fov: 40 }}
    >
      <color attach="background" args={['#2A1A1C']} />
      <RoomEnvironment />
      <PhoneRig />
      {/* EffectComposer must remain the LAST child; later rigs (Camera/Phone/Logo) mount ABOVE it. */}
      <EffectComposer>
        <Bloom intensity={0.5} luminanceThreshold={0.9} luminanceSmoothing={0.2} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
