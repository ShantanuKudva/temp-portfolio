export type Easing =
  | 'linear' | 'inQuad' | 'outQuad' | 'inOutQuad'
  | 'inCubic' | 'outCubic' | 'inOutCubic' | 'outBack';

export type Tuple3 = [number, number, number];

export const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);

export const remap = (x: number, inA: number, inB: number, outA: number, outB: number): number => {
  if (inA === inB) return outA;
  const t = clamp01((x - inA) / (inB - inA));
  return outA + (outB - outA) * t;
};

const EASINGS: Record<Easing, (t: number) => number> = {
  linear: (t) => t,
  inQuad: (t) => t * t,
  outQuad: (t) => 1 - (1 - t) * (1 - t),
  inOutQuad: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  inCubic: (t) => t * t * t,
  outCubic: (t) => 1 - Math.pow(1 - t, 3),
  inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  outBack: (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
};

export const ease = (name: Easing, t: number): number => EASINGS[name](clamp01(t));

export interface Keyframe<T> { at: number; value: T; ease?: Easing }

function segment(len: number, at: (i: number) => number, p: number): { i: number; t: number } | null {
  // returns index of the ending keyframe and eased-input local t, or null if clamped
  if (p <= at(0)) return null;
  if (p >= at(len - 1)) return { i: len - 1, t: 1 };
  for (let i = 1; i < len; i++) if (p <= at(i)) return { i, t: remap(p, at(i - 1), at(i), 0, 1) };
  return { i: len - 1, t: 1 };
}

export function sampleNumber(track: Keyframe<number>[], p: number): number {
  if (track.length === 0) throw new Error('sampleNumber: empty track');
  const seg = segment(track.length, (i) => track[i].at, p);
  if (seg === null) return track[0].value;
  const b = track[seg.i], a = track[seg.i - 1] ?? b;
  const t = ease(b.ease ?? 'linear', seg.t);
  return a.value + (b.value - a.value) * t;
}

export function sampleTuple3(track: Keyframe<Tuple3>[], p: number): Tuple3 {
  if (track.length === 0) throw new Error('sampleTuple3: empty track');
  const seg = segment(track.length, (i) => track[i].at, p);
  if (seg === null) return [...track[0].value];
  const b = track[seg.i], a = track[seg.i - 1] ?? b;
  const t = ease(b.ease ?? 'linear', seg.t);
  return [
    a.value[0] + (b.value[0] - a.value[0]) * t,
    a.value[1] + (b.value[1] - a.value[1]) * t,
    a.value[2] + (b.value[2] - a.value[2]) * t,
  ];
}
