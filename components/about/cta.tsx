"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Silk } from "@/components/hero/silk";
import { Reveal } from "@/components/motion/reveal";
import { CurtainLink } from "@/components/transition/curtain-link";
import styles from "./about.module.css";

/**
 * "Let's talk" closing CTA, on a Silk backdrop (the hero's wall shader). Silk is
 * mounted from the start (warmed up while fully transparent) and its visibility
 * is driven purely by scroll-linked opacity — so it can only ever fade, never
 * pop in.
 */
export function AboutCta() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  // Fade the silk in gradually as the section rises to the bottom of the page.
  const silkOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.85]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24 text-center sm:py-32"
    >
      {/* Silk wall — fades in with scroll, edges feathered so it blends into
          the velvet instead of starting on a hard horizontal seam. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: silkOpacity,
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, #000 24%, #000 82%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, #000 24%, #000 82%, transparent 100%)",
        }}
      >
        <Silk
          color="#3b2a24"
          speed={3.5}
          scale={1}
          noiseIntensity={1.2}
          rotation={0}
        />
      </motion.div>
      {/* Darken for text contrast. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 50%, rgba(26,18,13,0.3), rgba(26,18,13,0.8))",
        }}
      />

      <span
        aria-hidden
        className={`pointer-events-none absolute left-1/4 top-16 font-script text-amber-dot ${styles.twinkle}`}
        style={{ fontSize: 18 }}
      >
        ✦
      </span>
      <span
        aria-hidden
        className={`pointer-events-none absolute right-1/4 top-24 font-script text-amber-dot ${styles.twinkle}`}
        style={{ fontSize: 13, animationDelay: "1.8s" }}
      >
        ✦
      </span>

      <Reveal className="relative z-10 mx-auto max-w-2xl px-6">
        <p className="mb-4 font-script text-4xl text-amber-dot">let&apos;s talk</p>
        <h2 className="mb-9 font-display text-3xl leading-tight sm:text-5xl">
          Have an app or business worth an honest look?
        </h2>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CurtainLink
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-dot px-8 py-4 font-sans text-sm font-semibold uppercase tracking-[0.14em] text-espresso transition-colors hover:bg-creme"
          >
            Work with me ↗
          </CurtainLink>
          <CurtainLink
            href="/work"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-creme/25 px-8 py-4 font-sans text-sm font-semibold uppercase tracking-[0.14em] text-creme transition-colors hover:border-amber-dot/60 hover:text-amber-dot"
          >
            See the work
          </CurtainLink>
        </div>
      </Reveal>
    </section>
  );
}
