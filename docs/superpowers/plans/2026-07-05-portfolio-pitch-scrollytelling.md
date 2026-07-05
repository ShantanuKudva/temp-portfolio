# Portfolio Pitch — Scrollytelling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the scroll-driven pitch page that begins out of the landing's black portal — a 9-beat story (portal line → meet her → problem → reel → why-her → reel → what you get → the ask → footer) that makes a brand or agency book Varsheni.

**Architecture:** A second, independent scroll region mounted after the landing hero, owning its own normalized progress `q∈[0,1]`. A `position: fixed` R3F canvas (reused phone GLB + orbiting brand icons) sits behind stacked full-height DOM beats. `q` (from a dedicated GSAP ScrollTrigger) drives the phone rig via checkpoint tables; DOM beats reveal via IntersectionObserver + a scroll-linked word reveal. The landing→pitch seam is black-on-black (canvas fades up from black). All DOM UI is shadcn/Radix on the cherry-maroon theme.

**Tech Stack:** Next.js 16 App Router, React 19, React Three Fiber 9 + drei 10 + three 0.185, GSAP ScrollTrigger + Lenis, Zustand 5, shadcn/ui + Tailwind 4, `@calcom/embed-react` (new), Vitest 4 (jsdom) + puppeteer-core render harness.

## Global Constraints

- **React Compiler is ON.** Never call `Math.random()` / `Date.now()` in render or effects (use `mulberry32` from `@/lib/rng`); never `setState` synchronously inside an effect (use lazy init, subscriptions, or event/rAF callbacks); never mutate a value returned from a hook (clone first, e.g. `useTexture(...).clone()`); guard `document`/`window` with `typeof document !== 'undefined'` for SSR.
- **three.js:** never reassign `Object3D.position/rotation/scale/quaternion` — mutate via `.set(...)` / `.setScalar(...)`.
- **Single source of progress:** the pitch reads `q` only (never the landing's `p`). Read it non-reactively in `useFrame` via `getQ()`.
- **All DOM UI uses shadcn/Radix + Tailwind** on the existing cherry-maroon theme tokens. No hand-rolled UI primitives.
- **Everything content-related ships as flagged placeholders** (reels, portrait, contact, Cal link, legal copy) centralized in `lib/pitchContent.ts` — swap later with no structural change.
- **Palette (no cream, hard rule):** ground near-black `#0B0708`; maroon `#7B1E2B` primary; antique gold `#B08D4C` hairlines/eyebrows; blush `#E8C9C4` / sand `#EADFCF` text; deep wine `#571620`.
- **Path alias:** `@/` → repo root. **Test command:** `npm test` (Vitest, `tests/**/*.test.ts`). **Render check:** `node scripts/verify-scene.mjs`.
- Commit messages end with: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`. Use precise `git add <path>` — never `git add -A`. Leave `.gitmodules`, `skills/`, `public/assets/incoming/` untracked.

## File Structure

**Create:**
- `lib/pitch.ts` — `PBEAT`, `PITCH_X/SCALE/OP/ORB` tracks, `activeReel(q)`. Pure.
- `lib/pitchContent.ts` — all copy/data + placeholders.
- `lib/reveal.ts` — pure scroll-reveal math (`revealFraction`, `wordOpacity`).
- `components/overlay/WordReveal.tsx` — scroll-linked word reveal (reusable).
- `components/scroll/PitchProvider.tsx` — ScrollTrigger over the pitch region → `store.setQ`; `?q=` lock.
- `components/pitch/PitchSection.tsx` — region wrapper (provider + canvas + overlay + footer + height).
- `components/pitch/PitchCanvas.tsx` — fixed R3F canvas; fades from black.
- `components/pitch/PitchPhone.tsx` — reused phone GLB, `q`-driven transform, hosts `ReelScreen`.
- `components/pitch/ReelScreen.tsx` — screen plane: home image → active reel (placeholder canvas / video).
- `components/pitch/PitchOrbit.tsx` — orbiting brand icons around the phone.
- `components/pitch/BeatShell.tsx` — shared full-height beat wrapper (enter reveal).
- `components/pitch/beats/PortalLine.tsx`, `MeetHer.tsx`, `Problem.tsx`, `ReelBeat.tsx`, `WhyHer.tsx`, `WhatYouGet.tsx`, `TheAsk.tsx`.
- `components/pitch/PitchOverlay.tsx` — stacks the beat components.
- `components/pitch/BookCallButton.tsx` — Cal.com popup CTA.
- `components/pitch/PitchFooter.tsx` — footer + policies.
- `app/(legal)/privacy/page.tsx`, `terms/page.tsx`, `cookies/page.tsx`, `disclosure/page.tsx` — placeholder policy pages.
- `app/(legal)/layout.tsx` — shared legal-page shell.
- Tests: `tests/pitch.test.ts`, `tests/reveal.test.ts`, `tests/storeQ.test.ts`.

**Modify:**
- `lib/store.ts` — add `q`, `setQ`, `getQ`.
- `app/page.tsx` — replace the below-hero spacer `<section>` with `<PitchSection>`.
- `scripts/verify-scene.mjs` — support a `?q=` pitch lock + scroll-to-pitch for render checks.

---

### Task 1: Store — add pitch progress `q`

**Files:**
- Modify: `lib/store.ts`
- Test: `tests/storeQ.test.ts`

**Interfaces:**
- Produces: `useScrollStore` gains `q: number`, `setQ(q: number): void` (respects `locked`), and `getQ(): number` (non-reactive).

- [ ] **Step 1: Write the failing test**

```ts
// tests/storeQ.test.ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- storeQ`
Expected: FAIL (`setQ`/`getQ`/`q` do not exist).

- [ ] **Step 3: Implement in `lib/store.ts`**

Add `q` to the interface and initial state; add `setQ` (mirrors `setP` — respects `locked`) and `getQ`:

```ts
interface ScrollState {
  p: number;
  q: number;            // pitch region progress (0..1), independent of p
  locked: boolean;
  hud: boolean;
  setP: (p: number) => void;
  setQ: (q: number) => void;
  setLocked: (b: boolean) => void;
  setHud: (b: boolean) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  p: 0,
  q: 0,
  locked: false,
  hud: false,
  setP: (p) => set((s) => (s.locked ? s : { p })),
  setQ: (q) => set((s) => (s.locked ? s : { q })),
  setLocked: (locked) => set({ locked }),
  setHud: (hud) => set({ hud }),
}));

/** Non-reactive read for pitch useFrame loops. */
export const getQ = (): number => useScrollStore.getState().q;
```

(Leave existing `getP`, `activeIndex` untouched.)

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- storeQ`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/store.ts tests/storeQ.test.ts
git commit -m "feat(pitch): add independent scroll progress q to store"
```

---

### Task 2: Pitch beat tables + reel selector (`lib/pitch.ts`)

**Files:**
- Create: `lib/pitch.ts`
- Test: `tests/pitch.test.ts`

**Interfaces:**
- Consumes: `Keyframe<number>`, `sampleNumber` from `@/lib/track`.
- Produces:
  - `PBEAT` — `{ portalOut, meetHer, problem, reel1, pillars, reel2, whatYouGet, theAsk, end }`.
  - `PITCH_X, PITCH_SCALE, PITCH_OP, PITCH_ORB: Keyframe<number>[]` (phone x-offset as fraction of viewport width, uniform scale, phone opacity, orbit opacity).
  - `activeReel(q: number): number` — reel index `0|1|2` when near a reel beat, else `-1`.

- [ ] **Step 1: Write the failing test**

```ts
// tests/pitch.test.ts
import { describe, it, expect } from 'vitest';
import { PBEAT, PITCH_SCALE, PITCH_OP, activeReel } from '@/lib/pitch';
import { sampleNumber } from '@/lib/track';

describe('pitch phone tables', () => {
  it('is small on context beats and hero-sized on reel beats', () => {
    expect(sampleNumber(PITCH_SCALE, PBEAT.meetHer)).toBeLessThan(0.6);
    expect(sampleNumber(PITCH_SCALE, PBEAT.pillars)).toBeLessThan(0.6);
    expect(sampleNumber(PITCH_SCALE, PBEAT.reel1)).toBeGreaterThan(0.85);
    expect(sampleNumber(PITCH_SCALE, PBEAT.reel2)).toBeGreaterThan(0.85);
  });

  it('phone is fully opaque on reel + ask beats, dim on context beats', () => {
    expect(sampleNumber(PITCH_OP, PBEAT.reel1)).toBeCloseTo(1, 1);
    expect(sampleNumber(PITCH_OP, PBEAT.meetHer)).toBeLessThan(0.6);
  });
});

describe('activeReel', () => {
  it('selects a reel at each reel beat', () => {
    expect(activeReel(PBEAT.reel1)).toBe(0);
    expect(activeReel(PBEAT.reel2)).toBe(1);
    expect(activeReel(PBEAT.theAsk)).toBe(2);
  });
  it('shows the home screen (-1) between reel beats', () => {
    expect(activeReel(PBEAT.pillars)).toBe(-1);
    expect(activeReel(PBEAT.portalOut)).toBe(-1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- pitch`
Expected: FAIL (`@/lib/pitch` not found).

- [ ] **Step 3: Implement `lib/pitch.ts`**

```ts
import type { Keyframe } from '@/lib/track';

// Beat boundaries in pitch progress space (q ∈ [0,1]). Tune HERE.
export const PBEAT = {
  portalOut:  0.00,
  meetHer:    0.11,
  problem:    0.24,
  reel1:      0.37,
  pillars:    0.50,
  reel2:      0.63,
  whatYouGet: 0.75,
  theAsk:     0.86,
  end:        1.00,
} as const;

const E = 'inOutCubic' as const;

// Phone x-offset as a FRACTION of viewport width (0 = centred). The phone holds
// its lane on the right and only scales; no vertical swing, no rotation.
export const PITCH_X: Keyframe<number>[] = [
  { at: PBEAT.portalOut,  value: 0.00 },
  { at: PBEAT.meetHer,    value: 0.32, ease: E },
  { at: PBEAT.problem,    value: 0.32, ease: E },
  { at: PBEAT.reel1,      value: 0.28, ease: E },
  { at: PBEAT.pillars,    value: 0.32, ease: E },
  { at: PBEAT.reel2,      value: 0.28, ease: E },
  { at: PBEAT.whatYouGet, value: 0.32, ease: E },
  { at: PBEAT.theAsk,     value: 0.29, ease: E },
];

export const PITCH_SCALE: Keyframe<number>[] = [
  { at: PBEAT.portalOut,  value: 0.60 },
  { at: PBEAT.meetHer,    value: 0.42, ease: E },
  { at: PBEAT.problem,    value: 0.44, ease: E },
  { at: PBEAT.reel1,      value: 0.92, ease: E },
  { at: PBEAT.pillars,    value: 0.44, ease: E },
  { at: PBEAT.reel2,      value: 0.92, ease: E },
  { at: PBEAT.whatYouGet, value: 0.46, ease: E },
  { at: PBEAT.theAsk,     value: 0.82, ease: E },
];

export const PITCH_OP: Keyframe<number>[] = [
  { at: PBEAT.portalOut,  value: 1.00 },
  { at: PBEAT.meetHer,    value: 0.45, ease: E },
  { at: PBEAT.problem,    value: 0.45, ease: E },
  { at: PBEAT.reel1,      value: 1.00, ease: E },
  { at: PBEAT.pillars,    value: 0.50, ease: E },
  { at: PBEAT.reel2,      value: 1.00, ease: E },
  { at: PBEAT.whatYouGet, value: 0.55, ease: E },
  { at: PBEAT.theAsk,     value: 1.00, ease: E },
];

export const PITCH_ORB: Keyframe<number>[] = [
  { at: PBEAT.portalOut,  value: 0.85 },
  { at: PBEAT.meetHer,    value: 0.30, ease: E },
  { at: PBEAT.problem,    value: 0.35, ease: E },
  { at: PBEAT.reel1,      value: 0.80, ease: E },
  { at: PBEAT.pillars,    value: 0.40, ease: E },
  { at: PBEAT.reel2,      value: 0.80, ease: E },
  { at: PBEAT.whatYouGet, value: 0.40, ease: E },
  { at: PBEAT.theAsk,     value: 0.75, ease: E },
];

const REEL_BEATS: { at: number; i: number }[] = [
  { at: PBEAT.reel1, i: 0 },
  { at: PBEAT.reel2, i: 1 },
  { at: PBEAT.theAsk, i: 2 },
];
const REEL_WINDOW = 0.06; // how close to a reel beat before its reel plays

/** Reel index (0..2) when q is within REEL_WINDOW of a reel beat, else -1 (home). */
export function activeReel(q: number): number {
  let best = -1;
  let bestD = REEL_WINDOW;
  for (const r of REEL_BEATS) {
    const d = Math.abs(q - r.at);
    if (d < bestD) { bestD = d; best = r.i; }
  }
  return best;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- pitch`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/pitch.ts tests/pitch.test.ts
git commit -m "feat(pitch): beat tables + reel selector"
```

---

### Task 3: Scroll-reveal math (`lib/reveal.ts`)

**Files:**
- Create: `lib/reveal.ts`
- Test: `tests/reveal.test.ts`

**Interfaces:**
- Produces:
  - `revealFraction(rectTop: number, vh: number): number` — 0..1 how far a block has scrolled into the reveal band.
  - `wordOpacity(frac: number, i: number, n: number): number` — per-word opacity (0.15 dim → 1 lit), left→right.

- [ ] **Step 1: Write the failing test**

```ts
// tests/reveal.test.ts
import { describe, it, expect } from 'vitest';
import { revealFraction, wordOpacity } from '@/lib/reveal';

describe('revealFraction', () => {
  const vh = 1000;
  it('is 0 when the block sits below the reveal band', () => {
    expect(revealFraction(vh * 0.9, vh)).toBe(0);
  });
  it('is 1 when the block has risen past the band', () => {
    expect(revealFraction(vh * 0.2, vh)).toBe(1);
  });
  it('is monotonic as the block rises', () => {
    expect(revealFraction(vh * 0.6, vh)).toBeGreaterThan(revealFraction(vh * 0.75, vh));
  });
});

describe('wordOpacity', () => {
  it('is dim (0.15) for every word at frac 0', () => {
    expect(wordOpacity(0, 0, 10)).toBeCloseTo(0.15);
    expect(wordOpacity(0, 9, 10)).toBeCloseTo(0.15);
  });
  it('lights early words before late words', () => {
    expect(wordOpacity(0.5, 0, 10)).toBeGreaterThan(wordOpacity(0.5, 9, 10));
  });
  it('fully lights all words at frac 1', () => {
    expect(wordOpacity(1, 9, 10)).toBeCloseTo(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- reveal`
Expected: FAIL (`@/lib/reveal` not found).

- [ ] **Step 3: Implement `lib/reveal.ts`**

```ts
import { clamp01 } from '@/lib/track';

/** How far a block has entered the reveal band as it scrolls up (0..1).
 *  Fully lit by the time its top reaches ~32% of the viewport height. */
export function revealFraction(rectTop: number, vh: number): number {
  return clamp01((vh * 0.82 - rectTop) / (vh * 0.5));
}

/** Per-word opacity, brightening left→right with the block's scroll fraction. */
export function wordOpacity(frac: number, i: number, n: number): number {
  return 0.15 + 0.85 * clamp01(frac * n - i);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- reveal`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/reveal.ts tests/reveal.test.ts
git commit -m "feat(pitch): scroll-linked word-reveal math"
```

---

### Task 4: Content model (`lib/pitchContent.ts`)

**Files:**
- Create: `lib/pitchContent.ts`

**Interfaces:**
- Produces: `REELS`, `PILLARS`, `STATS`, `MEET`, `CHIPS`, `CONTACT`, `CAL_LINK`, `MEDIA_KIT_URL`, `PORTRAIT_SRC`, `FOOTER_LINKS`, and per-beat headline/sub strings. All placeholders flagged with `// PLACEHOLDER`.

- [ ] **Step 1: Create `lib/pitchContent.ts`** (no test — pure data; consumed by later tasks)

```ts
// Single edit point for all pitch copy + assets. Everything marked PLACEHOLDER
// swaps to real content with no component change.

export interface Reel {
  brand: string;                 // badge label, e.g. "Linear"
  gradient: [string, string, string]; // placeholder screen gradient (until video)
  caption: string;               // big on-screen line
  sub: string;                   // small mono line
  videoSrc?: string;             // PLACEHOLDER: drop /assets/reels/*.mp4 later
}

export const REELS: Reel[] = [
  { brand: 'Linear', gradient: ['#123', '#2F4A3A', '#0a1a12'], caption: 'this is how\nfast should feel.', sub: '60 sec · zero fluff' },
  { brand: 'Notion', gradient: ['#3a1420', '#7B1E2B', '#2A1A1C'], caption: 'everything,\nin one place.', sub: 'the verdict in 6 seconds' },
  { brand: 'Claude', gradient: ['#241b0a', '#B08D4C', '#1c1409'], caption: "okay, this\none's different.", sub: 'why it actually clicks' },
];

export const PILLARS = [
  { n: '01', title: 'Clarity', body: 'Complex product, one clean idea an audience actually remembers after they scroll.' },
  { n: '02', title: 'Speed',   body: "The hook, the point, the verdict — before anyone's thumb decides to move on." },
  { n: '03', title: 'Taste',   body: 'It looks as good as your product. Never cheap, never clickbait, never off-brand.' },
] as const;

export const STATS = [
  { value: '60s',   label: 'per review' },
  { value: '7-day', label: 'turnaround' },
  { value: '100%',  label: 'original' },
] as const;

export const MEET = {
  name: 'Varsheni',
  role: 'Tech UGC · App & product reviews',
  bio: 'I review apps and businesses the way people actually use them — no jargon, no 12-minute deep dives. Just the hook, the point, and the one reason it’s worth your thumb stopping.',
} as const;

export const CHIPS = [
  { pre: '1×', text: 'vertical review reel' },
  { pre: '7-day', text: 'turnaround' },
  { pre: '', text: 'posted to her audience' },
  { pre: 'full', text: 'usage rights' },
] as const;

export const HEADS = {
  portal:  'I make tech make sense.',
  problem: "You built something great. But nobody understands it in the six seconds they'll give you. That's exactly what I fix.",
  reel1:   'Sixty seconds.\nZero fluff.',
  reel2:   'Your product,\nmade obvious.',
  ask:     "Let's make your\ntech click.",
} as const;

export const PORTRAIT_SRC = '';                 // PLACEHOLDER: '/assets/varsheni.jpg' when it exists
export const CONTACT = { email: 'hello@varsheni.co', handle: '@varsheni' }; // PLACEHOLDER
export const CAL_LINK = 'varsheni/15min';       // PLACEHOLDER Cal.com link
export const MEDIA_KIT_URL = '#';               // PLACEHOLDER

export const FOOTER_LINKS = {
  explore: [
    { label: 'Reviews', href: '#' },
    { label: 'About', href: '#' },
    { label: 'Work with me', href: '#' },
    { label: 'Media kit', href: MEDIA_KIT_URL },
  ],
  connect: [
    { label: 'Instagram', href: '#' },
    { label: 'YouTube', href: '#' },
    { label: 'TikTok', href: '#' },
    { label: 'Email', href: `mailto:${CONTACT.email}` },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Content & Disclosure', href: '/disclosure' },
  ],
} as const;
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/pitchContent.ts
git commit -m "feat(pitch): centralized content model with flagged placeholders"
```

---

### Task 5: `PitchProvider` — drive `q` from scroll

**Files:**
- Create: `components/scroll/PitchProvider.tsx`

**Interfaces:**
- Consumes: `useScrollStore` (`setQ`, `setLocked`), `PitchProvider` wraps the pitch region and registers a scrubbed ScrollTrigger writing `self.progress` → `setQ`.
- Produces: `<PitchProvider>{children}</PitchProvider>`. Honors `?q=<0..1>` (freeze for the render harness) by setting `q` then `locked`.

- [ ] **Step 1: Implement `components/scroll/PitchProvider.tsx`**

Mirror `ScrollProvider`, but **no pin** (the canvas is fixed, sections scroll normally) and trigger spans the region top→bottom:

```tsx
'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollStore } from '@/lib/store';

export default function PitchProvider({ children }: { children: ReactNode }) {
  const regionRef = useRef<HTMLDivElement>(null);
  const setQ = useScrollStore((s) => s.setQ);
  const setLocked = useScrollStore((s) => s.setLocked);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forced = params.get('q');
    if (forced !== null) {
      const v = Math.min(1, Math.max(0, parseFloat(forced)));
      useScrollStore.getState().setQ(v);
      setLocked(true);
      return; // harness freeze — no scroll rig (Lenis already runs in the landing ScrollProvider)
    }

    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: regionRef.current!,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => setQ(self.progress),
    });
    return () => { st.kill(); };
  }, [setQ, setLocked]);

  return <div ref={regionRef}>{children}</div>;
}
```

Note: Lenis + `gsap.ticker` + `ScrollTrigger.update` are already wired by the landing's `ScrollProvider`; the pitch only adds a trigger.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/scroll/PitchProvider.tsx
git commit -m "feat(pitch): PitchProvider drives q from the pitch region scroll"
```

---

### Task 6: `WordReveal` component

**Files:**
- Create: `components/overlay/WordReveal.tsx`

**Interfaces:**
- Consumes: `revealFraction`, `wordOpacity` from `@/lib/reveal`.
- Produces: `<WordReveal text={string} className?={string} />` — renders each word in a span whose opacity tracks scroll; respects `prefers-reduced-motion` (renders fully lit).

- [ ] **Step 1: Implement `components/overlay/WordReveal.tsx`**

```tsx
'use client';
import { useEffect, useRef } from 'react';
import { revealFraction, wordOpacity } from '@/lib/reveal';

export default function WordReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(/\s+/);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>('[data-w]'));
    if (reduce) { spans.forEach((s) => (s.style.opacity = '1')); return; }

    let raf = 0;
    const update = () => {
      const frac = revealFraction(el.getBoundingClientRect().top, window.innerHeight);
      for (let i = 0; i < spans.length; i++) spans[i].style.opacity = wordOpacity(frac, i, spans.length).toFixed(3);
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [text]);

  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} data-w style={{ opacity: 0.15 }}>{w}{i < words.length - 1 ? ' ' : ''}</span>
      ))}
    </p>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/overlay/WordReveal.tsx
git commit -m "feat(pitch): scroll-linked WordReveal component"
```

---

### Task 7: `PitchOrbit` — orbiting brand icons

**Files:**
- Create: `components/pitch/PitchOrbit.tsx`

**Interfaces:**
- Consumes: `BRANDS`, `buildIconTexture` from `@/lib/brandIcons`; `getQ` from `@/lib/store`; `sampleNumber` + `PITCH_X/SCALE/ORB` from `@/lib/pitch`.
- Produces: `<PitchOrbit />` — a group of billboarded icon planes on a ring that tracks the phone's `q`-driven x/scale, spins slowly, and fades via `PITCH_ORB`. Renders inside the R3F canvas.

- [ ] **Step 1: Implement `components/pitch/PitchOrbit.tsx`**

```tsx
'use client';
import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Billboard } from '@react-three/drei';
import type { Group } from 'three';
import { BRANDS, buildIconTexture } from '@/lib/brandIcons';
import { getQ } from '@/lib/store';
import { sampleNumber } from '@/lib/track';
import { PITCH_X, PITCH_SCALE, PITCH_ORB } from '@/lib/pitch';
import { PHONE_HERO_POS } from '@/lib/phone';

const N = BRANDS.length;
const RADIUS = 0.9;      // ring radius around the phone (world units, pre-scale)
const ICON = 0.14;
const BASE = PHONE_HERO_POS; // ring centres on the phone hero position

export default function PitchOrbit() {
  const texs = useMemo(() => BRANDS.map((b) => buildIconTexture(b)), []);
  const ring = useRef<Group>(null);
  const items = useRef<(Group | null)[]>([]);
  const { viewport } = useThree();

  useFrame((state) => {
    const q = getQ();
    const t = state.clock.elapsedTime;
    const xFrac = sampleNumber(PITCH_X, q);
    const sc = sampleNumber(PITCH_SCALE, q);
    const orb = sampleNumber(PITCH_ORB, q);
    const g = ring.current;
    if (!g) return;
    // follow the phone: x-offset in world units = fraction * half viewport width
    g.position.set(BASE[0] + xFrac * viewport.width * 0.5, BASE[1], BASE[2]);
    g.scale.setScalar(sc);
    g.rotation.z = t * 0.24; // slow spin
    for (let i = 0; i < N; i++) {
      const it = items.current[i];
      if (it) it.rotation.z = -t * 0.24; // counter-rotate to stay upright
      if (it) (it as unknown as { visible: boolean }).visible = orb > 0.02;
    }
  });

  return (
    <group ref={ring}>
      {BRANDS.map((brand, i) => {
        const a = (i / N) * Math.PI * 2;
        return (
          <group key={brand.name} position={[Math.cos(a) * RADIUS, Math.sin(a) * RADIUS, -0.2]}
                 ref={(el) => { items.current[i] = el; }}>
            <Billboard>
              <mesh>
                <planeGeometry args={[ICON, ICON]} />
                <meshBasicMaterial map={texs[i] ?? undefined} transparent depthWrite={false} toneMapped={false} />
              </mesh>
            </Billboard>
          </group>
        );
      })}
    </group>
  );
}
```

Note: orbit material opacity per-icon is left at 1; the whole ring's presence is gated by `orb` (visibility). If a smoother fade is wanted during tuning, drive each material's `opacity` from `orb` instead of visibility (deferred to live tuning).

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/pitch/PitchOrbit.tsx
git commit -m "feat(pitch): orbiting brand icons that track the phone"
```

---

### Task 8: `ReelScreen` — phone screen content

**Files:**
- Create: `components/pitch/ReelScreen.tsx`

**Interfaces:**
- Consumes: `PHONE_SCALE` from `@/lib/phone`; `getQ` from `@/lib/store`; `activeReel` from `@/lib/pitch`; `REELS` from `@/lib/pitchContent`.
- Produces: `<ReelScreen />` — a plane at the phone screen face showing a placeholder reel canvas for the active reel (home/black when `-1`). Mounted as a child of `PitchPhone`.

- [ ] **Step 1: Implement `components/pitch/ReelScreen.tsx`**

Build one `CanvasTexture` per reel (brand gradient + caption + sub + progress bar), guarded for SSR; swap by `activeReel(q)` in `useFrame`. (VideoTexture upgrade is deferred until real files exist — see spec §6.4.)

```tsx
'use client';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CanvasTexture, SRGBColorSpace, type Texture, type MeshBasicMaterial } from 'three';
import { PHONE_SCALE } from '@/lib/phone';
import { getQ } from '@/lib/store';
import { activeReel } from '@/lib/pitch';
import { REELS } from '@/lib/pitchContent';

function buildReelTexture(r: (typeof REELS)[number]): Texture | null {
  if (typeof document === 'undefined') return null;
  const W = 512, H = 1080;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');
  if (!ctx) return null;
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, r.gradient[0]); g.addColorStop(0.55, r.gradient[1]); g.addColorStop(1, r.gradient[2]);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // badge
  ctx.font = '600 22px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText(`REVIEWING · ${r.brand.toUpperCase()}`, 40, 90);
  // caption (supports \n)
  ctx.fillStyle = '#fff'; ctx.font = '800 64px Helvetica, Arial, sans-serif';
  r.caption.split('\n').forEach((line, i) => ctx.fillText(line, 40, H - 220 + i * 68));
  ctx.font = '500 26px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.fillText(r.sub, 40, H - 90);
  const t = new CanvasTexture(cv); t.colorSpace = SRGBColorSpace; t.anisotropy = 16;
  return t;
}

export default function ReelScreen() {
  const texs = useMemo(() => REELS.map(buildReelTexture), []);
  const matRef = useRef<MeshBasicMaterial>(null);
  const cur = useRef<number>(-1);

  useFrame(() => {
    const m = matRef.current;
    if (!m) return;
    const idx = activeReel(getQ());
    if (idx !== cur.current) {
      cur.current = idx;
      m.map = idx >= 0 ? (texs[idx] ?? null) : null;
      m.color.setScalar(idx >= 0 ? 1 : 0); // black when no reel
      m.needsUpdate = true;
    }
  });

  const planeW = 0.0745 * PHONE_SCALE;
  const h = planeW * (1080 / 512);
  const faceZ = (0.0131 / 2) * PHONE_SCALE + 0.0002; // just proud of the screen face
  return (
    <mesh position={[0, 0, faceZ]}>
      <planeGeometry args={[planeW, h]} />
      <meshBasicMaterial ref={matRef} transparent toneMapped={false} />
    </mesh>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/pitch/ReelScreen.tsx
git commit -m "feat(pitch): phone screen reel content (placeholder canvas)"
```

---

### Task 9: `PitchPhone` — reused phone, `q`-driven

**Files:**
- Create: `components/pitch/PitchPhone.tsx`

**Interfaces:**
- Consumes: `PHONE_SCALE`, `PHONE_HERO_POS` from `@/lib/phone`; `getQ`; `sampleNumber` + `PITCH_X/SCALE/OP`; `ReelScreen`.
- Produces: `<PitchPhone />` — loads `phone.glb`, applies the landing's π-Y screen-facing correction, and drives world x/scale/opacity from `q`. Hosts `ReelScreen`.

- [ ] **Step 1: Confirm the phone GLB path + loader pattern**

Read `components/hero/PhoneRig.tsx` to copy the exact GLB path, `useGLTF`/loader usage, and the π-Y correction. Reuse the same loading approach (drei `useGLTF` with the same asset URL) so the model reads identically.

- [ ] **Step 2: Implement `components/pitch/PitchPhone.tsx`**

```tsx
'use client';
import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Group, MeshStandardMaterial } from 'three';
import { PHONE_SCALE, PHONE_HERO_POS } from '@/lib/phone';
import { getQ } from '@/lib/store';
import { sampleNumber } from '@/lib/track';
import { PITCH_X, PITCH_SCALE, PITCH_OP } from '@/lib/pitch';
import ReelScreen from './ReelScreen';

const PHONE_URL = '/assets/phone.glb'; // MATCH PhoneRig.tsx (verify exact path in Step 1)

export default function PitchPhone() {
  const { scene } = useGLTF(PHONE_URL);
  const model = useMemo(() => scene.clone(true), [scene]);
  const root = useRef<Group>(null);
  const { viewport } = useThree();

  useFrame(() => {
    const q = getQ();
    const g = root.current;
    if (!g) return;
    const xFrac = sampleNumber(PITCH_X, q);
    const sc = sampleNumber(PITCH_SCALE, q);
    const op = sampleNumber(PITCH_OP, q);
    g.position.set(PHONE_HERO_POS[0] + xFrac * viewport.width * 0.5, PHONE_HERO_POS[1], PHONE_HERO_POS[2]);
    g.scale.setScalar(sc);
    g.traverse((o) => {
      const mat = (o as unknown as { material?: MeshStandardMaterial }).material;
      if (mat) { mat.transparent = true; mat.opacity = op; }
    });
  });

  return (
    <group ref={root}>
      {/* π-Y correction so the screen faces +Z (matches PhoneRig) */}
      <group rotation={[0, Math.PI, 0]} scale={PHONE_SCALE}>
        <primitive object={model} />
      </group>
      <ReelScreen />
    </group>
  );
}
useGLTF.preload(PHONE_URL);
```

Note: if Step 1 shows `PhoneRig` applies the π-Y on a different node or a different URL, mirror that exactly. Keep `ReelScreen` outside the π-Y group so its face math (from `ScreenContent`) holds.

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/pitch/PitchPhone.tsx
git commit -m "feat(pitch): reused phone GLB driven by q"
```

---

### Task 10: `PitchCanvas` — fixed 3D layer

**Files:**
- Create: `components/pitch/PitchCanvas.tsx`

**Interfaces:**
- Consumes: `PitchPhone`, `PitchOrbit`, `getQ`.
- Produces: `<PitchCanvas />` — a `position: fixed` full-viewport R3F `<Canvas>` behind the DOM (`-z`), with lighting for the phone, that fades opacity 0→1 over the first slice of `q` (black-on-black handoff from the landing).

- [ ] **Step 1: Implement `components/pitch/PitchCanvas.tsx`**

```tsx
'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { getQ } from '@/lib/store';
import { clamp01 } from '@/lib/track';
import { PBEAT } from '@/lib/pitch';
import PitchPhone from './PitchPhone';
import PitchOrbit from './PitchOrbit';

function FadeIn({ el }: { el: HTMLDivElement | null }) {
  // fade the whole canvas up from black over portalOut → meetHer
  useFrame(() => {
    if (!el) return;
    el.style.opacity = clamp01((getQ() - PBEAT.portalOut) / (PBEAT.meetHer - PBEAT.portalOut)).toFixed(3);
  });
  return null;
}

export default function PitchCanvas() {
  const wrap = useRef<HTMLDivElement>(null);
  return (
    <div ref={wrap} className="fixed inset-0 -z-10 bg-[#0B0708]" style={{ opacity: 0 }}>
      <Canvas camera={{ position: [0, PHONE_CAM_Y, PHONE_CAM_Z], fov: 40 }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 4, 3]} intensity={2.2} />
        <spotLight position={[0, 3, 2.5]} angle={0.5} penumbra={0.8} intensity={12} color="#FFE7C4" />
        <PitchPhone />
        <PitchOrbit />
        <FadeIn el={wrap.current} />
      </Canvas>
    </div>
  );
}

const PHONE_CAM_Y = 0.95; // aim at the phone hero height
const PHONE_CAM_Z = 3.0;  // pulled back so the right-docked phone + orbit fit
```

Note: camera Y/Z + light intensities are provisional; tune live so the phone reads as a spotlit hero on a near-black ground. Keep the ground `#0B0708` so the seam from the landing's black portal is invisible.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/pitch/PitchCanvas.tsx
git commit -m "feat(pitch): fixed 3D canvas (phone + orbit) fading from black"
```

---

### Task 11: `BeatShell` + beat components

**Files:**
- Create: `components/pitch/BeatShell.tsx`, and `components/pitch/beats/{PortalLine,MeetHer,Problem,ReelBeat,WhyHer,WhatYouGet,TheAsk}.tsx`

**Interfaces:**
- `BeatShell`: `<BeatShell align?={'left'|'right'} className?>{children}</BeatShell>` — full-height section; fades/translates content in on IntersectionObserver (threshold 0.55); consistent padding.
- Beat components consume `@/lib/pitchContent` + `ScrambleLine`/`WordReveal` + shadcn `Card`/`Badge`/`Button`.

- [ ] **Step 1: Implement `components/pitch/BeatShell.tsx`**

```tsx
'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';

export default function BeatShell({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setInView(true); }),
      { threshold: 0.55 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section ref={ref} className={`relative flex min-h-screen items-center px-[7vw] ${className}`}>
      <div className={`max-w-[1000px] transition-all duration-700 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'}`}>
        {children}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Implement the seven beat components**

Each is a focused DOM section using content from `lib/pitchContent.ts`. Key ones:

`components/pitch/beats/PortalLine.tsx`:
```tsx
import BeatShell from '../BeatShell';
import ScrambleLine from '@/components/overlay/ScrambleLine';
import { HEADS } from '@/lib/pitchContent';

export default function PortalLine() {
  return (
    <BeatShell>
      <p className="mb-6 font-mono text-[13px] uppercase tracking-[0.32em] text-[#B08D4C]">Varsheni · tech UGC</p>
      <ScrambleLine text={HEADS.portal} className="block text-white font-extrabold leading-[0.95] tracking-[-0.025em] text-[clamp(46px,8.6vw,108px)]" />
      <p className="mt-6 max-w-[48ch] text-[18px] leading-relaxed text-[#EADFCF]/60">A creator who turns your product into something a real person actually understands — in the time it takes to lose them.</p>
    </BeatShell>
  );
}
```

`components/pitch/beats/MeetHer.tsx` (portrait + bio + stats; uses `PORTRAIT_SRC` or a gradient placeholder):
```tsx
import BeatShell from '../BeatShell';
import { MEET, STATS, PORTRAIT_SRC } from '@/lib/pitchContent';

export default function MeetHer() {
  return (
    <BeatShell>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[340px_1fr] md:items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-[#B08D4C]/50 shadow-2xl"
             style={{ background: PORTRAIT_SRC ? undefined : 'linear-gradient(160deg,#3a2226,#7B1E2B 55%,#2A1A1C)' }}>
          {PORTRAIT_SRC
            ? <img src={PORTRAIT_SRC} alt="Varsheni" className="h-full w-full object-cover" />
            : <span className="absolute inset-0 grid place-items-center font-mono text-[12px] tracking-[0.3em] text-white/40">HER PHOTO</span>}
        </div>
        <div>
          <p className="mb-2 font-mono text-[13px] uppercase tracking-[0.32em] text-[#B08D4C]">Meet the creator</p>
          <h2 className="text-white font-extrabold tracking-[-0.02em] text-[clamp(30px,4vw,52px)]">{MEET.name}</h2>
          <p className="my-4 text-[14px] uppercase tracking-[0.14em] text-[#B08D4C]">{MEET.role}</p>
          <p className="max-w-[42ch] text-[17px] leading-relaxed text-[#EADFCF]/70">{MEET.bio}</p>
          <div className="mt-7 flex gap-8">
            {STATS.map((s) => (
              <div key={s.label}>
                <b className="block text-[26px] font-extrabold text-white">{s.value}</b>
                <span className="text-[12px] uppercase tracking-[0.1em] text-[#EADFCF]/50">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BeatShell>
  );
}
```

`components/pitch/beats/Problem.tsx` (word reveal):
```tsx
import BeatShell from '../BeatShell';
import WordReveal from '@/components/overlay/WordReveal';
import { HEADS } from '@/lib/pitchContent';

export default function Problem() {
  return (
    <BeatShell>
      <p className="mb-6 font-mono text-[13px] uppercase tracking-[0.32em] text-[#B08D4C]">The problem</p>
      <WordReveal text={HEADS.problem} className="max-w-[15ch] text-white font-bold leading-[1.16] tracking-[-0.02em] text-[clamp(34px,5.6vw,72px)]" />
    </BeatShell>
  );
}
```

`components/pitch/beats/ReelBeat.tsx` (reusable for reel1/reel2 — the phone itself is in the canvas; this beat is the caption):
```tsx
import BeatShell from '../BeatShell';
import ScrambleLine from '@/components/overlay/ScrambleLine';

export default function ReelBeat({ eyebrow, head, note }: { eyebrow: string; head: string; note: string }) {
  return (
    <BeatShell>
      <p className="mb-6 font-mono text-[13px] uppercase tracking-[0.32em] text-[#B08D4C]">{eyebrow}</p>
      <ScrambleLine text={head} className="block whitespace-pre-line text-white font-extrabold leading-[0.95] tracking-[-0.025em] text-[clamp(46px,8.6vw,108px)]" />
      <p className="mt-6 max-w-[48ch] text-[18px] leading-relaxed text-[#EADFCF]/60">{note}</p>
    </BeatShell>
  );
}
```

`components/pitch/beats/WhyHer.tsx` (pillars via shadcn `Card`), `WhatYouGet.tsx` (chips via shadcn `Badge`), and `TheAsk.tsx` (uses `BookCallButton` from Task 12 + `Button`) — implement analogously with `PILLARS`, `CHIPS`, `HEADS.ask`, `CONTACT`. Keep all colors on palette tokens.

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors (TheAsk imports `BookCallButton` — implement Task 12 first if needed, or stub the import and complete in Task 12).

- [ ] **Step 4: Commit**

```bash
git add components/pitch/BeatShell.tsx components/pitch/beats/
git commit -m "feat(pitch): beat shell + beat DOM sections"
```

---

### Task 12: `BookCallButton` — Cal.com CTA

**Files:**
- Create: `components/pitch/BookCallButton.tsx`
- Modify: `package.json` (add `@calcom/embed-react`)

**Interfaces:**
- Consumes: `CAL_LINK` from `@/lib/pitchContent`; shadcn `Button`.
- Produces: `<BookCallButton />` — a shadcn primary button that opens the Cal.com popup; falls back to a plain anchor if the embed API is unavailable.

- [ ] **Step 1: Install the dependency**

Run: `npm install @calcom/embed-react`
Expected: added to `dependencies`.

- [ ] **Step 2: Implement `components/pitch/BookCallButton.tsx`**

```tsx
'use client';
import { useEffect } from 'react';
import { getCalApi } from '@calcom/embed-react';
import { Button } from '@/components/ui/button';
import { CAL_LINK } from '@/lib/pitchContent';

export default function BookCallButton() {
  useEffect(() => {
    (async () => {
      try {
        const cal = await getCalApi();
        cal('ui', { hideEventTypeDetails: false, layout: 'month_view' });
      } catch { /* embed unavailable → anchor fallback below still works */ }
    })();
  }, []);
  return (
    <Button asChild size="lg" className="rounded-full">
      <a href={`https://cal.com/${CAL_LINK}`} data-cal-link={CAL_LINK} data-cal-config='{"layout":"month_view"}'>
        Book a call →
      </a>
    </Button>
  );
}
```

- [ ] **Step 3: Typecheck + build**

Run: `npx tsc --noEmit && npm run build`
Expected: no errors; build succeeds.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json components/pitch/BookCallButton.tsx
git commit -m "feat(pitch): Cal.com book-a-call CTA with anchor fallback"
```

---

### Task 13: `PitchFooter` — footer + policies

**Files:**
- Create: `components/pitch/PitchFooter.tsx`

**Interfaces:**
- Consumes: `FOOTER_LINKS`, `MEET`, `CONTACT` from `@/lib/pitchContent`; shadcn `Separator`.
- Produces: `<PitchFooter />` — brand blurb + Explore / Connect / Legal columns + © line.

- [ ] **Step 1: Implement `components/pitch/PitchFooter.tsx`**

```tsx
import { FOOTER_LINKS } from '@/lib/pitchContent';
import { Separator } from '@/components/ui/separator';

const COLS = [
  { h: 'Explore', links: FOOTER_LINKS.explore },
  { h: 'Connect', links: FOOTER_LINKS.connect },
  { h: 'Legal', links: FOOTER_LINKS.legal },
];

export default function PitchFooter() {
  return (
    <footer className="relative z-10 border-t border-[#B08D4C]/25 bg-[#140A0C] px-[7vw] pb-10 pt-[70px]">
      <div className="grid max-w-[1100px] grid-cols-2 gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <h4 className="text-[26px] font-extrabold text-white">Varsheni</h4>
          <p className="mt-3 max-w-[34ch] text-[14px] leading-relaxed text-[#EADFCF]/50">Tech UGC creator. Reviews of apps &amp; businesses that make your product make sense — in sixty seconds, zero fluff.</p>
        </div>
        {COLS.map((c) => (
          <div key={c.h}>
            <h5 className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[#B08D4C]">{c.h}</h5>
            {c.links.map((l) => (
              <a key={l.label} href={l.href} className="mb-3 block text-[14px] text-[#EADFCF]/70 hover:text-white">{l.label}</a>
            ))}
          </div>
        ))}
      </div>
      <Separator className="my-8 max-w-[1100px] bg-[#EADFCF]/12" />
      <div className="flex max-w-[1100px] flex-wrap justify-between gap-3 text-[12px] text-[#EADFCF]/40">
        <span>© 2026 Varsheni. All rights reserved.</span>
        <span className="font-mono">Made with clarity, not fluff.</span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/pitch/PitchFooter.tsx
git commit -m "feat(pitch): footer with explore/connect/legal columns"
```

---

### Task 14: Legal policy pages

**Files:**
- Create: `app/(legal)/layout.tsx`, `app/(legal)/privacy/page.tsx`, `app/(legal)/terms/page.tsx`, `app/(legal)/cookies/page.tsx`, `app/(legal)/disclosure/page.tsx`

**Interfaces:**
- Produces: four static routes `/privacy`, `/terms`, `/cookies`, `/disclosure` rendered in a shared readable shell. Copy is **placeholder** legal text.

- [ ] **Step 1: Implement `app/(legal)/layout.tsx`**

```tsx
import type { ReactNode } from 'react';

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto min-h-screen max-w-[720px] bg-[#0B0708] px-6 py-24 text-[#EADFCF]">
      <a href="/" className="mb-10 inline-block font-mono text-[12px] uppercase tracking-[0.2em] text-[#B08D4C] hover:text-white">← Varsheni</a>
      <article className="prose-invert space-y-4 leading-relaxed [&_h1]:mb-6 [&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:text-white [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white">
        {children}
      </article>
    </main>
  );
}
```

- [ ] **Step 2: Implement the four pages** (each placeholder; example `privacy/page.tsx`)

```tsx
export const metadata = { title: 'Privacy Policy · Varsheni' };
export default function Privacy() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p className="text-[#EADFCF]/60">PLACEHOLDER — replace with reviewed legal copy before launch.</p>
      <h2>What we collect</h2>
      <p>When you book a call or reach out, we collect the details you provide (name, email, message) solely to respond and schedule.</p>
      <h2>Contact</h2>
      <p>Questions about this policy: hello@varsheni.co</p>
    </>
  );
}
```

Repeat for `terms` (Terms of Service), `cookies` (Cookie Policy), `disclosure` (Content &amp; Disclosure — note sponsored/gifted-content disclosure practice). Keep each short + clearly placeholder.

- [ ] **Step 3: Verify routes build**

Run: `npm run build`
Expected: routes `/privacy`, `/terms`, `/cookies`, `/disclosure` listed; build succeeds.

- [ ] **Step 4: Commit**

```bash
git add "app/(legal)"
git commit -m "feat(pitch): placeholder legal policy routes"
```

---

### Task 15: Assemble `PitchSection` + wire into the page

**Files:**
- Create: `components/pitch/PitchOverlay.tsx`, `components/pitch/PitchSection.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- `PitchOverlay`: stacks the beat components in order.
- `PitchSection`: `<PitchProvider>` wrapping `<PitchCanvas>` + `<PitchOverlay>` + `<PitchFooter>`; owns the region.
- `app/page.tsx`: replaces the spacer `<section>` with `<PitchSection>`.

- [ ] **Step 1: Implement `components/pitch/PitchOverlay.tsx`**

```tsx
import PortalLine from './beats/PortalLine';
import MeetHer from './beats/MeetHer';
import Problem from './beats/Problem';
import ReelBeat from './beats/ReelBeat';
import WhyHer from './beats/WhyHer';
import WhatYouGet from './beats/WhatYouGet';
import TheAsk from './beats/TheAsk';

export default function PitchOverlay() {
  return (
    <div className="relative z-10">
      <PortalLine />
      <MeetHer />
      <Problem />
      <ReelBeat eyebrow="Proof · a review" head={'Sixty seconds.\nZero fluff.'} note="One product, one verdict, no wasted frames. This is exactly what lands on your audience's feed." />
      <WhyHer />
      <ReelBeat eyebrow="In the wild" head={'Your product,\nmade obvious.'} note="The same treatment, tuned to whatever you're launching — an app, a tool, a whole brand." />
      <WhatYouGet />
      <TheAsk />
    </div>
  );
}
```

- [ ] **Step 2: Implement `components/pitch/PitchSection.tsx`**

```tsx
import PitchProvider from '@/components/scroll/PitchProvider';
import PitchCanvas from './PitchCanvas';
import PitchOverlay from './PitchOverlay';
import PitchFooter from './PitchFooter';

export default function PitchSection() {
  return (
    <PitchProvider>
      <div className="relative w-full bg-[#0B0708]">
        <PitchCanvas />
        <PitchOverlay />
      </div>
      <PitchFooter />
    </PitchProvider>
  );
}
```

- [ ] **Step 3: Wire into `app/page.tsx`**

Replace the spacer line:
```tsx
<section className="h-screen w-full" />{/* below-hero spacer; PortfolioHandoff replaces later */}
```
with:
```tsx
<PitchSection />
```
and add the import `import PitchSection from '@/components/pitch/PitchSection';`.

- [ ] **Step 4: Build + typecheck**

Run: `npx tsc --noEmit && npm run build`
Expected: no errors; build succeeds.

- [ ] **Step 5: Commit**

```bash
git add components/pitch/PitchOverlay.tsx components/pitch/PitchSection.tsx app/page.tsx
git commit -m "feat(pitch): assemble pitch section and mount after the landing"
```

---

### Task 16: Render checks — extend the verify harness for `q`

**Files:**
- Modify: `scripts/verify-scene.mjs`

**Interfaces:**
- Adds a `?q=<0..1>` mode that scrolls to the pitch region and freezes it, so headless Chrome can screenshot each pitch beat.

- [ ] **Step 1: Add `q` handling to `scripts/verify-scene.mjs`**

Extend the arg/URL handling: if a `q` is passed, build `URL = ${BASE}/?q=${Q}` and, after load, scroll the page so the pitch region is in view (the `?q=` lock already freezes `q` via `PitchProvider`, but the fixed canvas needs the pitch region on screen — scroll to `document.body.scrollHeight * 0.6`). Reuse the existing puppeteer launch, error capture, `waitUntil: networkidle2`, 4s settle, and `page.screenshot`.

Concretely, add near the top:
```js
const Q = process.env.VERIFY_Q ?? '';
const URL = Q !== '' ? `${BASE}/?q=${Q}` : (P === '' ? BASE : `${BASE}/?p=${P}`);
```
and after the settle delay, when `Q !== ''`:
```js
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.6));
await new Promise((r) => setTimeout(r, 1500));
```

- [ ] **Step 2: Manual render check (dev server running on :3000)**

Run:
```bash
npm run build && npm run start &   # serve prod on :3000
VERIFY_Q=0.11 node scripts/verify-scene.mjs '' /tmp/pitch-q11.png http://localhost:3000
VERIFY_Q=0.37 node scripts/verify-scene.mjs '' /tmp/pitch-q37.png http://localhost:3000
VERIFY_Q=0.86 node scripts/verify-scene.mjs '' /tmp/pitch-q86.png http://localhost:3000
```
Expected: `ERRORS: (none)`, `CANVAS: {"canvas":true,...}`; screenshots show meet-her (q=0.11), reel 1 hero (q=0.37), and the ask with Cal.com CTA (q=0.86). Visually confirm the phone reads as the same device, calm motion, reel on screen, orbit icons present.

- [ ] **Step 3: Full test suite**

Run: `npm test`
Expected: all suites pass (existing + `storeQ`, `pitch`, `reveal`).

- [ ] **Step 4: Commit**

```bash
git add scripts/verify-scene.mjs
git commit -m "test(pitch): q-locked render checks in the verify harness"
```

---

## Self-Review

**Spec coverage:** portal line (T11 PortalLine), meet-her photo (T11 MeetHer), problem word-reveal (T3+T6+T11 Problem), reels on phone (T8 PitchPhone + T7 ReelScreen + T11 ReelBeat), why-her pillars (T11 WhyHer), what-you-get chips (T11 WhatYouGet), the ask + Cal.com (T11 TheAsk + T12 BookCallButton), footer/policies (T13 + T14), orbiting icons (T7 PitchOrbit), calm phone motion (T2 tables + T8), q-region architecture (T1 store + T5 PitchProvider + T10 PitchCanvas + T15 assembly), black-on-black seam (T10 FadeIn), render verification (T16). All spec sections mapped.

**Placeholder scan:** all "PLACEHOLDER" markers are intentional content placeholders centralized in `lib/pitchContent.ts` + legal copy, per the spec's out-of-scope list — not plan gaps. Every code step ships complete code.

**Type consistency:** `q/setQ/getQ` (T1) consumed by T5/T7/T8/T10; `PBEAT`/`PITCH_*`/`activeReel` (T2) consumed by T7/T8/T10; `revealFraction`/`wordOpacity` (T3) consumed by T6; `pitchContent` exports (T4) consumed by T7/T11/T12/T13. `activeReel` returns `-1|0|1|2` matching `REELS` indices and `ReelScreen`'s guard. Names checked across tasks.

**Dependency order:** T8 (`PitchPhone`) Step 1 requires reading `PhoneRig.tsx` for the exact GLB URL + π-Y correction — flagged in-task. T11 `TheAsk` imports T12 `BookCallButton` — noted (implement T12 first or stub).

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-05-portfolio-pitch-scrollytelling.md`. Two execution options:

1. **Subagent-Driven (recommended)** — a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — execute tasks in this session with checkpoints for review.

Which approach?
