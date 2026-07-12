import { create } from "zustand";

/**
 * Page-transition curtain state.
 *   start(href) → phase "cover" (curtain wipes down over the screen)
 *   covered()   → phase "reveal" (navigation happens here, then it wipes away)
 *   done()      → phase "idle"
 */
type Phase = "idle" | "cover" | "reveal";

type CurtainState = {
  phase: Phase;
  pending: string | null;
  start: (href: string) => void;
  covered: () => void;
  done: () => void;
};

export const useCurtain = create<CurtainState>((set, get) => ({
  phase: "idle",
  pending: null,
  start: (href) => {
    if (get().phase !== "idle") return;
    set({ phase: "cover", pending: href });
  },
  covered: () => set({ phase: "reveal" }),
  done: () => set({ phase: "idle", pending: null }),
}));
