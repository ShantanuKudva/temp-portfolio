import { describe, it, expect } from 'vitest';
import { CAM_POS, CAM_LOOK } from '@/lib/camera';
import { sampleTuple3 } from '@/lib/track';
import { BEAT } from '@/lib/timeline';

describe('camera tables', () => {
  it('starts as an off-axis 3/4 shot at medium distance, framing the phone on the desk', () => {
    const pos = sampleTuple3(CAM_POS, BEAT.establishStart);
    expect(pos[0]).toBeGreaterThan(1.2); // off to the side (3/4)
    expect(pos[2]).toBeGreaterThan(2.0); // in front at a medium distance (was a far wide-room shot)
    const look = sampleTuple3(CAM_LOOK, BEAT.establishStart);
    expect(look[2]).toBeLessThan(1.0); // aimed at the desk rest (z~0.55), not the lifted hero
  });

  it('pushes in close by the end but STOPS in front of the phone (no through-clip)', () => {
    const pos = sampleTuple3(CAM_POS, BEAT.end);
    // ends much closer than the establishing pull-back…
    expect(pos[2]).toBeLessThan(1.6);
    // …but stays in front of the phone (front face ~z=1.25) so it never clips through it
    expect(pos[2]).toBeGreaterThan(1.25);
  });

  it('keeps looking at the screen at the end (not past it)', () => {
    const look = sampleTuple3(CAM_LOOK, BEAT.end);
    expect(look[2]).toBeGreaterThan(1.0); // still aimed at the phone/screen, not through to −z
  });
});
