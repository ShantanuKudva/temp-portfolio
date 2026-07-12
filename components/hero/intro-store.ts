import { create } from "zustand";

/**
 * Intro phases, fired in order on a fresh top-of-page load:
 *   reveal()    → loader gone; the name (shared layoutId) morphs to its hero
 *                 size/position on the silk, neon still OFF.
 *   light()     → the neon sign flickers on.
 *   bringHero() → the photo + chrome + nav come in.
 *
 * `animate` is false on the skip path (deep-linked below the hero / reduced
 * motion): `skip()` sets every phase at once so the hero just appears settled.
 */
type IntroState = {
  revealed: boolean;
  lit: boolean;
  heroIn: boolean;
  animate: boolean;
  reveal: () => void;
  light: () => void;
  bringHero: () => void;
  skip: () => void;
};

export const useIntro = create<IntroState>((set) => ({
  revealed: false,
  lit: false,
  heroIn: false,
  animate: true,
  reveal: () => set({ revealed: true, animate: true }),
  light: () => set({ lit: true }),
  bringHero: () => set({ heroIn: true }),
  skip: () => set({ revealed: true, lit: true, heroIn: true, animate: false }),
}));
