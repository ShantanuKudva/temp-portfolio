"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import AuroraBase from "@/components/Aurora";

// JS-interop component — flexible props (its .jsx infers strict types from defaults).
const Aurora = AuroraBase as unknown as React.ComponentType<Record<string, unknown>>;

/**
 * Connect's signature backdrop: a gold/terracotta Aurora spanning the whole
 * page beneath the espresso base. Sticky + viewport-sized; opacity is
 * scroll-linked so it eases in (hiding the WebGL first-frame flash) and never
 * pops. Reduced-motion pins it to a gentle static glow.
 */
export function ContactAurora({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mounted = useInView(ref, { margin: "40% 0px 40% 0px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Ease in from transparent, hold, soften toward the end.
  const opacity = useTransform(scrollYProgress, [0, 0.12, 0.85, 1], [0, 0.55, 0.55, 0.2]);

  return (
    <div ref={ref} className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="sticky top-0 h-screen w-full"
          style={{ opacity: reduce ? 0.4 : opacity }}
        >
          {mounted && (
            <Aurora
              colorStops={["#f3e6cf", "#d9a05b", "#a8674a"]}
              blend={0.4}
              amplitude={0.9}
              speed={0.35}
            />
          )}
        </motion.div>
      </div>
      {/* Soft floor so content keeps contrast over the aurora. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 60% at 50% 30%, transparent 20%, rgba(20,13,9,0.65) 100%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
