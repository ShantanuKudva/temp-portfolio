'use client';
import { useEffect, useRef } from 'react';
import { useScrollStore } from '@/lib/store';
import { BEAT } from '@/lib/timeline';
import { scramble, mulberry32 } from '@/lib/scramble';
import { clamp01 } from '@/lib/track';

const TEXT = 'Sixty seconds. Zero fluff.';

// The landing's final hook line. Unlike the earlier morphing lines, this one is
// p-driven: it decodes IN as the constellation returns, holds, then RE-SCRAMBLES
// and fades OUT as the phone rotates and the camera pushes through — so it
// "scrambles and disappears" into the portal instead of hard-cutting. Imperative
// per-char mutation via a store subscription (no per-frame React re-render).
export default function HookOutro({ className }: { className?: string }) {
  const wrap = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>('[data-c]'));
    const render = (p: number) => {
      const reveal = clamp01((p - BEAT.returnStart) / 0.02);                               // decode in
      const exit = clamp01((p - BEAT.rotateStart) / (BEAT.pushStart - BEAT.rotateStart));  // decode out
      const t = clamp01(reveal * (1 - exit));
      el.style.opacity = t.toFixed(3);
      const cs = scramble('', TEXT, t, mulberry32(Math.floor(t * 997) + TEXT.length));
      for (let i = 0; i < spans.length; i++) {
        const c = cs[i];
        if (!c) continue;
        spans[i].textContent = c.ch;
        spans[i].style.opacity = c.settled ? '1' : '0.5';
      }
    };
    render(useScrollStore.getState().p);
    return useScrollStore.subscribe((s) => render(s.p));
  }, []);

  return (
    <span ref={wrap} className={className} aria-label={TEXT} style={{ opacity: 0 }}>
      {TEXT.split('').map((ch, i) => (
        <span key={i} data-c style={{ opacity: 0.5 }}>{ch}</span>
      ))}
    </span>
  );
}
