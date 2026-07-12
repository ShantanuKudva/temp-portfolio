"use client";

import { useState } from "react";
import type { Reel } from "@/lib/work";
import { GradualBlur } from "@/components/effects/gradual-blur";
import { WorkAurora } from "./work-aurora";
import { WorkHero } from "./work-hero";
import { ReelGallery } from "./reel-gallery";
import { CaseStudy } from "./case-study";
import { Process } from "./process";
import { WorkCta } from "./work-cta";
import { ReelLightbox } from "./reel-lightbox";

/**
 * The Work page — mirrors the Connect layout in the wine theme (the nav's Work
 * card): a centred, ColorBends-backed hero → a category-grouped reel gallery →
 * a case study → the "how the reels get made" process → closing CTA. Owns the
 * lightbox open-state + selected reel.
 */
export function WorkPage() {
  const [active, setActive] = useState<Reel | null>(null);
  const open = (reel: Reel) => setActive(reel);
  const close = () => setActive(null);

  return (
    <main
      className="relative flex-1 text-creme"
      style={{ background: "linear-gradient(165deg, #5b0f1a 0%, #380710 45%)" }}
    >
      <WorkAurora>
        <WorkHero />
        <ReelGallery onOpen={open} />
        <CaseStudy />
        <Process />
        <WorkCta />
      </WorkAurora>

      <ReelLightbox reel={active} onClose={close} />

      {/* Bottom gradual blur, pinned across the page. */}
      <GradualBlur position="bottom" target="page" height="5.5rem" strength={3.2} />
    </main>
  );
}
