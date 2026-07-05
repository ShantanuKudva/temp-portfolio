'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollStore } from '@/lib/store';

export default function PitchProvider({ children }: { children: ReactNode }) {
  const regionRef = useRef<HTMLDivElement>(null);
  const setQ = useScrollStore((s) => s.setQ);
  const setLocked = useScrollStore((s) => s.setLocked);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forced = params.get('q');
    if (forced !== null) {
      const v = Math.min(1, Math.max(0, parseFloat(forced)));
      useScrollStore.getState().setQ(v);
      setLocked(true);
      return; // harness freeze — no scroll rig (Lenis already runs in the landing ScrollProvider)
    }

    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: regionRef.current!,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => setQ(self.progress),
    });
    return () => { st.kill(); };
  }, [setQ, setLocked]);

  return <div ref={regionRef}>{children}</div>;
}
