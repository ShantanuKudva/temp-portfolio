'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';

// Scroll-reveal wrapper for the post-scroll PORTFOLIO page (not the phone
// beats). Unlike BeatShell — which fades only, because the phone→portfolio
// seam is a crossfade — this is a normal simple page, so its sections rise as
// they enter (fade + translate-y). Same IntersectionObserver pattern as
// BeatShell (setState in the IO callback fires asynchronously, so it's
// React-Compiler-safe). `delay` staggers siblings.
export default function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setInView(true); }),
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-[800ms] ease-out ${inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${className}`}
    >
      {children}
    </div>
  );
}
