'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { parallaxY } from '@/lib/editorial';

// Scroll-linked vertical drift for editorial depth: the wrapped element moves a
// little slower/faster than the page as it crosses the viewport, so it reads as
// a separate plane from the text beside it. Same math as SectionHead's ghost
// numeral. Imperative (rAF + style mutation) so it's React-Compiler-safe, and it
// no-ops under prefers-reduced-motion. Nest INSIDE a Reveal (Reveal owns opacity
// + its own transform on the outer element; this owns transform on the inner).
export default function Parallax({
  children,
  strength = 0.1,
  className = '',
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = parallaxY(el.getBoundingClientRect().top, window.innerHeight, strength);
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
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
  }, [strength]);

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
}
