"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCurtain } from "./curtain-store";
import { lenisRef } from "@/lib/lenis";

// Jump to an in-page anchor, Lenis-aware so smooth-scroll stays in sync. Called
// while the curtain covers the screen, so the jump is instant/hidden.
//
// Cross-page targets need to *wait*: after router.push the new route's sections
// haven't mounted yet, and Lenis still knows the old page's height. So we poll a
// few frames for the element to appear, then re-assert the scroll (with a
// resize) over the next frames to correct for late layout shifts — web fonts,
// WebGL canvases, the Cal.com iframe growing, etc.
function scrollToHash(hash: string, attempts = 40) {
  const el = document.querySelector(hash) as HTMLElement | null;

  if (!el) {
    if (attempts > 0) {
      requestAnimationFrame(() => scrollToHash(hash, attempts - 1));
    }
    return;
  }

  const lenis = lenisRef.current;
  if (!lenis) {
    el.scrollIntoView();
    return;
  }

  const jump = () => {
    lenis.resize();
    const target = document.querySelector(hash) as HTMLElement | null;
    if (target) lenis.scrollTo(target, { offset: -90, immediate: true });
  };
  jump();
  requestAnimationFrame(jump);
  requestAnimationFrame(() => requestAnimationFrame(jump));
}

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
        const hashIndex = pending.indexOf("#");
        const path = hashIndex >= 0 ? pending.slice(0, hashIndex) : pending;
        const hash = hashIndex >= 0 ? pending.slice(hashIndex) : "";
        const samePage = !path || path === window.location.pathname;

        if (path && !samePage) {
          if (hash) {
            // Navigate without Next's auto-scroll, then jump to the anchor once
            // the new route has rendered (scrollToHash polls until it mounts).
            router.push(pending, { scroll: false });
            scrollToHash(hash);
          } else {
            router.push(pending);
          }
        } else if (hash) {
          scrollToHash(hash);
        } else {
          const lenis = lenisRef.current;
          if (lenis) lenis.scrollTo(0, { immediate: true });
          else window.scrollTo(0, 0);
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
