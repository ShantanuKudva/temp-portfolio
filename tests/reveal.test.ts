import { describe, it, expect } from 'vitest';
import { revealFraction, wordOpacity } from '@/lib/reveal';

describe('revealFraction', () => {
  const vh = 1000;
  it('is 0 when the block sits below the reveal band', () => {
    expect(revealFraction(vh * 0.9, vh)).toBe(0);
  });
  it('is 1 when the block has risen past the band', () => {
    expect(revealFraction(vh * 0.2, vh)).toBe(1);
  });
  it('is monotonic as the block rises', () => {
    expect(revealFraction(vh * 0.6, vh)).toBeGreaterThan(revealFraction(vh * 0.75, vh));
  });
});

describe('wordOpacity', () => {
  it('is dim (0.15) for every word at frac 0', () => {
    expect(wordOpacity(0, 0, 10)).toBeCloseTo(0.15);
    expect(wordOpacity(0, 9, 10)).toBeCloseTo(0.15);
  });
  it('lights early words before late words', () => {
    expect(wordOpacity(0.5, 0, 10)).toBeGreaterThan(wordOpacity(0.5, 9, 10));
  });
  it('fully lights all words at frac 1', () => {
    expect(wordOpacity(1, 9, 10)).toBeCloseTo(1);
  });
});
