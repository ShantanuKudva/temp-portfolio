"use client";

import { Reveal } from "@/components/motion/reveal";
import { CurtainLink } from "@/components/transition/curtain-link";

/**
 * Closing CTA — a lean line into a curtain-transition CTA toward /contact, with
 * a secondary link across to /about.
 */
export function WorkCta() {
  return (
    <section className="relative px-6 py-24 text-center sm:py-32">
      <Reveal className="mx-auto max-w-2xl">
        <p className="mb-3 font-script text-4xl text-amber-dot">seen enough?</p>
        <h2 className="mb-9 font-display text-3xl leading-tight sm:text-5xl">
          Let&apos;s make something honest.
        </h2>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CurtainLink
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-dot px-8 py-4 font-sans text-sm font-semibold uppercase tracking-[0.14em] text-espresso transition-colors hover:bg-creme"
          >
            Work with me ↗
          </CurtainLink>
          <CurtainLink
            href="/about"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-creme/25 px-8 py-4 font-sans text-sm font-semibold uppercase tracking-[0.14em] text-creme transition-colors hover:border-amber-dot/60 hover:text-amber-dot"
          >
            Read her story →
          </CurtainLink>
        </div>
      </Reveal>
    </section>
  );
}
