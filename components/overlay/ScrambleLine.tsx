'use client';
import { useEffect, useRef, useState } from 'react';
import { scramble, mulberry32, type ScrambleChar } from '@/lib/scramble';

const DECODE_MS = 700;

export default function ScrambleLine({ text, className }: { text: string; className?: string }) {
  const [chars, setChars] = useState<ScrambleChar[]>(() => scramble('', text, 1, mulberry32(1)));
  const fromRef = useRef(text);
  const raf = useRef(0);
  const startRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    const to = text;
    const rand = mulberry32(to.length + 7);
    const startAt = performance.now();
    startRef.current = startAt;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startAt) / DECODE_MS);
      setChars(scramble(from, to, t, mulberry32(Math.floor(t * 1000) + to.length))); // reseed per frame, deterministic-ish
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else fromRef.current = to;
      void rand;
    };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [text]);

  return (
    <span className={className} aria-label={text}>
      {chars.map((c, i) => (
        <span key={i} style={{ opacity: c.settled ? 1 : 0.5 }}>{c.ch}</span>
      ))}
    </span>
  );
}
