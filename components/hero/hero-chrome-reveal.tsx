"use client";

import { motion, useReducedMotion } from "motion/react";
import { useIntro } from "./intro-store";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Fades the hero's supporting chrome (side text, pill, seal, sparks, ticks) in
 * together, on the `heroIn` beat — so it arrives with the photo, after the neon
 * lights, rather than being visible during the loader → morph → neon phases.
 * Fills the hero area (absolute inset-0); children keep their own positioning.
 */
export function HeroChromeReveal({ children }: { children: React.ReactNode }) {
  const heroIn = useIntro((s) => s.heroIn);
  const animate = useIntro((s) => s.animate);
  const reduce = useReducedMotion();
  const entrance = animate && !reduce;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-5"
      initial={entrance ? { opacity: 0, y: 16 } : false}
      animate={
        heroIn || !entrance ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
      }
      transition={entrance ? { duration: 1.3, ease: EASE, delay: 0.15 } : { duration: 0 }}
    >
      {children}
    </motion.div>
  );
}
