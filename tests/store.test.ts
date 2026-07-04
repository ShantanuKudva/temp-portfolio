import { describe, it, expect } from 'vitest';
import { activeIndex } from '@/lib/store';

describe('activeIndex', () => {
  const b = [0.1, 0.4, 0.58, 0.64]; // line-change boundaries
  it('is -1 before the first boundary', () => { expect(activeIndex(0.05, b)).toBe(-1); });
  it('selects the last boundary <= p', () => {
    expect(activeIndex(0.1, b)).toBe(0);
    expect(activeIndex(0.5, b)).toBe(1);
    expect(activeIndex(0.6, b)).toBe(2);
    expect(activeIndex(0.99, b)).toBe(3);
  });
});
