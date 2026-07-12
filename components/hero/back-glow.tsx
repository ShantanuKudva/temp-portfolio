"use client";

import { motion, useReducedMotion } from "motion/react";
import { useIntro } from "./intro-store";
import styles from "./hero.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The crème halo behind the subject. Gated on `heroIn` so it fades in with the
 * photo — otherwise it lingers as a "glow around her face" on the bare silk
 * before she arrives.
 */
export function BackGlow() {
  const heroIn = useIntro((s) => s.heroIn);
  const animate = useIntro((s) => s.animate);
  const reduce = useReducedMotion();
  const entrance = animate && !reduce;

  return (
    <motion.div
      aria-hidden
      className={styles.backglow}
      initial={entrance ? { opacity: 0 } : false}
      animate={{ opacity: heroIn || !entrance ? 1 : 0 }}
      transition={entrance ? { duration: 1.2, ease: EASE } : { duration: 0 }}
    />
  );
}
