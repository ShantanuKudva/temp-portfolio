"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCurtain } from "./curtain-store";

// A firm, symmetric ease for the wipe (fast middle, settled ends).
const EASE = [0.76, 0, 0.24, 1] as const;

// A wide ellipse with a rounded leading edge, flowing continuously DOWNWARD
// from the navbar. Cover: the curved bottom edge sweeps down to full cover.
// Reveal: the whole shape keeps travelling down and off the bottom (never
// reverses), its curved top edge revealing the page top→bottom.
const HIDDEN = "ellipse(140% 0% at 50% 0%)";
const FULL = "ellipse(140% 140% at 50% 0%)";
const GONE = "ellipse(140% 140% at 50% 260%)";

/**
 * Velvet page-transition curtain. A rounded wipe flows down from the top (the
 * navbar's edge) to cover, runs the navigation while covered, then keeps
 * flowing down off the bottom. Mounted globally; triggered via
 * `useCurtain().start(href)`.
 */
export function Curtain() {
  const phase = useCurtain((s) => s.phase);
  const pending = useCurtain((s) => s.pending);
  const covered = useCurtain((s) => s.covered);
  const done = useCurtain((s) => s.done);
  const router = useRouter();
  const reduce = useReducedMotion();

  if (phase === "idle") return null;

  const target = phase === "cover" ? FULL : GONE;

  const handleComplete = () => {
    if (phase === "cover") {
      // Fully covered → perform the navigation, then wipe away.
      if (pending) {
        if (pending.startsWith("#")) {
          document
            .querySelector(pending)
            ?.scrollIntoView({ behavior: "auto", block: "start" });
        } else {
          router.push(pending);
        }
      }
      covered();
    } else {
      done();
    }
  };

  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 z-300 flex items-center justify-center"
      style={{
        background:
          "linear-gradient(180deg, #2a0710 0%, #3d0b16 45%, #2a0710 100%)",
        clipPath: HIDDEN,
      }}
      initial={{ clipPath: HIDDEN }}
      animate={{ clipPath: target }}
      transition={reduce ? { duration: 0 } : { duration: 0.55, ease: EASE }}
      onAnimationComplete={handleComplete}
    >
      <span
        className="font-script text-6xl text-creme/90"
        style={{ textShadow: "0 0 22px rgba(247,240,227,0.25)" }}
      >
        Varsheni
      </span>
    </motion.div>
  );
}
