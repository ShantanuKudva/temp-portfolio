"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import ColorBendsBase from "@/components/ColorBends";
import type { Reel } from "@/lib/work";
import { GradualBlur } from "@/components/effects/gradual-blur";
import { WorkHero } from "./work-hero";
import { FeaturedReel } from "./featured-reel";
import { ReelWall } from "./reel-wall";
import { WorkCta } from "./work-cta";
import { ReelLightbox } from "./reel-lightbox";

// JS-interop component — flexible props (its .jsx infers strict types from defaults).
const ColorBends = ColorBendsBase as unknown as React.ComponentType<
  Record<string, unknown>
>;

/**
 * The Work page — velvet wine surface (matching the nav's Work card), a page
 * hero, the featured reel + drifting reel wall over a region-scoped ColorBends
 * signature, and a closing CTA. Owns the lightbox open-state + selected reel.
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

      {/* Featured + wall over the ambient ColorBends signature. */}
      <section id="reels" className="relative scroll-mt-24 overflow-hidden py-8 sm:py-12">
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
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
            }}
          >
            {mounted && (
              <ColorBends
                colors={["#9a1a2c", "#5b0f1a", "#38070f"]}
                speed={0.18}
                intensity={1.1}
                transparent
                scale={1.3}
                noise={0.06}
              />
            )}
          </motion.div>
          {/* Soft floor so cards keep contrast over the glow. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 60% at 50% 40%, transparent 30%, rgba(26,5,9,0.55) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 space-y-14 px-4 sm:px-8">
          <FeaturedReel onOpen={open} />
          <ReelWall onOpen={open} />
        </div>
      </section>

      <WorkCta />

      <ReelLightbox reel={active} onClose={close} />

      {/* Bottom gradual blur, pinned across the page. */}
      <GradualBlur position="bottom" target="page" height="5.5rem" strength={3.2} />
    </main>
  );
}
