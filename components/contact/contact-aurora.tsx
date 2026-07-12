"use client";

import { motion, useReducedMotion } from "motion/react";
import AuroraBase from "@/components/Aurora";

// JS-interop component — flexible props (its .jsx infers strict types from defaults).
const Aurora = AuroraBase as unknown as React.ComponentType<Record<string, unknown>>;

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Connect's signature backdrop: a gold/terracotta Aurora spanning the whole
 * page beneath the espresso base. Sticky + viewport-sized so it glows behind
 * whichever section is in view. It fades in over ~1.2s on mount — long enough to
 * hide the WebGL first-frame flash — then holds at a steady, visible glow.
 */
export function ContactAurora({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="sticky top-0 h-screen w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: reduce ? 0.42 : 0.6 }}
          transition={{ duration: 1.2, ease: EASE }}
        >
          <Aurora
            colorStops={["#3a3f6b", "#d9a05b", "#f3e6cf"]}
            blend={0.4}
            amplitude={0.9}
            speed={0.35}
          />
        </motion.div>
      </div>
      {/* Soft floor so content keeps contrast over the aurora. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 60% at 50% 30%, transparent 25%, rgba(11,12,26,0.6) 100%)",
        }}
      />
      {/* Subtle crème grid, edge-faded so it stays a quiet texture. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(174,178,230,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(174,178,230,0.045) 1px, transparent 1px)",
          backgroundSize: "13px 13px",
          WebkitMaskImage:
            "radial-gradient(120% 85% at 50% 25%, #000 35%, transparent 85%)",
          maskImage:
            "radial-gradient(120% 85% at 50% 25%, #000 35%, transparent 85%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
