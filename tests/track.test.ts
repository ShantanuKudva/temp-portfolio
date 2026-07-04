import { describe, it, expect } from 'vitest';
import { clamp01, remap, ease, sampleNumber, sampleTuple3, type Keyframe, type Tuple3 } from '@/lib/track';

describe('clamp01/remap', () => {
  it('clamps', () => { expect(clamp01(-1)).toBe(0); expect(clamp01(2)).toBe(1); expect(clamp01(0.5)).toBe(0.5); });
  it('remaps and clamps to output range', () => {
    expect(remap(5, 0, 10, 0, 100)).toBe(50);
    expect(remap(-5, 0, 10, 0, 100)).toBe(0);
    expect(remap(50, 0, 10, 0, 100)).toBe(100);
  });
  it('remap with zero-width input returns outA', () => { expect(remap(3, 2, 2, 7, 9)).toBe(7); });
});

describe('ease', () => {
  it('endpoints are 0 and 1', () => {
    for (const n of ['linear','inQuad','outCubic','inOutCubic','outBack'] as const) {
      expect(ease(n, 0)).toBeCloseTo(0); expect(ease(n, 1)).toBeCloseTo(1);
    }
  });
});

describe('sampleNumber', () => {
  const t: Keyframe<number>[] = [{ at: 0, value: 0 }, { at: 0.5, value: 10, ease: 'linear' }, { at: 1, value: 20, ease: 'linear' }];
  it('clamps before/after', () => { expect(sampleNumber(t, -1)).toBe(0); expect(sampleNumber(t, 2)).toBe(20); });
  it('interpolates linearly mid-segment', () => { expect(sampleNumber(t, 0.25)).toBeCloseTo(5); expect(sampleNumber(t, 0.75)).toBeCloseTo(15); });
  it('hits exact keyframes', () => { expect(sampleNumber(t, 0.5)).toBe(10); });
});

describe('sampleTuple3', () => {
  const t: Keyframe<Tuple3>[] = [{ at: 0, value: [0,0,0] }, { at: 1, value: [10,20,30], ease: 'linear' }];
  it('interpolates each axis', () => { expect(sampleTuple3(t, 0.5)).toEqual([5,10,15]); });
  it('returns a copy, not the stored array', () => { const r = sampleTuple3(t, 0); expect(r).toEqual([0,0,0]); r[0] = 99; expect(t[0].value[0]).toBe(0); });
});
