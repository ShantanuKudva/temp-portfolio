"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import PrismaticBurstBase from "@/components/PrismaticBurst";
import { Reveal } from "@/components/motion/reveal";

// JS-interop component — flexible props (its .jsx infers strict types from defaults).
const PrismaticBurst = PrismaticBurstBase as unknown as React.ComponentType<
  Record<string, unknown>
>;

/**
 * "No hard sell" close — a prismatic burst blooms behind the line as the section
 * scrolls into view. The canvas is screen-blended (its black backdrop drops out)
 * and radial-masked so the burst dissolves into the indigo with no hard edge; its
 * opacity is scroll-linked so it eases in and out seamlessly. Paused while
 * off-screen. Colours track the page theme (indigo · moonlight · crème · gold).
 */
export function PrismaticClose() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [0, 0.85, 0.85, 0]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden px-6 py-28 text-center sm:py-40"
    >
      {/* Prismatic burst — scroll-eased + edge-masked so it melds into the indigo. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: reduce ? 0.4 : opacity,
          WebkitMaskImage:
            "radial-gradient(60% 65% at 50% 50%, #000 25%, transparent 78%)",
          maskImage:
            "radial-gradient(60% 65% at 50% 50%, #000 25%, transparent 78%)",
        }}
      >
        <PrismaticBurst
          animationType="rotate3d"
          intensity={1.5}
          speed={0.4}
          distort={1.1}
          paused={!inView}
          rayCount={20}
          mixBlendMode="screen"
          colors={["#3a3f6b", "#aeb2e6", "#f3e6cf", "#d9a05b"]}
        />
      </motion.div>

      <Reveal className="relative z-10 mx-auto max-w-xl">
        <p className="font-display text-2xl leading-snug text-creme/90 sm:text-3xl">
          No hard sell, no fluff — just an{" "}
          <span className="font-script text-moonlight">honest</span> conversation.
        </p>
      </Reveal>
    </section>
  );
}
