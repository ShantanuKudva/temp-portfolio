import { describe, it, expect } from 'vitest';
import { PHONE_POS, PHONE_ROT, PHONE_HERO_POS } from '@/lib/phone';
import { sampleTuple3 } from '@/lib/track';
import { BEAT } from '@/lib/timeline';

describe('phone tables', () => {
  it('rests on the desk at establish', () => {
    const pos = sampleTuple3(PHONE_POS, BEAT.establishStart);
    // desk top is at ~y=0.2; the phone rests just above it, far below the
    // lifted hero (y=0.95) — assert it's clearly in the "on desk" band.
    expect(pos[1]).toBeLessThan(0.4);
  });
  it('reaches hero position by burst and it matches PHONE_HERO_POS', () => {
    const pos = sampleTuple3(PHONE_POS, BEAT.burstStart);
    expect(pos).toEqual(PHONE_HERO_POS);
  });
  it('rotates to landscape (~ -PI/2 z) by push', () => {
    const rot = sampleTuple3(PHONE_ROT, BEAT.pushStart);
    expect(rot[2]).toBeCloseTo(-Math.PI / 2, 2);
  });
});
