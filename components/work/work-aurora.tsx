"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import ColorBendsBase from "@/components/ColorBends";

// JS-interop component — flexible props (its .jsx infers strict types from defaults).
const ColorBends = ColorBendsBase as unknown as React.ComponentType<
  Record<string, unknown>
>;

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Work's signature backdrop — the wine analogue of ContactAurora. A full-page
 * crème grid continues the whole way down (faded only at the extreme edges);
 * a viewport-pinned ColorBends glow (blurred into a soft velvet light, the nav
 * Work-card's signature) hangs at the top of screen and follows the scroll.
 */
export function WorkAurora({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // Mount ColorBends early (opacity ~0) so its WebGL first frame never flashes.
  const mounted = useInView(ref, { margin: "30% 0px 30% 0px" });

  return (
    <div ref={ref} className="relative overflow-hidden">
      {/* Full-page crème grid — continues all the way down. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(247,240,227,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(247,240,227,0.04) 1px, transparent 1px)",
          backgroundSize: "13px 13px",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, #000 2%, #000 97%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, #000 2%, #000 97%, transparent 100%)",
        }}
      />

      {/* Viewport-pinned ColorBends — the nav Work-card's exact animated
          background (same colours + props), so the page carries the same
          signature. Follows the scroll as a full-viewport field. */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="sticky top-0 h-screen w-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: reduce ? 0.6 : 0.85 }}
          transition={{ duration: 1.2, ease: EASE }}
          style={{
            // Soft-fade the bottom of the viewport field so it dissolves into
            // the wine rather than hard-cutting mid-page.
            WebkitMaskImage:
              "linear-gradient(to bottom, #000 0%, #000 64%, transparent 97%)",
            maskImage:
              "linear-gradient(to bottom, #000 0%, #000 64%, transparent 97%)",
          }}
        >
          {mounted && (
            <ColorBends
              // Duller, muted wine (less vivid crimson) — same signature, calmer.
              colors={["#6b2029", "#43141b", "#280a10"]}
              rotation={120}
              speed={0.16}
              scale={1.1}
              intensity={1.15}
              bandWidth={6}
              noise={0.1}
              parallax={0.4}
              mouseInfluence={0.6}
              transparent
            />
          )}
        </motion.div>
      </div>

      {/* Inner sheen for depth (as on the nav card). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 60% at 50% 0%, rgba(247,240,227,0.06), transparent 60%)",
        }}
      />

      {/* Full-page soft floor so content keeps contrast over the field. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(140% 50% at 50% 0%, transparent 35%, rgba(26,5,9,0.5) 100%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
