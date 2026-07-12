"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils";

/**
 * A re-skinned take on React Bits' ElasticSlider (Framer-Motion): a horizontal
 * track that stretches with a spring when you drag past either end, then eases
 * back. Controlled via `value`/`onChange` in `[min, max]`. Wine/crème tokens —
 * track crème/15, fill crème/70, thumb amber-dot. Used as the lightbox volume.
 */
export function ElasticSlider({
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  className,
  leftIcon,
  rightIcon,
  "aria-label": ariaLabel = "Volume",
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  "aria-label"?: string;
}) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  // Overshoot past the ends drives a spring-backed horizontal stretch of the
  // whole track — the elastic character. 0 while dragging within range.
  const overflow = useMotionValue(0);
  const scaleX = useSpring(useTransform(overflow, [0, 120], [1, 1.06]), {
    stiffness: 320,
    damping: 26,
  });
  const originX = useMotionValue(0.5);

  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const pct = ((value - min) / (max - min)) * 100;

  const setFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const raw = (clientX - rect.left) / rect.width;
    // Elastic feedback when pulled past an edge.
    if (raw < 0) {
      overflow.set(-raw * rect.width);
      originX.set(1);
    } else if (raw > 1) {
      overflow.set((raw - 1) * rect.width);
      originX.set(0);
    } else {
      overflow.set(0);
    }
    const next = clamp(min + raw * (max - min));
    // Quantise to step without Math.random/Date.now.
    const snapped = Math.round(next / step) * step;
    onChange(clamp(snapped));
  };

  const release = () => overflow.set(0);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (e.buttons !== 1) return;
    setFromClientX(e.clientX);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      onChange(clamp(value - step * 5));
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      onChange(clamp(value + step * 5));
    }
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {leftIcon != null && (
        <span className="text-creme/70" aria-hidden>
          {leftIcon}
        </span>
      )}
      <motion.div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={Number(value.toFixed(2))}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={release}
        onPointerLeave={release}
        onKeyDown={onKeyDown}
        className="relative h-6 flex-1 cursor-pointer touch-none select-none outline-none focus-visible:ring-2 focus-visible:ring-amber-dot/60 rounded-full"
        style={reduce ? undefined : { scaleX, originX }}
      >
        {/* rail */}
        <span className="pointer-events-none absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-creme/15" />
        {/* fill */}
        <span
          className="pointer-events-none absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-creme/70"
          style={{ width: `${pct}%` }}
        />
        {/* thumb */}
        <span
          className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-dot shadow-[0_0_10px_rgba(217,160,91,0.5)]"
          style={{ left: `${pct}%` }}
        />
      </motion.div>
      {rightIcon != null && (
        <span className="text-creme/70" aria-hidden>
          {rightIcon}
        </span>
      )}
    </div>
  );
}
