# Landing Sequence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the scroll-driven 3D landing sequence for Varsheni — a cherry-maroon creator's room where a phone lifts off a desk, 3D company logos erupt and organize into a constellation then flow back in, the camera pushes through the screen, and the name decodes in — bridging seamlessly into the portfolio.

**Architecture:** One continuous page. A pinned React Three Fiber canvas renders the room + phone + logos; Lenis + GSAP ScrollTrigger pin the canvas and expose a single normalized progress `p` (0..1). `p` lives in a Zustand store; every rig reads it and maps it to its own state through an independently-tunable checkpoint table. All DOM/overlay UI is built from shadcn/ui (Radix) primitives styled with Tailwind; only the R3F scene graph and the scramble-text effect are custom, and they render inside shadcn/Tailwind-styled containers.

**Tech Stack:** Next.js (App Router, TypeScript) · React Three Fiber · @react-three/drei · @react-three/postprocessing · three · Lenis · GSAP (ScrollTrigger) · Zustand · Tailwind CSS · shadcn/ui (Radix) · Vitest (unit) · puppeteer-core (scene render-verification).

---

## Global Constraints

*Every task's requirements implicitly include this section.*

- **Latest packages.** Always install the latest stable version of every package (`npm i <pkg>@latest`). Versions are never pinned in this doc; any version shown is illustrative only.
- **shadcn/ui for all DOM UI.** Every DOM element — text-overlay containers, preloader, portfolio handoff, and any button/card/progress/badge — uses shadcn/ui (Radix) primitives + Tailwind utilities. **No hand-rolled UI primitives ever.** The only custom code is (a) the R3F scene graph (no shadcn equivalent exists for WebGL) and (b) the scramble-text effect; both render *inside* shadcn/Tailwind-styled containers.
- **Single source of truth for progress.** Exactly one normalized `p` (0..1) from the Zustand store drives every rig. No rig reads scroll position directly. Each rig owns a checkpoint table and maps `p` → its state.
- **Checkpoint boundaries are centralized** in `lib/timeline.ts` (`BEAT`). Percentages are provisional (spec §5) — tuning = editing that one file. Rigs reference `BEAT.*`, never hard-coded beat numbers.
- **WebGL gotcha (critical).** `THREE.Object3D.position` / `.rotation` / `.scale` / `.quaternion` are non-writable. Always mutate (`obj.position.set(x,y,z)`, `obj.rotation.set(...)`). **Never reassign** (`mesh.position = v` or `Object.assign(mesh,{position})`) — it throws in strict-mode modules and blanks the whole scene.
- **Palette (cherry maroon)** — wire these into the shadcn theme tokens (CSS variables) and reuse everywhere:
  | Token | Hex | Use |
  |---|---|---|
  | Cherry maroon | `#7B1E2B` | Accent wall, brand, `--primary` |
  | Deep wine | `#571620` | Curtains, deep shadow, hover/pressed |
  | Wine ink | `#2A1A1C` | Darkest surfaces, text on light |
  | Taupe | `#8A7268` | Muted / secondary |
  | Antique gold | `#B08D4C` | Thin accents — window frame, molding, hairlines |
  | Dusty blush | `#E8C9C4` | Rug, soft washes |
  | Warm sand | `#EADFCF` | Floor, baseboards |
  | Warm cream | `#F4EBDD` | Side wall, ceiling, light surfaces |
  | Forest green | `#2F4A3A` | Plant, one framed piece |
- **Copy is locked and verbatim** (spec §8) — these exact strings, in this order:
  1. `Tech is loud.`
  2. `I make it make sense.`
  3. `Sixty seconds. Zero fluff.`
  4. `Varsheni — tech that actually clicks.` *(reveal — em dash U+2014)*
  5. `So here's what that looks like.` *(bridge)* → portfolio header `Recent obsessions.`
- **Logo set (representative, 15)** — YouTube, Instagram *(hero)*, Claude, OpenAI, Gemini, Figma, Notion, GitHub, Perplexity, Spotify, Stripe, Midjourney, Meta, Linear, Radix UI. Final list confirmed with creator later (spec §11).
- **Photoreal is the target; primitive mocks only prove choreography.** Fidelity + perf are validated in a step-one material/lighting test (Task 3) before full assembly. All rigs are built with primitive/mock geometry that runs today, behind an explicit asset-swap seam (`useGLTF`) for when real photoreal assets are sourced (spec §11 open item).
- **Performance budget (desktop):** 60 fps on a mid-range laptop; initial compressed payload ≤ ~10–12 MB. Mobile deferred, but architecture must allow a reduced path.

---

## Testing approach (two modes)

This build has two kinds of code and two kinds of test. Every task states which it uses.

1. **Logic modules** (`lib/*.ts` — pure functions: interpolation, scramble, geometry helpers, store selectors). **Real TDD with Vitest**: write the failing test, watch it fail, implement, watch it pass. These files import no `three` and no React, so they test in plain jsdom/node.

2. **Scene & UI modules** (R3F components, overlays). Their "test" is the **render-verification harness** (`scripts/verify-scene.mjs`, puppeteer-core driving system Chrome against the dev server). A scene task passes when, at each specified `p`:
   - **zero** `pageerror` / console-error / failed-request events, **and**
   - a **non-blank** screenshot (the human-reviewable artifact).

   Per CLAUDE.md: wait for `networkidle2` + a few seconds before sampling; the **screenshot is the real signal** (a transparent center-pixel `readPixels` is a false negative without `preserveDrawingBuffer`). The dev server exposes a debug hook `?p=<0..1>` that locks progress so any beat can be screenshotted deterministically.

---

## File structure

```
varsheni-portfolio/
├─ app/
│  ├─ layout.tsx              # root layout; fonts; imports globals.css
│  ├─ page.tsx                # composes ScrollProvider + hero + PortfolioHandoff + Preloader
│  └─ globals.css             # Tailwind layers + shadcn theme tokens (palette)
├─ components/
│  ├─ scroll/
│  │  └─ ScrollProvider.tsx   # Lenis + ScrollTrigger pin; writes p to store; ?p= lock; ?hud=
│  ├─ hero/
│  │  ├─ HeroCanvas.tsx       # pinned <Canvas> + PostFX (bloom); mounts all rigs
│  │  ├─ RoomEnvironment.tsx  # cherry-maroon room: walls/desk/props/HDRI/lighting choreography
│  │  ├─ PhoneRig.tsx         # phone: rest→lift→hero→rotate→push/breakout
│  │  ├─ ScreenContent.tsx    # app-grid → reel on the phone screen (CanvasTexture)
│  │  ├─ CameraRig.tsx        # establishing → frontal → push-through path
│  │  └─ LogoField.tsx        # 15 logos: erupt→swirl→constellation(+lines)→return→clean
│  ├─ overlay/
│  │  ├─ ScrambleLine.tsx     # reusable decode/scramble text (shadcn/Tailwind container)
│  │  ├─ HookText.tsx         # lines 1–3, chosen by p
│  │  ├─ TitleReveal.tsx      # lines 4–5 (reveal + bridge), chosen by p
│  │  └─ Preloader.tsx        # shadcn Progress gate on drei useProgress
│  ├─ portfolio/
│  │  └─ PortfolioHandoff.tsx # DOM seam into portfolio (shadcn Card stub)
│  └─ ui/                     # shadcn-generated primitives (button, progress, card, badge…)
├─ lib/
│  ├─ timeline.ts             # BEAT constants (single tunable source)
│  ├─ track.ts                # clamp01, remap, ease, Keyframe, sampleNumber, sampleTuple3
│  ├─ store.ts                # useScrollStore (Zustand): p, locked, hud + selectors
│  ├─ logos.ts                # LOGOS: LogoDef[] (id/label/color/hero)
│  ├─ logofield.ts            # chaosPositions, nodePositions, nearestEdges (pure)
│  ├─ scramble.ts             # mulberry32, scramble, scrambleText (pure)
│  └─ utils.ts                # shadcn cn() helper (generated by shadcn init)
├─ scripts/
│  └─ verify-scene.mjs        # puppeteer-core render-verification harness
├─ public/assets/             # (asset-swap target) HDRI, desk.glb, logo GLBs — Draco/KTX2
├─ tests/                     # Vitest unit tests mirror lib/
├─ tailwind.config.ts
├─ components.json            # shadcn config
├─ vitest.config.ts
└─ package.json
```

**Reference material (in-repo):** the `skills/threejs-skills/skills/` submodule has vanilla-Three explainers useful for the underlying concepts — `threejs-loaders` (Draco/KTX2, LoadingManager), `threejs-materials` (PBR), `threejs-lighting`, `threejs-postprocessing` (bloom). This build uses the **R3F equivalents** (drei `useGLTF`/`<Environment>`, `@react-three/postprocessing` `<Bloom>`), but the concepts map directly.

---

## Task 1: Project scaffold + pinned canvas + verification harness

**Files:**
- Create: `package.json`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `tailwind.config.ts`, `components.json`, `lib/utils.ts`, `vitest.config.ts`, `components/hero/HeroCanvas.tsx`, `scripts/verify-scene.mjs`
- Create: `.gitignore` (Next defaults + `/.superpowers/`)

**Interfaces:**
- Produces: a running dev server at `http://localhost:3000` rendering a full-viewport R3F `<Canvas>` with a cherry-maroon clear color; `npm run verify:scene` reporting errors + a screenshot; `npm test` running Vitest.

- [ ] **Step 1: Scaffold Next.js + TypeScript + Tailwind**

Run (accept defaults; App Router, TS, Tailwind, `@/*` alias, no `src/`):
```bash
npx create-next-app@latest . --ts --tailwind --app --eslint --import-alias "@/*" --no-src-dir --use-npm
```
Expected: project files created; `npm run dev` serves the starter page.

- [ ] **Step 2: Install runtime + dev dependencies (latest)**

```bash
npm i three @react-three/fiber @react-three/drei @react-three/postprocessing postprocessing lenis gsap zustand
npm i -D @types/three vitest @vitejs/plugin-react jsdom puppeteer-core
```

- [ ] **Step 3: Init shadcn/ui and wire the palette into theme tokens**

```bash
npx shadcn@latest init -d
npx shadcn@latest add button card progress badge separator
```
Then replace `app/globals.css` theme tokens so shadcn variables use the palette (keep Tailwind's `@import`/`@layer` lines that `init` created; only set the color variables):
```css
:root {
  --background: #F4EBDD;      /* warm cream */
  --foreground: #2A1A1C;      /* wine ink */
  --primary: #7B1E2B;         /* cherry maroon */
  --primary-foreground: #F4EBDD;
  --secondary: #8A7268;       /* taupe */
  --secondary-foreground: #F4EBDD;
  --muted: #EADFCF;           /* warm sand */
  --muted-foreground: #571620;
  --accent: #B08D4C;          /* antique gold */
  --accent-foreground: #2A1A1C;
  --border: #B08D4C;
  --ring: #7B1E2B;
}
.dark, :root { color-scheme: dark; }
```
(These map the palette onto shadcn tokens; every shadcn component now themes cherry-maroon.)

- [ ] **Step 4: Add npm scripts**

Edit `package.json` `"scripts"` to include:
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "test": "vitest run",
  "test:watch": "vitest",
  "verify:scene": "node scripts/verify-scene.mjs"
}
```

- [ ] **Step 5: Vitest config**

Create `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', globals: true, include: ['tests/**/*.test.ts'] },
  resolve: { alias: { '@': resolve(__dirname, '.') } },
});
```

- [ ] **Step 6: Minimal pinned canvas**

Create `components/hero/HeroCanvas.tsx`:
```tsx
'use client';
import { Canvas } from '@react-three/fiber';

export default function HeroCanvas() {
  return (
    <Canvas
      className="!fixed inset-0 h-screen w-screen"
      gl={{ antialias: true }}
      camera={{ position: [2.6, 1.5, 4.2], fov: 40 }}
      onCreated={({ gl }) => gl.setClearColor('#7B1E2B', 1)}
    >
      <ambientLight intensity={0.6} />
      <mesh>
        <boxGeometry args={[1, 2, 0.1]} />
        <meshStandardMaterial color="#EADFCF" />
      </mesh>
    </Canvas>
  );
}
```
Replace `app/page.tsx` with:
```tsx
import HeroCanvas from '@/components/hero/HeroCanvas';

export default function Page() {
  return (
    <main className="relative h-[200vh] w-full bg-background">
      <HeroCanvas />
    </main>
  );
}
```

- [ ] **Step 7: Verification harness**

Create `scripts/verify-scene.mjs`:
```js
import puppeteer from 'puppeteer-core';

// Usage: node scripts/verify-scene.mjs [p] [outPath] [url]
const P = process.argv[2] ?? '';
const OUT = process.argv[3] ?? `/tmp/varsheni-scene-${P || '0'}.png`;
const BASE = process.argv[4] ?? 'http://localhost:3000';
const URL = P === '' ? BASE : `${BASE}/?p=${P}`;
const CHROME = process.env.CHROME_PATH
  ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 760 });
const errors = [];
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('CONSOLE-ERR: ' + m.text()); });
page.on('requestfailed', (r) =>
  errors.push('REQFAIL: ' + r.url().slice(0, 80) + ' :: ' + (r.failure()?.errorText)));
await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 }).catch((e) => errors.push('GOTO: ' + e.message));
await new Promise((r) => setTimeout(r, 4000));
const info = await page.evaluate(() => {
  const c = document.querySelector('canvas');
  return c ? { canvas: true, w: c.width, h: c.height } : { canvas: false };
});
await page.screenshot({ path: OUT });
console.log('URL:', URL);
console.log('ERRORS:', errors.length ? '\n' + errors.join('\n') : '(none)');
console.log('CANVAS:', JSON.stringify(info));
console.log('SHOT:', OUT);
await browser.close();
if (errors.length || !info.canvas) process.exit(1);
```

- [ ] **Step 8: Verify**

In one terminal: `npm run dev`. In another:
```bash
npm run verify:scene
```
Expected: `ERRORS: (none)`, `CANVAS: {"canvas":true,...}`, a screenshot at `/tmp/varsheni-scene-0.png` showing a maroon field with a cream box. Open the screenshot to confirm.

- [ ] **Step 9: Commit**

```bash
git add -A ':!.superpowers' && git commit -m "chore: scaffold Next.js + R3F + shadcn + verify harness"
```

---

## Task 2: Timeline constants + interpolation primitive (`lib/timeline.ts`, `lib/track.ts`)

**Files:**
- Create: `lib/timeline.ts`, `lib/track.ts`, `tests/track.test.ts`

**Interfaces:**
- Produces:
  - `BEAT` — `{ establishStart, liftStart, burstStart, swirlStart, constellStart, constellPeak, holdStart, returnStart, rotateStart, pushStart, revealStart, bridgeStart, end }` (all `number` in 0..1).
  - `clamp01(x): number`, `remap(x,inA,inB,outA,outB): number`, `ease(name,t): number`.
  - `type Easing`, `interface Keyframe<T> { at:number; value:T; ease?:Easing }`, `type Tuple3 = [number,number,number]`.
  - `sampleNumber(track: Keyframe<number>[], p): number`, `sampleTuple3(track: Keyframe<Tuple3>[], p): Tuple3`.
- Convention: a keyframe's `ease` describes the segment **ending** at it (ignored on the first). Before the first `at`, returns the first value; after the last, the last value.

- [ ] **Step 1: Write the failing test**

Create `tests/track.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { clamp01, remap, ease, sampleNumber, sampleTuple3, type Keyframe, type Tuple3 } from '@/lib/track';

describe('clamp01/remap', () => {
  it('clamps', () => { expect(clamp01(-1)).toBe(0); expect(clamp01(2)).toBe(1); expect(clamp01(0.5)).toBe(0.5); });
  it('remaps and clamps to output range', () => {
    expect(remap(5, 0, 10, 0, 100)).toBe(50);
    expect(remap(-5, 0, 10, 0, 100)).toBe(0);
    expect(remap(50, 0, 10, 0, 100)).toBe(100);
  });
  it('remap with zero-width input returns outA', () => { expect(remap(3, 2, 2, 7, 9)).toBe(7); });
});

describe('ease', () => {
  it('endpoints are 0 and 1', () => {
    for (const n of ['linear','inQuad','outCubic','inOutCubic','outBack'] as const) {
      expect(ease(n, 0)).toBeCloseTo(0); expect(ease(n, 1)).toBeCloseTo(1);
    }
  });
});

describe('sampleNumber', () => {
  const t: Keyframe<number>[] = [{ at: 0, value: 0 }, { at: 0.5, value: 10, ease: 'linear' }, { at: 1, value: 20, ease: 'linear' }];
  it('clamps before/after', () => { expect(sampleNumber(t, -1)).toBe(0); expect(sampleNumber(t, 2)).toBe(20); });
  it('interpolates linearly mid-segment', () => { expect(sampleNumber(t, 0.25)).toBeCloseTo(5); expect(sampleNumber(t, 0.75)).toBeCloseTo(15); });
  it('hits exact keyframes', () => { expect(sampleNumber(t, 0.5)).toBe(10); });
});

describe('sampleTuple3', () => {
  const t: Keyframe<Tuple3>[] = [{ at: 0, value: [0,0,0] }, { at: 1, value: [10,20,30], ease: 'linear' }];
  it('interpolates each axis', () => { expect(sampleTuple3(t, 0.5)).toEqual([5,10,15]); });
  it('returns a copy, not the stored array', () => { const r = sampleTuple3(t, 0); expect(r).toEqual([0,0,0]); r[0] = 99; expect(t[0].value[0]).toBe(0); });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module '@/lib/track'`.

- [ ] **Step 3: Implement `lib/track.ts`**

```ts
export type Easing =
  | 'linear' | 'inQuad' | 'outQuad' | 'inOutQuad'
  | 'inCubic' | 'outCubic' | 'inOutCubic' | 'outBack';

export type Tuple3 = [number, number, number];

export const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);

export const remap = (x: number, inA: number, inB: number, outA: number, outB: number): number => {
  if (inA === inB) return outA;
  const t = clamp01((x - inA) / (inB - inA));
  return outA + (outB - outA) * t;
};

const EASINGS: Record<Easing, (t: number) => number> = {
  linear: (t) => t,
  inQuad: (t) => t * t,
  outQuad: (t) => 1 - (1 - t) * (1 - t),
  inOutQuad: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  inCubic: (t) => t * t * t,
  outCubic: (t) => 1 - Math.pow(1 - t, 3),
  inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  outBack: (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
};

export const ease = (name: Easing, t: number): number => EASINGS[name](clamp01(t));

export interface Keyframe<T> { at: number; value: T; ease?: Easing }

function segment(len: number, at: (i: number) => number, p: number): { i: number; t: number } | null {
  // returns index of the ending keyframe and eased-input local t, or null if clamped
  if (p <= at(0)) return null;
  if (p >= at(len - 1)) return { i: len - 1, t: 1 };
  for (let i = 1; i < len; i++) if (p <= at(i)) return { i, t: remap(p, at(i - 1), at(i), 0, 1) };
  return { i: len - 1, t: 1 };
}

export function sampleNumber(track: Keyframe<number>[], p: number): number {
  if (track.length === 0) throw new Error('sampleNumber: empty track');
  const seg = segment(track.length, (i) => track[i].at, p);
  if (seg === null) return track[0].value;
  const b = track[seg.i], a = track[seg.i - 1] ?? b;
  const t = ease(b.ease ?? 'linear', seg.t);
  return a.value + (b.value - a.value) * t;
}

export function sampleTuple3(track: Keyframe<Tuple3>[], p: number): Tuple3 {
  if (track.length === 0) throw new Error('sampleTuple3: empty track');
  const seg = segment(track.length, (i) => track[i].at, p);
  if (seg === null) return [...track[0].value];
  const b = track[seg.i], a = track[seg.i - 1] ?? b;
  const t = ease(b.ease ?? 'linear', seg.t);
  return [
    a.value[0] + (b.value[0] - a.value[0]) * t,
    a.value[1] + (b.value[1] - a.value[1]) * t,
    a.value[2] + (b.value[2] - a.value[2]) * t,
  ];
}
```

- [ ] **Step 4: Implement `lib/timeline.ts`**

```ts
// Single tunable source of truth for beat boundaries (p in [0,1]). Spec §5.
// Percentages are provisional — tune HERE; every rig references these.
export const BEAT = {
  establishStart: 0.0,
  liftStart:      0.1,
  burstStart:     0.22,
  swirlStart:     0.3,
  constellStart:  0.4,
  constellPeak:   0.45,
  holdStart:      0.5,
  returnStart:    0.58,
  rotateStart:    0.64,
  pushStart:      0.74,
  revealStart:    0.88,
  bridgeStart:    0.95,
  end:            1.0,
} as const;
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test`
Expected: PASS (all `track` tests green).

- [ ] **Step 6: Commit**

```bash
git add lib/timeline.ts lib/track.ts tests/track.test.ts && git commit -m "feat: timeline constants + checkpoint interpolation primitive"
```

---

## Task 3: Photoreal material/lighting validation — the step-one GATE

**Files:**
- Create: `app/spike/page.tsx` (temporary validation route), `components/hero/SpikeScene.tsx`
- Assets (sourced for this test): `public/assets/hdri/room.hdr`, `public/assets/desk.glb` (Draco-compressed)

**Interfaces:**
- Produces: a go/no-go decision on photoreal fidelity + payload/fps budget **before** any full assembly. Nothing downstream imports this; it de-risks the highest risk (spec §10.1).

> **This task is a gate, not a feature.** Its deliverable is a beauty-shot render at the fidelity bar *plus measured numbers*. If it cannot hit the budget, STOP and revisit scope with the user before continuing.

- [ ] **Step 1: Obtain one real desk asset + HDRI**

Acquire a single photoreal desk GLTF and a warm interior `.hdr` (e.g. from Poly Haven — CC0). Run the desk through Draco compression (`npx gltf-transform draco desk-raw.glb public/assets/desk.glb`). Place the `.hdr` at `public/assets/hdri/room.hdr`. *(These two files are the only assets this task needs; full asset production is deferred — spec §11.)*

- [ ] **Step 2: Build the validation scene**

Create `components/hero/SpikeScene.tsx`:
```tsx
'use client';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, useGLTF, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { ACESFilmicToneMapping } from 'three';

function Desk() {
  const { scene } = useGLTF('/assets/desk.glb');
  return <primitive object={scene} />;
}

export default function SpikeScene() {
  return (
    <Canvas
      className="!fixed inset-0 h-screen w-screen"
      shadows
      gl={{ antialias: true, toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      camera={{ position: [2.4, 1.4, 3.2], fov: 40 }}
    >
      <color attach="background" args={['#2A1A1C']} />
      <Environment files="/assets/hdri/room.hdr" background={false} />
      <directionalLight castShadow position={[4, 6, 3]} intensity={2.2} color="#F4EBDD"
        shadow-mapSize={[2048, 2048]} shadow-bias={-0.0002} />
      <Desk />
      <ContactShadows position={[0, 0.01, 0]} opacity={0.5} blur={2.4} far={4} />
      <OrbitControls makeDefault target={[0, 0.6, 0]} />
      <EffectComposer>
        <Bloom intensity={0.6} luminanceThreshold={0.85} luminanceSmoothing={0.2} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
useGLTF.preload('/assets/desk.glb');
```
Create `app/spike/page.tsx`:
```tsx
import SpikeScene from '@/components/hero/SpikeScene';
export default function SpikePage() { return <main className="h-screen w-full"><SpikeScene /></main>;
}
```

- [ ] **Step 3: Verify it renders clean**

With `npm run dev` running:
```bash
npm run verify:scene "" /tmp/spike.png http://localhost:3000/spike
```
Expected: `ERRORS: (none)`; open `/tmp/spike.png` — the desk should read as a lit, PBR, HDRI-lit object with soft contact shadow and gentle bloom. This is the **fidelity bar** for the room.

- [ ] **Step 4: Measure the budget**

- **Payload:** `npm run build` then note the route's first-load JS + the transferred asset bytes (desk.glb + room.hdr). Record total compressed bytes.
- **FPS:** open `/spike` in Chrome, open DevTools Rendering → FPS meter, orbit for 10s, record steady-state fps on the target-class machine.

- [ ] **Step 5: Gate decision (record in the commit body)**

- PASS if fidelity looks photoreal-credible AND assets ≤ ~10–12 MB compressed AND ≥ 60 fps. → proceed.
- FAIL → STOP. Report numbers to the user; options are lighter assets, baked lighting, or reduced scope. Do not continue assembly until resolved.

- [ ] **Step 6: Commit**

```bash
git add app/spike components/hero/SpikeScene.tsx public/assets && \
git commit -m "spike: photoreal desk+HDRI validation [PASS: <MB>MB, <fps>fps]"
```

---

## Task 4: ScrollProvider — Lenis + ScrollTrigger pin, writes `p` (`lib/store.ts`, `components/scroll/ScrollProvider.tsx`)

**Files:**
- Create: `lib/store.ts`, `tests/store.test.ts`, `components/scroll/ScrollProvider.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `BEAT` (Task 2).
- Produces:
  - `useScrollStore` (Zustand) with state `{ p:number; locked:boolean; hud:boolean }` and actions `setP(p)`, `setLocked(b)`, `setHud(b)`.
  - `getP(): number` — non-reactive read for `useFrame` loops (`useScrollStore.getState().p`).
  - `activeIndex(p, boundaries: number[]): number` — pure selector: index of the last boundary ≤ p, or −1 before the first. Used by overlays to re-render only on line changes.
  - `<ScrollProvider>` — sets up Lenis + GSAP ScrollTrigger, pins its child for `HERO_SCROLL_VH` of scroll, writes `self.progress` → `setP`. Honors `?p=<0..1>` (locks p, disables scroll writes) and `?hud=1` (enables a debug badge).

- [ ] **Step 1: Write the failing test (pure selector)**

Create `tests/store.test.ts`:
```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module '@/lib/store'`.

- [ ] **Step 3: Implement `lib/store.ts`**

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Implement `components/scroll/ScrollProvider.tsx`**

```tsx
'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';

const HERO_SCROLL_VH = 800; // hero pinned for 8 viewport-heights of scroll (tune)

export default function ScrollProvider({ children }: { children: ReactNode }) {
  const pinRef = useRef<HTMLDivElement>(null);
  const setP = useScrollStore((s) => s.setP);
  const setLocked = useScrollStore((s) => s.setLocked);
  const setHud = useScrollStore((s) => s.setHud);
  const hud = useScrollStore((s) => s.hud);
  const p = useScrollStore((s) => Math.round(s.p * 1000) / 1000);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setHud(params.get('hud') === '1');
    const forced = params.get('p');
    if (forced !== null) {
      const v = Math.min(1, Math.max(0, parseFloat(forced)));
      useScrollStore.getState().setP(v);   // set before lock
      setLocked(true);
      return;                              // debug: no scroll rig
    }

    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const st = ScrollTrigger.create({
      trigger: pinRef.current!,
      start: 'top top',
      end: `+=${HERO_SCROLL_VH}%`,
      pin: true,
      scrub: true,
      onUpdate: (self) => setP(self.progress),
    });

    return () => { st.kill(); gsap.ticker.remove(ticker); lenis.destroy(); };
  }, [setP, setLocked, setHud]);

  return (
    <>
      <div ref={pinRef}>{children}</div>
      {hud && (
        <Badge className="fixed left-3 top-3 z-50 font-mono" variant="secondary">
          p = {p.toFixed(3)}
        </Badge>
      )}
    </>
  );
}
```

- [ ] **Step 6: Wire into the page**

Replace `app/page.tsx`:
```tsx
import ScrollProvider from '@/components/scroll/ScrollProvider';
import HeroCanvas from '@/components/hero/HeroCanvas';

export default function Page() {
  return (
    <main className="relative w-full bg-background">
      <ScrollProvider>
        <section className="h-screen w-full">
          <HeroCanvas />
        </section>
      </ScrollProvider>
      <section className="h-screen w-full" />{/* below-hero spacer; PortfolioHandoff replaces later */}
    </main>
  );
}
```

- [ ] **Step 7: Verify (scroll + lock both work)**

With dev running:
```bash
npm run verify:scene 0.5 /tmp/p50.png        # forced p=0.5, locked
```
Expected: `ERRORS: (none)`, canvas present. Then open `http://localhost:3000/?hud=1` in a browser and scroll — the badge `p` should sweep 0→1 as the hero stays pinned, then the page continues to the spacer.

- [ ] **Step 8: Commit**

```bash
git add lib/store.ts tests/store.test.ts components/scroll/ScrollProvider.tsx app/page.tsx && \
git commit -m "feat: ScrollProvider (Lenis+ScrollTrigger) writing normalized p + debug lock/hud"
```

---

## Task 5: RoomEnvironment — p-driven cherry-maroon room

**Files:**
- Create: `components/hero/RoomEnvironment.tsx`
- Modify: `components/hero/HeroCanvas.tsx`

**Interfaces:**
- Consumes: `getP` (Task 4), `sampleNumber`/`sampleTuple3` + `Keyframe` (Task 2), `BEAT` (Task 2), the validated material/lighting approach (Task 3).
- Produces: `<RoomEnvironment />` — the persistent room (walls, floor, desk, props, HDRI) plus lighting choreography driven by `p` (golden daylight → glow peak at constellation → spotlight narrows at return). Renders as mock primitives now; desk swaps to `useGLTF('/assets/desk.glb')` (validated in Task 3) behind a clear seam.

> Mock geometry proves choreography (Global Constraints). The room's walls/floor/props are primitive boxes/planes in palette colors; the desk uses the real Task-3 asset. Swapping remaining props to photoreal GLTFs is the deferred asset step (spec §11).

- [ ] **Step 1: Implement `components/hero/RoomEnvironment.tsx`**

```tsx
'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, useGLTF } from '@react-three/drei';
import type { DirectionalLight, SpotLight, Group } from 'three';
import { getP } from '@/lib/store';
import { BEAT } from '@/lib/timeline';
import { sampleNumber, type Keyframe } from '@/lib/track';

// Warm key light dims slightly as logos take over, warm glow peaks at constellation.
const SUN_INTENSITY: Keyframe<number>[] = [
  { at: BEAT.establishStart, value: 2.4 },
  { at: BEAT.burstStart,     value: 1.9, ease: 'inOutCubic' },
  { at: BEAT.constellPeak,   value: 2.2, ease: 'inOutCubic' },
  { at: BEAT.returnStart,    value: 1.7, ease: 'inOutCubic' },
  { at: BEAT.pushStart,      value: 1.2, ease: 'inOutCubic' },
];
// A spotlight narrows onto the phone during Return.
const SPOT_INTENSITY: Keyframe<number>[] = [
  { at: BEAT.holdStart,   value: 0 },
  { at: BEAT.returnStart, value: 2.5, ease: 'outCubic' },
  { at: BEAT.rotateStart, value: 1.0, ease: 'inQuad' },
];

function Desk() {
  const { scene } = useGLTF('/assets/desk.glb');
  return <primitive object={scene} position={[0.35, 0, 0.3]} />;
}

export default function RoomEnvironment() {
  const sun = useRef<DirectionalLight>(null);
  const spot = useRef<SpotLight>(null);
  const props = useRef<Group>(null);

  useFrame(() => {
    const p = getP();
    if (sun.current) sun.current.intensity = sampleNumber(SUN_INTENSITY, p);
    if (spot.current) spot.current.intensity = sampleNumber(SPOT_INTENSITY, p);
  });

  return (
    <group ref={props}>
      <Environment files="/assets/hdri/room.hdr" background={false} />
      {/* Key sun through the gold-framed window */}
      <directionalLight ref={sun} castShadow position={[4, 6, 3]} color="#F4EBDD"
        shadow-mapSize={[2048, 2048]} shadow-bias={-0.0002} />
      {/* Return-beat spotlight onto the phone hero position */}
      <spotLight ref={spot} position={[0, 3.5, 1.6]} angle={0.5} penumbra={0.8}
        color="#F4EBDD" target-position={[0, 0.95, 1.15]} />
      <ambientLight intensity={0.25} color="#7B1E2B" />

      {/* Room shell (mock primitives, palette colors) */}
      <mesh position={[0, 1.4, -2]} receiveShadow>
        <planeGeometry args={[8, 4]} /><meshStandardMaterial color="#7B1E2B" />
      </mesh>{/* maroon accent back wall */}
      <mesh position={[-4, 1.4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 4]} /><meshStandardMaterial color="#F4EBDD" />
      </mesh>{/* warm-cream side wall */}
      <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} /><meshStandardMaterial color="#EADFCF" />
      </mesh>{/* warm-sand floor */}
      <mesh position={[0.2, -0.58, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3, 2]} /><meshStandardMaterial color="#E8C9C4" />
      </mesh>{/* blush rug */}

      <Desk />

      {/* Mock props (swap to GLTFs later): plant, mug, lamp, books */}
      <mesh position={[-0.9, 0.15, 0.4]} castShadow><cylinderGeometry args={[0.12, 0.16, 0.3, 12]} /><meshStandardMaterial color="#2F4A3A" /></mesh>
      <mesh position={[0.9, 0.08, 0.5]} castShadow><boxGeometry args={[0.5, 0.16, 0.35]} /><meshStandardMaterial color="#571620" /></mesh>
    </group>
  );
}
useGLTF.preload('/assets/desk.glb');
```

- [ ] **Step 2: Mount it, remove the placeholder box**

Edit `components/hero/HeroCanvas.tsx` — replace the `<ambientLight/>` + `<mesh>` placeholder with `<RoomEnvironment />`, add `shadows` and ACES tone mapping to the `<Canvas>`:
```tsx
'use client';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping } from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import RoomEnvironment from '@/components/hero/RoomEnvironment';

export default function HeroCanvas() {
  return (
    <Canvas
      className="!fixed inset-0 h-screen w-screen"
      shadows
      gl={{ antialias: true, toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      camera={{ position: [2.6, 1.5, 4.2], fov: 40 }}
    >
      <color attach="background" args={['#2A1A1C']} />
      <RoomEnvironment />
      {/* EffectComposer must remain the LAST child; later rigs (Camera/Phone/Logo) mount ABOVE it. */}
      <EffectComposer>
        <Bloom intensity={0.5} luminanceThreshold={0.9} luminanceSmoothing={0.2} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
```

- [ ] **Step 3: Verify at three beats**

```bash
npm run verify:scene 0.0  /tmp/room-est.png
npm run verify:scene 0.45 /tmp/room-const.png
npm run verify:scene 0.6  /tmp/room-return.png
```
Expected: all `ERRORS: (none)`. Open the three shots — establishing is warm/golden; at 0.6 the spotlight visibly concentrates toward the phone position. The room reads as the persistent maroon set in all three.

- [ ] **Step 4: Commit**

```bash
git add components/hero/RoomEnvironment.tsx components/hero/HeroCanvas.tsx && \
git commit -m "feat: RoomEnvironment — persistent cherry-maroon room with p-driven lighting"
```

---

## Task 6: PhoneRig — rest → lift → hero → rotate → push

**Files:**
- Create: `components/hero/PhoneRig.tsx`, `lib/phone.ts`, `tests/phone.test.ts`
- Modify: `components/hero/HeroCanvas.tsx`

**Interfaces:**
- Consumes: `getP`, `sampleNumber`/`sampleTuple3`, `BEAT`.
- Produces:
  - `lib/phone.ts` exporting `PHONE_HERO_POS: Tuple3` (the lifted hero position, imported by LogoField so logos emit/return to the same point) and the checkpoint tables `PHONE_POS`, `PHONE_ROT`, `SCREEN_BREAKOUT`.
  - `<PhoneRig>` — a group with a mock phone body + screen plane whose position/rotation follow the tables; exposes nothing else. The screen plane is named via `userData.role = 'screen'` so ScreenContent (Task 8) can find/attach to it — but PhoneRig renders its own child `<ScreenContent slot />` in Task 8.

- [ ] **Step 1: Write the failing test (table endpoints)**

Create `tests/phone.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { PHONE_POS, PHONE_ROT, PHONE_HERO_POS } from '@/lib/phone';
import { sampleTuple3 } from '@/lib/track';
import { BEAT } from '@/lib/timeline';

describe('phone tables', () => {
  it('rests on the desk at establish', () => {
    const pos = sampleTuple3(PHONE_POS, BEAT.establishStart);
    expect(pos[1]).toBeLessThan(0.2); // low, on desk
  });
  it('reaches hero position by burst and it matches PHONE_HERO_POS', () => {
    const pos = sampleTuple3(PHONE_POS, BEAT.burstStart);
    expect(pos).toEqual(PHONE_HERO_POS);
  });
  it('rotates to landscape (~ -PI/2 z) by push', () => {
    const rot = sampleTuple3(PHONE_ROT, BEAT.pushStart);
    expect(rot[2]).toBeCloseTo(-Math.PI / 2, 2);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module '@/lib/phone'`.

- [ ] **Step 3: Implement `lib/phone.ts`**

```ts
import type { Keyframe, Tuple3 } from '@/lib/track';
import { BEAT } from '@/lib/timeline';

export const PHONE_HERO_POS: Tuple3 = [0, 0.95, 1.15];

export const PHONE_POS: Keyframe<Tuple3>[] = [
  { at: BEAT.establishStart, value: [0.35, 0.06, 0.55] },              // on the desk stand
  { at: BEAT.liftStart,      value: [0.35, 0.06, 0.55] },
  { at: BEAT.burstStart,     value: PHONE_HERO_POS, ease: 'outCubic' },// lifted hero
  { at: BEAT.returnStart,    value: PHONE_HERO_POS },                  // holds hero
  { at: BEAT.rotateStart,    value: PHONE_HERO_POS },
  { at: BEAT.pushStart,      value: [0, 0.95, 1.2], ease: 'inOutCubic' },
  { at: BEAT.revealStart,    value: [0, 0.95, 1.25] },
];

export const PHONE_ROT: Keyframe<Tuple3>[] = [
  { at: BEAT.establishStart, value: [-0.35, 0.5, 0] },                 // propped, angled
  { at: BEAT.liftStart,      value: [-0.35, 0.5, 0] },
  { at: BEAT.burstStart,     value: [0, 0, 0], ease: 'outCubic' },     // squares to camera
  { at: BEAT.rotateStart,    value: [0, 0, 0] },
  { at: BEAT.pushStart,      value: [0, 0, -Math.PI / 2], ease: 'inOutCubic' }, // landscape
  { at: BEAT.revealStart,    value: [0, 0, -Math.PI / 2] },
];

// Screen "breakout" — content scales slightly past the frame during push (spec §7).
export const SCREEN_BREAKOUT: Keyframe<number>[] = [
  { at: BEAT.pushStart,   value: 1.0 },
  { at: BEAT.revealStart, value: 1.1, ease: 'inOutCubic' },
];
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Implement `components/hero/PhoneRig.tsx`**

```tsx
'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import type { Group } from 'three';
import { getP } from '@/lib/store';
import { sampleTuple3 } from '@/lib/track';
import { PHONE_POS, PHONE_ROT } from '@/lib/phone';

export default function PhoneRig() {
  const g = useRef<Group>(null);
  useFrame(() => {
    if (!g.current) return;
    const p = getP();
    const pos = sampleTuple3(PHONE_POS, p);
    const rot = sampleTuple3(PHONE_ROT, p);
    g.current.position.set(pos[0], pos[1], pos[2]); // mutate — never reassign (Global Constraints)
    g.current.rotation.set(rot[0], rot[1], rot[2]);
  });

  return (
    <group ref={g}>
      {/* Body (mock; swap to photoreal iPhone GLTF later) */}
      <RoundedBox args={[0.62, 1.28, 0.07]} radius={0.06} smoothness={6} castShadow>
        <meshStandardMaterial color="#2A1A1C" metalness={0.8} roughness={0.35} />
      </RoundedBox>
      {/* Screen plane — ScreenContent (Task 8) will render into this slot */}
      <mesh position={[0, 0, 0.038]} userData={{ role: 'screen' }}>
        <planeGeometry args={[0.5, 1.08]} />
        <meshStandardMaterial color="#0A0A0A" emissive="#111" />
      </mesh>
    </group>
  );
}
```

- [ ] **Step 6: Mount in HeroCanvas**

Edit `components/hero/HeroCanvas.tsx` — insert `<PhoneRig />` directly **above** the `<EffectComposer>` block (after `<RoomEnvironment />`), and import it.

- [ ] **Step 7: Verify at four beats**

```bash
npm run verify:scene 0.0  /tmp/phone-rest.png
npm run verify:scene 0.25 /tmp/phone-hero.png
npm run verify:scene 0.7  /tmp/phone-square.png
npm run verify:scene 0.82 /tmp/phone-landscape.png
```
Expected: all `ERRORS: (none)`. Screenshots: phone low on the desk at 0.0; lifted and centered at 0.25; still upright at 0.7; rotated to landscape by 0.82.

- [ ] **Step 8: Commit**

```bash
git add components/hero/PhoneRig.tsx lib/phone.ts tests/phone.test.ts components/hero/HeroCanvas.tsx && \
git commit -m "feat: PhoneRig — rest→lift→hero→rotate driven by p"
```

---

## Task 7: CameraRig — establishing → frontal → push-through

**Files:**
- Create: `components/hero/CameraRig.tsx`, `lib/camera.ts`, `tests/camera.test.ts`
- Modify: `components/hero/HeroCanvas.tsx`

**Interfaces:**
- Consumes: `getP`, `sampleTuple3`, `BEAT`, `PHONE_HERO_POS` (Task 6).
- Produces: `lib/camera.ts` (`CAM_POS`, `CAM_LOOK` tables) and `<CameraRig>` — drives the default camera's position + lookAt each frame, with a small time-based idle drift during the hold beat. Because it controls the camera, `HeroCanvas` must NOT also set a static camera; CameraRig owns it via `useThree`.

- [ ] **Step 1: Write the failing test**

Create `tests/camera.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { CAM_POS, CAM_LOOK } from '@/lib/camera';
import { sampleTuple3 } from '@/lib/track';
import { BEAT } from '@/lib/timeline';

describe('camera tables', () => {
  it('starts as a 3/4 establishing shot (off-axis, pulled back)', () => {
    const pos = sampleTuple3(CAM_POS, BEAT.establishStart);
    expect(pos[0]).toBeGreaterThan(1.5); // off to the side
    expect(pos[2]).toBeGreaterThan(3.5); // pulled back
  });
  it('dives toward/through the screen by the end (small +z, look into -z)', () => {
    const pos = sampleTuple3(CAM_POS, BEAT.end);
    const look = sampleTuple3(CAM_LOOK, BEAT.end);
    expect(pos[2]).toBeLessThan(0.5);
    expect(look[2]).toBeLessThan(0);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module '@/lib/camera'`.

- [ ] **Step 3: Implement `lib/camera.ts`**

```ts
import type { Keyframe, Tuple3 } from '@/lib/track';
import { BEAT } from '@/lib/timeline';

export const CAM_POS: Keyframe<Tuple3>[] = [
  { at: BEAT.establishStart, value: [2.6, 1.5, 4.2] },                 // 3/4 establishing
  { at: BEAT.liftStart,      value: [1.6, 1.3, 4.0], ease: 'inOutCubic' },
  { at: BEAT.burstStart,     value: [0, 1.1, 3.6], ease: 'inOutCubic' },// frontal
  { at: BEAT.holdStart,      value: [0, 1.0, 3.4] },
  { at: BEAT.returnStart,    value: [0, 0.98, 3.2], ease: 'inOutCubic' },
  { at: BEAT.rotateStart,    value: [0, 0.95, 2.6], ease: 'inOutCubic' },
  { at: BEAT.pushStart,      value: [0, 0.95, 1.9], ease: 'inCubic' },
  { at: BEAT.revealStart,    value: [0, 0.95, 0.9], ease: 'inCubic' }, // approaching the glass
  { at: BEAT.end,            value: [0, 0.95, 0.2] },                  // through it
];

export const CAM_LOOK: Keyframe<Tuple3>[] = [
  { at: BEAT.establishStart, value: [0.2, 0.6, 0.2] },                 // desk/phone at rest
  { at: BEAT.burstStart,     value: [0, 0.95, 1.15], ease: 'inOutCubic' }, // phone hero
  { at: BEAT.returnStart,    value: [0, 0.95, 1.15] },
  { at: BEAT.pushStart,      value: [0, 0.95, 0.5], ease: 'inOutCubic' },
  { at: BEAT.end,            value: [0, 0.95, -1.0] },                 // into the screen
];
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Implement `components/hero/CameraRig.tsx`**

```tsx
'use client';
import { useFrame, useThree } from '@react-three/fiber';
import { getP } from '@/lib/store';
import { sampleTuple3 } from '@/lib/track';
import { BEAT } from '@/lib/timeline';
import { CAM_POS, CAM_LOOK } from '@/lib/camera';

export default function CameraRig() {
  const camera = useThree((s) => s.camera);
  useFrame((state) => {
    const p = getP();
    const pos = sampleTuple3(CAM_POS, p);
    const look = sampleTuple3(CAM_LOOK, p);
    // gentle idle drift only during the hold beat
    const hold = p >= BEAT.holdStart && p < BEAT.returnStart ? 1 : 0;
    const t = state.clock.elapsedTime;
    camera.position.set(pos[0] + Math.sin(t * 0.4) * 0.03 * hold, pos[1], pos[2]);
    camera.lookAt(look[0], look[1], look[2]);
  });
  return null;
}
```

- [ ] **Step 6: Mount + stop HeroCanvas from pinning a static camera**

Edit `components/hero/HeroCanvas.tsx` — keep the `camera` prop (initial frame) but add `<CameraRig />` as the first child (before `<EffectComposer>`) so it takes over each frame. (No other change; CameraRig mutates the same default camera.)

- [ ] **Step 7: Verify the arc**

```bash
npm run verify:scene 0.0  /tmp/cam-est.png
npm run verify:scene 0.25 /tmp/cam-frontal.png
npm run verify:scene 0.82 /tmp/cam-push.png
npm run verify:scene 0.98 /tmp/cam-through.png
```
Expected: all `ERRORS: (none)`. Screenshots show a 3/4 room shot → squared frontal on the phone → the phone filling more of the frame → the camera essentially at/through the screen by 0.98.

- [ ] **Step 8: Commit**

```bash
git add components/hero/CameraRig.tsx lib/camera.ts tests/camera.test.ts components/hero/HeroCanvas.tsx && \
git commit -m "feat: CameraRig — establishing→frontal→push-through path"
```

---

## Task 8: ScreenContent — app-grid → reel on the phone screen

**Files:**
- Create: `components/hero/ScreenContent.tsx`
- Modify: `components/hero/PhoneRig.tsx`

**Interfaces:**
- Consumes: `getP`, `sampleNumber`, `BEAT`, `SCREEN_BREAKOUT` (Task 6). *(The mock app-grid uses a small local color palette — the real home-screen is an asset-swap — so this task has no dependency on `lib/logos.ts`.)*
- Produces: `<ScreenContent />` — a plane textured with a `CanvasTexture`: a home-screen app grid at rest that cross-fades to a short-form "reel" frame near push; scales by `SCREEN_BREAKOUT` during push. Rendered as a child of PhoneRig's group so it inherits the phone transform.

- [ ] **Step 1: Implement `components/hero/ScreenContent.tsx`**

```tsx
'use client';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CanvasTexture, type Mesh, type MeshBasicMaterial } from 'three';
import { getP } from '@/lib/store';
import { sampleNumber } from '@/lib/track';
import { BEAT } from '@/lib/timeline';
import { SCREEN_BREAKOUT } from '@/lib/phone';

// Mock app-grid palette (the real home screen is an asset-swap; this only needs to read as an app grid).
const GRID_COLORS = ['#FF0033', '#E4405F', '#D97757', '#10A37F', '#4285F4', '#F24E1E', '#111111', '#8A7268', '#20808D', '#1DB954', '#635BFF', '#1B1B2E', '#0467DF', '#5E6AD2', '#6E56CF', '#B08D4C'];

function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#0B0B10'; ctx.fillRect(0, 0, w, h);
  const cols = 4, size = w / (cols + 1), gap = size / (cols + 1);
  GRID_COLORS.forEach((color, i) => {
    const c = i % cols, r = Math.floor(i / cols);
    const x = gap + c * (size + gap), y = gap * 3 + r * (size + gap);
    ctx.fillStyle = color;
    ctx.beginPath();
    (ctx as CanvasRenderingContext2D & { roundRect: (x:number,y:number,w:number,h:number,r:number)=>void })
      .roundRect(x, y, size, size, size * 0.24);
    ctx.fill();
  });
}
function drawReel(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#7B1E2B'; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#F4EBDD'; ctx.font = `${w * 0.09}px sans-serif`; ctx.textAlign = 'center';
  ctx.fillText('60s reviews', w / 2, h * 0.5);
}

export default function ScreenContent() {
  const mesh = useRef<Mesh>(null);
  const gridTex = useMemo(() => makeTex(drawGrid), []);
  const reelTex = useMemo(() => makeTex(drawReel), []);

  useFrame(() => {
    const p = getP();
    const m = mesh.current?.material as MeshBasicMaterial | undefined;
    if (m) { m.map = p >= BEAT.rotateStart ? reelTex : gridTex; m.needsUpdate = true; }
    const s = sampleNumber(SCREEN_BREAKOUT, p);
    mesh.current?.scale.set(s, s, 1);
  });

  return (
    <mesh ref={mesh} position={[0, 0, 0.04]}>
      <planeGeometry args={[0.5, 1.08]} />
      <meshBasicMaterial map={gridTex} toneMapped={false} />
    </mesh>
  );
}

function makeTex(draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void): CanvasTexture {
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 1104;
  const ctx = cv.getContext('2d')!; draw(ctx, cv.width, cv.height);
  return new CanvasTexture(cv);
}
```

- [ ] **Step 2: Render it inside PhoneRig, remove the plain screen plane**

Edit `components/hero/PhoneRig.tsx` — replace the `<mesh userData={{role:'screen'}}>…</mesh>` block with `<ScreenContent />` (import it). It inherits the phone group's transform.

- [ ] **Step 3: Verify at rest and reel**

```bash
npm run verify:scene 0.25 /tmp/screen-grid.png
npm run verify:scene 0.82 /tmp/screen-reel.png
```
Expected: `ERRORS: (none)`. At 0.25 the phone shows a colored app grid; at 0.82 (landscape) the screen shows the maroon "reel" frame, slightly enlarged.

- [ ] **Step 4: Commit**

```bash
git add components/hero/ScreenContent.tsx components/hero/PhoneRig.tsx && \
git commit -m "feat: ScreenContent — app-grid→reel CanvasTexture with breakout scale"
```

---

## Task 9: LogoField — erupt → swirl → constellation (+lines) → return → clean

**Files:**
- Create: `lib/logos.ts`, `lib/logofield.ts`, `tests/logofield.test.ts`, `components/hero/LogoField.tsx`
- Modify: `components/hero/HeroCanvas.tsx`

**Interfaces:**
- Consumes: `getP`, `BEAT`, `remap`/`clamp01`/`ease`, `PHONE_HERO_POS` (Task 6).
- Produces:
  - `lib/logos.ts`: `interface LogoDef { id:string; label:string; color:string; hero:boolean }` and `LOGOS: LogoDef[]` (the 15, heroes first).
  - `lib/logofield.ts` (pure, tested): `mulberry32(seed)`, `chaosPositions(count, radius, seed): Tuple3[]`, `nodePositions(count, radius): Tuple3[]` (Fibonacci disk; index 0 nearest center → heroes central), `nearestEdges(nodes, k): [number,number][]` (deduped nearest-neighbor pairs).
  - `<LogoField>` — 15 meshes emitting from `PHONE_HERO_POS`, mapped per-`p` through the 7 checkpoints, plus a `<lineSegments>` constellation whose vertices follow the nodes and whose opacity fades in at Constellation / out at Return.

- [ ] **Step 1: Write the failing test**

Create `tests/logofield.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { mulberry32, chaosPositions, nodePositions, nearestEdges } from '@/lib/logofield';

describe('mulberry32', () => {
  it('is deterministic for a seed', () => {
    const a = mulberry32(42), b = mulberry32(42);
    expect(a()).toBe(b()); expect(a()).toBe(b());
  });
});
describe('nodePositions', () => {
  it('returns `count` points within the radius, hero (index 0) nearest center', () => {
    const n = nodePositions(15, 1.6);
    expect(n).toHaveLength(15);
    const r0 = Math.hypot(n[0][0], n[0][1]);
    const rLast = Math.hypot(n[14][0], n[14][1]);
    expect(r0).toBeLessThan(rLast);
    for (const [x, y] of n) expect(Math.hypot(x, y)).toBeLessThanOrEqual(1.6001);
  });
});
describe('chaosPositions', () => {
  it('is deterministic and returns `count` scattered points', () => {
    const a = chaosPositions(15, 2, 7), b = chaosPositions(15, 2, 7);
    expect(a).toEqual(b); expect(a).toHaveLength(15);
  });
});
describe('nearestEdges', () => {
  it('connects each node and dedupes pairs (i<j)', () => {
    const nodes = nodePositions(6, 1.6);
    const edges = nearestEdges(nodes, 2);
    for (const [i, j] of edges) expect(i).toBeLessThan(j);
    const keys = new Set(edges.map(([i, j]) => `${i}-${j}`));
    expect(keys.size).toBe(edges.length); // no duplicates
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module '@/lib/logofield'`.

- [ ] **Step 3: Implement `lib/logos.ts`**

```ts
export interface LogoDef { id: string; label: string; color: string; hero: boolean }

// Heroes first so they land nearest the constellation center (spec §6).
export const LOGOS: LogoDef[] = [
  { id: 'youtube',    label: 'YouTube',    color: '#FF0033', hero: true },
  { id: 'instagram',  label: 'Instagram',  color: '#E4405F', hero: true },
  { id: 'claude',     label: 'Claude',     color: '#D97757', hero: false },
  { id: 'openai',     label: 'OpenAI',     color: '#10A37F', hero: false },
  { id: 'gemini',     label: 'Gemini',     color: '#4285F4', hero: false },
  { id: 'figma',      label: 'Figma',      color: '#F24E1E', hero: false },
  { id: 'notion',     label: 'Notion',     color: '#111111', hero: false },
  { id: 'github',     label: 'GitHub',     color: '#8A7268', hero: false },
  { id: 'perplexity', label: 'Perplexity', color: '#20808D', hero: false },
  { id: 'spotify',    label: 'Spotify',    color: '#1DB954', hero: false },
  { id: 'stripe',     label: 'Stripe',     color: '#635BFF', hero: false },
  { id: 'midjourney', label: 'Midjourney', color: '#1B1B2E', hero: false },
  { id: 'meta',       label: 'Meta',       color: '#0467DF', hero: false },
  { id: 'linear',     label: 'Linear',     color: '#5E6AD2', hero: false },
  { id: 'radix',      label: 'Radix UI',   color: '#6E56CF', hero: false },
];
```

- [ ] **Step 4: Implement `lib/logofield.ts`**

```ts
import type { Tuple3 } from '@/lib/track';

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GOLDEN = Math.PI * (3 - Math.sqrt(5)); // ~2.399963 rad

/** Fibonacci disk in the constellation plane (centered at origin, facing camera). */
export function nodePositions(count: number, radius: number): Tuple3[] {
  const out: Tuple3[] = [];
  for (let i = 0; i < count; i++) {
    const r = radius * Math.sqrt(i / count);
    const a = i * GOLDEN;
    out.push([Math.cos(a) * r, Math.sin(a) * r, (i % 2 ? 1 : -1) * 0.06]);
  }
  return out;
}

/** Deterministic scattered "chaos" positions in a shell around origin. */
export function chaosPositions(count: number, radius: number, seed: number): Tuple3[] {
  const rand = mulberry32(seed);
  const out: Tuple3[] = [];
  for (let i = 0; i < count; i++) {
    const u = rand() * 2 - 1, th = rand() * Math.PI * 2, r = radius * (0.6 + rand() * 0.4);
    const s = Math.sqrt(1 - u * u);
    out.push([Math.cos(th) * s * r, u * r * 0.8 + 0.4, Math.sin(th) * s * r]);
  }
  return out;
}

/** For each node, connect to its k nearest neighbors; dedupe as i<j pairs. */
export function nearestEdges(nodes: Tuple3[], k: number): [number, number][] {
  const seen = new Set<string>();
  const edges: [number, number][] = [];
  for (let i = 0; i < nodes.length; i++) {
    const d = nodes
      .map((n, j) => ({ j, dist: Math.hypot(n[0] - nodes[i][0], n[1] - nodes[i][1], n[2] - nodes[i][2]) }))
      .filter((o) => o.j !== i)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, k);
    for (const { j } of d) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!seen.has(key)) { seen.add(key); edges.push(i < j ? [i, j] : [j, i]); }
    }
  }
  return edges;
}
```

- [ ] **Step 5: Run to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Implement `components/hero/LogoField.tsx`**

```tsx
'use client';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { BufferGeometry, Float32BufferAttribute, type Group, type LineSegments, type LineBasicMaterial } from 'three';
import { getP } from '@/lib/store';
import { BEAT } from '@/lib/timeline';
import { clamp01, remap, ease } from '@/lib/track';
import { LOGOS } from '@/lib/logos';
import { chaosPositions, nodePositions, nearestEdges } from '@/lib/logofield';
import { PHONE_HERO_POS } from '@/lib/phone';

const R_CONSTEL = 1.6;
const CENTER: [number, number, number] = [0, 1.7, 0.4]; // constellation hangs above the desk

export default function LogoField() {
  const group = useRef<Group>(null);
  const lines = useRef<LineSegments>(null);
  const n = LOGOS.length;

  const chaos = useMemo(() => chaosPositions(n, 2.2, 1337), [n]);
  const nodesLocal = useMemo(() => nodePositions(n, R_CONSTEL), [n]);
  const nodes = useMemo(
    () => nodesLocal.map((p) => [p[0] + CENTER[0], p[1] + CENTER[1], p[2] + CENTER[2]] as [number, number, number]),
    [nodesLocal],
  );
  const edges = useMemo(() => nearestEdges(nodes, 2), [nodes]);
  const lineGeom = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(new Float32Array(edges.length * 2 * 3), 3));
    return g;
  }, [edges.length]);

  useFrame(() => {
    const p = getP();
    const grp = group.current; if (!grp) return;

    // Per-logo position/scale across the 7 checkpoints.
    grp.children.forEach((child, i) => {
      const emit = PHONE_HERO_POS;
      const c = chaos[i], node = nodes[i];
      let x = emit[0], y = emit[1], z = emit[2], s = 0;

      if (p < BEAT.burstStart) { s = 0; }
      else if (p < BEAT.swirlStart) {            // Burst: emit → chaos
        const t = ease('outCubic', remap(p, BEAT.burstStart, BEAT.swirlStart, 0, 1));
        x = emit[0] + (c[0] - emit[0]) * t; y = emit[1] + (c[1] - emit[1]) * t; z = emit[2] + (c[2] - emit[2]) * t; s = t;
      } else if (p < BEAT.constellStart) {       // Swirl: chaos → node
        const t = ease('inOutCubic', remap(p, BEAT.swirlStart, BEAT.constellStart, 0, 1));
        x = c[0] + (node[0] - c[0]) * t; y = c[1] + (node[1] - c[1]) * t; z = c[2] + (node[2] - c[2]) * t; s = 1;
      } else if (p < BEAT.returnStart) {         // Constellation + Hold: settle + idle drift
        const drift = Math.sin((i + p * 6) * 1.7) * 0.02;
        x = node[0]; y = node[1] + drift; z = node[2]; s = 1;
      } else if (p < BEAT.rotateStart) {         // Return: node → emit, shrink
        const t = ease('inCubic', remap(p, BEAT.returnStart, BEAT.rotateStart, 0, 1));
        x = node[0] + (emit[0] - node[0]) * t; y = node[1] + (emit[1] - node[1]) * t; z = node[2] + (emit[2] - node[2]) * t; s = 1 - t;
      } else { s = 0; }                          // Clean

      child.position.set(x, y, z);               // mutate — never reassign
      child.scale.setScalar(LOGOS[i].hero ? s * 1.25 : s);
    });

    // Constellation lines: follow nodes; fade in at Constellation, out during Return.
    const geom = lineGeom;
    const arr = geom.getAttribute('position') as Float32BufferAttribute;
    edges.forEach(([a, b], e) => {
      arr.setXYZ(e * 2, nodes[a][0], grp.children[a].position.y, nodes[a][2]);
      arr.setXYZ(e * 2 + 1, nodes[b][0], grp.children[b].position.y, nodes[b][2]);
    });
    arr.needsUpdate = true;
    const fadeIn = clamp01(remap(p, BEAT.constellStart, BEAT.constellPeak, 0, 1));
    const fadeOut = 1 - clamp01(remap(p, BEAT.returnStart, BEAT.rotateStart, 0, 1));
    const mat = lines.current?.material as LineBasicMaterial | undefined;
    if (mat) { mat.opacity = fadeIn * fadeOut; }
  });

  return (
    <>
      <group ref={group}>
        {LOGOS.map((logo) => (
          <group key={logo.id} scale={0}>
            {/* Mock chip (colored; hero larger via scale). Real extruded 3D logo GLTF is the asset-swap step. */}
            <RoundedBox args={[0.34, 0.34, 0.08]} radius={0.05} smoothness={4} castShadow>
              <meshStandardMaterial color={logo.color} metalness={0.3} roughness={0.4} />
            </RoundedBox>
          </group>
        ))}
      </group>
      <lineSegments ref={lines} geometry={lineGeom}>
        <lineBasicMaterial color="#B08D4C" transparent opacity={0} />
      </lineSegments>
    </>
  );
}
```

- [ ] **Step 7: Mount in HeroCanvas**

Edit `components/hero/HeroCanvas.tsx` — insert `<LogoField />` directly **above** the `<EffectComposer>` block (import it).

- [ ] **Step 8: Verify the 7 checkpoints**

```bash
npm run verify:scene 0.20 /tmp/logo-dormant.png
npm run verify:scene 0.26 /tmp/logo-burst.png
npm run verify:scene 0.35 /tmp/logo-swirl.png
npm run verify:scene 0.45 /tmp/logo-constellation.png
npm run verify:scene 0.61 /tmp/logo-return.png
npm run verify:scene 0.70 /tmp/logo-clean.png
```
Expected: all `ERRORS: (none)`. Screenshots: nothing at 0.20; scattered chaos at 0.26; converging at 0.35; ordered node map **with gold connecting lines** at 0.45; shrinking back toward the phone at 0.61; gone by 0.70. Hero logos (YouTube/Instagram) sit central and larger.

- [ ] **Step 9: Commit**

```bash
git add lib/logos.ts lib/logofield.ts tests/logofield.test.ts components/hero/LogoField.tsx components/hero/HeroCanvas.tsx && \
git commit -m "feat: LogoField — 7-checkpoint erupt→constellation→return with connecting lines"
```

---

## Task 10: Scramble engine + HookText (lines 1–3)

**Files:**
- Create: `lib/scramble.ts`, `tests/scramble.test.ts`, `components/overlay/ScrambleLine.tsx`, `components/overlay/HookText.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `useScrollStore`, `activeIndex` (Task 4), `BEAT`.
- Produces:
  - `lib/scramble.ts` (pure): `interface ScrambleChar { ch:string; settled:boolean }`, `scramble(from, to, t, rand): ScrambleChar[]`, `scrambleText(chars): string`, re-exports `mulberry32`.
  - `<ScrambleLine text>` — reusable decode overlay: whenever `text` changes, plays a ~0.7s time-based decode from the previous text to the new one (rAF), rendering unsettled glyphs at 50% opacity. shadcn/Tailwind container. Reused by TitleReveal (Task 11).
  - `<HookText>` — subscribes to `activeIndex(p, HOOK_BOUNDARIES)` (re-renders only on line change) and feeds the active line (1–3, or empty) to `<ScrambleLine>`.

- [ ] **Step 1: Write the failing test**

Create `tests/scramble.test.ts`:
```ts
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
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module '@/lib/scramble'`.

- [ ] **Step 3: Implement `lib/scramble.ts`**

```ts
import { mulberry32 } from '@/lib/logofield';
export { mulberry32 };

export interface ScrambleChar { ch: string; settled: boolean }

const GLYPHS = '!<>-_\\/[]{}—=+*^?#§$%';

/** Deterministic per-char decode from `from` to `to` at progress t∈[0,1]. Inject rand for determinism. */
export function scramble(from: string, to: string, t: number, rand: () => number): ScrambleChar[] {
  const tt = t <= 0 ? 0 : t >= 1 ? 1 : t;
  const len = Math.max(from.length, to.length);
  const out: ScrambleChar[] = [];
  for (let i = 0; i < len; i++) {
    const toCh = to[i] ?? '';
    const fromCh = from[i] ?? '';
    const start = (i / Math.max(len, 1)) * 0.6;   // stagger
    const end = start + 0.4;
    const local = (tt - start) / (end - start);
    if (local >= 1 || toCh === '') out.push({ ch: toCh, settled: true });
    else if (local <= 0) out.push({ ch: fromCh, settled: true });
    else out.push({ ch: rand() < 0.28 ? toCh : GLYPHS[Math.floor(rand() * GLYPHS.length)], settled: false });
  }
  return out;
}

export const scrambleText = (chars: ScrambleChar[]): string => chars.map((c) => c.ch).join('');
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test`
Expected: PASS. *(Note: `t=0` yields `from` because trailing indices beyond `from.length` resolve to `toCh===''` → empty, contributing nothing; `hello` is returned.)*

- [ ] **Step 5: Implement `components/overlay/ScrambleLine.tsx`**

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { scramble, mulberry32, type ScrambleChar } from '@/lib/scramble';

const DECODE_MS = 700;

export default function ScrambleLine({ text, className }: { text: string; className?: string }) {
  const [chars, setChars] = useState<ScrambleChar[]>(() => scramble('', text, 1, mulberry32(1)));
  const fromRef = useRef(text);
  const raf = useRef(0);
  const startRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    const to = text;
    const rand = mulberry32(to.length + 7);
    const startAt = performance.now();
    startRef.current = startAt;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startAt) / DECODE_MS);
      setChars(scramble(from, to, t, mulberry32(Math.floor(t * 1000) + to.length))); // reseed per frame, deterministic-ish
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else fromRef.current = to;
      void rand;
    };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [text]);

  return (
    <span className={className} aria-label={text}>
      {chars.map((c, i) => (
        <span key={i} style={{ opacity: c.settled ? 1 : 0.5 }}>{c.ch}</span>
      ))}
    </span>
  );
}
```

- [ ] **Step 6: Implement `components/overlay/HookText.tsx`**

```tsx
'use client';
import { useScrollStore, activeIndex } from '@/lib/store';
import { BEAT } from '@/lib/timeline';
import ScrambleLine from '@/components/overlay/ScrambleLine';

// Line-change boundaries → text (spec §8 lines 1–3; empty clears during rotate).
const HOOK_BOUNDARIES = [BEAT.liftStart, BEAT.constellStart, BEAT.returnStart, BEAT.rotateStart];
const HOOK_TEXT = ['Tech is loud.', 'I make it make sense.', 'Sixty seconds. Zero fluff.', ''];

export default function HookText() {
  const idx = useScrollStore((s) => activeIndex(s.p, HOOK_BOUNDARIES));
  const text = idx >= 0 ? HOOK_TEXT[idx] : '';
  if (!text) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[14vh] z-40 flex justify-center px-6">
      <ScrambleLine
        text={text}
        className="text-center font-mono text-2xl font-semibold tracking-tight text-primary-foreground drop-shadow-[0_2px_12px_rgba(42,26,28,0.6)] md:text-4xl"
      />
    </div>
  );
}
```

- [ ] **Step 7: Mount HookText in the hero section**

Edit `app/page.tsx` — inside the pinned `<section>`, after `<HeroCanvas />`, add `<HookText />` (import it).

- [ ] **Step 8: Verify the three lines land**

```bash
npm run verify:scene 0.15 /tmp/hook1.png   # "Tech is loud."
npm run verify:scene 0.45 /tmp/hook2.png   # "I make it make sense."
npm run verify:scene 0.60 /tmp/hook3.png   # "Sixty seconds. Zero fluff."
npm run verify:scene 0.70 /tmp/hook-none.png # cleared
```
Expected: `ERRORS: (none)`. Each screenshot shows the correct line centered near the lower third; at 0.70 no hook line is present. (The decode animation itself is time-based; a static screenshot shows the settled line.)

- [ ] **Step 9: Commit**

```bash
git add lib/scramble.ts tests/scramble.test.ts components/overlay/ScrambleLine.tsx components/overlay/HookText.tsx app/page.tsx && \
git commit -m "feat: scramble engine + HookText (lines 1–3), p-selected"
```

---

## Task 11: TitleReveal (lines 4–5)

**Files:**
- Create: `components/overlay/TitleReveal.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `useScrollStore`, `activeIndex`, `BEAT`, `<ScrambleLine>` (Task 10).
- Produces: `<TitleReveal>` — at `revealStart` decodes the name (line 4); at `bridgeStart` morphs to the bridge (line 5). Same `activeIndex` re-render discipline as HookText.

- [ ] **Step 1: Implement `components/overlay/TitleReveal.tsx`**

```tsx
'use client';
import { useScrollStore, activeIndex } from '@/lib/store';
import { BEAT } from '@/lib/timeline';
import ScrambleLine from '@/components/overlay/ScrambleLine';

const TITLE_BOUNDARIES = [BEAT.revealStart, BEAT.bridgeStart];
const TITLE_TEXT = ['Varsheni — tech that actually clicks.', "So here's what that looks like."];

export default function TitleReveal() {
  const idx = useScrollStore((s) => activeIndex(s.p, TITLE_BOUNDARIES));
  if (idx < 0) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center px-6">
      <ScrambleLine
        text={TITLE_TEXT[idx]}
        className="max-w-4xl text-center font-sans text-3xl font-bold tracking-tight text-primary-foreground drop-shadow-[0_2px_16px_rgba(42,26,28,0.7)] md:text-6xl"
      />
    </div>
  );
}
```

- [ ] **Step 2: Mount in the hero section**

Edit `app/page.tsx` — inside the pinned `<section>`, after `<HookText />`, add `<TitleReveal />` (import it).

- [ ] **Step 3: Verify**

```bash
npm run verify:scene 0.90 /tmp/title-name.png    # "Varsheni — tech that actually clicks."
npm run verify:scene 0.97 /tmp/title-bridge.png  # "So here's what that looks like."
```
Expected: `ERRORS: (none)`. Name centered at 0.90; bridge line at 0.97, both over the full-bleed screen content.

- [ ] **Step 4: Commit**

```bash
git add components/overlay/TitleReveal.tsx app/page.tsx && \
git commit -m "feat: TitleReveal — name decode + portfolio bridge (lines 4–5)"
```

---

## Task 12: Preloader — asset gate (shadcn Progress)

**Files:**
- Create: `components/overlay/Preloader.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: drei `useProgress`, shadcn `Progress`.
- Produces: `<Preloader>` — a fixed full-screen cover in palette colors with a shadcn `<Progress>` bound to `useProgress().progress`; fades out (and unmounts) when loading completes. Gates the reveal so the photoreal assets are ready before the sequence is interactable (spec §9 asset pipeline).

- [ ] **Step 1: Implement `components/overlay/Preloader.tsx`**

```tsx
'use client';
import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { Progress } from '@/components/ui/progress';

export default function Preloader() {
  const { progress, active } = useProgress();
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    if (!active && progress >= 100) { const t = setTimeout(() => setHidden(true), 600); return () => clearTimeout(t); }
  }, [active, progress]);
  if (hidden) return null;
  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-background transition-opacity duration-500"
      style={{ opacity: !active && progress >= 100 ? 0 : 1 }}
    >
      <span className="font-sans text-2xl font-bold tracking-tight text-primary">Varsheni</span>
      <Progress value={progress} className="w-64" />
      <span className="font-mono text-xs text-muted-foreground">{Math.round(progress)}%</span>
    </div>
  );
}
```

- [ ] **Step 2: Mount as a top-level overlay**

Edit `app/page.tsx` — add `<Preloader />` as the last child of `<main>` (outside `ScrollProvider`), import it.

- [ ] **Step 3: Verify it clears**

```bash
npm run verify:scene 0.0 /tmp/preloader.png
```
Expected: `ERRORS: (none)`. Because the harness waits 4s (post-`networkidle2`), assets have loaded and the screenshot shows the **scene** (preloader faded out), confirming the gate opens. To see the loader itself, throttle the network in a manual browser session.

- [ ] **Step 4: Commit**

```bash
git add components/overlay/Preloader.tsx app/page.tsx && \
git commit -m "feat: Preloader gate on drei useProgress (shadcn Progress)"
```

---

## Task 13: PortfolioHandoff — the seam into the portfolio (shadcn Card stub)

**Files:**
- Create: `components/portfolio/PortfolioHandoff.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: shadcn `Card`, `Separator`.
- Produces: `<PortfolioHandoff>` — the DOM section that flows in *after* the hero unpins (continuous scroll, no cut). Header `Recent obsessions.` + a stub grid of shadcn `Card`s. This is the bridge target; full portfolio content is a later spec (spec §2 non-goal).

- [ ] **Step 1: Implement `components/portfolio/PortfolioHandoff.tsx`**

```tsx
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const STUBS = [
  { t: 'App teardown', d: 'What actually ships vs. the landing page.' },
  { t: 'Business breakdown', d: 'The model in sixty seconds.' },
  { t: 'Tool shootout', d: 'Head-to-head, zero fluff.' },
];

export default function PortfolioHandoff() {
  return (
    <section className="relative z-10 min-h-screen w-full bg-background px-6 py-24 md:px-16">
      <h2 className="font-sans text-3xl font-bold tracking-tight text-primary md:text-5xl">Recent obsessions.</h2>
      <Separator className="my-8 bg-accent/40" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {STUBS.map((s) => (
          <Card key={s.t} className="border-accent/30 bg-muted">
            <CardHeader>
              <CardTitle className="text-foreground">{s.t}</CardTitle>
              <CardDescription className="text-muted-foreground">{s.d}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Replace the below-hero spacer**

Edit `app/page.tsx` — replace the `<section className="h-screen w-full" />` spacer with `<PortfolioHandoff />` (import it).

- [ ] **Step 3: Verify the seam**

With dev running, open `http://localhost:3000/?hud=1` and scroll to the end: as `p` reaches 1 the hero unpins and the "Recent obsessions." section scrolls up continuously with no jump. Then:
```bash
npm run verify:scene 1.0 /tmp/handoff.png
```
Expected: `ERRORS: (none)`.

- [ ] **Step 4: Commit**

```bash
git add components/portfolio/PortfolioHandoff.tsx app/page.tsx && \
git commit -m "feat: PortfolioHandoff seam (Recent obsessions stub, shadcn Card)"
```

---

## Task 14: Full-sequence assembly, tuning pass, and arc verification

**Files:**
- Modify: `lib/timeline.ts` (tuning only), any rig checkpoint tables (tuning only)
- Create: `scripts/verify-arc.sh`

**Interfaces:**
- Consumes: everything.
- Produces: a single verified pass of the whole arc + a repeatable arc-capture script. No new components.

- [ ] **Step 1: Arc-capture script**

Create `scripts/verify-arc.sh`:
```bash
#!/usr/bin/env bash
set -euo pipefail
for p in 0.00 0.05 0.16 0.26 0.35 0.45 0.54 0.61 0.69 0.81 0.90 0.97 1.00; do
  node scripts/verify-scene.mjs "$p" "/tmp/arc-$p.png"
done
echo "Arc frames written to /tmp/arc-*.png"
```
Make executable: `chmod +x scripts/verify-arc.sh`.

- [ ] **Step 2: Run the full arc**

With dev running: `./scripts/verify-arc.sh`
Expected: every frame reports `ERRORS: (none)`. If any frame errors, fix that rig before tuning.

- [ ] **Step 3: Review the reel and tune**

Open `/tmp/arc-*.png` in order — it should read as: establish → lift → burst → swirl → constellation (with lines) → hold → return → rotate → push → reveal (name) → bridge → portfolio. Where a transition feels rushed/long, adjust the boundary in `lib/timeline.ts` (`BEAT`) or the specific rig table, re-run Step 2. Repeat until the arc reads cleanly. *(Spec §5: percentages are provisional, tuned in-engine — this is that step.)*

- [ ] **Step 4: Confirm continuous scroll both directions**

Manually in the browser (`?hud=1`): scroll top→bottom (full arc plays, seam into portfolio is smooth), then bottom→top (logos re-erupt, lines re-form, scramble lines re-morph to their previous state — spec §8 reversibility).

- [ ] **Step 5: Perf check against budget**

`npm run build`; open the built site; DevTools FPS meter through a full scroll. Confirm ≥ 60 fps steady on the target-class machine and first-load payload ≤ ~10–12 MB compressed. Record numbers.

- [ ] **Step 6: Commit**

```bash
git add lib/timeline.ts scripts/verify-arc.sh && \
git commit -m "chore: full-arc verification + choreography tuning pass [<fps>fps, <MB>MB]"
```

---

## Spec coverage map

| Spec section / requirement | Task(s) |
|---|---|
| §1 Concept — full arc room→logos→constellation→push→reveal→bridge | 5–14 |
| §4 Cherry-maroon room, palette, photoreal setting, persistence | 3, 5, Global Constraints |
| §4/§9 Photoreal validated **step one** (desk + HDRI, budget) | 3 (gate) |
| §5 Master timeline (11 beats, one `p`) | 2 (BEAT), 4 (`p`), all rigs |
| §6 Logo system — 15 logos, 7 checkpoints, constellation + lines, heroes central | 9 |
| §6 Radix UI added to set | 9 (`lib/logos.ts`) |
| §7 Phone rig — rest→lift→hero→rotate→push + breakout | 6, 8 |
| §7 Camera — establishing→frontal→push-through, idle drift | 7 |
| §7 Screen content — app-grid → reel | 8 |
| §8 Copy (5 verbatim lines), scramble morph, scroll-triggered/time-played, reversible | 10, 11 |
| §9 Stack: Next+R3F+drei+postprocessing, Lenis+ScrollTrigger (not ScrollControls) | 1, 4 |
| §9 DOM/UI: shadcn/Tailwind for all UI, palette→tokens, latest packages | 1, 10–13, Global Constraints |
| §9 Single source of truth `p`; per-rig checkpoint tables | 2, 4, all rigs |
| §9 Modules (11) designed for isolation | one task per module (4–13) |
| §9 Asset pipeline — Draco/KTX2/HDRI/gated preloader | 3, 5, 12 |
| §9 Perf budget 60fps / ≤~10–12 MB | 3, 14 |
| §10 Risks — photoreal cost (gate), trademark (mock+swap seam), pacing (tuning), scramble legibility (settle-before-advance) | 3, 9, 14, 10 |
| §12 Success criteria — smooth scrubbable arc, room persists, lines land, full-bleed push, per-module `p` | 14 (verification) |

**Deferred (spec §11 open items, not in this plan):** final company list, official 3D logo/room asset production + trademark clearance, mobile choreography, production copy/stats, name confirmation. The build ships fidelity-validated (Task 3) with runnable mock choreography behind explicit `useGLTF` asset-swap seams.
