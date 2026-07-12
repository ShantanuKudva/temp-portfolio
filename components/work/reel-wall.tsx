"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  wrap,
} from "motion/react";
import type { Reel } from "@/lib/work";
import { WALL_ROWS } from "@/lib/work";
import { ReelCard } from "./reel-card";

const SPEED = 26; // px/sec idle drift

/**
 * One auto-drifting row. Cards are duplicated so the wrap looks seamless; an
 * `x` MotionValue advances each frame and wraps within the first copy's width.
 * Hovering pauses the drift; dragging nudges it (Motion eases the throw back
 * into the idle drift). Reduced-motion collapses to a static scrollable strip.
 */
function MarqueeRow({
  reels,
  direction,
  onOpen,
}: {
  reels: Reel[];
  direction: 1 | -1;
  onOpen: (reel: Reel) => void;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const hovering = useRef(false);
  const dragging = useRef(false);

  useAnimationFrame((_, delta) => {
    if (reduce || hovering.current || dragging.current) return;
    const track = trackRef.current;
    if (!track) return;
    const half = track.scrollWidth / 2 || 1;
    const move = (direction * SPEED * delta) / 1000;
    const next = wrap(-half, 0, x.get() + move);
    x.set(next);
  });

  const cards = [...reels, ...reels];

  if (reduce) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {reels.map((reel) => (
          <div key={reel.id} className="w-48 shrink-0 sm:w-60">
            <ReelCard reel={reel} onOpen={onOpen} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden"
      onPointerEnter={() => {
        hovering.current = true;
      }}
      onPointerLeave={() => {
        hovering.current = false;
      }}
    >
      <motion.div
        ref={trackRef}
        className="flex w-max cursor-grab gap-4 active:cursor-grabbing"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -100000, right: 100000 }}
        dragElastic={0.12}
        onDragStart={() => {
          dragging.current = true;
        }}
        onDragEnd={() => {
          dragging.current = false;
        }}
      >
        {cards.map((reel, i) => (
          <div
            key={`${reel.id}-${i}`}
            className="w-48 shrink-0 sm:w-60"
          >
            <ReelCard reel={reel} onOpen={onOpen} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/**
 * The drifting reel wall — two rows travelling in opposite directions.
 */
export function ReelWall({ onOpen }: { onOpen: (reel: Reel) => void }) {
  const [rowA, rowB] = WALL_ROWS;
  return (
    <div className="flex flex-col gap-4">
      <MarqueeRow reels={rowA} direction={-1} onOpen={onOpen} />
      <MarqueeRow reels={rowB} direction={1} onOpen={onOpen} />
    </div>
  );
}
