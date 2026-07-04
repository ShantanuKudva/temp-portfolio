import { describe, it, expect } from 'vitest';
import { CAM_POS, CAM_LOOK } from '@/lib/camera';
import { sampleTuple3 } from '@/lib/track';
import { BEAT } from '@/lib/timeline';

describe('camera tables', () => {
  it('starts as a high-angle close-up looking down at the phone on the desk', () => {
    const pos = sampleTuple3(CAM_POS, BEAT.establishStart);
    const look = sampleTuple3(CAM_LOOK, BEAT.establishStart);
    expect(pos[1]).toBeGreaterThan(look[1] + 0.4); // camera well above the target → looking down
    expect(look[1]).toBeLessThan(0.4);             // aimed at the desk surface (not the lifted hero)
    expect(pos[2]).toBeLessThan(2.0);              // a close-up, not a pulled-back wide shot
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
