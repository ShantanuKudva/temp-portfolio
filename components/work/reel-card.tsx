"use client";

import { useRef } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import type { Reel } from "@/lib/work";
import { cn } from "@/lib/utils";

/**
 * One 9:16 reel card: poster still with a muted hover-preview that starts
 * imperatively on pointer-enter (React-Compiler-safe — no setState in effects).
 * The whole card is a button that opens the lightbox via `onOpen`. In the grid,
 * `index` prints a faint number watermark and `dimmed` recedes it while a
 * sibling is focused (About's bento behaviour).
 */
export function ReelCard({
  reel,
  onOpen,
  index,
  dimmed = false,
  onHover,
  className,
  priority,
}: {
  reel: Reel;
  onOpen: (reel: Reel) => void;
  index?: number;
  dimmed?: boolean;
  onHover?: (v: boolean) => void;
  className?: string;
  priority?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const preview = (play: boolean) => {
    const v = videoRef.current;
    if (!v) return;
    if (play) {
      v.currentTime = 0;
      void v.play().catch(() => {});
    } else {
      v.pause();
    }
  };

  return (
    <button
      type="button"
      onClick={() => onOpen(reel)}
      onPointerEnter={() => {
        preview(true);
        onHover?.(true);
      }}
      onPointerLeave={() => {
        preview(false);
        onHover?.(false);
      }}
      aria-label={`Play: ${reel.title} — ${reel.subject}`}
      className={cn(
        "group/reel relative aspect-9/16 w-full overflow-hidden rounded-3xl border border-creme/12 bg-[#380710] text-left shadow-[0_24px_60px_-26px_rgba(0,0,0,0.85)] outline-none transition-[transform,border-color,opacity,filter] duration-500 ease-out hover:-translate-y-1 hover:border-amber-dot/45 focus-visible:ring-2 focus-visible:ring-amber-dot/60",
        dimmed ? "opacity-45 blur-[2px]" : "opacity-100 blur-0",
        className,
      )}
    >
      {/* top sheen hairline */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-px bg-gradient-to-r from-transparent via-creme/25 to-transparent"
      />

      <Image
        src={reel.poster}
        alt={`${reel.subject} — reel poster`}
        fill
        priority={priority}
        sizes="(max-width: 768px) 90vw, 360px"
        className="object-cover transition-opacity duration-500 group-hover/reel:opacity-0"
      />
      {/* No video yet on this reel — the poster stands alone. */}
      {reel.src && (
        <video
          ref={videoRef}
          src={reel.src}
          poster={reel.poster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover/reel:opacity-100"
        />
      )}

      {/* legibility scrim */}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1a0509]/90 via-transparent to-[#1a0509]/20" />

      {/* faint index watermark (echoes About) */}
      {index != null && (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-2 top-1 select-none font-display leading-[0.8] text-creme/[0.08]"
          style={{ fontSize: "6rem" }}
        >
          {String(index).padStart(2, "0")}
        </span>
      )}

      {/* kind tag */}
      <span className="pointer-events-none absolute left-4 top-4 rounded-full border border-amber-dot/40 bg-[#1a0509]/40 px-2.5 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-taupe backdrop-blur-sm">
        {reel.kind === "app" ? "App" : "Business"}
      </span>

      {/* play glyph on hover */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover/reel:opacity-100">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-creme/50 bg-[#1a0509]/40 backdrop-blur-sm">
          <Play className="ml-0.5 size-5 text-creme" aria-hidden />
        </span>
      </span>

      {/* title */}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
        <span className="block font-display text-lg leading-snug text-creme drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
          {reel.title}
        </span>
        <span className="mt-1.5 block font-sans text-[11px] uppercase tracking-[0.18em] text-[#eebb79]/90">
          {reel.subject}
        </span>
      </span>
    </button>
  );
}
