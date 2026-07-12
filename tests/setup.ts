import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// jsdom has no IntersectionObserver; Framer Motion's `whileInView` (used by
// <Reveal>) needs it. Minimal no-op stub so motion components mount/render.
class IntersectionObserverStub {
  root = null;
  rootMargin = "";
  thresholds: number[] = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
if (typeof globalThis.IntersectionObserver === "undefined") {
  globalThis.IntersectionObserver =
    IntersectionObserverStub as unknown as typeof IntersectionObserver;
}

// jsdom also has no ResizeObserver; CardNav / Hero measure with it.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver =
    ResizeObserverStub as unknown as typeof ResizeObserver;
}

// jsdom does not implement media playback; the reel lightbox calls play/pause
// and reads/writes volume. Minimal stubs so those components mount and run.
if (typeof HTMLMediaElement !== "undefined") {
  const proto = HTMLMediaElement.prototype as unknown as Record<string, unknown>;
  if (!proto.__mediaStubbed) {
    proto.play = () => Promise.resolve();
    proto.pause = () => {};
    let vol = 1;
    let muted = false;
    Object.defineProperty(HTMLMediaElement.prototype, "volume", {
      configurable: true,
      get() {
        return vol;
      },
      set(v: number) {
        vol = v;
      },
    });
    Object.defineProperty(HTMLMediaElement.prototype, "muted", {
      configurable: true,
      get() {
        return muted;
      },
      set(v: boolean) {
        muted = v;
      },
    });
    proto.__mediaStubbed = true;
  }
}

afterEach(() => {
  cleanup();
});
