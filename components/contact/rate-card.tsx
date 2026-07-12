"use client";

import { CONTACT, PACKAGES, type Package } from "@/lib/contact-info";
import { Reveal } from "@/components/motion/reveal";
import { SpotlightCard } from "@/components/effects/spotlight-card";

function Tile({ pkg, delay }: { pkg: Package; delay: number }) {
  return (
    <Reveal delay={delay} className="h-full">
      <SpotlightCard
        spotlightColor="rgba(217, 160, 91, 0.16)"
        className="h-full rounded-3xl border border-creme/12 bg-gradient-to-br from-[#3f2d25]/90 via-[#2a1c14]/85 to-[#140d09]/92 p-7 backdrop-blur-md transition-colors duration-300 hover:border-amber-dot/50 sm:p-8"
      >
        <div className="relative z-10 flex h-full flex-col">
          <h3 className="font-display text-2xl sm:text-[1.7rem]">{pkg.name}</h3>
          <p className="mt-1.5 font-sans text-[14px] leading-relaxed text-creme/60">
            {pkg.blurb}
          </p>
          <ul className="mt-6 flex-1 space-y-2.5">
            {pkg.deliverables.map((d) => (
              <li key={d} className="flex items-start gap-2.5 font-sans text-[14px] text-creme/75">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-clay" />
                {d}
              </li>
            ))}
          </ul>
          <p className="mt-7 font-display text-xl text-amber-dot">{pkg.priceFrom}</p>
        </div>
      </SpotlightCard>
    </Reveal>
  );
}

/**
 * "What working together looks like" — three package tiles with "from ₹X"
 * anchors and a downloadable rate-card PDF. Same card family as About's bento.
 */
export function RateCard() {
  return (
    <section id="packages" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal>
          <p className="mb-3 font-sans text-xs font-medium uppercase tracking-[0.3em] text-amber-dot">
            <span>✦</span>&nbsp;&nbsp;Rate card
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mb-12 max-w-xl font-display text-3xl leading-tight sm:text-5xl">
            What working together looks like.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PACKAGES.map((pkg, i) => (
            <Tile key={pkg.key} pkg={pkg} delay={i * 0.06} />
          ))}
        </div>

        <Reveal delay={0.12}>
          <a
            href={CONTACT.rateCardPdf}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-creme/25 px-6 py-3 font-sans text-sm font-semibold uppercase tracking-[0.14em] text-creme transition-colors hover:border-amber-dot/60 hover:text-amber-dot"
            download
          >
            ↓ Download rate card (PDF)
          </a>
        </Reveal>
      </div>
    </section>
  );
}
