"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import AuroraBase from "@/components/Aurora";

// JS-interop component — flexible props (its .jsx infers strict types from defaults).
const Aurora = AuroraBase as unknown as React.ComponentType<
  Record<string, unknown>
>;

/**
 * Shared Aurora backdrop spanning the Who-I-am + What-I-bring sections. The
 * aurora is a sticky, viewport-sized layer so it glows behind whichever part is
 * in view, and its opacity is scroll-linked: it mounts early (while still fully
 * transparent, so the WebGL first-frame flash is hidden), eases in as the region
 * enters, and gradually fades back out as you scroll past — no flashbang.
 */
export function AuroraRegion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  // Mount early/keep-mounted with a generous margin so init + teardown happen
  // while opacity is ~0.
  const mounted = useInView(ref, { margin: "40% 0px 40% 0px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // 0 at the edges, full through the middle — gradual both ways.
  const opacity = useTransform(scrollYProgress, [0, 0.16, 0.84, 1], [0, 0.7, 0.7, 0]);

  return (
    <div ref={ref} className="relative overflow-hidden">
      {/* Sticky, viewport-sized aurora (chocolate/mocha/taupe). */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div className="sticky top-0 h-screen w-full" style={{ opacity }}>
          {mounted && (
            <Aurora
              colorStops={["#c98a3f", "#6b4e42", "#b79e8c"]}
              blend={0.5}
              amplitude={1.1}
              speed={0.4}
            />
          )}
        </motion.div>
      </div>
      {/* Soft floor so content/cards keep contrast over the aurora. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 55% at 50% 40%, transparent 25%, rgba(26,18,13,0.6) 100%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
