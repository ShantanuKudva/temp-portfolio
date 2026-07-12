"use client";

import { useRef } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import type { Reel } from "@/lib/work";
import { cn } from "@/lib/utils";

/**
 * One 9:16 reel card: poster still with a muted hover-preview that starts
 * imperatively on pointer-enter (React-Compiler-safe — no setState in effects).
 * The whole card is a button that opens the lightbox via `onOpen`.
 */
export function ReelCard({
  reel,
  onOpen,
  className,
  priority,
}: {
  reel: Reel;
  onOpen: (reel: Reel) => void;
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
      onPointerEnter={() => preview(true)}
      onPointerLeave={() => preview(false)}
      aria-label={`Play: ${reel.title} — ${reel.subject}`}
      className={cn(
        "group/reel relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-creme/10 bg-[#380710] text-left shadow-[0_20px_50px_-24px_rgba(0,0,0,0.8)] outline-none transition-transform duration-500 ease-out focus-visible:ring-2 focus-visible:ring-amber-dot/60",
        className,
      )}
    >
      <Image
        src={reel.poster}
        alt={`${reel.subject} — reel poster`}
        fill
        priority={priority}
        sizes="(max-width: 640px) 60vw, 260px"
        className="object-cover transition-opacity duration-500 group-hover/reel:opacity-0"
      />
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

      {/* legibility scrim */}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1a0509]/85 via-transparent to-[#1a0509]/25" />

      {/* kind tag */}
      <span className="pointer-events-none absolute left-3 top-3 rounded-full border border-amber-dot/40 bg-[#1a0509]/40 px-2.5 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-taupe backdrop-blur-sm">
        {reel.kind === "app" ? "App" : "Business"}
      </span>

      {/* play glyph on hover */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover/reel:opacity-100">
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-creme/50 bg-[#1a0509]/40 backdrop-blur-sm">
          <Play className="ml-0.5 size-5 text-creme" aria-hidden />
        </span>
      </span>

      {/* title */}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
        <span className="block font-display text-base leading-snug text-creme drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
          {reel.title}
        </span>
        <span className="mt-1 block font-sans text-[11px] uppercase tracking-[0.18em] text-amber-dot/90">
          {reel.subject}
        </span>
      </span>
    </button>
  );
}
