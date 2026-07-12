"use client";

import { Reveal } from "@/components/motion/reveal";
import { CurtainLink } from "@/components/transition/curtain-link";

/**
 * A themed "in the studio" placeholder for routes that are wired but not yet
 * built out (/work, /contact). Crème-forward with the section's accent so the
 * nav + CTAs never dead-end while the real page is in progress.
 */
export function PagePlaceholder({
  eyebrow,
  title,
  blurb,
  accent = "var(--color-wine)",
}: {
  eyebrow: string;
  title: string;
  blurb: string;
  accent?: string;
}) {
  return (
    <main className="flex flex-1 items-center justify-center bg-creme px-6 py-40 text-center text-espresso">
      <Reveal className="mx-auto max-w-xl">
        <p
          className="mb-4 font-sans text-xs font-medium uppercase tracking-[0.34em]"
          style={{ color: accent }}
        >
          <span>✦</span>&nbsp;&nbsp;{eyebrow}
        </p>
        <h1 className="mb-6 font-display text-4xl leading-tight sm:text-6xl">
          {title}
        </h1>
        <p className="mb-10 font-sans text-base leading-relaxed text-mocha sm:text-lg">
          {blurb}
        </p>
        <CurtainLink
          href="/about"
          className="inline-flex items-center gap-2 rounded-full border border-espresso/20 px-7 py-3.5 font-sans text-sm font-semibold uppercase tracking-[0.14em] text-espresso transition-colors hover:border-wine/40 hover:text-wine"
        >
          Meet Varsheni ↗
        </CurtainLink>
      </Reveal>
    </main>
  );
}
