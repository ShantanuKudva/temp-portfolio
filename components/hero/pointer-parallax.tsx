"use client";

import { useEffect } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Subtle pointer parallax. Writes the normalised cursor position to CSS vars
 * (--mx / --my, range -1..1) on the root; hero layers translate against them at
 * different depths. rAF-throttled, passive, and a no-op under reduced motion.
 */
export function PointerParallax() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    const apply = () => {
      raf = 0;
      const el = document.documentElement;
      el.style.setProperty("--mx", tx.toFixed(3));
      el.style.setProperty("--my", ty.toFixed(3));
    };
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return null;
}
