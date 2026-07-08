'use client';
import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping } from 'three';
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import { EffectComposer, Bloom, N8AO } from '@react-three/postprocessing';
import RoomEnvironment from '@/components/hero/RoomEnvironment';
import PhoneRig from '@/components/hero/PhoneRig';
import LogoField from '@/components/hero/LogoField';
import CameraRig from '@/components/hero/CameraRig';

export default function HeroCanvas() {
  // Adaptive quality for weak GPUs. dpr is capped (never render at native 2–3×
  // retina) and driven down further when the frame rate regresses; a sustained
  // regression trips `lowPerf`, which also drops the expensive ambient-occlusion
  // pass. AdaptiveDpr additionally lowers resolution while the scene is actively
  // moving and restores it when idle. Together these keep low-end devices from
  // stuttering without touching the look on capable hardware.
  const [dpr, setDpr] = useState(1.5);
  const [lowPerf, setLowPerf] = useState(false);

  return (
    <Canvas
      className="!fixed inset-0 h-screen w-screen"
      shadows
      dpr={dpr}
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
      {/* Warm dark backdrop for the desk close-up */}
      <color attach="background" args={['#130D0A']} />
      {/* Watches the render loop: step dpr down on regression, and after a few
          flip-flops fall back to the floor + flag low-perf (drops AO below). */}
      <PerformanceMonitor
        onIncline={() => setDpr(1.75)}
        onDecline={() => setDpr(1)}
        flipflops={3}
        onFallback={() => { setDpr(1); setLowPerf(true); }}
      />
      <AdaptiveDpr pixelated />
      {/* CameraRig takes over the default camera every frame via useThree — the
          `camera` prop above only supplies its initial pose (first paint, before
          CameraRig's first useFrame runs). Must mount before EffectComposer. */}
      <CameraRig />
      <RoomEnvironment />
      <PhoneRig />
      {/* App icons erupt from the phone into a floating constellation. */}
      <LogoField />
      {/* EffectComposer must remain the LAST child; later rigs (Phone/Logo) mount ABOVE it.
          Two variants: the full chain (ambient occlusion + bloom) on capable
          hardware, and a bloom-only chain once low-perf trips — AO is the single
          most expensive pass, so dropping it is the biggest saving for weak GPUs.
          (Split into two composers rather than a conditional child because
          EffectComposer's children must be effect elements, not a falsy value.) */}
      {lowPerf ? (
        <EffectComposer>
          <Bloom intensity={0.32} luminanceThreshold={0.95} luminanceSmoothing={0.25} mipmapBlur />
        </EffectComposer>
      ) : (
        <EffectComposer>
          <N8AO aoRadius={0.35} intensity={1.9} distanceFalloff={1} color="black" halfRes />
          <Bloom intensity={0.32} luminanceThreshold={0.95} luminanceSmoothing={0.25} mipmapBlur />
        </EffectComposer>
      )}
    </Canvas>
  );
}
