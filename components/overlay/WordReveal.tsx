'use client';
import { useEffect, useRef } from 'react';
import { revealFraction, wordOpacity } from '@/lib/reveal';

export default function WordReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(/\s+/);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>('[data-w]'));
    if (reduce) { spans.forEach((s) => (s.style.opacity = '1')); return; }

    let raf = 0;
    const update = () => {
      const frac = revealFraction(el.getBoundingClientRect().top, window.innerHeight);
      for (let i = 0; i < spans.length; i++) spans[i].style.opacity = wordOpacity(frac, i, spans.length).toFixed(3);
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [text]);

  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} data-w style={{ opacity: 0.15 }}>{w}{i < words.length - 1 ? ' ' : ''}</span>
      ))}
    </p>
  );
}
