"use client";
import { useScrollStore } from "@/lib/store";

// Bottom-centre "scroll" cue on the establish frame. Fades out the moment the
// sequence starts moving (p > ~0) so it never lingers over the animation. Sits
// under the preloader (z-40 < z-100), so it only appears once the scene is revealed.
export default function ScrollIndicator() {
  const started = useScrollStore((s) => s.p > 0.02);
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-[5vh] z-40 flex flex-col items-center gap-2 transition-opacity duration-500"
      style={{ opacity: started ? 0 : 1 }}
      aria-hidden="true"
    >
      <span className="scroll-cue__label">Scroll</span>
      <span className="scroll-cue__mouse">
        <span className="scroll-cue__wheel" />
      </span>
    </div>
  );
}
