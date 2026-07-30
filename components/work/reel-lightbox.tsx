"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Play, Volume2, VolumeX, X } from "lucide-react";
import type { Reel } from "@/lib/work";

/**
 * Modal reel player. Centered 9:16 <video> over a dimmed, blurred backdrop.
 * Tap the video to play/pause; an Instagram-style mute/volume toggle sits at the
 * bottom-right. Focus-trapped, Esc/backdrop/✕ to close, body scroll locked while
 * open. Renders nothing when `reel` is null.
 */
export function ReelLightbox({
  reel,
  onClose,
}: {
  reel: Reel | null;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);

  const open = reel !== null;

  // Esc to close + scroll lock while open. Imperative focus, no setState here.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => dialogRef.current?.focus());
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      cancelAnimationFrame(raf);
    };
  }, [open, onClose]);

  // Autoplay when a reel is set.
  useEffect(() => {
    const v = videoRef.current;
    if (!open || !v) return;
    v.muted = muted;
    void v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reel?.id]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    const next = !muted;
    setMuted(next);
    if (v) v.muted = next;
  };

  return (
    <AnimatePresence>
      {open && reel && (
        <motion.div
          className="fixed inset-0 z-200 flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* backdrop */}
          <button
            type="button"
            aria-label="Dismiss player"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-[#0a0305]/80 backdrop-blur-md"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${reel.title} — ${reel.subject}`}
            tabIndex={-1}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex max-h-full w-full max-w-105 flex-col outline-none"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute -top-11 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-creme/25 text-creme/80 transition-colors hover:border-amber-dot/60 hover:text-[#eebb79] sm:-right-11 sm:top-0"
            >
              <X className="size-5" aria-hidden />
            </button>

            <div className="relative overflow-hidden rounded-2xl border border-creme/15 bg-[#1a0509] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]">
              {reel.src ? (
                <video
                  ref={videoRef}
                  src={reel.src}
                  poster={reel.poster}
                  playsInline
                  loop
                  onClick={togglePlay}
                  className="aspect-9/16 w-full cursor-pointer bg-black object-cover"
                />
              ) : (
                /* Reel has a poster but no video uploaded yet. */
                <div className="relative aspect-9/16 w-full bg-black">
                  <Image
                    src={reel.poster}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 90vw, 420px"
                    className="object-cover opacity-70"
                  />
                  <p className="absolute inset-x-0 bottom-8 text-center font-sans text-[13px] text-creme/75">
                    Video coming soon.
                  </p>
                </div>
              )}

              {/* Tap-to-play glyph when paused (Instagram-style). */}
              {!playing && (
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label="Play"
                  className="absolute inset-0 grid place-items-center"
                >
                  <span className="grid h-16 w-16 place-items-center rounded-full border border-creme/50 bg-[#1a0509]/40 backdrop-blur-sm">
                    <Play className="ml-1 size-7 text-creme" aria-hidden />
                  </span>
                </button>
              )}

              {/* Instagram-style mute/volume toggle, bottom-right of the video. */}
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? "Unmute" : "Mute"}
                className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-[#1a0509]/70 text-creme backdrop-blur-sm transition-colors hover:text-amber-dot"
              >
                {muted ? (
                  <VolumeX className="size-4" aria-hidden />
                ) : (
                  <Volume2 className="size-4" aria-hidden />
                )}
              </button>
            </div>

            {/* caption */}
            <div className="mt-4 px-1">
              <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#eebb79]/90">
                {reel.kind === "app" ? "App" : "Business"} · {reel.subject}
              </p>
              <h2 className="mt-1 font-display text-xl leading-snug text-creme">
                {reel.title}
              </h2>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
