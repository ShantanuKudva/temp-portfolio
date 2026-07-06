'use client';
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';

// The landing plays over a tall invisible SCROLL TRACK while the 3D canvas (in
// page.tsx) stays fixed to the viewport. We deliberately do NOT pin: GSAP pinning
// wraps the target in a transformed spacer, and a transformed ancestor makes the
// fixed canvas scroll away on release (the scene "slid up into black"). The canvas
// is already `position: fixed`, so it needs no pin — the track just reserves the
// scroll distance and we scrub its progress into `p`.
//
// The push-through climaxes at revealStart (0.88), where the black phone screen
// fills the frame; only 0.88→1.0 (reveal/bridge) rendered nothing but dead black.
// So we cap `p` just past the climax and size the track to match — the phone still
// pushes all the way in to a full-black frame, then the portfolio fades over it,
// but we drop the ~100vh of empty black scroll that used to follow.
const P_MAX = 0.9;
const LANDING_VH = Math.round(800 * P_MAX); // scroll distance for the landing

export default function ScrollProvider() {
  const trackRef = useRef<HTMLDivElement>(null);
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
      trigger: trackRef.current!,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => setP(self.progress * P_MAX),
    });

    return () => { st.kill(); gsap.ticker.remove(ticker); lenis.destroy(); };
  }, [setP, setLocked, setHud]);

  return (
    <>
      <div ref={trackRef} aria-hidden style={{ height: `${LANDING_VH}vh` }} />
      {hud && (
        <Badge className="fixed left-3 top-3 z-50 font-mono" variant="secondary">
          p = {p.toFixed(3)}
        </Badge>
      )}
    </>
  );
}
