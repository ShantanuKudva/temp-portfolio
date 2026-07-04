import { mulberry32 } from '@/lib/rng';
export { mulberry32 };

export interface ScrambleChar { ch: string; settled: boolean }

const GLYPHS = '!<>-_\\/[]{}—=+*^?#§$%';

/** Deterministic per-char decode from `from` to `to` at progress t∈[0,1]. Inject rand for determinism. */
export function scramble(from: string, to: string, t: number, rand: () => number): ScrambleChar[] {
  const tt = t <= 0 ? 0 : t >= 1 ? 1 : t;
  const len = Math.max(from.length, to.length);
  const out: ScrambleChar[] = [];
  for (let i = 0; i < len; i++) {
    const toCh = to[i] ?? '';
    const fromCh = from[i] ?? '';
    const start = (i / Math.max(len, 1)) * 0.6;   // stagger
    const end = start + 0.4;
    const local = (tt - start) / (end - start);
    if (local >= 1 || toCh === '') out.push({ ch: toCh, settled: true });
    else if (local <= 0) out.push({ ch: fromCh, settled: true });
    else out.push({ ch: rand() < 0.28 ? toCh : GLYPHS[Math.floor(rand() * GLYPHS.length)], settled: false });
  }
  return out;
}

export const scrambleText = (chars: ScrambleChar[]): string => chars.map((c) => c.ch).join('');
