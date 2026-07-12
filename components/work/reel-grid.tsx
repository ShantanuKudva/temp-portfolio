"use client";

import { useState } from "react";
import type { Reel } from "@/lib/work";
import { REELS } from "@/lib/work";
import { ReelCard } from "./reel-card";
import { Reveal } from "@/components/motion/reveal";

/**
 * The curated reel set — a small 3-up grid of 9:16 cards. Hovering one recedes
 * the others (About's bento focus behaviour). Tapping opens the lightbox.
 */
export function ReelGrid({ onOpen }: { onOpen: (reel: Reel) => void }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const set = (i: number) => (v: boolean) =>
    setHovered((cur) => (v ? i : cur === i ? null : cur));

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3">
      {REELS.map((reel, i) => (
        <Reveal
          key={reel.id}
          delay={i * 0.08}
          className={i === 0 ? "col-span-2 md:col-span-1" : ""}
        >
          <ReelCard
            reel={reel}
            onOpen={onOpen}
            index={i + 1}
            priority={i === 0}
            dimmed={hovered !== null && hovered !== i}
            onHover={set(i)}
            className="mx-auto max-w-[340px]"
          />
        </Reveal>
      ))}
    </div>
  );
}
