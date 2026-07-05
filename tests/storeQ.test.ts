import { describe, it, expect, beforeEach } from 'vitest';
import { useScrollStore, getQ } from '@/lib/store';

describe('pitch progress q', () => {
  beforeEach(() => useScrollStore.setState({ q: 0, locked: false }));

  it('setQ updates q and getQ reads it non-reactively', () => {
    useScrollStore.getState().setQ(0.42);
    expect(getQ()).toBeCloseTo(0.42);
  });

  it('setQ is a no-op while locked (harness freeze)', () => {
    useScrollStore.getState().setQ(0.3);
    useScrollStore.setState({ locked: true });
    useScrollStore.getState().setQ(0.9);
    expect(getQ()).toBeCloseTo(0.3);
  });
});
