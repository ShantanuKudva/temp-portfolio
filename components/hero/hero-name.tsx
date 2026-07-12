"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { useIntro } from "./intro-store";
import styles from "./hero.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;
// Loader state of the name: small, raised toward the loader's centre.
const LOADER_SCALE = 0.42;
const LOADER_Y = -90;

/**
 * The name is one element for the whole intro (it sits above the loader curtain,
 * below the subject). On reveal it runs two distinct beats — first PLACE
 * (translate to its hero spot at loader size), then ZOOM (scale up to full) —
 * then lights the neon, then signals the hero to come in. Skip/reduced-motion:
 * it's simply at rest, lit.
 */
export function HeroName({ children }: { children: React.ReactNode }) {
  const revealed = useIntro((s) => s.revealed);
  const lit = useIntro((s) => s.lit);
  const introAnimate = useIntro((s) => s.animate);
  const light = useIntro((s) => s.light);
  const bringHero = useIntro((s) => s.bringHero);
  const reduce = useReducedMotion();
  const entrance = introAnimate && !reduce;

  const y = useMotionValue(LOADER_Y);
  const scale = useMotionValue(LOADER_SCALE);

  // Skip path → snap straight to rest.
  useEffect(() => {
    if (entrance) return;
    y.set(0);
    scale.set(1);
  }, [entrance, y, scale]);

  // Intro path → place, then zoom (overlapped so it reads as one graceful
  // motion, not two stops), then neon, then hero.
  useEffect(() => {
    if (!revealed || !entrance) return;
    const cPlace = animate(y, 0, { duration: 1.2, ease: EASE });
    // Zoom starts while the placement is still settling, and eases out slowly.
    const cZoom = animate(scale, 1, {
      duration: 1.7,
      delay: 0.55,
      ease: [0.22, 1, 0.36, 1],
    });
    const tLight = setTimeout(() => light(), 2350);
    const tHero = setTimeout(() => bringHero(), 3550);
    return () => {
      cPlace.stop();
      cZoom.stop();
      clearTimeout(tLight);
      clearTimeout(tHero);
    };
  }, [revealed, entrance, y, scale, light, bringHero]);

  const litClass = !entrance
    ? styles.wordmarkLit
    : lit
      ? styles.wordmarkOn
      : undefined;

  return (
    <div className={styles.wordmarkAnchor} aria-hidden>
      <motion.div className={cn(styles.wordmark, litClass)} style={{ y, scale }}>
        {children}
      </motion.div>
    </div>
  );
}
