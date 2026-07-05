'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';

export default function BeatShell({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setInView(true); }),
      { threshold: 0.55 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section ref={ref} className={`relative flex min-h-screen items-center px-[7vw] ${className}`}>
      <div className={`max-w-[1000px] transition-all duration-700 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'}`}>
        {children}
      </div>
    </section>
  );
}
