'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { parallaxY } from '@/lib/editorial';

// Shared magazine header: a mono index (N° 02), an oversized display title, and
// an optional mono kicker, all sitting on a full-width gold hairline. An optional
// oversized italic-serif "ghost" numeral bleeds off the right and drifts on a
// small scroll parallax. Numbering encodes real reading order (a contents page).
export default function SectionHead({
  index, title, kicker, ghost, className = '',
}: {
  index: string;
  title: ReactNode;
  kicker?: string;
  ghost?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current, g = ghostRef.current;
    if (!el || !g) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = parallaxY(el.getBoundingClientRect().top, window.innerHeight, 0.12);
      g.style.transform = `translateY(${y.toFixed(1)}px)`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {ghost && (
        <span
          ref={ghostRef}
          aria-hidden
          className="pointer-events-none absolute -top-[0.34em] right-0 select-none font-serif italic leading-none text-[#B08D4C]/[0.07] text-[clamp(120px,22vw,300px)]"
        >
          {ghost}
        </span>
      )}
      <div className="relative flex items-end justify-between gap-6 border-b border-[#B08D4C]/25 pb-5">
        <div>
          <span className="font-mono text-[12px] uppercase tracking-[0.3em] text-[#B08D4C]">{index}</span>
          <h2 className="mt-3 text-balance font-extrabold leading-[0.98] tracking-[-0.02em] text-white text-[clamp(34px,5.4vw,64px)]">
            {title}
          </h2>
        </div>
        {kicker && (
          <span className="hidden shrink-0 pb-2 text-right font-mono text-[12px] uppercase tracking-[0.24em] text-[#EADFCF]/45 sm:block">
            {kicker}
          </span>
        )}
      </div>
    </div>
  );
}
