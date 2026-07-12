"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import styles from "./hero.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Camera-style autofocus reticle over the subject's face (adapted from React
 * Bits' TrueFocus, which targets text). On hover the corner brackets "acquire"
 * — hunt in from oversize, then lock — with a faint crème glow + "In focus"
 * readout, like a lens finding focus on her face.
 */
export function FaceFocus() {
  const [on, setOn] = useState(false);

  return (
    <div
      className={styles.faceTarget}
      onPointerEnter={() => setOn(true)}
      onPointerLeave={() => setOn(false)}
      aria-hidden
    >
      <AnimatePresence>
        {on && (
          <motion.div
            className={styles.focusFrame}
            initial={{ opacity: 0, scale: 1.22 }}
            animate={{ opacity: 1, scale: [1.22, 0.97, 1] }}
            exit={{ opacity: 0, scale: 1.12 }}
            transition={{ duration: 0.42, ease: EASE, times: [0, 0.62, 1] }}
          >
            <span className={cn(styles.focusCorner, styles.fcTL)} />
            <span className={cn(styles.focusCorner, styles.fcTR)} />
            <span className={cn(styles.focusCorner, styles.fcBL)} />
            <span className={cn(styles.focusCorner, styles.fcBR)} />
            <span className={styles.focusLabel}>In focus</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
