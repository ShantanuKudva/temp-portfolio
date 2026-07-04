'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';

const HERO_SCROLL_VH = 800; // hero pinned for 8 viewport-heights of scroll (tune)

export default function ScrollProvider({ children }: { children: ReactNode }) {
  const pinRef = useRef<HTMLDivElement>(null);
  const setP = useScrollStore((s) => s.setP);
  const setLocked = useScrollStore((s) => s.setLocked);
  const setHud = useScrollStore((s) => s.setHud);
  const hud = useScrollStore((s) => s.hud);
  const p = useScrollStore((s) => Math.round(s.p * 1000) / 1000);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setHud(params.get('hud') === '1');
    const forced = params.get('p');
    if (forced !== null) {
      const v = Math.min(1, Math.max(0, parseFloat(forced)));
      useScrollStore.getState().setP(v);   // set before lock
      setLocked(true);
      return;                              // debug: no scroll rig
    }

    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const st = ScrollTrigger.create({
      trigger: pinRef.current!,
      start: 'top top',
      end: `+=${HERO_SCROLL_VH}%`,
      pin: true,
      scrub: true,
      onUpdate: (self) => setP(self.progress),
    });

    return () => { st.kill(); gsap.ticker.remove(ticker); lenis.destroy(); };
  }, [setP, setLocked, setHud]);

  return (
    <>
      <div ref={pinRef}>{children}</div>
      {hud && (
        <Badge className="fixed left-3 top-3 z-50 font-mono" variant="secondary">
          p = {p.toFixed(3)}
        </Badge>
      )}
    </>
  );
}
