"use client";

import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { REELS } from "@/lib/work";

// TODO(real): swap for a real collaboration — brief, approach, outcome + quote.
const CASE = {
  subject: REELS[0].subject,
  kind: REELS[0].kind === "app" ? "App" : "Business",
  poster: REELS[0].poster,
  beats: [
    {
      label: "The brief",
      body: "A note-taking app wanted honest reach with an audience that's seen every “productivity” pitch — and stopped believing them.",
    },
    {
      label: "What I did",
      body: "Lived in the product for a full week, then built a plain-words reel around the one moment it actually saved me — no script gloss, no feature dump.",
    },
    {
      label: "The outcome",
      body: "A review the comments argued about in good faith — saves, shares, and DMs asking “is it really that good?”. The kind of trust a paid ad can't buy.",
    },
  ],
  quote:
    "She said the quiet part out loud, and that's exactly why people believed the rest.",
  attribution: "— the brand team",
};

/**
 * A single case study — one collaboration told as brief → approach → outcome,
 * on a chocolate-glass panel with a pull-quote and the reel poster. Qualitative
 * only (no fabricated metrics). Placeholder copy for Varsheni to make real.
 */
export function CaseStudy() {
  return (
    <section
      id="case-study"
      className="relative scroll-mt-24 px-6 py-20 sm:px-10 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-3 font-sans text-xs font-medium uppercase tracking-[0.3em] text-amber-dot">
            <span>✦</span>&nbsp;&nbsp;Case study
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mb-12 max-w-xl font-display text-3xl leading-tight sm:text-5xl">
            One honest review, start to finish.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[300px_1fr] md:gap-12">
          {/* Poster */}
          <Reveal>
            <div className="relative mx-auto aspect-9/16 w-full max-w-[300px] overflow-hidden rounded-3xl border border-creme/12 shadow-[0_24px_60px_-26px_rgba(0,0,0,0.85)]">
              <Image
                src={CASE.poster}
                alt={`${CASE.subject} case study`}
                fill
                sizes="(max-width: 768px) 90vw, 300px"
                className="object-cover"
              />
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-creme/25 to-transparent" />
              <span className="absolute left-4 top-4 rounded-full border border-amber-dot/40 bg-[#1a0509]/40 px-2.5 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-taupe backdrop-blur-sm">
                {CASE.kind} · {CASE.subject}
              </span>
            </div>
          </Reveal>

          {/* Narrative beats + pull quote */}
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-6">
                {CASE.beats.map((b, i) => (
                  <div key={b.label} className="flex gap-5">
                    <span className="pt-1 font-display text-lg text-amber-dot/70">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="mb-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.24em] text-amber-dot/80">
                        {b.label}
                      </p>
                      <p className="max-w-md font-sans text-[15px] leading-relaxed text-creme/75">
                        {b.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-l-2 border-amber-dot/40 pl-5">
                <p className="font-display text-2xl leading-snug text-creme sm:text-[1.7rem]">
                  &ldquo;{CASE.quote}&rdquo;
                </p>
                <p className="mt-3 font-script text-2xl text-amber-dot">
                  {CASE.attribution}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
