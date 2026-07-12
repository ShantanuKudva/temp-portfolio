"use client";

import { motion, useReducedMotion } from "motion/react";
import { useCurtain } from "@/components/transition/curtain-store";
import { cn } from "@/lib/utils";

/**
 * A slowly-rotating wax-seal CTA — circular "work with me" text around a ↗ core,
 * routed through the curtain transition to /contact. Echoes the hero seal so the
 * Work page feels part of the same world.
 */
export function CtaStamp({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const start = useCurtain((s) => s.start);

  return (
    <button
      type="button"
      onClick={() => start("/contact")}
      aria-label="Work with me"
      className={cn(
        "group relative grid place-items-center rounded-full outline-none transition-transform duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#eebb79]/60",
        className,
      )}
    >
      <motion.svg
        viewBox="0 0 132 132"
        className="h-full w-full"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 26, ease: "linear", repeat: Infinity }}
      >
        <defs>
          <path
            id="work-seal-ring"
            d="M66,66 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0"
          />
        </defs>
        <circle cx="66" cy="66" r="63" fill="none" stroke="rgba(238,187,121,0.45)" strokeWidth="1" />
        <circle cx="66" cy="66" r="50" fill="none" stroke="rgba(238,187,121,0.28)" strokeWidth="1" strokeDasharray="2 4" />
        <text
          fill="#eebb79"
          style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "9.5px",
            letterSpacing: "3px",
            textTransform: "uppercase",
          }}
        >
          <textPath href="#work-seal-ring" startOffset="0">
            · Work with me · Honest reviews&nbsp;
          </textPath>
        </text>
      </motion.svg>
      <span className="pointer-events-none absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#eebb79]/40 bg-[#1a0509]/50 text-lg text-[#eebb79] backdrop-blur-sm transition-colors group-hover:border-[#eebb79] group-hover:text-creme">
        ↗
      </span>
    </button>
  );
}
