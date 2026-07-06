import { describe, it, expect } from 'vitest';
import { clamp01, smoothstep, parallaxY } from '@/lib/editorial';

describe('clamp01', () => {
  it('clamps to [0,1]', () => {
    expect(clamp01(-0.3)).toBe(0);
    expect(clamp01(0.4)).toBe(0.4);
    expect(clamp01(2)).toBe(1);
  });
});

describe('smoothstep', () => {
  it('is 0 at/below the low edge and 1 at/above the high edge', () => {
    expect(smoothstep(0, 1, -1)).toBe(0);
    expect(smoothstep(0, 1, 0)).toBe(0);
    expect(smoothstep(0, 1, 1)).toBe(1);
    expect(smoothstep(0, 1, 2)).toBe(1);
  });
  it('is 0.5 at the midpoint and monotonic', () => {
    expect(smoothstep(0, 1, 0.5)).toBeCloseTo(0.5, 5);
    expect(smoothstep(0, 1, 0.25)).toBeLessThan(smoothstep(0, 1, 0.75));
  });
});

describe('parallaxY', () => {
  it('is ~0 when the element is centred, and flips sign across centre', () => {
    expect(parallaxY(500, 1000, 0.1)).toBeCloseTo(0, 5); // top == vh/2
    expect(parallaxY(0, 1000, 0.1)).toBeGreaterThan(0);  // above centre → positive
    expect(parallaxY(1000, 1000, 0.1)).toBeLessThan(0);  // below centre → negative
  });
});
