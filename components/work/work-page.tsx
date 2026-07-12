"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import ColorBendsBase from "@/components/ColorBends";
import type { Reel } from "@/lib/work";
import { GradualBlur } from "@/components/effects/gradual-blur";
import { Reveal } from "@/components/motion/reveal";
import { WorkHero } from "./work-hero";
import { ReelGrid } from "./reel-grid";
import { CaseStudy } from "./case-study";
import { Process } from "./process";
import { WorkCta } from "./work-cta";
import { ReelLightbox } from "./reel-lightbox";

// JS-interop component — flexible props (its .jsx infers strict types from defaults).
const ColorBends = ColorBendsBase as unknown as React.ComponentType<
  Record<string, unknown>
>;

/**
 * The Work page — velvet wine surface (matching the nav's Work card), a page
 * hero, then a framed reel section: featured reel + a full-bleed drifting reel
 * wall over the ambient ColorBends signature, closing on a CTA. Owns the
 * lightbox open-state + selected reel.
 */
export function WorkPage() {
  const [active, setActive] = useState<Reel | null>(null);
  const open = (reel: Reel) => setActive(reel);
  const close = () => setActive(null);

  const regionRef = useRef<HTMLDivElement>(null);
  // Mount ColorBends early (while opacity is ~0) so its WebGL first frame never
  // flashes; keep it mounted across the region.
  const mounted = useInView(regionRef, { margin: "40% 0px 40% 0px" });

  return (
    <main
      className="relative flex-1 text-creme"
      style={{ background: "linear-gradient(165deg, #5b0f1a 0%, #380710 45%)" }}
    >
      <WorkHero />

      {/* ═══ The reels — framed section over the ambient ColorBends ═══ */}
      <section
        id="reels"
        className="relative scroll-mt-24 overflow-hidden py-16 sm:py-24"
      >
        {/* Ambient ColorBends — feathered top/bottom, mount-faded to a low steady
            opacity so it breathes behind the reels without a hard seam. */}
        <div
          ref={regionRef}
          className="pointer-events-none absolute inset-0"
          aria-hidden
        >
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{
              // Heavy blur turns ColorBends' bands into a soft velvet glow
              // (no hard laser beam), the way About's Aurora reads.
              filter: "blur(70px) saturate(1.05)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)",
            }}
          >
            {mounted && (
              <ColorBends
                colors={["#9a1a2c", "#5b0f1a", "#38070f"]}
                speed={0.14}
                intensity={0.95}
                transparent
                scale={2.2}
                frequency={0.7}
                noise={0.05}
              />
            )}
          </motion.div>
          {/* Soft floor so cards keep contrast over the glow. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 60% at 50% 30%, transparent 45%, rgba(26,5,9,0.5) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 px-6 sm:px-10">
          {/* Section header. */}
          <div className="mx-auto mb-14 max-w-5xl">
            <Reveal>
              <p className="mb-3 font-sans text-xs font-medium uppercase tracking-[0.3em] text-amber-dot">
                <span>✦</span>&nbsp;&nbsp;Recent reviews
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="max-w-xl font-display text-3xl leading-tight sm:text-5xl">
                Worth pressing play on.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 max-w-lg font-sans text-[15px] leading-relaxed text-creme/65">
                Tap any reel for the full, honest take — no paid praise, just
                what held up once the novelty wore off.
              </p>
            </Reveal>
          </div>

          <ReelGrid onOpen={open} />
        </div>
      </section>

      <CaseStudy />

      <Process />

      <WorkCta />

      <ReelLightbox reel={active} onClose={close} />

      {/* Bottom gradual blur, pinned across the page. */}
      <GradualBlur position="bottom" target="page" height="5.5rem" strength={3.2} />
    </main>
  );
}
