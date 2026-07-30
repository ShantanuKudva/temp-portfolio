"use client";

import { useState } from "react";
import type { Reel, ReelCategory } from "@/lib/work";
import type { WorkContent } from "@/lib/content/map/work";
import { PageBottomBlur } from "@/components/effects/page-bottom-blur";
import { WorkAurora } from "./work-aurora";
import { WorkHero } from "./work-hero";
import { ReelGallery } from "./reel-gallery";
import { CaseStudy } from "./case-study";
import { Process } from "./process";
import { WorkCta } from "./work-cta";
import { ReelLightbox } from "./reel-lightbox";
import { MakerCredit } from "@/components/maker-credit";

/**
 * The Work page — mirrors the Connect layout in the wine theme (the nav's Work
 * card): a centred, ColorBends-backed hero → a category-grouped reel gallery →
 * a case study → the "how the reels get made" process → closing CTA. Owns the
 * lightbox open-state + selected reel.
 */
export function WorkPage({
  categories,
  content,
}: {
  categories: ReelCategory[];
  content: WorkContent;
}) {
  const [active, setActive] = useState<Reel | null>(null);
  const open = (reel: Reel) => setActive(reel);
  const close = () => setActive(null);

  return (
    <main
      className="relative flex-1 text-creme"
      style={{ background: "linear-gradient(165deg, #5b0f1a 0%, #380710 45%)" }}
    >
      <WorkAurora>
        <WorkHero content={content.hero} />
        <ReelGallery categories={categories} content={content.gallery} onOpen={open} />
        <CaseStudy content={content.caseStudy} />
        <Process content={content.process} />
        <WorkCta content={content.cta} />
        <MakerCredit />
      </WorkAurora>

      <ReelLightbox reel={active} onClose={close} />

      {/* Bottom gradual blur — fades out as the footer arrives (stays crisp). */}
      <PageBottomBlur />
    </main>
  );
}
