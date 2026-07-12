"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useIntro } from "./intro-store";
import styles from "./hero.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * The loader curtain: a dark-wine aurora screen with a subtle progress bar,
 * sitting BEHIND the name (lower z) so the name reads over it. On 100% it calls
 * `reveal()` and fades out to expose the silk — the name then places/zooms/lights
 * on its own. Only plays on a fresh top-of-page load; otherwise `skip()`.
 */
export function LoaderCurtain() {
  const reveal = useIntro((s) => s.reveal);
  const skip = useIntro((s) => s.skip);
  const revealed = useIntro((s) => s.revealed);
  const [gone, setGone] = useState(false);
  const reduce = useReducedMotion();
  const decided = useRef(false);
  const started = useRef(false);

  const target = useMotionValue(0);
  const scaleX = useTransform(target, [0, 100], [0, 1]);
  const pct = useTransform(target, (v) =>
    Math.round(Math.min(100, Math.max(0, v))),
  );

  useIsoLayoutEffect(() => {
    if (decided.current) return;
    decided.current = true;
    if (window.scrollY > 40 || reduce) {
      skip();
      setGone(true);
    }
  }, [reduce, skip]);

  useEffect(() => {
    if (gone || revealed) return;
    const controls = animate(target, 100, { duration: 1.5, ease: EASE });
    const unsub = target.on("change", (v) => {
      if (v >= 99.5 && !started.current) {
        started.current = true;
        reveal();
      }
    });
    return () => {
      controls.stop();
      unsub();
    };
  }, [gone, revealed, target, reveal]);

  if (gone) return null;

  return (
    <motion.div
      aria-hidden
      className={styles.curtain}
      initial={{ opacity: 1 }}
      animate={{ opacity: revealed ? 0 : 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      onAnimationComplete={() => {
        if (revealed) setGone(true);
      }}
    >
      <div className={styles.aurora} />
      <div className={styles.curtainProgress}>
        <div className={styles.track}>
          <motion.div className={styles.bar} style={{ scaleX }} />
        </div>
        <div className={styles.pctRow}>
          <motion.span>{pct}</motion.span>
          <span>%</span>
        </div>
      </div>
    </motion.div>
  );
}
