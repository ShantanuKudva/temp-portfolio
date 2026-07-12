"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import SoftAuroraBase from "@/components/SoftAurora";
import { Reveal } from "@/components/motion/reveal";
import { CurtainLink } from "@/components/transition/curtain-link";

// JS-interop component — flexible props (its .jsx infers strict types from defaults).
const SoftAurora = SoftAuroraBase as unknown as React.ComponentType<
  Record<string, unknown>
>;

/**
 * Closing CTA — the end of the page. A wine/gold SoftAurora glow rises from the
 * bottom edge behind a lean curtain-transition CTA toward /contact.
 */
export function WorkCta() {
  const ref = useRef<HTMLElement>(null);
  const mounted = useInView(ref, { margin: "20% 0px 20% 0px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden px-6 py-28 text-center sm:py-36"
    >
      {/* SoftAurora glow centred on the closing headline. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, #000 28%, #000 72%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, #000 28%, #000 72%, transparent 100%)",
        }}
      >
        {mounted && (
          <SoftAurora
            color1="#e7b878"
            color2="#7a1524"
            speed={0.5}
            scale={1.4}
            brightness={1.05}
            bandHeight={0.54}
            bandSpread={1.1}
            colorSpeed={0.8}
            enableMouseInteraction={false}
          />
        )}
      </motion.div>

      <Reveal className="relative z-10 mx-auto max-w-2xl">
        <p className="mb-3 font-script text-4xl text-[#eebb79]">seen enough?</p>
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
            className="inline-flex items-center justify-center gap-2 rounded-full border border-creme/25 px-8 py-4 font-sans text-sm font-semibold uppercase tracking-[0.14em] text-creme transition-colors hover:border-amber-dot/60 hover:text-[#eebb79]"
          >
            Read her story →
          </CurtainLink>
        </div>
      </Reveal>
    </section>
  );
}
