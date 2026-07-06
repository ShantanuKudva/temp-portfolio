"use client";
import { useEffect, useRef, useState } from "react";
import { useScrollStore } from "@/lib/store";

// Bottom-centre scroll cue. Shows on the establish frame, hides while the user is
// actively scrolling, and — the ask — reappears with a "Keep scrolling" nudge if
// they stall for a few seconds partway through (never once the sequence is nearly
// done). Sits under the preloader (z-40 < z-100).
const IDLE_MS = 3200;

export default function ScrollIndicator() {
  const [{ p, idle }, set] = useState({ p: 0, idle: true });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Drive off store changes (not the reactive selector) so state only updates in
  // the subscription/timer callbacks — never synchronously inside the effect body.
  useEffect(() => {
    const unsub = useScrollStore.subscribe((s, prev) => {
      if (s.p === prev.p) return;
      set({ p: s.p, idle: false }); // moving → hide
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(
        () => set((st) => ({ ...st, idle: true })), // stalled → nudge
        IDLE_MS,
      );
    });
    return () => {
      unsub();
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const atStart = p < 0.02;
  // Landing caps at p≈0.8; hide the cue before then so "Keep scrolling" never
  // lingers over the portfolio (which begins once p is maxed).
  const midSequence = p >= 0.02 && p < 0.68;
  const show = atStart || (idle && midSequence);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-[5vh] z-40 flex flex-col items-center gap-2 transition-opacity duration-500"
      style={{ opacity: show ? 1 : 0 }}
      aria-hidden="true"
    >
      <span className="scroll-cue__label">
        {atStart ? "Scroll" : "Keep scrolling"}
      </span>
      <span className="scroll-cue__mouse">
        <span className="scroll-cue__wheel" />
      </span>
    </div>
  );
}
