"use client";

import { cn } from "@/lib/utils";
import { useIntro } from "./intro-store";
import styles from "./hero.module.css";

/**
 * The neon's spill onto the silk wall: a big soft warm glow behind the name
 * that flickers in on the `lit` beat (in sync with the sign) and settles to a
 * faint steady wash — so the neon reads as actually lighting the room.
 */
export function NeonWash() {
  const lit = useIntro((s) => s.lit);
  const animate = useIntro((s) => s.animate);

  if (!lit) return null;

  return (
    <div
      aria-hidden
      className={cn(
        styles.neonWash,
        animate ? styles.neonWashOn : styles.neonWashSteady,
      )}
    />
  );
}
