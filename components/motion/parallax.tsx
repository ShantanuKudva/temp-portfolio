"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * Subtle scroll parallax: as the wrapper passes through the viewport, its child
 * drifts vertically. `speed` is the drift in px at each end (positive = the
 * element rises a touch as you scroll down). The outer element stays
 * untransformed so useScroll's measurement doesn't feed back on itself.
 * Reduced-motion collapses it to no drift.
 */
export function Parallax({
  children,
  speed = 40,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}
