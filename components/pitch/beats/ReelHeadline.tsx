'use client';
import { useEffect, useRef } from 'react';
import { scramble, mulberry32 } from '@/lib/scramble';
import { clamp01 } from '@/lib/track';

// Scroll-linked headline. Decodes IN as it rises into view, holds while centred,
// then RE-SCRAMBLES and fades OUT as it climbs past the top ("scramble and
// disappear"). Imperative per-char mutation (no setState) to satisfy the React
// Compiler and stay cheap on the scroll loop.
export default function ReelHeadline({ text, className }: { text: string; className?: string }) {
  const wrap = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>('[data-c]'));
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const enter = clamp01((vh - r.top) / (vh * 0.55));      // 0→1 as it rises into view
      const exit = clamp01((vh * 0.4 - r.top) / (vh * 0.3));  // 0→1 once its top climbs past ~40%
      const t = clamp01(enter * (1 - exit));                  // decode in, hold, then decode back out
      el.style.opacity = t.toFixed(3);
      const cs = scramble('', text, t, mulberry32(Math.floor(t * 997) + text.length));
      for (let i = 0; i < spans.length; i++) {
        const c = cs[i];
        if (!c) continue;
        spans[i].textContent = c.ch;
        spans[i].style.opacity = c.settled ? '1' : '0.5';
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    raf = requestAnimationFrame(update);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [text]);

  return (
    <span ref={wrap} className={className} aria-label={text} style={{ opacity: 0 }}>
      {text.split('').map((ch, i) => (
        <span key={i} data-c style={{ opacity: 0.5 }}>{ch}</span>
      ))}
    </span>
  );
}
