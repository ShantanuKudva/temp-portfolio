import { describe, it, expect } from 'vitest';
import { scramble, scrambleText, mulberry32 } from '@/lib/scramble';

describe('scramble', () => {
  it('t=0 yields the from-text', () => {
    expect(scrambleText(scramble('hello', 'world!!', 0, mulberry32(1)))).toBe('hello');
  });
  it('t=1 yields the to-text with all settled', () => {
    const chars = scramble('hello', 'world!!', 1, mulberry32(1));
    expect(scrambleText(chars)).toBe('world!!');
    expect(chars.every((c) => c.settled)).toBe(true);
  });
  it('is deterministic for a fixed seed', () => {
    expect(scrambleText(scramble('a', 'bcd', 0.5, mulberry32(9))))
      .toBe(scrambleText(scramble('a', 'bcd', 0.5, mulberry32(9))));
  });
});
