import { describe, it, expect } from 'vitest';
import { PBEAT, PITCH_SCALE, PITCH_OP, activeReel } from '@/lib/pitch';
import { sampleNumber } from '@/lib/track';

describe('pitch phone tables', () => {
  it('is small on context beats and hero-sized on reel beats', () => {
    expect(sampleNumber(PITCH_SCALE, PBEAT.meetHer)).toBeLessThan(0.6);
    expect(sampleNumber(PITCH_SCALE, PBEAT.pillars)).toBeLessThan(0.6);
    expect(sampleNumber(PITCH_SCALE, PBEAT.reel1)).toBeGreaterThan(0.85);
    expect(sampleNumber(PITCH_SCALE, PBEAT.reel2)).toBeGreaterThan(0.85);
  });

  it('phone is fully opaque on reel + ask beats, dim on context beats', () => {
    expect(sampleNumber(PITCH_OP, PBEAT.reel1)).toBeCloseTo(1, 1);
    expect(sampleNumber(PITCH_OP, PBEAT.meetHer)).toBeLessThan(0.6);
  });
});

describe('activeReel', () => {
  it('selects a reel at each reel beat', () => {
    expect(activeReel(PBEAT.reel1)).toBe(0);
    expect(activeReel(PBEAT.reel2)).toBe(1);
    expect(activeReel(PBEAT.theAsk)).toBe(2);
  });
  it('shows the home screen (-1) between reel beats', () => {
    expect(activeReel(PBEAT.pillars)).toBe(-1);
    expect(activeReel(PBEAT.portalOut)).toBe(-1);
  });
});
