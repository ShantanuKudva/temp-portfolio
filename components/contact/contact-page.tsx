"use client";

import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/motion/reveal";
import { GradualBlur } from "@/components/effects/gradual-blur";
import { ContactAurora } from "./contact-aurora";
import { RateCard } from "./rate-card";
import { Booking } from "./booking";
import { PrismaticClose } from "./prismatic-close";

const EASE = [0.16, 1, 0.3, 1] as const;

function Sparkle({ className, size = 16, delay = 0 }: { className: string; size?: number; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      className={`pointer-events-none absolute font-script text-moonlight ${className}`}
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
 * The Connect page: an Aurora-backed hero → rate card → booking + contact rail,
 * with the shared bottom gradual blur. Warm espresso base with gold/terracotta
 * accents — the Connect nav-card's world.
 */
export function ContactPage() {
  return (
    <main
      className="relative flex-1 text-creme"
      style={{ background: "linear-gradient(165deg, #191b33 0%, #0b0c1a 45%)" }}
    >
      <ContactAurora>
        {/* ═══ Hero ═══ */}
        <section className="relative overflow-hidden px-6 pb-10 pt-32 text-center sm:px-10 sm:pt-40">
          <Sparkle className="left-[18%] top-28" size={20} />
          <Sparkle className="right-[20%] top-40" size={14} delay={1.6} />
          <Sparkle className="left-[30%] top-[60%]" size={12} delay={2.8} />

          <Reveal className="mx-auto max-w-2xl">
            <p className="mb-4 font-sans text-xs font-medium uppercase tracking-[0.34em] text-moonlight">
              <span>✦</span>&nbsp;&nbsp;Connect
            </p>
            <p className="mb-2 font-script text-5xl text-moonlight sm:text-6xl">let&apos;s talk</p>
            <h1 className="mb-6 font-display text-4xl leading-[1.08] sm:text-6xl">
              Have an app or business worth an honest look?
            </h1>
            <p className="mx-auto mb-8 max-w-md font-sans text-base leading-relaxed text-creme/70">
              Brand deals, honest reviews, and collaborations — here&apos;s where we start.
            </p>
            <span className="inline-flex items-center gap-2 rounded-full border border-moonlight/40 bg-moonlight/10 px-4 py-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-moonlight">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-moonlight opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-moonlight" />
              </span>
              Booking new collabs
            </span>
          </Reveal>
        </section>

        {/* ═══ Rate card ═══ */}
        <RateCard />

        {/* ═══ Book & reach me ═══ */}
        <Booking />

        {/* ═══ Close — "no hard sell" with a prismatic burst ═══ */}
        <PrismaticClose />
      </ContactAurora>

      {/* Bottom gradual blur, pinned across the page. */}
      <GradualBlur position="bottom" target="page" height="5.5rem" strength={3.2} />
    </main>
  );
}
