"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";

/**
 * A cursor-tracked spotlight wrapper (idea lifted from React Bits' SpotlightCard,
 * re-skinned to our tokens). The card's own look comes from `className`; this only
 * adds a radial glow that follows the pointer and fades in on hover. Position is
 * written to CSS vars imperatively via a ref — no per-move React state, so it stays
 * React-Compiler-safe.
 */
export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(217, 160, 91, 0.15)",
}: {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`group/spot relative overflow-hidden ${className}`}
      style={{ "--spotlight-color": spotlightColor } as CSSProperties}
    >
      {/* Cursor-tracked glow — sits above the card bg, below the content. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          background:
            "radial-gradient(circle at var(--spot-x, 50%) var(--spot-y, 50%), var(--spotlight-color), transparent 70%)",
        }}
      />
      {children}
    </div>
  );
}
