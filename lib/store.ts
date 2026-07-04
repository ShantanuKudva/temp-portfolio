import { create } from 'zustand';

interface ScrollState {
  p: number;
  locked: boolean;
  hud: boolean;
  setP: (p: number) => void;
  setLocked: (b: boolean) => void;
  setHud: (b: boolean) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  p: 0,
  locked: false,
  hud: false,
  setP: (p) => set((s) => (s.locked ? s : { p })),
  setLocked: (locked) => set({ locked }),
  setHud: (hud) => set({ hud }),
}));

/** Non-reactive read for useFrame loops — does NOT subscribe/re-render. */
export const getP = (): number => useScrollStore.getState().p;

/** Index of the last boundary <= p, or -1 before the first. Pure. */
export function activeIndex(p: number, boundaries: number[]): number {
  let idx = -1;
  for (let i = 0; i < boundaries.length; i++) if (p >= boundaries[i]) idx = i;
  return idx;
}
