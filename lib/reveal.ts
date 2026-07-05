import { clamp01 } from '@/lib/track';

/** How far a block has entered the reveal band as it scrolls up (0..1).
 *  Fully lit by the time its top reaches ~32% of the viewport height. */
export function revealFraction(rectTop: number, vh: number): number {
  return clamp01((vh * 0.82 - rectTop) / (vh * 0.5));
}

/** Per-word opacity, brightening left→right with the block's scroll fraction. */
export function wordOpacity(frac: number, i: number, n: number): number {
  return 0.15 + 0.85 * clamp01(frac * n - i);
}
