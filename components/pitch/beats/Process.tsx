'use client';
import { useEffect, useRef } from 'react';
import SectionHead from '../SectionHead';
import { PROCESS_STEPS } from '@/lib/pitchContent';

// N° 04 — the four moves from brief to feed, as a scroll-driven vertical stepper:
// a gold line fills to the scroll "playhead" (viewport centre) and each step
// brightens the moment the playhead reaches its node (dimmed until then), so the
// sequence literally lights up as you scroll through it. Imperative (rAF + style
// mutation) so it's React-Compiler-safe; reduced-motion shows everything active.
export default function Process() {
  const lineRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const liRefs = useRef<(HTMLLIElement | null)[]>([]);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const setActive = (i: number, on: boolean) => {
      const li = liRefs.current[i], node = nodeRefs.current[i];
      if (li) li.style.opacity = on ? '1' : '0.38';
      if (node) {
        node.style.background = on ? '#B08D4C' : '#160C0E';
        node.style.color = on ? '#2A1A1C' : '#B08D4C';
        node.style.borderColor = on ? '#B08D4C' : 'rgba(176,141,76,0.4)';
      }
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (fillRef.current) fillRef.current.style.height = '100%';
      PROCESS_STEPS.forEach((_, i) => setActive(i, true));
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const line = lineRef.current, fill = fillRef.current;
      if (!line || !fill) return;
      const lr = line.getBoundingClientRect();
      const playhead = window.innerHeight * 0.5;
      fill.style.height = `${Math.max(0, Math.min(lr.height, playhead - lr.top)).toFixed(1)}px`;
      nodeRefs.current.forEach((node, i) => {
        if (!node) return;
        setActive(i, node.getBoundingClientRect().top <= playhead + 6);
      });
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
    <section className="relative flex min-h-screen items-center px-[7vw] py-28">
      <div className="mx-auto w-full max-w-[1100px]">
        <SectionHead index="N° 04" title="Brief to feed, in four moves." kicker="How it works" ghost="04" />

        <ol className="relative mt-16 max-w-[720px]">
          {/* the track line + the scroll-filled portion */}
          <div ref={lineRef} className="absolute left-[19px] top-5 bottom-10 w-px bg-[#B08D4C]/15">
            <div ref={fillRef} className="w-full bg-[#B08D4C]" style={{ height: 0 }} />
          </div>

          {PROCESS_STEPS.map((s, i) => (
            <li
              key={s.n}
              ref={(el) => { liRefs.current[i] = el; }}
              className="relative grid grid-cols-[40px_1fr] gap-7 pb-14 transition-opacity duration-500 last:pb-0"
              style={{ opacity: 0.38 }}
            >
              <div
                ref={(el) => { nodeRefs.current[i] = el; }}
                className="z-10 flex size-10 items-center justify-center rounded-full border font-mono text-[13px] transition-colors duration-300"
                style={{ background: '#160C0E', color: '#B08D4C', borderColor: 'rgba(176,141,76,0.4)' }}
              >
                {s.n}
              </div>
              <div className="pt-1.5">
                <h3 className="text-[24px] font-bold text-white">{s.title}</h3>
                <p className="mt-2 max-w-[46ch] text-[16px] leading-relaxed text-[#EADFCF]/65">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
