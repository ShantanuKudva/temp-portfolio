"use client";

import { Reveal } from "@/components/motion/reveal";

// TODO(real): tune to Varsheni's actual workflow.
const STEPS = [
  {
    n: "01",
    title: "The brief",
    body: "We align on goals, audience and disclosure up front — no surprises, brand-safe from the first message.",
  },
  {
    n: "02",
    title: "I live with it",
    body: "Days of real, everyday use — not a five-minute demo. The verdict only lands because it's earned.",
  },
  {
    n: "03",
    title: "Script & shoot",
    body: "A plain-words take, written thumb-first and shot to be watched to the very last second.",
  },
  {
    n: "04",
    title: "Edit & deliver",
    body: "Cut, captioned and colour-matched, delivered with usage rights and revisions built in.",
  },
];

/**
 * "How the reels get made" — the process as a wine-glass bento with number
 * watermarks (mirrors About's What-I-bring card language).
 */
export function Process() {
  return (
    <section
      id="process"
      className="relative scroll-mt-24 px-6 py-20 sm:px-10 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-3 font-sans text-xs font-medium uppercase tracking-[0.3em] text-amber-dot">
            <span>✦</span>&nbsp;&nbsp;How the reels get made
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mb-12 max-w-xl font-display text-3xl leading-tight sm:text-5xl">
            From brief to your feed — the honest way.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06}>
              <div className="group relative flex min-h-[13.5rem] flex-col overflow-hidden rounded-3xl border border-creme/12 bg-gradient-to-br from-[#5b0f1a]/85 via-[#3a0a12]/80 to-[#160407]/92 p-7 backdrop-blur-md transition-colors duration-300 hover:border-amber-dot/45">
                {/* number watermark */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-3 bottom-0 select-none font-display leading-[0.8] text-creme/[0.06]"
                  style={{ fontSize: "8.5rem" }}
                >
                  {s.n}
                </span>
                {/* top sheen */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-creme/25 to-transparent"
                />

                <div className="relative z-10 flex flex-col">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-amber-dot">
                      {s.n} / 04
                    </span>
                    <span className="h-px w-9 bg-amber-dot/50" />
                  </div>
                  <h3 className="mb-2.5 font-display text-2xl sm:text-[1.6rem]">
                    {s.title}
                  </h3>
                  <p className="max-w-xs font-sans text-[14px] leading-relaxed text-creme/70">
                    {s.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
