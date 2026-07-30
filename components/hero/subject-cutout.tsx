"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { useIntro } from "./intro-store";
import { FaceFocus } from "./face-focus";
import styles from "./hero.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Editorial entrance: on reveal she fades + rises + eases down from a hair of
 * over-scale, arriving before the neon flickers on. On the skip path or under
 * reduced motion she's simply present, no entrance.
 */
export function SubjectCutout({ alt }: { alt: string }) {
  const heroIn = useIntro((s) => s.heroIn);
  const animate = useIntro((s) => s.animate);
  const reduce = useReducedMotion();
  const entrance = animate && !reduce;
  const [focused, setFocused] = useState(false);

  return (
    <motion.div
      className={styles.subject}
      initial={
        entrance
          ? { opacity: 0, y: 44, scale: 1.03, filter: "blur(18px)" }
          : false
      }
      animate={
        heroIn || !entrance
          ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
          : { opacity: 0, y: 44, scale: 1.03, filter: "blur(18px)" }
      }
      transition={entrance ? { duration: 1.2, ease: EASE } : { duration: 0 }}
    >
      {/* Base: the whole subject — blurs (shallow DoF) when her face is focused. */}
      <Image
        src="/varsheni-2-cutout.png"
        alt={alt}
        width={790}
        height={902}
        priority
        className={cn(styles.subjectImg, focused && styles.subjectImgBlur)}
      />
      {/* Sharp face patch, masked/feathered to her face — held above the blur. */}
      <Image
        src="/varsheni-2-cutout.png"
        alt=""
        aria-hidden
        width={790}
        height={902}
        className={cn(
          styles.subjectFocusPatch,
          focused && styles.subjectFocusPatchOn,
        )}
      />
      <FaceFocus onFocusChange={setFocused} />
    </motion.div>
  );
}
