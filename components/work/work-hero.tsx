"use client";

import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import { CtaStamp } from "./cta-stamp";
import type { WorkContent } from "@/lib/content/map/work";

const EASE = [0.16, 1, 0.3, 1] as const;

function Sparkle({
  className,
  size = 16,
  delay = 0,
}: {
  className: string;
  size?: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      className={`pointer-events-none absolute font-script text-[#eebb79] ${className}`}
      style={{ fontSize: size }}
      initial={{ opacity: 0.25 }}
      animate={reduce ? { opacity: 0.4 } : { opacity: [0.25, 0.8, 0.25] }}
      transition={{ duration: 4.5, ease: EASE, repeat: Infinity, delay }}
    >
      ✦
    </motion.span>
  );
}

/**
 * Work hero — the Connect page's centered, aurora-backed hero, in the wine
 * theme: eyebrow, an Alex Brush line, the Playfair headline, a sub-line and the
 * availability pill, all centred with a scroll parallax.
 */
export function WorkHero({ content }: { content: WorkContent["hero"] }) {
  return (
    <section className="relative overflow-hidden px-6 pb-10 pt-32 text-center sm:px-10 sm:pt-40">
      {/* Rotating "work with me" CTA stamp, top corner. */}
      <CtaStamp className="absolute right-6 top-28 z-20 hidden h-24 w-24 sm:right-10 sm:top-32 sm:block lg:h-28 lg:w-28" />

      <Sparkle className="left-[18%] top-28" size={20} />
      <Sparkle className="right-[20%] top-40" size={14} delay={1.6} />
      <Sparkle className="left-[30%] top-[60%]" size={12} delay={2.8} />

      <Parallax speed={34}>
        <Reveal className="mx-auto max-w-2xl">
          <p className="mb-4 font-sans text-xs font-medium uppercase tracking-[0.34em] text-[#eebb79]">
            <span>✦</span>&nbsp;&nbsp;{content.eyebrow}
          </p>
          <p className="mb-2 font-script text-5xl text-[#eebb79] sm:text-6xl">
            {content.script}
          </p>
          <h1 className="mb-6 font-display text-4xl leading-[1.08] sm:text-6xl">
            {content.headline}
          </h1>
          <p className="mx-auto mb-8 max-w-md font-sans text-base leading-relaxed text-creme/70">
            {content.intro}
          </p>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-dot/40 bg-amber-dot/10 px-4 py-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-[#eebb79]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-dot opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-dot" />
            </span>
            {content.availability}
          </span>
        </Reveal>
      </Parallax>
    </section>
  );
}
