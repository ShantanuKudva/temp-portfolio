"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";
import AuroraBase from "@/components/Aurora";

// JS-interop component — flexible props (its .jsx infers strict types from defaults).
const Aurora = AuroraBase as unknown as React.ComponentType<Record<string, unknown>>;

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Stacked aurora layers — each a full-screen shader with its own colour ramp,
 * amplitude and speed (one flipped to hang from the bottom) so they drift out of
 * phase and read as depth rather than one flat sheet. Gold lives here (and only
 * here); the cooler layers carry indigo + moonlight.
 */
type Layer = {
  colorStops: string[];
  amplitude: number;
  speed: number;
  blend: number;
  opacity: number;
  mix?: CSSProperties["mixBlendMode"];
  flip?: boolean;
};

const LAYERS: Layer[] = [
  // Base sheet — indigo → gold → crème, slow and wide.
  { colorStops: ["#3a3f6b", "#d9a05b", "#f3e6cf"], amplitude: 0.8, speed: 0.3, blend: 0.4, opacity: 1 },
  // Warm mid-glow — gold forward, faster, screened for luminosity.
  { colorStops: ["#d9a05b", "#aeb2e6", "#f3e6cf"], amplitude: 1.25, speed: 0.52, blend: 0.6, opacity: 0.55, mix: "screen" },
];

/**
 * Connect's signature backdrop. Two independent layers:
 *  - the aurora GLOW is viewport-pinned (sticky) so it follows the scroll as a
 *    top-of-screen light; it fades in over ~1.2s on mount (hiding the WebGL
 *    first frame).
 *  - the moonlight GRID + floor span the FULL page height (uniform tiling, faded
 *    only at the extreme top/bottom edges) so the texture continues all the way
 *    down — no mid-page seam.
 */
export function ContactAurora({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <div className="relative overflow-hidden">
      {/* Full-page moonlight grid — continues the whole way down. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(174,178,230,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(174,178,230,0.045) 1px, transparent 1px)",
          backgroundSize: "13px 13px",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, #000 2%, #000 97%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, #000 2%, #000 97%, transparent 100%)",
        }}
      />

      {/* Viewport-pinned aurora glow. */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="sticky top-0 h-screen w-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: reduce ? 0.42 : 0.72 }}
          transition={{ duration: 1.2, ease: EASE }}
          style={{
            // Fade the glow out toward the bottom of the viewport so it dissolves
            // into the indigo — no hard bottom edge / seam.
            WebkitMaskImage:
              "linear-gradient(to bottom, #000 0%, #000 32%, transparent 78%)",
            maskImage:
              "linear-gradient(to bottom, #000 0%, #000 32%, transparent 78%)",
          }}
        >
          {LAYERS.map((l, i) => (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                opacity: l.opacity,
                mixBlendMode: l.mix,
                transform: l.flip ? "scaleY(-1)" : undefined,
              }}
            >
              <Aurora
                colorStops={l.colorStops}
                blend={l.blend}
                amplitude={l.amplitude}
                speed={l.speed}
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Full-page soft floor so content keeps contrast over the field. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(140% 45% at 50% 0%, transparent 40%, rgba(11,12,26,0.45) 100%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
