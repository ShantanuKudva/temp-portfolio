'use client';
import { useEffect, useRef } from 'react';
import { useScrollStore } from '@/lib/store';
import { clamp01 } from '@/lib/track';

// Guarantees a FULLY black frame at the end of the push-through. The 3D framing
// leaves a sliver of spotlit desk at the viewport edges even once the phone screen
// is black, so we fade a flat black curtain over the scene as the landing finishes
// (p 0.85→0.9). It sits above the canvas but below the portfolio (z-[5] < z-10),
// so the phone covers the entire screen first — then the portfolio crossfades in
// over guaranteed black rather than over a half-lit desk.
const CURTAIN_IN = 0.85; // p at which the curtain starts closing
const CURTAIN_FULL = 0.9; // p at which it's fully black (== landing P_MAX)

export default function LandingCurtain() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const render = (p: number) => {
      el.style.opacity = clamp01((p - CURTAIN_IN) / (CURTAIN_FULL - CURTAIN_IN)).toFixed(3);
    };
    render(useScrollStore.getState().p);
    return useScrollStore.subscribe((s) => render(s.p));
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5] bg-black"
      style={{ opacity: 0 }}
    />
  );
}
