# Varsheni v2 — Foundation + Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the v2 design foundation (brand tokens, fonts, test harness, smooth scroll, the GradualBlur effect) and build the locked hero section pixel-close to the reference mock.

**Architecture:** Next.js 16 App Router. Brand tokens + fonts are global (`app/globals.css`, `app/layout.tsx`). The hero is a server-rendered composition of small presentational components under `components/hero/`, styled with a scoped CSS Module (`hero.module.css`) that ports the exact velvet-wall gradients, neon-flicker keyframes, and wax-seal spin from the reference mock. Motion that needs JS is Framer Motion (`motion/react`); the hero's flicker/seal are pure CSS. A pure-CSS `GradualBlur` effect (re-skinned React Bits idea) provides the progressive bottom-edge blur, suppressible at the footer.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4 (`@theme inline`), shadcn/ui (`@base-ui/react`), `next/font/google`, Framer Motion (`motion`), Lenis, Vitest + @testing-library/react.

**Reference (source of truth for the hero look):** `docs/superpowers/specs/assets/2026-07-11-hero-reference.html` (open in a browser) and `2026-07-11-hero-reference.png`. The design spec is `docs/superpowers/specs/2026-07-11-varsheni-v2-portfolio-design.md`.

## Global Constraints

- **Palette (exact hex):** wine `#5B0F1A`, espresso `#3B2A24`, mocha `#6B4E42`, taupe `#B79E8C`, crème `#F7F3EE`, amber-dot `#D9A05B`. Do not deviate.
- **Type:** Playfair Display (display) · Montserrat (UI/body) · Alex Brush (cursive name only).
- **Motion:** Framer Motion (`motion`, import from `motion/react`) + Lenis are the default. GSAP is a scoped escape hatch only. Every animation must be disabled under `prefers-reduced-motion: reduce`.
- **UI:** use shadcn/ui primitives in `components/ui/` for DOM UI; no hand-rolled primitives; use `cn()` from `@/lib/utils`.
- **React Compiler safe:** no synchronous `setState` in effects (use rAF / imperative refs); no `Math.random` / `Date.now` in render.
- **Git:** precise `git add <path>` — never `-A`. Leave `.gitmodules`, `skills/`, `public/assets/incoming/` untracked. End every commit message with:
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`
- **Path alias:** `@/*` → repo root (e.g. `@/components/hero/hero`).
- Install latest stable package versions.

---

### Task 1: Test harness (React Testing Library + jsdom)

**Files:**
- Modify: `vitest.config.ts`
- Create: `tests/setup.ts`
- Create: `tests/smoke.test.tsx`
- Modify: `package.json` (devDependencies via install command)

**Interfaces:**
- Produces: a working Vitest + RTL harness that compiles `.test.tsx`, with `@testing-library/jest-dom` matchers globally available and DOM cleanup between tests.

- [ ] **Step 1: Install testing libraries**

Run:
```bash
npm install -D @testing-library/react@latest @testing-library/jest-dom@latest @testing-library/dom@latest
```
Expected: packages added to `devDependencies`, no peer-dep errors (React 19 is supported by RTL 16+).

- [ ] **Step 2: Create the test setup file**

Create `tests/setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});
```

- [ ] **Step 3: Update Vitest config to include tsx + setup**

Replace `vitest.config.ts` with:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    passWithNoTests: true,
  },
  resolve: { alias: { "@": resolve(__dirname, ".") } },
});
```

- [ ] **Step 4: Write a smoke test that proves the harness works**

Create `tests/smoke.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";

function Hello() {
  return <p>harness ok</p>;
}

test("RTL + jest-dom harness renders and matches", () => {
  render(<Hello />);
  expect(screen.getByText("harness ok")).toBeInTheDocument();
});
```

- [ ] **Step 5: Run the test**

Run: `npm test`
Expected: PASS — 1 passed, `tests/smoke.test.tsx`.

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts tests/setup.ts tests/smoke.test.tsx package.json package-lock.json
git commit -m "test(v2): add RTL + jsdom harness

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Brand tokens + fonts

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: Tailwind color utilities `bg-wine text-wine bg-espresso bg-mocha text-taupe bg-creme text-creme bg-amber-dot` (and the rest), font utilities `font-display font-sans font-script`, CSS vars `--font-playfair --font-montserrat --font-alex-brush` on `<html>`, and a default `body` of wine bg / crème text.

- [ ] **Step 1: Add brand color + font tokens to the theme**

In `app/globals.css`, inside the existing `@theme inline { … }` block, add these lines before the closing `}` (after line 44, alongside the existing `--font-sans` etc.). Replace the existing `--font-sans`/`--font-mono` lines with the brand fonts:
```css
  /* Brand type */
  --font-display: var(--font-playfair);
  --font-sans: var(--font-montserrat);
  --font-script: var(--font-alex-brush);
  --font-mono: var(--font-montserrat);
  /* Brand palette */
  --color-wine: #5b0f1a;
  --color-espresso: #3b2a24;
  --color-mocha: #6b4e42;
  --color-taupe: #b79e8c;
  --color-creme: #f7f3ee;
  --color-amber-dot: #d9a05b;
```

- [ ] **Step 2: Point the base surface at the brand palette**

In `app/globals.css`, in the `@layer base { … }` block, replace the `body` rule so the site defaults to the wine surface with crème text and the Montserrat UI face:
```css
  body {
    background-color: var(--color-wine);
    color: var(--color-creme);
    font-family: var(--font-sans);
  }
```
Leave the `* { @apply border-border outline-ring/50; }` and `html { @apply font-sans; }` rules as-is.

- [ ] **Step 3: Swap the fonts in the root layout**

Replace `app/layout.tsx` with:
```tsx
import type { Metadata } from "next";
import { Playfair_Display, Montserrat, Alex_Brush } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});
const alexBrush = Alex_Brush({
  variable: "--font-alex-brush",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Varsheni — Tech UGC Creator",
  description:
    "Honest reviews of the apps and businesses worth your tap, from tech UGC creator Varsheni.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${montserrat.variable} ${alexBrush.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Verify it compiles and renders the wine surface**

Run: `npm run build`
Expected: build succeeds (no font/module errors). Then run `npm run dev`, open `http://localhost:3000`, and confirm the page background is deep wine (`#5B0F1A`) with crème text. (This is a visual/compile check — no unit test; CSS tokens aren't meaningfully unit-testable in jsdom.)

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat(v2): brand tokens (wine/crème) + Playfair/Montserrat/Alex Brush fonts

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Hero assets (rembg cut-out + portraits)

**Files:**
- Create: `public/varsheni-2-cutout.png` (copied)
- Create: `public/varsheni-2.png`, `public/varsheni-3.png` (copied, for later sections)
- Create: `scripts/make-cutout.py` (documented, reproducible)

**Interfaces:**
- Produces: `/varsheni-2-cutout.png` — a transparent-background, edge-feathered cut-out of the hero subject, served from `public/`.

- [ ] **Step 1: Copy the finished cut-out and portraits into `public/`**

The feathered rembg cut-out already exists from the brainstorm. Copy it and the source portraits:
```bash
cp .superpowers/brainstorm/*/content/varsheni-2-cut-v3.png public/varsheni-2-cutout.png
cp ~/Downloads/varsheni-2.png public/varsheni-2.png
cp ~/Downloads/varsheni-3.png public/varsheni-3.png
```
Expected: `ls public/*.png` lists all three. If the brainstorm dir is gone, regenerate with Step 2.

- [ ] **Step 2: Save the reproducible cut-out script**

Create `scripts/make-cutout.py` (records how the cut-out was produced, for regeneration):
```python
# Requires: pip install "rembg[cpu]" pillow scipy numpy
# Usage: python scripts/make-cutout.py ~/Downloads/varsheni-2.png public/varsheni-2-cutout.png
import sys
import numpy as np
from rembg import remove, new_session
from PIL import Image, ImageFilter
from scipy import ndimage

src, dst = sys.argv[1], sys.argv[2]
img = Image.open(src).convert("RGB")
out = remove(
    img, session=new_session("u2net"),
    alpha_matting=True, alpha_matting_foreground_threshold=250,
    alpha_matting_background_threshold=15, alpha_matting_erode_size=12,
).convert("RGBA")

arr = np.asarray(out).astype(np.uint8)
a = arr[:, :, 3].astype(np.float32) / 255.0
a[a < 0.35] = 0.0
binm = ndimage.binary_erosion(a > 0.5, iterations=2)
lbl, n = ndimage.label(binm)
if n > 1:
    sizes = ndimage.sum(np.ones_like(lbl), lbl, range(1, n + 1))
    binm = lbl == (int(np.argmax(sizes)) + 1)
a = np.where(binm, a, 0.0)
a_img = Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.6))
res = Image.fromarray(arr[:, :, :3], "RGB").convert("RGBA")
res.putalpha(a_img)
bbox = res.getbbox()
if bbox:
    res = res.crop(bbox)
res.save(dst)
print("saved", dst, res.size)
```

- [ ] **Step 3: Verify the cut-out is transparent PNG**

Run:
```bash
python3 -c "from PIL import Image; im=Image.open('public/varsheni-2-cutout.png'); print(im.mode, im.size, 'has_alpha', im.mode=='RGBA')"
```
Expected: `RGBA (767, 893) has_alpha True` (size may vary slightly).

- [ ] **Step 4: Commit**

```bash
git add public/varsheni-2-cutout.png public/varsheni-2.png public/varsheni-3.png scripts/make-cutout.py
git commit -m "assets(v2): hero cut-out + portraits + cutout script

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Lenis smooth-scroll provider

**Files:**
- Create: `components/smooth-scroll.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: `<SmoothScroll>` client component that drives Lenis on a rAF loop, respects `prefers-reduced-motion`, and wraps `children`.

- [ ] **Step 1: Create the SmoothScroll provider**

Create `components/smooth-scroll.tsx`:
```tsx
"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

- [ ] **Step 2: Wrap the app in SmoothScroll**

In `app/layout.tsx`, import it and wrap `children` inside `<body>`:
```tsx
import { SmoothScroll } from "@/components/smooth-scroll";
```
Change the body to:
```tsx
      <body className="min-h-full flex flex-col">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
```

- [ ] **Step 3: Verify it compiles and does not error at runtime**

Run: `npm run build` (expected: success). Then `npm run dev`, open the page, confirm no console errors and that mouse-wheel scrolling is smoothed. (Runtime/visual check — Lenis touches `window`, so it is not unit-tested here.)

- [ ] **Step 4: Commit**

```bash
git add components/smooth-scroll.tsx app/layout.tsx
git commit -m "feat(v2): Lenis smooth-scroll provider (reduced-motion aware)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: GradualBlur effect (re-skinned, pure CSS)

**Files:**
- Create: `components/effects/gradual-blur.tsx`
- Create: `tests/gradual-blur.test.tsx`

**Interfaces:**
- Produces:
  - `buildBlurLayers(opts: { divCount: number; strength: number; exponential?: boolean }): Array<{ blurRem: number; mask: string }>` — pure function, exported for testing.
  - `<GradualBlur position?="bottom" height?="7rem" strength?={2.2} divCount?={6} hasFooter?={boolean} className?={string} />` — renders nothing when `hasFooter` is true; otherwise a fixed, `pointer-events:none` progressive-blur overlay pinned to the given edge.

- [ ] **Step 1: Write the failing test for the layer math**

Create `tests/gradual-blur.test.tsx`:
```tsx
import { render } from "@testing-library/react";
import { buildBlurLayers, GradualBlur } from "@/components/effects/gradual-blur";

test("buildBlurLayers returns one layer per divCount with increasing blur", () => {
  const layers = buildBlurLayers({ divCount: 6, strength: 2, exponential: true });
  expect(layers).toHaveLength(6);
  const blurs = layers.map((l) => l.blurRem);
  const sorted = [...blurs].sort((a, b) => a - b);
  expect(blurs).toEqual(sorted); // monotonically increasing
  expect(blurs[0]).toBeGreaterThan(0);
  layers.forEach((l) => expect(l.mask).toContain("linear-gradient"));
});

test("GradualBlur renders divCount layers by default", () => {
  const { container } = render(<GradualBlur />);
  const root = container.querySelector('[data-slot="gradual-blur"]');
  expect(root).not.toBeNull();
  expect(root!.querySelectorAll("div")).toHaveLength(6);
});

test("GradualBlur renders nothing when hasFooter is true", () => {
  const { container } = render(<GradualBlur hasFooter />);
  expect(container.querySelector('[data-slot="gradual-blur"]')).toBeNull();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- gradual-blur`
Expected: FAIL — cannot find module `@/components/effects/gradual-blur`.

- [ ] **Step 3: Implement the component**

Create `components/effects/gradual-blur.tsx`:
```tsx
import { cn } from "@/lib/utils";

type Position = "top" | "bottom" | "left" | "right";

const DIRECTION: Record<Position, string> = {
  top: "to top",
  bottom: "to bottom",
  left: "to left",
  right: "to right",
};

export function buildBlurLayers(opts: {
  divCount: number;
  strength: number;
  exponential?: boolean;
}) {
  const { divCount, strength, exponential = true } = opts;
  const increment = 100 / divCount;
  const layers: Array<{ blurRem: number; mask: string }> = [];
  for (let i = 1; i <= divCount; i++) {
    const progress = i / divCount;
    const blurRem = exponential
      ? Math.pow(2, progress * 4) * 0.0625 * strength
      : 0.0625 * (progress * divCount + 1) * strength;
    const p1 = increment * i - increment;
    const p2 = increment * i;
    const p3 = increment * i + increment;
    const p4 = increment * i + increment * 2;
    let g = `transparent ${p1}%, black ${p2}%`;
    if (p3 <= 100) g += `, black ${p3}%`;
    if (p4 <= 100) g += `, transparent ${p4}%`;
    layers.push({ blurRem: Number(blurRem.toFixed(3)), mask: g });
  }
  return layers;
}

export function GradualBlur({
  position = "bottom",
  height = "7rem",
  strength = 2.2,
  divCount = 6,
  hasFooter = false,
  className,
}: {
  position?: Position;
  height?: string;
  strength?: number;
  divCount?: number;
  hasFooter?: boolean;
  className?: string;
}) {
  if (hasFooter) return null;

  const isVertical = position === "top" || position === "bottom";
  const dir = DIRECTION[position];
  const layers = buildBlurLayers({ divCount, strength });

  return (
    <div
      data-slot="gradual-blur"
      aria-hidden
      className={cn("pointer-events-none fixed z-50", className)}
      style={{
        [position]: 0,
        left: isVertical ? 0 : undefined,
        right: isVertical ? 0 : undefined,
        top: isVertical ? undefined : 0,
        bottom: isVertical ? undefined : 0,
        height: isVertical ? height : "100%",
        width: isVertical ? "100%" : height,
        isolation: "isolate",
      }}
    >
      {layers.map((l, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            WebkitBackdropFilter: `blur(${l.blurRem}rem)`,
            backdropFilter: `blur(${l.blurRem}rem)`,
            WebkitMaskImage: `linear-gradient(${dir}, ${l.mask})`,
            maskImage: `linear-gradient(${dir}, ${l.mask})`,
          }}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- gradual-blur`
Expected: PASS — 3 passed.

- [ ] **Step 5: Commit**

```bash
git add components/effects/gradual-blur.tsx tests/gradual-blur.test.tsx
git commit -m "feat(v2): GradualBlur progressive edge blur (off at footer)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: SiteNav

**Files:**
- Create: `components/site-nav.tsx`
- Create: `tests/site-nav.test.tsx`

**Interfaces:**
- Produces: `<SiteNav />` — the hero's top bar: Playfair-italic "Varsheni" logotype (left) and Work · About · Reels links + an "Inquire ↗" pill (right). Semantic `<nav>` with accessible links.

- [ ] **Step 1: Write the failing test**

Create `tests/site-nav.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { SiteNav } from "@/components/site-nav";

test("SiteNav exposes a navigation landmark with the brand + links", () => {
  render(<SiteNav />);
  expect(screen.getByRole("navigation")).toBeInTheDocument();
  expect(screen.getByText("Varsheni")).toBeInTheDocument();
  ["Work", "About", "Reels"].forEach((label) =>
    expect(screen.getByRole("link", { name: label })).toBeInTheDocument()
  );
  expect(screen.getByRole("link", { name: /inquire/i })).toHaveAttribute("href", "#contact");
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- site-nav`
Expected: FAIL — cannot find module `@/components/site-nav`.

- [ ] **Step 3: Implement SiteNav**

Create `components/site-nav.tsx`:
```tsx
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Reels", href: "#reels" },
];

export function SiteNav({ className }: { className?: string }) {
  return (
    <nav
      className={cn(
        "relative z-40 flex items-center justify-between px-6 py-6 sm:px-12 sm:py-7",
        className
      )}
    >
      <a
        href="#top"
        className="font-display text-xl italic font-semibold text-creme"
      >
        Varsheni
      </a>
      <div className="flex items-center gap-6 sm:gap-8 text-[11px] uppercase tracking-[0.16em] text-creme/90">
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="hidden opacity-80 transition-opacity hover:opacity-100 sm:inline"
          >
            {l.label}
          </a>
        ))}
        <a
          href="#contact"
          className="rounded-full border border-taupe/40 px-4 py-2 transition-colors hover:bg-creme hover:text-espresso"
        >
          Inquire ↗
        </a>
      </div>
    </nav>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- site-nav`
Expected: PASS — 1 passed.

- [ ] **Step 5: Commit**

```bash
git add components/site-nav.tsx tests/site-nav.test.tsx
git commit -m "feat(v2): SiteNav top bar

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Hero visual system (CSS Module + NeonName + WaxSeal)

**Files:**
- Create: `components/hero/hero.module.css`
- Create: `components/hero/neon-name.tsx`
- Create: `components/hero/wax-seal.tsx`
- Create: `tests/hero-pieces.test.tsx`

**Interfaces:**
- Produces:
  - CSS module classes: `.wall`, `.wordmark`, `.backglow`, `.subject`, `.pill`, `.sideText`, `.spark`, `.tick`, `.seal`, `.sealCore` (consumed by Task 8).
  - `<NeonName>Varsheni</NeonName>` — the Alex Brush wordmark with the neon flicker-on animation + resting glow; animation off under reduced motion (handled in CSS).
  - `<WaxSeal />` — the rotating circular "· work with me · tech ugc · honest reviews ·" seal with an ↗ core; a link to `#contact` with an accessible label.

- [ ] **Step 1: Create the hero CSS module (ported from the reference mock)**

Create `components/hero/hero.module.css`. These values are ported verbatim from `docs/superpowers/specs/assets/2026-07-11-hero-reference.html`:
```css
/* ---- Velvet/suede wine wall ---- */
.wall {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(78% 64% at 50% 30%, rgba(236, 182, 152, 0.13), transparent 66%),
    radial-gradient(120% 80% at 50% 120%, rgba(30, 6, 12, 0.5), transparent 60%);
}
.wall::before {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.6;
  mix-blend-mode: soft-light;
  background-image: repeating-linear-gradient(
    94deg,
    rgba(255, 255, 255, 0.055) 0 1px,
    transparent 1px 4px
  );
}
.wall::after {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.08;
  mix-blend-mode: overlay;
  background-size: 200px 200px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
}

/* ---- Faint crème back-glow behind the subject ---- */
.backglow {
  position: absolute;
  left: 50%;
  top: 44%;
  transform: translate(-50%, -50%);
  z-index: 2;
  pointer-events: none;
  width: min(46vh, 490px);
  height: min(70vh, 690px);
  border-radius: 50%;
  filter: blur(14px);
  background: radial-gradient(
    circle,
    rgba(248, 240, 227, 0.34) 0%,
    rgba(248, 240, 227, 0.14) 44%,
    transparent 72%
  );
}

/* ---- Neon cursive wordmark ---- */
.wordmark {
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  z-index: 1;
  --glow: 0 0 26px rgba(247, 240, 227, 0.55), 0 0 60px rgba(236, 182, 152, 0.35),
    0 0 120px rgba(236, 182, 152, 0.22);
  --glow-sm: 0 0 14px rgba(247, 240, 227, 0.4);
  font-family: var(--font-script), cursive;
  font-weight: 400;
  font-size: clamp(140px, 26vw, 400px);
  line-height: 0.8;
  color: var(--color-creme);
  white-space: nowrap;
  user-select: none;
  letter-spacing: 0.01em;
  text-shadow: var(--glow);
  animation: neonOn 2.7s linear 0.3s both;
}
@keyframes neonOn {
  0% { opacity: 0.12; text-shadow: none; }
  6% { opacity: 0.12; text-shadow: none; }
  7% { opacity: 0.85; text-shadow: var(--glow-sm); }
  9% { opacity: 0.15; text-shadow: none; }
  12% { opacity: 0.9; text-shadow: var(--glow); }
  14% { opacity: 0.2; text-shadow: none; }
  16% { opacity: 1; text-shadow: var(--glow); }
  19% { opacity: 0.35; text-shadow: var(--glow-sm); }
  21% { opacity: 1; text-shadow: var(--glow); }
  26% { opacity: 0.55; text-shadow: var(--glow-sm); }
  29% { opacity: 1; text-shadow: var(--glow); }
  35% { opacity: 0.9; text-shadow: var(--glow); }
  37% { opacity: 1; text-shadow: var(--glow); }
  100% { opacity: 1; text-shadow: var(--glow); }
}

/* ---- Subject cut-out ---- */
.subject {
  position: relative;
  z-index: 3;
  height: 60vh;
  max-height: 660px;
  width: auto;
  object-fit: contain;
  object-position: bottom;
  filter: drop-shadow(0 18px 38px rgba(0, 0, 0, 0.32));
}

/* ---- Availability pill ---- */
.pill {
  position: absolute;
  left: 64px;
  bottom: 130px;
  z-index: 7;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  border: 1px solid rgba(183, 158, 140, 0.33);
  border-radius: 40px;
  padding: 10px 18px;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-creme);
}
.pillDot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-amber-dot);
  box-shadow: 0 0 0 3px rgba(217, 160, 91, 0.2);
}

/* ---- Vertical side text ---- */
.sideText {
  position: absolute;
  top: 50%;
  z-index: 6;
  writing-mode: vertical-rl;
  white-space: nowrap;
  font-size: 11px;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: var(--color-taupe);
  opacity: 0.85;
}
.sideLeft { left: 26px; transform: translateY(-50%) rotate(180deg); }
.sideRight { right: 26px; transform: translateY(-50%); }

/* ---- Sparkles + corner ticks ---- */
.spark { position: absolute; z-index: 6; color: var(--color-taupe); user-select: none; pointer-events: none; }
.tick { position: absolute; z-index: 6; width: 14px; height: 14px; border-color: rgba(183, 158, 140, 0.33); border-style: solid; border-width: 0; }
.tickTL { top: 96px; left: 48px; border-left-width: 1px; border-top-width: 1px; }
.tickTR { top: 96px; right: 48px; border-right-width: 1px; border-top-width: 1px; }

/* ---- Rotating wax-seal CTA ---- */
.seal {
  position: absolute;
  right: 64px;
  bottom: 118px;
  z-index: 7;
  width: 132px;
  height: 132px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}
.sealRing { position: absolute; inset: 0; animation: sealSpin 22s linear infinite; }
.sealRing text { fill: var(--color-taupe); font-size: 9px; letter-spacing: 3px; text-transform: uppercase; }
.sealCore {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--color-creme);
  color: var(--color-espresso);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: transform 0.3s;
}
.seal:hover .sealCore { transform: scale(1.08); }
@keyframes sealSpin { to { transform: rotate(360deg); } }

/* ---- Reduced motion ---- */
@media (prefers-reduced-motion: reduce) {
  .wordmark { animation: none; }
  .sealRing { animation: none; }
}

/* ---- Responsive ---- */
@media (max-width: 720px) {
  .subject { height: 48vh; }
  .wordmark { font-size: 24vw; }
  .pill { left: 20px; bottom: 90px; }
  .seal { right: 20px; bottom: 84px; transform: scale(0.85); }
  .sideText { display: none; }
  .tick { display: none; }
}
```

- [ ] **Step 2: Write failing tests for NeonName + WaxSeal**

Create `tests/hero-pieces.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { NeonName } from "@/components/hero/neon-name";
import { WaxSeal } from "@/components/hero/wax-seal";

test("NeonName renders the given name text", () => {
  render(<NeonName>Varsheni</NeonName>);
  expect(screen.getByText("Varsheni")).toBeInTheDocument();
});

test("WaxSeal is an accessible link to contact", () => {
  render(<WaxSeal />);
  const link = screen.getByRole("link", { name: /work with me/i });
  expect(link).toHaveAttribute("href", "#contact");
});
```

- [ ] **Step 3: Run to verify they fail**

Run: `npm test -- hero-pieces`
Expected: FAIL — cannot find the modules.

- [ ] **Step 4: Implement NeonName**

Create `components/hero/neon-name.tsx`:
```tsx
import { cn } from "@/lib/utils";
import styles from "./hero.module.css";

export function NeonName({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div aria-hidden className={cn(styles.wordmark, className)}>
      {children}
    </div>
  );
}
```

- [ ] **Step 5: Implement WaxSeal**

Create `components/hero/wax-seal.tsx`:
```tsx
import styles from "./hero.module.css";

export function WaxSeal() {
  return (
    <a href="#contact" aria-label="Work with me" className={styles.seal}>
      <svg className={styles.sealRing} viewBox="0 0 132 132" aria-hidden>
        <defs>
          <path
            id="seal-ring-path"
            d="M66,66 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0"
          />
        </defs>
        <text>
          <textPath href="#seal-ring-path" startOffset="0%">
            · WORK WITH ME · TECH UGC · HONEST REVIEWS&nbsp;
          </textPath>
        </text>
      </svg>
      <span className={styles.sealCore} aria-hidden>
        ↗
      </span>
    </a>
  );
}
```

- [ ] **Step 6: Run to verify they pass**

Run: `npm test -- hero-pieces`
Expected: PASS — 2 passed. (The `.wordmark` heading is `aria-hidden`; `getByText` still finds it since it is not removed from the DOM.)

- [ ] **Step 7: Commit**

```bash
git add components/hero/hero.module.css components/hero/neon-name.tsx components/hero/wax-seal.tsx tests/hero-pieces.test.tsx
git commit -m "feat(v2): hero visual system — velvet wall CSS, neon name, wax seal

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Hero assembly + page wiring + visual verification

**Files:**
- Create: `components/hero/subject-cutout.tsx`
- Create: `components/hero/hero.tsx`
- Modify: `app/page.tsx`
- Create: `tests/hero.test.tsx`

**Interfaces:**
- Consumes: `SiteNav`, `NeonName`, `WaxSeal`, `GradualBlur`, and `hero.module.css` classes from earlier tasks.
- Produces: `<Hero />` — the full-viewport hero section, rendered by `app/page.tsx`.

- [ ] **Step 1: Implement the subject cut-out (next/image)**

Create `components/hero/subject-cutout.tsx`:
```tsx
import Image from "next/image";
import styles from "./hero.module.css";

export function SubjectCutout() {
  return (
    <Image
      src="/varsheni-2-cutout.png"
      alt="Varsheni, tech UGC creator"
      width={767}
      height={893}
      priority
      className={styles.subject}
    />
  );
}
```

- [ ] **Step 2: Write the failing hero test**

Create `tests/hero.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/hero/hero";

test("Hero renders as a banner with the name, subject alt, and CTAs", () => {
  render(<Hero />);
  expect(screen.getByRole("banner")).toBeInTheDocument();
  expect(screen.getByText("Varsheni")).toBeInTheDocument();
  expect(screen.getByAltText(/tech ugc creator/i)).toBeInTheDocument();
  expect(screen.getByText(/available for brand deals/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /work with me/i })).toBeInTheDocument();
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `npm test -- hero.test`
Expected: FAIL — cannot find module `@/components/hero/hero`.

- [ ] **Step 4: Implement the Hero composition**

Create `components/hero/hero.tsx`:
```tsx
import { SiteNav } from "@/components/site-nav";
import { NeonName } from "./neon-name";
import { WaxSeal } from "./wax-seal";
import { SubjectCutout } from "./subject-cutout";
import styles from "./hero.module.css";

export function Hero() {
  return (
    <header id="top" role="banner" className="relative flex min-h-screen flex-col overflow-hidden">
      <div className={styles.wall} aria-hidden />
      <SiteNav />

      <div className="relative flex flex-1 items-end justify-center">
        <NeonName>Varsheni</NeonName>
        <div className={styles.backglow} aria-hidden />
        <SubjectCutout />

        <span className={`${styles.tick} ${styles.tickTL}`} aria-hidden />
        <span className={`${styles.tick} ${styles.tickTR}`} aria-hidden />
        <span className={styles.spark} style={{ top: 120, left: 150, fontSize: 22, opacity: 0.85 }} aria-hidden>✦</span>
        <span className={styles.spark} style={{ top: 250, right: 150, fontSize: 16, opacity: 0.7 }} aria-hidden>✦</span>
        <span className={styles.spark} style={{ bottom: 210, left: 340, fontSize: 13, opacity: 0.6 }} aria-hidden>✦</span>

        <div className={`${styles.sideText} ${styles.sideLeft}`} aria-hidden>
          Apps · Businesses · Honest reviews
        </div>
        <div className={`${styles.sideText} ${styles.sideRight}`} aria-hidden>
          Est. 2026 — Made in India
        </div>

        <div className={styles.pill}>
          <span className={styles.pillDot} aria-hidden />
          Available for brand deals
        </div>

        <WaxSeal />
      </div>
    </header>
  );
}
```

- [ ] **Step 5: Wire the hero into the page**

Replace `app/page.tsx` with:
```tsx
import { Hero } from "@/components/hero/hero";

export default function Page() {
  return (
    <main className="flex-1">
      <Hero />
    </main>
  );
}
```

- [ ] **Step 6: Run to verify the hero test passes**

Run: `npm test -- hero.test`
Expected: PASS — 1 passed.

- [ ] **Step 7: Run the full suite + build**

Run: `npm test` (expected: all suites pass) then `npm run build` (expected: success, no type errors).

- [ ] **Step 8: Visual verification against the reference**

Run `npm run dev`, open `http://localhost:3000`, and confirm against `docs/superpowers/specs/assets/2026-07-11-hero-reference.png`:
- Velvet wine wall with the warm sheen pool and grain.
- Giant Alex Brush "Varsheni" **flickers on** on load, then holds a warm glow, layered behind the subject.
- `varsheni-2` cut-out centered, crisp feathered edges, gently back-lit.
- "Available for brand deals" pill (amber dot) bottom-left; rotating "work with me" seal bottom-right; vertical side text on both edges; sparkles and corner ticks present.
- Toggle OS reduced-motion on and reload: the name shows lit with **no flicker**, the seal does **not** rotate.
Capture a screenshot for the record (optional) via a headless Chrome run.

- [ ] **Step 9: Commit**

```bash
git add components/hero/subject-cutout.tsx components/hero/hero.tsx app/page.tsx tests/hero.test.tsx
git commit -m "feat(v2): assemble hero section + wire into page

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage (this plan = Foundation + Hero, §3 + §5 + parts of §7–§10 of the spec):**
- Palette + type tokens → Task 2. ✓
- Fonts via `next/font` → Task 2. ✓
- rembg cut-out asset → Task 3. ✓
- Lenis smooth scroll → Task 4. ✓
- GradualBlur (off at footer) → Task 5 (component ready; mounted per-section in the sections plan). ✓
- Hero: velvet wall, neon-flicker Alex Brush name, cut-out, back-glow, wax-seal, pill, side text, sparkles, ticks, nav → Tasks 6–8. ✓
- Reduced-motion respected → Task 7 CSS + Task 8 Step 8. ✓
- Responsive hero recompose → Task 7 CSS media query. ✓
- No background WebGL → nothing added (correct). ✓
- Framer Motion is available but the hero's motion is pure CSS by design; Motion enters with the scroll reveals in the sections plan. ✓

**Not in this plan (deferred to the follow-on "sections" plan):** About, Reels gallery (embla), What I Offer, Contact (Cal.com) + Footer, page-level scroll reveals (Framer Motion), mounting `<GradualBlur />` per section with `hasFooter` on the contact/footer section, and the shadcn token re-skin used by those sections.

**Placeholder scan:** none — every step has concrete code/commands.

**Type consistency:** `buildBlurLayers`/`GradualBlur` props (Task 5) match their test (Task 5). `NeonName`/`WaxSeal` (Task 7) are consumed with matching signatures in `Hero` (Task 8). CSS-module class names referenced in Task 8 (`wall`, `backglow`, `tick`, `tickTL`, `tickTR`, `spark`, `sideText`, `sideLeft`, `sideRight`, `pill`, `pillDot`) all exist in Task 7's `hero.module.css`.

---

## Follow-on

After this plan lands, a second plan — `docs/superpowers/plans/YYYY-MM-DD-varsheni-v2-sections.md` — covers About → Reels → What I Offer → Contact + Footer, the Framer Motion scroll reveals, and per-section `<GradualBlur hasFooter={…} />` mounting.
