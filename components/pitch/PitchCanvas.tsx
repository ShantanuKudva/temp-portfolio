'use client';
import { useRef } from 'react';
import type { RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { getQ } from '@/lib/store';
import { clamp01 } from '@/lib/track';
import { PBEAT } from '@/lib/pitch';
import PitchPhone from './PitchPhone';
import PitchOrbit from './PitchOrbit';

// Camera framing for the pitch phone hero shot — tuned live so the phone
// reads as a spotlit hero on a near-black ground.
const PHONE_CAM_Y = 1.12; // raised above the phone hero height so the tall phone drops into frame centre
const PHONE_CAM_Z = 2.3; // close enough that the hero-scaled phone fills the frame

// Rendered INSIDE <Canvas> so useFrame runs on the render loop; it mutates
// the outer wrapper div's style via the ref every frame to fade the whole
// canvas up from black over portalOut → meetHer (the landing's black-portal
// handoff). Reads wrapRef.current fresh each frame instead of capturing
// wrap.current at mount time (which would still be null on first render).
function FadeIn({ wrapRef }: { wrapRef: RefObject<HTMLDivElement | null> }) {
  useFrame(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.opacity = clamp01(
      (getQ() - PBEAT.portalOut) / (PBEAT.meetHer - PBEAT.portalOut)
    ).toFixed(3);
  });
  return null;
}

export default function PitchCanvas() {
  const wrap = useRef<HTMLDivElement>(null);
  return (
    <div ref={wrap} className="pointer-events-none fixed inset-0 z-0 bg-[#0B0708]" style={{ opacity: 0 }}>
      <Canvas camera={{ position: [0, PHONE_CAM_Y, PHONE_CAM_Z], fov: 40 }} dpr={[1, 2]}>
        {/* Same HDRI the landing uses so the iPhone 14 Pro's PBR metal/glass reads
            identically (without an env map it renders flat + pale — looked like a
            different asset). background stays off; this only lights reflections. */}
        <Environment files="/assets/hdri/room.hdr" environmentIntensity={0.5} />
        <ambientLight intensity={0.25} color="#FFF3E8" />
        <directionalLight position={[2, 4, 3]} intensity={1.4} color="#FFE9CC" />
        <spotLight position={[0, 3, 2.5]} angle={0.5} penumbra={0.8} intensity={14} color="#FFE7C4" />
        <PitchPhone />
        <PitchOrbit />
        <FadeIn wrapRef={wrap} />
      </Canvas>
    </div>
  );
}
