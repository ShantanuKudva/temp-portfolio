import ScrollProvider from '@/components/scroll/ScrollProvider';
import HeroCanvas from '@/components/hero/HeroCanvas';
import HookText from '@/components/overlay/HookText';
import ScrollIndicator from '@/components/overlay/ScrollIndicator';
import LandingCurtain from '@/components/overlay/LandingCurtain';
import Preloader from '@/components/hero/Preloader';
import PitchSection from '@/components/pitch/PitchSection';

export default function Page() {
  return (
    <main className="relative w-full bg-[#0B0708]">
      {/* The 3D scene + overlays are FIXED to the viewport and live OUTSIDE the
          scroll track. Previously they sat inside a GSAP-pinned wrapper, but pinning
          applies a `transform` to that wrapper, and a transformed ancestor makes a
          `position: fixed` child resolve against it instead of the viewport — so on
          pin-release the whole scene slid up into black. Kept out here, the canvas
          stays locked to the viewport through the portfolio handoff. */}
      <HeroCanvas />
      <HookText />
      <ScrollIndicator />
      {/* Closes the last of the push-through to a fully black frame (the 3D framing
          leaves lit desk edges) so the portfolio fades in over black, not a half-lit
          desk. Above the canvas, below the portfolio. */}
      <LandingCurtain />
      {/* Invisible tall spacer that provides the landing's scroll distance and
          drives progress `p` (no pin — see ScrollProvider). */}
      <ScrollProvider />
      <PitchSection />
      {/* Gates the scene until every GLB + the HDRI have streamed in (100%). */}
      <Preloader />
    </main>
  );
}
