"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CONTACT, PACKAGES, type Package } from "@/lib/contact-info";
import { Reveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import { SpotlightCard } from "@/components/effects/spotlight-card";
import LightRaysBase from "@/components/LightRays";

// JS-interop component — flexible props (its .jsx infers strict types from defaults).
const LightRays = LightRaysBase as unknown as React.ComponentType<
  Record<string, unknown>
>;

const EASE = [0.16, 1, 0.3, 1] as const;

function Tile({ pkg, delay }: { pkg: Package; delay: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Reveal delay={delay} className="h-full">
      <div
        className="h-full"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <SpotlightCard
          spotlightColor="rgba(174, 178, 230, 0.16)"
          className="h-full rounded-3xl border border-creme/12 bg-gradient-to-br from-[#232647]/90 via-[#161832]/85 to-[#0b0c1a]/92 p-7 backdrop-blur-md transition-colors duration-300 hover:border-moonlight/50 sm:p-8"
        >
          {/* LightRays ignite on hover — same effect as About, moonlight-tinted. */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                key="rays"
                className="absolute inset-0"
                style={{ zIndex: 1, isolation: "isolate" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                aria-hidden
              >
                <LightRays
                  raysOrigin="top-center"
                  raysColor="#aeb2e6"
                  raysSpeed={1.3}
                  lightSpread={0.7}
                  rayLength={1.5}
                  followMouse
                  mouseInfluence={0.2}
                  noiseAmount={0.08}
                  distortion={0.03}
                  saturation={1}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative z-10 flex h-full flex-col">
            <h3 className="font-display text-2xl sm:text-[1.7rem]">{pkg.name}</h3>
            <p className="mt-1.5 font-sans text-[14px] leading-relaxed text-creme/60">
              {pkg.blurb}
            </p>
            <ul className="mt-6 flex-1 space-y-2.5">
              {pkg.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-2.5 font-sans text-[14px] text-creme/75">
                  <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-moonlight" />
                  {d}
                </li>
              ))}
            </ul>
            <p className="mt-7 font-display text-xl text-moonlight">{pkg.priceFrom}</p>
          </div>
        </SpotlightCard>
      </div>
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
        <Parallax speed={28}>
          <Reveal>
            <p className="mb-3 font-sans text-xs font-medium uppercase tracking-[0.3em] text-moonlight">
              <span>✦</span>&nbsp;&nbsp;Rate card
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mb-12 max-w-xl font-display text-3xl leading-tight sm:text-5xl">
              What working together looks like.
            </h2>
          </Reveal>
        </Parallax>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PACKAGES.map((pkg, i) => (
            <Tile key={pkg.key} pkg={pkg} delay={i * 0.06} />
          ))}
        </div>

        <Reveal delay={0.12}>
          <a
            href={CONTACT.rateCardPdf}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-creme/25 px-6 py-3 font-sans text-sm font-semibold uppercase tracking-[0.14em] text-creme transition-colors hover:border-moonlight/60 hover:text-moonlight"
            download
          >
            ↓ Download rate card (PDF)
          </a>
        </Reveal>
      </div>
    </section>
  );
}
