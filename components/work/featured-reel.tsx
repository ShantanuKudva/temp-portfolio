"use client";

import { ArrowUpRight } from "lucide-react";
import type { Reel } from "@/lib/work";
import { FEATURED } from "@/lib/work";
import { ReelCard } from "./reel-card";
import { Reveal } from "@/components/motion/reveal";

/**
 * The featured reel: a larger 9:16 card + a meta column (tag, title, take, and
 * a "watch the review" affordance that opens the same lightbox).
 */
export function FeaturedReel({ onOpen }: { onOpen: (reel: Reel) => void }) {
  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-8 md:grid-cols-[minmax(0,320px)_1fr] md:gap-14">
      <Reveal>
        <div className="relative mx-auto w-full max-w-[300px]">
          <span className="absolute -left-3 -top-3 z-10 rounded-full bg-amber-dot px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-espresso shadow-[0_8px_24px_-6px_rgba(217,160,91,0.6)]">
            Latest review
          </span>
          <ReelCard reel={FEATURED} onOpen={onOpen} priority />
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="max-w-md">
          <span className="inline-block rounded-full border border-amber-dot/40 px-3 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-taupe">
            {FEATURED.kind === "app" ? "App" : "Business"} · {FEATURED.subject}
          </span>
          <h2 className="mt-5 font-display text-3xl leading-tight text-creme sm:text-4xl">
            {FEATURED.title}
          </h2>
          <p className="mt-4 font-sans text-[15px] leading-relaxed text-creme/70">
            The freshest one off the edit bench — lived-in for days, then said
            plainly. Tap in for the full, honest take.
          </p>
          <button
            type="button"
            onClick={() => onOpen(FEATURED)}
            className="group mt-7 inline-flex items-center gap-2 rounded-full bg-amber-dot px-6 py-3 font-sans text-sm font-semibold uppercase tracking-[0.14em] text-espresso transition-colors hover:bg-creme"
          >
            Watch the review
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </button>
        </div>
      </Reveal>
    </div>
  );
}
