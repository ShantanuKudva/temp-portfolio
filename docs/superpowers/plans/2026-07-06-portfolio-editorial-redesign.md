# Portfolio Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the post-transition DOM portfolio (the sections that fade in after the 3D phone push-through) as an editorial / magazine spread — opinionated typography, asymmetric grids, richer surfaces, three new sections — so it reads as a designed feature, not a sparse landing page.

**Architecture:** Introduce a small shared editorial kit (`SectionHead`, `PullQuote`, `EditorialBackdrop`, plus `lib/editorial.ts` math) and render nine content-sized sections through it inside the existing `PortfolioReveal` crossfade. The 3D landing, scroll engine, `LandingCurtain`, and `PortfolioReveal` transform-hold are untouched. All motion is scroll-linked transform/opacity (React-safe) — never a GSAP pin.

**Tech Stack:** Next.js 16 (App Router) · React 19 · Tailwind v4 · shadcn/Base-UI · `next/font/google` (Fraunces + Geist) · Vitest (unit) · puppeteer-core + system Chrome (visual verification).

## Global Constraints

- **No GSAP pins anywhere in the portfolio.** Pin transforms its wrapper (breaks the fixed 3D canvas) and reparents live React subtrees (`insertBefore NotFoundError`). All motion = scroll-linked transform/opacity read via `getBoundingClientRect()` in a rAF loop.
- **No `position: sticky` inside the `PortfolioReveal` wrapper.** That wrapper carries `will-change: transform`, which becomes the containing block / sticky root and breaks it. The masthead settle re-implements sticky with a transform on a leaf div instead.
- **Fraunces self-hosted via `next/font/google`** — never a webfont `<link>`.
- **Keep the fixed 3D canvas untouched.** Portfolio stays `z-10` above the canvas (`z-0`) and the `LandingCurtain` (`z-[5]`).
- **Preserve the Instagram reel carousel** (`ReelCatalogue.tsx` + `InstagramReelUI.tsx` + `FeaturedReel`) — frame it editorially, don't rebuild it.
- **Palette (hardcoded hex, warm dark — single theme):** Ground `#160C0E`, Ink `#0E0708`/`#140A0C`, Cherry maroon `#7B1E2B`, Deep wine `#571620`, Antique gold `#B08D4C`, Warm sand `#EADFCF`, Dusty blush `#E8C9C4`. Body text is the sand family at opacity, never pure grey; `#fff` only for highest-emphasis display.
- **`THREE.Object3D` transforms are non-writable** (mutate, never reassign) — irrelevant here (no 3D touched) but do not break this rule if a step strays near the scene.
- **Placeholder *content* is intentional and clearly marked** (`$—` rates, case metrics, contact). That is a product decision, not a plan gap — do not "fill it in."
- **Do NOT touch `components/hero/LogoField.tsx`** — it has a pre-existing `TextureLoader` WIP tsc error owned by the user. `npx tsc --noEmit` is "clean" if the only error is in that file.

**Scratchpad for screenshots:** `/private/tmp/claude-501/-Users-shantanu-Desktop-development-personal-varsheni-portfolio/8f3fccc2-a90d-49c5-93ef-f9142c567bf4/scratchpad`

---

## File Structure

**New — shared editorial kit**
- `lib/editorial.ts` — pure motion math (`clamp01`, `smoothstep`, `parallaxY`). Unit-tested.
- `components/pitch/EditorialBackdrop.tsx` — opaque ground + maroon radial glows + film-grain wash (bottom layer).
- `components/pitch/SectionHead.tsx` — indexed header (mono index + display title + kicker + gold rule) with an optional parallaxing ghost numeral. Client (parallax).
- `components/pitch/PullQuote.tsx` — oversized italic-serif quote with a gold quotation mark.

**New — sections**
- `components/pitch/Masthead.tsx` — reworked from `beats/About.tsx`; client (settle motion).
- `components/pitch/CaseStudy.tsx`, `HowItsMade.tsx`, `Pricing.tsx`, `Reviewed.tsx`, `Faq.tsx`, `ThePackage.tsx`.

**Modified**
- `app/layout.tsx` — add Fraunces.
- `app/globals.css` — `--font-serif` token, `.drop-cap` utility.
- `lib/pitchContent.ts` — add `PROCESS_STEPS`, `CASE_STUDY`, `PRICING_TIERS`, `FAQ`.
- `lib/appLogos.ts` — add `category` field + `REVIEWED_BRANDS` export.
- `components/pitch/ReelCatalogue.tsx` — frame with `SectionHead` + numbered reel index (carousel kept).
- `components/pitch/beats/TheAsk.tsx` — editorial closing spread + colophon.
- `components/pitch/PitchFooter.tsx` — tighten to the system.
- `components/pitch/PortfolioPage.tsx` — new 9-section order + mount `EditorialBackdrop`.

**New — tooling**
- `scripts/shoot.mjs` — reusable puppeteer screenshotter (visual verification for every section).

**Retired from the portfolio flow** (files stay on disk, just no longer rendered by `PortfolioPage`): `beats/About.tsx`, `beats/WhatYouGet.tsx`, and the `AppLogos` marquee (its logos move into `Reviewed`).

**Tests**
- `tests/editorial.test.ts` (new), `tests/pitchContent.test.ts` (new).

---

## Task 1: Fonts + editorial CSS foundation + screenshot tool

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Create: `scripts/shoot.mjs`

**Interfaces:**
- Consumes: nothing.
- Produces: CSS var `--font-fraunces` on `<html>`; Tailwind token `--font-serif` → usable as `font-serif`; utility class `.drop-cap`. Script `node scripts/shoot.mjs <outDir>` writes `00.png`…`NN.png` full-viewport screenshots of `localhost:3000` scrolled top→bottom.

- [ ] **Step 1: Add Fraunces to the font setup**

In `app/layout.tsx`, extend the `next/font/google` import and add the loader. Replace the import line and add the loader block:

```tsx
import { Geist, Geist_Mono, Fraunces } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
```

Then add `fraunces.variable` to the `<html>` className:

```tsx
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
```

- [ ] **Step 2: Wire the serif token + drop-cap utility in globals.css**

In `app/globals.css`, inside the `@theme inline { … }` block, add one line next to the other `--font-*` entries (after `--font-mono: var(--font-geist-mono);`):

```css
  --font-serif: var(--font-fraunces);
```

Then append this block to the **end** of `app/globals.css`:

```css
/* ── Editorial ─────────────────────────────────────────────────────────────
   Drop-cap for the lead paragraph of the masthead / case study. Fraunces,
   antique-gold, floated so body text wraps around it. */
.drop-cap::first-letter {
  float: left;
  font-family: var(--font-fraunces), Georgia, serif;
  font-weight: 600;
  font-size: 3.4em;
  line-height: 0.78;
  padding: 0.05em 0.14em 0 0;
  color: #b08d4c;
}
@media (prefers-reduced-motion: reduce) {
  /* settle + parallax are disabled in JS; nothing needed here, but keep the
     drop-cap static (it already is). */
}
```

- [ ] **Step 3: Create the reusable screenshot tool**

Create `scripts/shoot.mjs`:

```js
// Reusable portfolio screenshotter. Drives system Chrome (puppeteer-core), loads
// the running dev server, and captures full-viewport PNGs scrolled top→bottom.
// Full-viewport (no clip) at dsf 2 — clip+dsf returns black in this project.
// Usage: node scripts/shoot.mjs <outDir> [steps] [url]
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const outDir = process.argv[2] || './shots';
const steps = Number(process.argv[3] || 14);
const url = process.argv[4] || 'http://localhost:3000';
mkdirSync(outDir, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--window-size=1440,900'],
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
await sleep(2500); // let the preloader clear + first paint settle

const height = await page.evaluate(() => document.body.scrollHeight);
const vh = 900;
for (let i = 0; i < steps; i++) {
  const y = Math.round((i / (steps - 1)) * Math.max(0, height - vh));
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await sleep(650);
  await page.screenshot({ path: `${outDir}/${String(i).padStart(2, '0')}.png` });
}
console.log(`shot ${steps} frames (docHeight=${height}px) → ${outDir}`);
console.log(errors.length ? `PAGE ERRORS:\n${errors.join('\n')}` : 'no page errors');
await browser.close();
```

- [ ] **Step 4: Verify tsc + build the font**

Run: `npx tsc --noEmit`
Expected: clean (or only the known `components/hero/LogoField.tsx` error).

Run: `npm run dev` (leave running in the background), then in another shell:
`node scripts/shoot.mjs "$SCRATCH/t1" 4` where `$SCRATCH` is the scratchpad path.
Expected console: `shot 4 frames … no page errors`. Open `00.png` — the page renders (landing hero), no crash.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/globals.css scripts/shoot.mjs
git commit -m "feat(portfolio): add Fraunces serif, editorial CSS tokens, screenshot tool"
```

---

## Task 2: Editorial content data

**Files:**
- Modify: `lib/pitchContent.ts`
- Modify: `lib/appLogos.ts`
- Create: `tests/pitchContent.test.ts`

**Interfaces:**
- Produces (from `lib/pitchContent`): `PROCESS_STEPS: {n,title,body}[]` (4), `CASE_STUDY: {eyebrow,brand,brief,quote,metrics:{value,label}[],note}`, `PRICING_TIERS: {name,tag,price,unit,features:string[],featured:boolean,ribbon?:string}[]` (3, exactly one `featured` with `ribbon`), `FAQ: {q,a}[]` (5).
- Produces (from `lib/appLogos`): `AppLogo.category?: string`; `REVIEWED_BRANDS: (AppLogo & {category:string})[]` — the entries that carry a category, in array order.

- [ ] **Step 1: Write the failing test**

Create `tests/pitchContent.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { PROCESS_STEPS, CASE_STUDY, PRICING_TIERS, FAQ } from '@/lib/pitchContent';
import { REVIEWED_BRANDS } from '@/lib/appLogos';

describe('editorial content', () => {
  it('has four process steps in order', () => {
    expect(PROCESS_STEPS).toHaveLength(4);
    expect(PROCESS_STEPS.map((s) => s.n)).toEqual(['01', '02', '03', '04']);
    PROCESS_STEPS.forEach((s) => { expect(s.title).toBeTruthy(); expect(s.body).toBeTruthy(); });
  });

  it('case study exposes brief, quote and three metrics', () => {
    expect(CASE_STUDY.brief).toBeTruthy();
    expect(CASE_STUDY.quote).toBeTruthy();
    expect(CASE_STUDY.metrics).toHaveLength(3);
    CASE_STUDY.metrics.forEach((m) => { expect(m.value).toBeTruthy(); expect(m.label).toBeTruthy(); });
  });

  it('has three pricing tiers with exactly one featured, ribboned tier', () => {
    expect(PRICING_TIERS).toHaveLength(3);
    const featured = PRICING_TIERS.filter((t) => t.featured);
    expect(featured).toHaveLength(1);
    expect(featured[0].ribbon).toBeTruthy();
    PRICING_TIERS.forEach((t) => expect(t.features.length).toBeGreaterThanOrEqual(3));
  });

  it('has five FAQ entries', () => {
    expect(FAQ).toHaveLength(5);
    FAQ.forEach((f) => { expect(f.q).toBeTruthy(); expect(f.a).toBeTruthy(); });
  });

  it('reviewed brands all carry a category', () => {
    expect(REVIEWED_BRANDS.length).toBeGreaterThanOrEqual(8);
    REVIEWED_BRANDS.forEach((b) => { expect(b.category).toBeTruthy(); expect(b.slug).toBeTruthy(); });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/pitchContent.test.ts`
Expected: FAIL — `PROCESS_STEPS`/`REVIEWED_BRANDS` are not exported.

- [ ] **Step 3: Add the content to `lib/pitchContent.ts`**

Append to the end of `lib/pitchContent.ts`:

```ts
// ── Editorial redesign content (2026-07-06) ────────────────────────────────
// All PLACEHOLDER where marked — swaps to real copy with no component change.

export const PROCESS_STEPS = [
  { n: '01', title: 'Brief',  body: 'You send the product and the one thing you wish people understood. We find the hook worth sixty seconds.' },
  { n: '02', title: 'Script', body: 'A tight script — the hook, the point, the verdict. Written the way a friend talks, not a sponsored read.' },
  { n: '03', title: 'Shoot',  body: 'Shot and cut for the feed: vertical, captioned, thumb-stopping from the very first frame.' },
  { n: '04', title: 'Ship',   body: 'Posted to her audience within seven days — with full usage rights to run it anywhere you like.' },
] as const;

export const CASE_STUDY = {
  eyebrow: 'The brief · Linear',
  brand: 'Linear',
  brief: 'Linear is fast — but “fast” is invisible in a screenshot. They needed people to feel it, not read about it.',
  quote: 'So we didn’t say fast. We showed the half-second between click and done.',
  metrics: [
    { value: '1.3M', label: 'views' },
    { value: '24k',  label: 'saves' },
    { value: '3.1k', label: 'comments' },
  ],
  note: 'Placeholder numbers — real case metrics on request.',
} as const;

export const PRICING_TIERS = [
  { name: 'Single',   tag: 'One review',    price: '$—', unit: '/ reel',  featured: false,
    features: ['1× 60-second vertical reel', '7-day turnaround', 'One revision round', 'Full usage rights'] },
  { name: 'Bundle',   tag: 'Three reviews', price: '$—', unit: '/ three', featured: true, ribbon: 'Most booked',
    features: ['3× reels, your cadence', 'Priority turnaround', 'Bundle saving', 'Full usage rights'] },
  { name: 'Retainer', tag: 'Monthly',       price: '$—', unit: '/ month', featured: false,
    features: ['4 reels every month', 'First pick of drops', 'Ongoing, cancel anytime', 'Full usage rights'] },
] as const;

export const FAQ = [
  { q: 'Who writes the script?', a: 'She does, from your brief — and you approve it before anything gets shot.' },
  { q: 'How many revisions?',    a: 'One round is included. Approving the script up front keeps it tight and on-message.' },
  { q: 'Do I own the reel?',     a: 'Yes — full usage rights to run it on your channels, ads, and site, for good.' },
  { q: 'Will you post it too?',  a: 'Yes, to her audience. That reach is part of the deal, not an add-on.' },
  { q: 'How fast is it?',        a: 'Seven days from brief to posted — faster on a bundle or retainer.' },
] as const;
```

- [ ] **Step 4: Add categories + the `REVIEWED_BRANDS` export to `lib/appLogos.ts`**

In `lib/appLogos.ts`, add `category` to the interface:

```ts
export interface AppLogo {
  name: string;
  domain: string;
  slug: string;
  category?: string; // PLACEHOLDER — set on the curated Reviewed subset
}
```

Set a category on the first twelve entries (leave the rest untouched). Replace those twelve object literals with:

```ts
  { name: 'ChatGPT',   domain: 'openai.com',  slug: 'chatgpt',  category: 'AI' },
  { name: 'Bolt.new',  domain: 'bolt.new',    slug: 'bolt',     category: 'Build' },
  { name: 'Gamma',     domain: 'gamma.app',   slug: 'gamma',    category: 'Decks' },
  { name: 'HeyGen',    domain: 'heygen.com',  slug: 'heygen',   category: 'Video' },
  { name: 'Granola',   domain: 'granola.ai',  slug: 'granola',  category: 'Notes' },
  { name: 'Julius AI', domain: 'julius.ai',   slug: 'julius',   category: 'Data' },
  { name: 'Napkin AI', domain: 'napkin.ai',   slug: 'napkin',   category: 'Visuals' },
  { name: 'Murf AI',   domain: 'murf.ai',     slug: 'murf',     category: 'Voice' },
  { name: 'Sarvam AI', domain: 'sarvam.ai',   slug: 'sarvam',   category: 'AI' },
  { name: 'Krutrim',   domain: 'olakrutrim.com', slug: 'krutrim', category: 'AI' },
  { name: 'Cluely',    domain: 'cluely.com',  slug: 'cluely',   category: 'Assistant' },
  { name: 'Wispr Flow',domain: 'wisprflow.ai',slug: 'wisprflow',category: 'Dictation' },
```

Then append the export at the end of `lib/appLogos.ts`:

```ts
// The curated grid for the portfolio "Reviewed" section — the entries that carry
// a category. Uses the real downloaded /assets/logos/<slug>.png marks.
export const REVIEWED_BRANDS = APP_LOGOS.filter(
  (l): l is AppLogo & { category: string } => Boolean(l.category),
);
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run tests/pitchContent.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 6: Commit**

```bash
git add lib/pitchContent.ts lib/appLogos.ts tests/pitchContent.test.ts
git commit -m "feat(portfolio): add editorial content (process, case study, pricing, FAQ, reviewed brands)"
```

---

## Task 3: Motion math — `lib/editorial.ts`

**Files:**
- Create: `lib/editorial.ts`
- Create: `tests/editorial.test.ts`

**Interfaces:**
- Produces: `clamp01(x:number):number`; `smoothstep(e0:number,e1:number,x:number):number` (0 below `e0`, 1 above `e1`, smooth between); `parallaxY(top:number, vh:number, strength:number):number` (0 when the element's top sits at viewport centre, negative above, positive below).

- [ ] **Step 1: Write the failing test**

Create `tests/editorial.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { clamp01, smoothstep, parallaxY } from '@/lib/editorial';

describe('clamp01', () => {
  it('clamps to [0,1]', () => {
    expect(clamp01(-0.3)).toBe(0);
    expect(clamp01(0.4)).toBe(0.4);
    expect(clamp01(2)).toBe(1);
  });
});

describe('smoothstep', () => {
  it('is 0 at/below the low edge and 1 at/above the high edge', () => {
    expect(smoothstep(0, 1, -1)).toBe(0);
    expect(smoothstep(0, 1, 0)).toBe(0);
    expect(smoothstep(0, 1, 1)).toBe(1);
    expect(smoothstep(0, 1, 2)).toBe(1);
  });
  it('is 0.5 at the midpoint and monotonic', () => {
    expect(smoothstep(0, 1, 0.5)).toBeCloseTo(0.5, 5);
    expect(smoothstep(0, 1, 0.25)).toBeLessThan(smoothstep(0, 1, 0.75));
  });
});

describe('parallaxY', () => {
  it('is ~0 when the element is centred, and flips sign across centre', () => {
    expect(parallaxY(500, 1000, 0.1)).toBeCloseTo(0, 5); // top == vh/2
    expect(parallaxY(0, 1000, 0.1)).toBeGreaterThan(0);  // above centre → positive
    expect(parallaxY(1000, 1000, 0.1)).toBeLessThan(0);  // below centre → negative
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/editorial.test.ts`
Expected: FAIL — module `@/lib/editorial` not found.

- [ ] **Step 3: Write the implementation**

Create `lib/editorial.ts`:

```ts
// Pure scroll-motion helpers for the editorial portfolio. No DOM — DOM wiring
// lives in the components; keeping the math here makes it unit-testable and
// keeps every rAF callback trivial.

export const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);

// Hermite smoothstep. 0 at/below e0, 1 at/above e1, eased in between.
export function smoothstep(e0: number, e1: number, x: number): number {
  if (e0 === e1) return x < e0 ? 0 : 1;
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}

// Small vertical parallax offset (px) for an element whose viewport-relative top
// is `top`. Zero at viewport centre; positive above centre, negative below.
// `strength` ~0.06–0.14 of the viewport height.
export function parallaxY(top: number, vh: number, strength: number): number {
  const centered = (top - vh / 2) / vh; // -0.5..+0.5 as it crosses the viewport
  return -centered * vh * strength;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/editorial.test.ts`
Expected: PASS (all).

- [ ] **Step 5: Commit**

```bash
git add lib/editorial.ts tests/editorial.test.ts
git commit -m "feat(portfolio): add editorial scroll-motion math (clamp01, smoothstep, parallaxY)"
```

---

## Task 4: Shared editorial primitives — Backdrop, SectionHead, PullQuote

**Files:**
- Create: `components/pitch/EditorialBackdrop.tsx`
- Create: `components/pitch/SectionHead.tsx`
- Create: `components/pitch/PullQuote.tsx`

**Interfaces:**
- Consumes: `parallaxY` from `@/lib/editorial` (Task 3); `.font-serif` + palette (Task 1).
- Produces:
  - `<EditorialBackdrop />` — no props. Absolutely-positioned bottom layer (`-z-10`) carrying the opaque ground, glows, and grain. Mount as the first child of a `relative` container that has no background of its own.
  - `<SectionHead index title kicker? ghost? className? />` — `index: string`, `title: ReactNode`, `kicker?: string`, `ghost?: string`, `className?: string`.
  - `<PullQuote cite? className?>{children}</PullQuote>` — `children: ReactNode`, `cite?: string`, `className?: string`.

- [ ] **Step 1: Create `EditorialBackdrop.tsx`**

```tsx
// Bottom layer of the portfolio: opaque warm-dark ground + two maroon radial
// glows + a faint film-grain wash. Rendered at -z-10 INSIDE the portfolio's z-10
// stacking context, so it covers the fixed 3D canvas (z-0) and landing curtain
// (z-5) while every section paints above it. Absolute (not fixed) — the parent
// carries will-change:transform, which would trap a fixed child; absolute over
// the full portfolio height looks identical for a static texture. Non-interactive.
const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E";

export default function EditorialBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#160C0E]">
      <div className="absolute -left-[12%] top-[6%] h-[46vw] w-[46vw] rounded-full bg-[#7B1E2B]/20 blur-[130px]" />
      <div className="absolute -right-[14%] top-[52%] h-[40vw] w-[40vw] rounded-full bg-[#571620]/25 blur-[140px]" />
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-soft-light"
        style={{ backgroundImage: `url("${GRAIN}")`, backgroundSize: '140px 140px' }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Create `SectionHead.tsx`**

```tsx
'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { parallaxY } from '@/lib/editorial';

// Shared magazine header: a mono index (N° 02), an oversized display title, and
// an optional mono kicker, all sitting on a full-width gold hairline. An optional
// oversized italic-serif "ghost" numeral bleeds off the right and drifts on a
// small scroll parallax. Numbering encodes real reading order (a contents page).
export default function SectionHead({
  index, title, kicker, ghost, className = '',
}: {
  index: string;
  title: ReactNode;
  kicker?: string;
  ghost?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current, g = ghostRef.current;
    if (!el || !g) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = parallaxY(el.getBoundingClientRect().top, window.innerHeight, 0.12);
      g.style.transform = `translateY(${y.toFixed(1)}px)`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {ghost && (
        <span
          ref={ghostRef}
          aria-hidden
          className="pointer-events-none absolute -top-[0.34em] right-0 select-none font-serif italic leading-none text-[#B08D4C]/[0.07] text-[clamp(120px,22vw,300px)]"
        >
          {ghost}
        </span>
      )}
      <div className="relative flex items-end justify-between gap-6 border-b border-[#B08D4C]/25 pb-5">
        <div>
          <span className="font-mono text-[12px] uppercase tracking-[0.3em] text-[#B08D4C]">{index}</span>
          <h2 className="mt-3 text-balance font-extrabold leading-[0.98] tracking-[-0.02em] text-white text-[clamp(34px,5.4vw,64px)]">
            {title}
          </h2>
        </div>
        {kicker && (
          <span className="hidden shrink-0 pb-2 text-right font-mono text-[12px] uppercase tracking-[0.24em] text-[#EADFCF]/45 sm:block">
            {kicker}
          </span>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `PullQuote.tsx`**

```tsx
import type { ReactNode } from 'react';

// Oversized italic-serif pull-quote with a gold quotation mark. Fraunces carries
// the editorial voice; the mark is decorative (aria-hidden).
export default function PullQuote({
  children, cite, className = '',
}: {
  children: ReactNode;
  cite?: string;
  className?: string;
}) {
  return (
    <figure className={`relative ${className}`}>
      <span aria-hidden className="absolute -left-1 -top-7 select-none font-serif italic leading-none text-[#B08D4C]/40 text-[clamp(60px,9vw,120px)]">“</span>
      <blockquote className="relative text-balance font-serif italic leading-[1.08] tracking-[-0.01em] text-white text-[clamp(28px,4.4vw,52px)]">
        {children}
      </blockquote>
      {cite && <figcaption className="mt-5 font-mono text-[12px] uppercase tracking-[0.24em] text-[#B08D4C]">{cite}</figcaption>}
    </figure>
  );
}
```

- [ ] **Step 4: Verify tsc**

Run: `npx tsc --noEmit`
Expected: clean (only the known `LogoField.tsx` error, if any). The primitives are rendered/verified visually once wired into sections (Task 5+).

- [ ] **Step 5: Commit**

```bash
git add components/pitch/EditorialBackdrop.tsx components/pitch/SectionHead.tsx components/pitch/PullQuote.tsx
git commit -m "feat(portfolio): add editorial primitives (backdrop, section head, pull-quote)"
```

---

## Task 5: Masthead (rework `About` → `Masthead`) with settle motion

**Files:**
- Create: `components/pitch/Masthead.tsx`
- Modify: `components/pitch/PortfolioPage.tsx` (temporary wiring so the section renders for verification)

**Interfaces:**
- Consumes: `clamp01`, `smoothstep` (Task 3); `PullQuote` (Task 4); `MEET`, `ABOUT`, `ABOUT_FACTS`, `PORTRAIT_SRC` from `@/lib/pitchContent`.
- Produces: `<Masthead />` — no props. First portfolio section. Client component; a leaf "stage" div re-implements sticky via transform so the serif wordmark **settles** (scales down + strapline fades) as it pins to the viewport top, then releases at the section's end. Gated on the section's own `top < 0`, so it engages only after `PortfolioReveal` releases.

- [ ] **Step 1: Create `Masthead.tsx`**

```tsx
'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Reveal from './Reveal';
import PullQuote from './PullQuote';
import { clamp01, smoothstep } from '@/lib/editorial';
import { MEET, ABOUT, ABOUT_FACTS, PORTRAIT_SRC } from '@/lib/pitchContent';

// px of scroll (after PortfolioReveal releases) over which the wordmark condenses.
const SETTLE = 420;

// The masthead. A serif wordmark + mono strapline that PIN to the viewport top and
// SETTLE (scale down, strapline fades) as you scroll into the section — then release
// at the section's end. The pin is a transform on the leaf `stage` div (NOT sticky,
// NOT a GSAP pin) so it never reparents the DOM or fights PortfolioReveal. Below the
// wordmark: portrait, drop-cap bio, giant pull-quote, and facts as a numbered index.
export default function Masthead() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLHeadingElement>(null);
  const strap = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const sec = section.current, st = stage.current, w = word.current, sp = strap.current;
    if (!sec || !st || !w || !sp) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const top = sec.getBoundingClientRect().top;
      if (top < 0) {
        // Sticky-by-transform: pin the stage to the viewport top through the
        // condense distance, then freeze the offset so it releases and scrolls
        // away (no condensed wordmark hanging over the content below).
        const maxTy = SETTLE;
        const ty = Math.min(-top, maxTy);
        const s = smoothstep(0, 1, clamp01(-top / SETTLE));
        st.style.transform = `translateY(${ty.toFixed(1)}px)`;
        w.style.transform = `scale(${(1 - 0.42 * s).toFixed(3)})`;
        sp.style.opacity = (1 - s).toFixed(3);
      } else {
        st.style.transform = '';
        w.style.transform = '';
        sp.style.opacity = '1';
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={section} className="relative px-[7vw] pt-[14vh] pb-32">
      <div ref={stage} className="mx-auto w-full max-w-[1200px] will-change-transform">
        <p ref={strap} className="font-mono text-[12px] uppercase tracking-[0.42em] text-[#B08D4C]">
          {MEET.role}
        </p>
        <h1 ref={word} className="mt-4 origin-left font-serif font-semibold leading-[0.9] tracking-[-0.02em] text-white text-[clamp(72px,15vw,190px)]">
          {MEET.name}
        </h1>
      </div>

      <div className="mx-auto mt-[9vh] grid w-full max-w-[1200px] grid-cols-1 gap-12 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-16">
        <Reveal>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[400px] overflow-hidden rounded-[4px] ring-1 ring-[#B08D4C]/40 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)]">
            {PORTRAIT_SRC ? (
              <Image src={PORTRAIT_SRC} alt={MEET.name} fill sizes="400px" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(150deg,#7B1E2B,#571620_55%,#2A1A1C)]">
                <span className="font-serif italic leading-none text-white/90 text-[clamp(90px,16vw,150px)]">V</span>
                <span className="absolute bottom-4 left-5 font-mono text-[11px] uppercase tracking-[0.24em] text-[#EADFCF]/45">portrait — placeholder</span>
              </div>
            )}
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="drop-cap max-w-[52ch] text-[17px] leading-relaxed text-[#EADFCF]/75">{ABOUT.body}</p>
          </Reveal>
          <Reveal delay={120}>
            <PullQuote className="mt-10">{ABOUT.kicker}</PullQuote>
          </Reveal>
          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[#B08D4C]/20 pt-8">
            {ABOUT_FACTS.map((f, i) => (
              <Reveal key={f.k} delay={120 + i * 60}>
                <div className="flex gap-3">
                  <span className="font-mono text-[11px] leading-6 tabular-nums text-[#B08D4C]">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#B08D4C]">{f.k}</dt>
                    <dd className="mt-1.5 text-[16px] leading-snug text-[#EADFCF]/85">{f.v}</dd>
                  </div>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Temporarily wire Masthead into `PortfolioPage.tsx` for verification**

Replace the body of `components/pitch/PortfolioPage.tsx` with this interim version (full 9-section wiring lands in Task 12):

```tsx
import EditorialBackdrop from './EditorialBackdrop';
import Masthead from './Masthead';
import ReelCatalogue from './ReelCatalogue';
import WhatYouGet from './beats/WhatYouGet';
import TheAsk from './beats/TheAsk';

export default function PortfolioPage() {
  return (
    <div className="relative z-10">
      <EditorialBackdrop />
      <Masthead />
      <ReelCatalogue />
      <WhatYouGet />
      <TheAsk />
    </div>
  );
}
```

- [ ] **Step 3: Verify tsc + render the settle**

Run: `npx tsc --noEmit` → clean (bar `LogoField.tsx`).

With `npm run dev` running: `node scripts/shoot.mjs "$SCRATCH/t5" 18`
Expected: `no page errors`. Inspect the lower frames (portfolio region): the giant **Varsheni** serif wordmark appears, then in successive frames it is smaller and the strapline has faded (the settle), while the portrait + drop-cap bio + pull-quote + numbered facts sit below. The 3D canvas is not visible over the portfolio (opaque ground), and the earlier landing frames still render (canvas fixed, not scrolled to black).

- [ ] **Step 4: Commit**

```bash
git add components/pitch/Masthead.tsx components/pitch/PortfolioPage.tsx
git commit -m "feat(portfolio): editorial masthead with transform-based settle motion"
```

---

## Task 6: Selected Work — frame `ReelCatalogue` editorially

**Files:**
- Modify: `components/pitch/ReelCatalogue.tsx`

**Interfaces:**
- Consumes: `SectionHead` (Task 4); the existing `FeaturedReel`, `InstagramReelUI`, `CarouselApi`, `CATALOGUE` (unchanged).
- Produces: `<ReelCatalogue />` — reframed with a `SectionHead` and a numbered, clickable reel index (left) that tracks the active slide. **The reel carousel + thumbnails are unchanged.**

- [ ] **Step 1: Rework the layout (keep `FeaturedReel` + carousel intact)**

In `components/pitch/ReelCatalogue.tsx`: add `import SectionHead from './SectionHead';` after the other imports. Then replace the entire returned `<section>…</section>` of the `ReelCatalogue` default export (from `return (` to its matching close) with:

```tsx
  return (
    <section className="relative px-[7vw] py-28">
      <div className="mx-auto w-full max-w-[1200px]">
        <SectionHead index="N° 02" title="Selected work" kicker={`Six reels · ${CATALOGUE.length} verdicts`} ghost="02" />

        <div className="mt-14 grid grid-cols-1 items-start gap-14 md:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] md:gap-20">
          {/* LEFT — active reel description + a numbered index that tracks the slide */}
          <div>
            <Reveal>
              <Badge variant="secondary" className="font-mono text-[10px] uppercase tracking-[0.16em]">{activeReel.brand}</Badge>
              <p className="mt-4 min-h-[2.2em] whitespace-pre-line font-bold leading-[1.06] text-white text-[clamp(24px,3.2vw,38px)]">{activeReel.caption}</p>
              <p className="mt-3 font-mono text-[13px] uppercase tracking-[0.18em] text-[#EADFCF]/55">{activeReel.sub}</p>
            </Reveal>

            <ol className="mt-10 border-t border-[#B08D4C]/20">
              {CATALOGUE.map((reel, i) => (
                <li key={reel.brand}>
                  <button
                    type="button"
                    onClick={() => api?.scrollTo(i)}
                    className={cn(
                      'flex w-full items-baseline gap-5 border-b border-[#B08D4C]/12 py-4 text-left transition-colors',
                      i === current ? 'text-white' : 'text-[#EADFCF]/45 hover:text-[#EADFCF]/80',
                    )}
                  >
                    <span className="font-mono text-[12px] tabular-nums text-[#B08D4C]">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-[18px] font-semibold">{reel.brand}</span>
                    <span className="ml-auto hidden font-mono text-[11px] uppercase tracking-[0.16em] text-[#EADFCF]/35 sm:block">{reel.sub}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          {/* RIGHT — featured reel carousel + thumbnail carousel (unchanged) */}
          <Reveal delay={120}>
            <div className="mx-auto w-full max-w-[340px]">
              <Carousel setApi={setApi} opts={{ loop: true, align: 'center' }}>
                <CarouselContent>
                  {CATALOGUE.map((reel, i) => (
                    <CarouselItem key={reel.brand}>
                      <AspectRatio ratio={REEL_AR}>
                        <FeaturedReel reel={reel} index={i} active={i === current} />
                      </AspectRatio>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              <Carousel opts={{ dragFree: true, containScroll: 'keepSnaps' }} className="mt-4">
                <CarouselContent className="my-1">
                  {CATALOGUE.map((reel, i) => (
                    <CarouselItem
                      key={reel.brand}
                      onClick={() => api?.scrollTo(i)}
                      className={cn('basis-1/4 cursor-pointer transition-opacity', i === current ? 'opacity-100' : 'opacity-40 hover:opacity-75')}
                    >
                      <AspectRatio ratio={REEL_AR}>
                        <div
                          className="h-full w-full overflow-hidden rounded-md"
                          style={{ background: `linear-gradient(160deg, ${reel.gradient[0]}, ${reel.gradient[1]} 55%, ${reel.gradient[2]})` }}
                        />
                      </AspectRatio>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
```

(The `min-h-screen` centring is gone — the section is now content-sized. `Reveal`, `Badge`, `cn`, `Carousel*`, `AspectRatio`, `FeaturedReel`, `REEL_AR`, `CATALOGUE`, `api`, `current`, `activeReel` are all already imported/defined in the file.)

- [ ] **Step 2: Verify tsc + render**

Run: `npx tsc --noEmit` → clean (bar `LogoField.tsx`).
With dev running: `node scripts/shoot.mjs "$SCRATCH/t6" 18` → `no page errors`. In the portfolio frames: an indexed "N° 02 · Selected work" header on a gold rule with a faint ghost "02" top-right; the numbered reel index on the left (active row white) beside the Instagram reel carousel + thumbnails. Click-tracking is verified in Task 12's live pass.

- [ ] **Step 3: Commit**

```bash
git add components/pitch/ReelCatalogue.tsx
git commit -m "feat(portfolio): frame Selected Work with section head + numbered reel index"
```

---

## Task 7: Case Study (new)

**Files:**
- Create: `components/pitch/CaseStudy.tsx`

**Interfaces:**
- Consumes: `SectionHead`, `PullQuote` (Task 4); `Reveal`; `InstagramReelUI`; `AspectRatio`; `CASE_STUDY`, `CATALOGUE` (Task 2 / existing).
- Produces: `<CaseStudy />` — one reel unpacked (brief → pull-quote → metrics), reel on the left, story on the right.

- [ ] **Step 1: Create `CaseStudy.tsx`**

```tsx
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import PullQuote from './PullQuote';
import InstagramReelUI from './InstagramReelUI';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { CASE_STUDY, CATALOGUE } from '@/lib/pitchContent';

// Phone-screen aspect (matches ReelCatalogue) so the Instagram chrome proportions
// are right.
const REEL_AR = 736 / 1624;

// One reel unpacked: the brief, the hook as a pull-quote, and the outcome metrics.
// Reuses the Linear reel + Instagram chrome as a static (non-playing) still.
export default function CaseStudy() {
  const reel = CATALOGUE[0]; // Linear
  return (
    <section className="relative px-[7vw] py-28">
      <div className="mx-auto w-full max-w-[1200px]">
        <SectionHead index="N° 03" title="One reel, unpacked" kicker={CASE_STUDY.eyebrow} ghost="03" />
        <div className="mt-14 grid grid-cols-1 items-center gap-14 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-16">
          <Reveal>
            <div className="mx-auto w-full max-w-[300px]" style={{ containerType: 'inline-size' }}>
              <AspectRatio ratio={REEL_AR}>
                <div
                  className="relative h-full w-full overflow-hidden rounded-[20px] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)]"
                  style={{ background: `linear-gradient(160deg, ${reel.gradient[0]}, ${reel.gradient[1]} 55%, ${reel.gradient[2]})` }}
                >
                  <InstagramReelUI reel={reel} index={0} />
                </div>
              </AspectRatio>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="max-w-[46ch] text-[19px] leading-relaxed text-[#EADFCF]/80">{CASE_STUDY.brief}</p>
            </Reveal>
            <Reveal delay={120}>
              <PullQuote className="mt-9">{CASE_STUDY.quote}</PullQuote>
            </Reveal>
            <Reveal delay={180}>
              <div className="mt-10 flex flex-wrap gap-x-14 gap-y-6 border-t border-[#B08D4C]/20 pt-8">
                {CASE_STUDY.metrics.map((m) => (
                  <div key={m.label}>
                    <div className="font-serif leading-none tabular-nums text-white text-[clamp(34px,4.4vw,52px)]">{m.value}</div>
                    <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[#EADFCF]/50">{m.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={220}>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-[#EADFCF]/35">{CASE_STUDY.note}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify tsc**

Run: `npx tsc --noEmit` → clean (bar `LogoField.tsx`). (Rendered in Task 12 once wired.)

- [ ] **Step 3: Commit**

```bash
git add components/pitch/CaseStudy.tsx
git commit -m "feat(portfolio): add Case Study section"
```

---

## Task 8: How it's made (new)

**Files:**
- Create: `components/pitch/HowItsMade.tsx`

**Interfaces:**
- Consumes: `SectionHead` (Task 4); `Reveal`; `PROCESS_STEPS` (Task 2).
- Produces: `<HowItsMade />` — 4 numbered steps as ruled rows with oversized gold serif numerals.

- [ ] **Step 1: Create `HowItsMade.tsx`**

```tsx
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import { PROCESS_STEPS } from '@/lib/pitchContent';

// The process, as a ruled index: oversized italic-serif numeral · title · body.
export default function HowItsMade() {
  return (
    <section className="relative px-[7vw] py-28">
      <div className="mx-auto w-full max-w-[1200px]">
        <SectionHead index="N° 04" title="How it’s made" kicker="Brief → Script → Shoot → Ship" ghost="04" />
        <div className="mt-8">
          {PROCESS_STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <div className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-8 gap-y-2 border-b border-[#B08D4C]/15 py-8 md:grid-cols-[7rem_15rem_minmax(0,1fr)]">
                <span className="font-serif italic leading-none text-[#B08D4C]/70 text-[clamp(44px,6vw,84px)]">{s.n}</span>
                <h3 className="font-extrabold tracking-[-0.01em] text-white text-[clamp(24px,3vw,34px)]">{s.title}</h3>
                <p className="max-w-[46ch] text-[16px] leading-relaxed text-[#EADFCF]/70">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify tsc**

Run: `npx tsc --noEmit` → clean (bar `LogoField.tsx`).

- [ ] **Step 3: Commit**

```bash
git add components/pitch/HowItsMade.tsx
git commit -m "feat(portfolio): add How it's made section"
```

---

## Task 9: The Package (rework `WhatYouGet` → `ThePackage`)

**Files:**
- Create: `components/pitch/ThePackage.tsx`

**Interfaces:**
- Consumes: `SectionHead` (Task 4); `Reveal`; `CHIPS`, `STATS` (existing).
- Produces: `<ThePackage />` — deliverables as a ruled spec-sheet + stats as oversized serif numerals. **No app wall** (logos move to Reviewed).

- [ ] **Step 1: Create `ThePackage.tsx`**

```tsx
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import { CHIPS, STATS } from '@/lib/pitchContent';

// What you get — deliverables as a ruled spec-sheet (left) and the numbers as
// oversized serif figures (right). The old scrolling app wall is retired; those
// logos live in "Reviewed" now.
export default function ThePackage() {
  return (
    <section className="relative px-[7vw] py-28">
      <div className="mx-auto w-full max-w-[1200px]">
        <SectionHead
          index="N° 05"
          title={<>One 60-second review. <span className="text-[#EADFCF]/40">Yours to run anywhere.</span></>}
          kicker="What you get"
          ghost="05"
        />
        <div className="mt-12 grid grid-cols-1 gap-16 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <dl>
            {CHIPS.map((c, i) => (
              <Reveal key={c.text} delay={i * 70}>
                <div className="flex items-baseline justify-between gap-6 border-b border-[#B08D4C]/15 py-5">
                  <dt className="text-[18px] text-[#EADFCF]/85">{c.text}</dt>
                  <dd className="font-mono text-[13px] uppercase tracking-[0.16em] text-[#B08D4C]">{c.pre || '—'}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
          <div className="flex flex-col justify-center gap-10 md:pl-10">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <div>
                  <div className="font-serif leading-[0.85] tracking-[-0.02em] tabular-nums text-white text-[clamp(52px,7vw,88px)]">{s.value}</div>
                  <div className="mt-2 font-mono text-[12px] uppercase tracking-[0.22em] text-[#EADFCF]/50">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify tsc**

Run: `npx tsc --noEmit` → clean (bar `LogoField.tsx`).

- [ ] **Step 3: Commit**

```bash
git add components/pitch/ThePackage.tsx
git commit -m "feat(portfolio): add The Package spec-sheet section (retires app wall)"
```

---

## Task 10: Pricing (new)

**Files:**
- Create: `components/pitch/Pricing.tsx`

**Interfaces:**
- Consumes: `SectionHead` (Task 4); `Reveal`; `cn`; `PRICING_TIERS` (Task 2).
- Produces: `<Pricing />` — 3 ruled tier columns; the featured tier is filled maroon and carries the ribbon.

- [ ] **Step 1: Create `Pricing.tsx`**

```tsx
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import { cn } from '@/lib/utils';
import { PRICING_TIERS } from '@/lib/pitchContent';

// Three ruled tier columns. Hairlines come from a 1px gap over a gold-tinted
// backing; the featured tier is filled deep-wine and ribboned. Rates are $—.
export default function Pricing() {
  return (
    <section className="relative px-[7vw] py-28">
      <div className="mx-auto w-full max-w-[1200px]">
        <SectionHead index="N° 06" title="Pricing" kicker="Placeholder rates" ghost="06" />
        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-[6px] border border-[#B08D4C]/20 bg-[#B08D4C]/15 md:grid-cols-3">
          {PRICING_TIERS.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <div className={cn('relative flex h-full flex-col p-8', t.featured ? 'bg-[#571620]' : 'bg-[#160C0E]')}>
                {t.ribbon && (
                  <span className="absolute right-6 top-6 rounded-full bg-[#B08D4C] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#160C0E]">
                    {t.ribbon}
                  </span>
                )}
                <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-[#B08D4C]">{t.tag}</p>
                <h3 className="mt-2 font-extrabold text-white text-[clamp(24px,3vw,32px)]">{t.name}</h3>
                <div className="mt-5 flex items-baseline gap-2">
                  <span className="font-serif leading-none text-white text-[clamp(40px,5vw,60px)]">{t.price}</span>
                  <span className="font-mono text-[13px] text-[#EADFCF]/55">{t.unit}</span>
                </div>
                <ul className="mt-7 flex flex-col gap-3 border-t border-[#B08D4C]/15 pt-6">
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-3 text-[15px] text-[#EADFCF]/80">
                      <span className="text-[#B08D4C]">→</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify tsc**

Run: `npx tsc --noEmit` → clean (bar `LogoField.tsx`).

- [ ] **Step 3: Commit**

```bash
git add components/pitch/Pricing.tsx
git commit -m "feat(portfolio): add Pricing section (3 tiers, placeholder rates)"
```

---

## Task 11: Reviewed (new) + FAQ (new)

**Files:**
- Create: `components/pitch/Reviewed.tsx`
- Create: `components/pitch/Faq.tsx`

**Interfaces:**
- Consumes: `SectionHead` (Task 4); `Reveal`; `REVIEWED_BRANDS` (Task 2); `FAQ` (Task 2).
- Produces: `<Reviewed />` — editorial logo grid (mark + name + category). `<Faq />` — ruled numbered Q&A rows.

- [ ] **Step 1: Create `Reviewed.tsx`**

```tsx
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import { REVIEWED_BRANDS } from '@/lib/appLogos';

// The apps & tools she covers — a ruled editorial grid of mark + name + category,
// using the real /assets/logos/<slug>.png marks. Hairlines via a 1px gap.
export default function Reviewed() {
  return (
    <section className="relative px-[7vw] py-28">
      <div className="mx-auto w-full max-w-[1200px]">
        <SectionHead index="N° 07" title="Reviewed" kicker="Apps & tools she covers" ghost="07" />
        <div className="mt-12 grid grid-cols-2 gap-px bg-[#B08D4C]/12 sm:grid-cols-3 lg:grid-cols-4">
          {REVIEWED_BRANDS.map((b, i) => (
            <Reveal key={b.slug} delay={(i % 4) * 60}>
              <div className="flex items-center gap-4 bg-[#160C0E] p-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/assets/logos/${b.slug}.png`}
                  alt={b.name}
                  width={40}
                  height={40}
                  loading="lazy"
                  className="h-10 w-10 shrink-0 rounded-[22%] object-contain"
                />
                <div className="min-w-0">
                  <div className="truncate text-[16px] font-semibold text-[#EADFCF]/90">{b.name}</div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#B08D4C]">{b.category}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `Faq.tsx`**

```tsx
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import { FAQ } from '@/lib/pitchContent';

// Ruled Q&A: numbered index · question (serif-adjacent bold) · answer, on hairlines.
export default function Faq() {
  return (
    <section className="relative px-[7vw] py-28">
      <div className="mx-auto w-full max-w-[1200px]">
        <SectionHead index="N° 08" title="Questions" kicker="Before you ask" ghost="08" />
        <div className="mt-8">
          {FAQ.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <div className="grid grid-cols-1 gap-3 border-b border-[#B08D4C]/15 py-8 md:grid-cols-[auto_minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-10">
                <span className="font-mono text-[12px] tabular-nums text-[#B08D4C]">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="text-balance font-bold leading-snug text-white text-[clamp(19px,2.2vw,24px)]">{f.q}</h3>
                <p className="max-w-[52ch] text-[16px] leading-relaxed text-[#EADFCF]/70">{f.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify tsc**

Run: `npx tsc --noEmit` → clean (bar `LogoField.tsx`).

- [ ] **Step 4: Commit**

```bash
git add components/pitch/Reviewed.tsx components/pitch/Faq.tsx
git commit -m "feat(portfolio): add Reviewed logo grid + FAQ sections"
```

---

## Task 12: The Ask (rework) + Footer (tighten) + full integration

**Files:**
- Modify: `components/pitch/beats/TheAsk.tsx`
- Modify: `components/pitch/PitchFooter.tsx`
- Modify: `components/pitch/PortfolioPage.tsx`

**Interfaces:**
- Consumes: everything above; keeps `ScrambleLine`, `BookCallButton`, `Button` (with `nativeButton={false}` anchors), `HEADS`, `CONTACT`, `MEDIA_KIT_URL`, `FOOTER_LINKS`, `Separator`.
- Produces: final `PortfolioPage` rendering the nine sections in order over `EditorialBackdrop`.

- [ ] **Step 1: Rework `beats/TheAsk.tsx` into an editorial closing spread**

Replace the whole file `components/pitch/beats/TheAsk.tsx` with:

```tsx
import Reveal from '../Reveal';
import ScrambleLine from '@/components/overlay/ScrambleLine';
import { Button } from '@/components/ui/button';
import BookCallButton from '@/components/pitch/BookCallButton';
import { HEADS, CONTACT, MEDIA_KIT_URL } from '@/lib/pitchContent';

const COLOPHON = [
  { k: 'Email', v: CONTACT.email },
  { k: 'Social', v: CONTACT.handle },
  { k: 'Booking', v: 'Cal.com · 15 min' },
  { k: 'Availability', v: 'Open — placeholder' },
];

// The closing spread: the one place cherry-maroon goes loud. A giant serif ask
// (scramble-animated), the CTA buttons, and a contact colophon.
export default function TheAsk() {
  return (
    <section className="relative px-[7vw] py-32">
      <Reveal className="w-full">
        <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[8px] bg-[#571620] px-[7%] py-20 ring-1 ring-[#B08D4C]/40 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] sm:py-28">
          <span aria-hidden className="pointer-events-none absolute -right-4 -top-10 select-none font-serif italic leading-none text-white/[0.06] text-[clamp(160px,26vw,360px)]">09</span>
          <p className="mb-8 font-mono text-[12px] uppercase tracking-[0.4em] text-[#E8C9C4]">The ask</p>
          <ScrambleLine
            text={HEADS.ask}
            className="block whitespace-pre-line font-serif font-semibold leading-[0.92] tracking-[-0.02em] text-white text-[clamp(44px,8vw,104px)]"
          />

          <div className="mt-12 flex flex-wrap gap-4">
            <BookCallButton />
            <Button variant="outline" size="lg" nativeButton={false} className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/10" render={<a href={`mailto:${CONTACT.email}`} />}>
              Work with me
            </Button>
            <Button variant="ghost" size="lg" nativeButton={false} className="rounded-full text-white/80 hover:bg-white/10 hover:text-white" render={<a href={MEDIA_KIT_URL} />}>
              Download media kit
            </Button>
          </div>

          <dl className="mt-14 grid grid-cols-2 gap-x-10 gap-y-6 border-t border-[#B08D4C]/30 pt-10 sm:grid-cols-4">
            {COLOPHON.map((c) => (
              <div key={c.k}>
                <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#E8C9C4]/60">{c.k}</dt>
                <dd className="mt-1.5 text-[15px] text-white/90">{c.v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-[#E8C9C4]/45">Contact details are placeholder — swap real.</p>
        </div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 2: Tighten `PitchFooter.tsx` to the system**

In `components/pitch/PitchFooter.tsx`, replace the wordmark `<h4>` line so the wordmark is serif:

```tsx
          <h4 className="font-serif text-[30px] font-semibold text-white">Varsheni</h4>
```

- [ ] **Step 3: Final `PortfolioPage.tsx` — nine sections in order**

Replace `components/pitch/PortfolioPage.tsx` with:

```tsx
import EditorialBackdrop from './EditorialBackdrop';
import Masthead from './Masthead';
import ReelCatalogue from './ReelCatalogue';
import CaseStudy from './CaseStudy';
import HowItsMade from './HowItsMade';
import ThePackage from './ThePackage';
import Pricing from './Pricing';
import Reviewed from './Reviewed';
import Faq from './Faq';
import TheAsk from './beats/TheAsk';

// The post-scroll editorial portfolio. Normal-flow page that begins once the 3D
// phone has faded to black (via PortfolioReveal). EditorialBackdrop is the opaque
// bottom layer that covers the fixed canvas; the nine sections paint above it.
// 01 Masthead · 02 Selected Work · 03 Case Study · 04 How it's made ·
// 05 The Package · 06 Pricing · 07 Reviewed · 08 FAQ · 09 The Ask.
export default function PortfolioPage() {
  return (
    <div className="relative z-10">
      <EditorialBackdrop />
      <Masthead />
      <ReelCatalogue />
      <CaseStudy />
      <HowItsMade />
      <ThePackage />
      <Pricing />
      <Reviewed />
      <Faq />
      <TheAsk />
    </div>
  );
}
```

- [ ] **Step 4: Full verification**

Run: `npm test` → all suites pass (`pitch`, `pitchContent`, `editorial`).
Run: `npx tsc --noEmit` → clean (only the known `LogoField.tsx` error, if present).
With dev running: `node scripts/shoot.mjs "$SCRATCH/t12" 22`
Expected console: `no page errors`.

Inspect the frames in order and confirm:
1. **Landing intact** — early frames show the 3D hero (canvas `position: fixed`, top 0); it is not scrolled up into black.
2. **Crossfade** — the portfolio fades up over black (not a hard scroll cut).
3. **Nine sections present, none empty** — Masthead (settling wordmark) → Selected Work (reel carousel + numbered index) → Case Study → How it's made → The Package → Pricing (3 tiers, middle filled) → Reviewed (logo grid) → FAQ → The Ask (maroon spread) → Footer. No half-screen dead voids beneath any section.
4. **Editorial system reads** — gold hairline rules, ghost numerals, serif wordmark/pull-quotes/numerals, grain/glow depth.

- [ ] **Step 5: Commit**

```bash
git add components/pitch/beats/TheAsk.tsx components/pitch/PitchFooter.tsx components/pitch/PortfolioPage.tsx
git commit -m "feat(portfolio): editorial Ask spread + footer, wire nine-section order"
```

---

## Self-Review

Run after the plan is written, before execution:

1. **Spec coverage** — every spec section maps to a task: fonts/CSS (T1), content (T2), motion math (T3), primitives incl. backdrop/section-head/pull-quote/drop-cap (T1+T4), Masthead+settle (T5), Selected Work (T6), Case Study (T7), How it's made (T8), The Package (T9), Pricing (T10), Reviewed+FAQ (T11), The Ask+Footer+integration (T12). Motion spec: settle (T5), section reveals (existing `Reveal`, used throughout), ghost parallax (T4 `SectionHead`), reduced-motion (T4/T5 guards). Constraints: no-pin / no-sticky-in-wrapper (T5 transform-leaf), canvas untouched, carousel preserved (T6).
2. **Placeholder scan** — no "TBD"/"implement later" in steps; every code step shows complete code. `$—` rates / case metrics / contact are intentional marked content, not plan gaps.
3. **Type consistency** — `SectionHead` prop names (`index/title/kicker/ghost`) match every call site; `REVIEWED_BRANDS` is `(AppLogo & {category:string})[]` so `b.category` is defined; `PRICING_TIERS[].ribbon?` guarded with `{t.ribbon && …}`; `parallaxY/clamp01/smoothstep` signatures match tests and consumers.

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-07-06-portfolio-editorial-redesign.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration. REQUIRED SUB-SKILL: superpowers:subagent-driven-development.

**2. Inline Execution** — Execute tasks in this session using superpowers:executing-plans, batch execution with checkpoints.

**Which approach?**
