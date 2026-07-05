import type { Keyframe } from '@/lib/track';

// Beat boundaries in pitch progress space (q ∈ [0,1]). Tune HERE.
export const PBEAT = {
  portalOut:  0.00,
  meetHer:    0.11,
  problem:    0.24,
  reel1:      0.37,
  pillars:    0.50,
  reel2:      0.63,
  whatYouGet: 0.75,
  theAsk:     0.86,
  end:        1.00,
} as const;

const E = 'inOutCubic' as const;

// Framing constants for the 3D pitch phone/orbit. PITCH_SCALE/PITCH_X below are
// authored 0..1 (from the CSS mock); these map them into world space so the
// phone reads as a hero on reel beats and stays framed. Tune live.
export const PITCH_HERO = 2.3;    // world-scale multiplier applied to PITCH_SCALE
export const PITCH_XSPREAD = 0.9; // world x-offset per unit of PITCH_X (0 = centred)

// Phone x-offset as a FRACTION of viewport width (0 = centred). The phone holds
// its lane on the right and only scales; no vertical swing, no rotation.
export const PITCH_X: Keyframe<number>[] = [
  { at: PBEAT.portalOut,  value: 0.00 },
  { at: PBEAT.meetHer,    value: 0.32, ease: E },
  { at: PBEAT.problem,    value: 0.32, ease: E },
  { at: PBEAT.reel1,      value: 0.28, ease: E },
  { at: PBEAT.pillars,    value: 0.32, ease: E },
  { at: PBEAT.reel2,      value: 0.28, ease: E },
  { at: PBEAT.whatYouGet, value: 0.32, ease: E },
  { at: PBEAT.theAsk,     value: 0.29, ease: E },
];

export const PITCH_SCALE: Keyframe<number>[] = [
  { at: PBEAT.portalOut,  value: 0.60 },
  { at: PBEAT.meetHer,    value: 0.42, ease: E },
  { at: PBEAT.problem,    value: 0.44, ease: E },
  { at: PBEAT.reel1,      value: 0.92, ease: E },
  { at: PBEAT.pillars,    value: 0.44, ease: E },
  { at: PBEAT.reel2,      value: 0.92, ease: E },
  { at: PBEAT.whatYouGet, value: 0.46, ease: E },
  { at: PBEAT.theAsk,     value: 0.82, ease: E },
];

export const PITCH_OP: Keyframe<number>[] = [
  { at: PBEAT.portalOut,  value: 1.00 },
  { at: PBEAT.meetHer,    value: 0.45, ease: E },
  { at: PBEAT.problem,    value: 0.45, ease: E },
  { at: PBEAT.reel1,      value: 1.00, ease: E },
  { at: PBEAT.pillars,    value: 0.50, ease: E },
  { at: PBEAT.reel2,      value: 1.00, ease: E },
  { at: PBEAT.whatYouGet, value: 0.55, ease: E },
  { at: PBEAT.theAsk,     value: 1.00, ease: E },
];

export const PITCH_ORB: Keyframe<number>[] = [
  { at: PBEAT.portalOut,  value: 0.85 },
  { at: PBEAT.meetHer,    value: 0.30, ease: E },
  { at: PBEAT.problem,    value: 0.35, ease: E },
  { at: PBEAT.reel1,      value: 0.80, ease: E },
  { at: PBEAT.pillars,    value: 0.40, ease: E },
  { at: PBEAT.reel2,      value: 0.80, ease: E },
  { at: PBEAT.whatYouGet, value: 0.40, ease: E },
  { at: PBEAT.theAsk,     value: 0.75, ease: E },
];

const REEL_BEATS: { at: number; i: number }[] = [
  { at: PBEAT.reel1, i: 0 },
  { at: PBEAT.reel2, i: 1 },
  { at: PBEAT.theAsk, i: 2 },
];
const REEL_WINDOW = 0.06; // how close to a reel beat before its reel plays

/** Reel index (0..2) when q is within REEL_WINDOW of a reel beat, else -1 (home). */
export function activeReel(q: number): number {
  let best = -1;
  let bestD = REEL_WINDOW;
  for (const r of REEL_BEATS) {
    const d = Math.abs(q - r.at);
    if (d < bestD) { bestD = d; best = r.i; }
  }
  return best;
}
