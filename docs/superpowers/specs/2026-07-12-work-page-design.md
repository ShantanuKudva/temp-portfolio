# Work (`/work`) — "The Work" — Design Spec

**Date:** 2026-07-12 · **Branch:** `v2` · **Status:** Design locked, ready for implementation plan

The Work page is the site's **core proof**: a gallery of Varsheni's 9:16 vertical
app/business reviews. This build ships the **full page shell + motion + a real
lightbox player** with tasteful placeholder media; real reels wire in later as a
drop-in data swap.

## 1. Purpose & scope

- Show the reels as the central evidence that the reviews are real and worth trusting.
- End on a soft nudge toward `/contact` ("work with me").
- **Content reality:** no real reel media exists yet. Build the shell with placeholder
  posters/clips (`// TODO(real):`), so wiring real media later is a data-only change.
- **Out of scope:** filter UI, written stats/case studies, real video encoding pipeline,
  CMS. Revisit when real content exists.

## 2. Design-system placement

Each route has its own velvet surface + ambient WebGL signature:
- **About** — espresso + Strands/Aurora.
- **Connect** — midnight-indigo + Aurora.
- **Work** — **wine/burgundy + ColorBends** (the "red" of the "one red + two chocolates"
  set; matches the nav's Work card, which already uses ColorBends with wine stops).

Reuse the existing system, do not reinvent: `Reveal` (`components/motion/reveal.tsx`),
`Parallax` (`components/motion/parallax.tsx`), `GradualBlur`
(`components/effects/gradual-blur.tsx`), `CurtainLink`
(`components/transition/curtain-link.tsx`), the Sparkle ✦ prop, and the availability-pill
pattern. Gold (`--color-amber-dot`) stays a restrained accent; body/UI accents lean crème
+ taupe.

## 3. Page structure (top → bottom)

Root: `<main>` with `background: linear-gradient(165deg, #5b0f1a 0%, #380710 45%)`,
`text-creme`, `relative flex-1`.

### 3.1 Page hero (`work-hero.tsx`)
- Eyebrow: `✦ The Work` (Montserrat, uppercase, tracked, amber-dot).
- Headline (Playfair): `Reviews worth your tap.` — placeholder copy, Varsheni swaps later.
- One Montserrat sub-line: the apps & businesses she's actually lived with.
- Availability pill ("Available for brand deals") — same markup as About.
- `Parallax speed={30}` on the heading block; `Reveal` on each line.
- Hard velvet surface; ColorBends glow eases in behind (see §3.6).

### 3.2 Featured reel (`featured-reel.tsx`)
- One large 9:16 card (left) + meta column (right); stacks on mobile.
- Card: poster still, muted hover-preview `<video>` (autoplay/loop/muted/playsInline),
  small "latest review" ribbon, play affordance. Tap opens the lightbox (§3.4).
- Meta: `App`/`Business` tag pill, Playfair title, Montserrat one-line take, a subtle
  "watch the review ↗" affordance.
- `Reveal` on entry; soft settle on the card.

### 3.3 The drifting reel wall (`reel-wall.tsx` + `reel-card.tsx`)
- The core device. **Two rows** of 9:16 `reel-card`s auto-drifting in **opposite
  directions** (row 1 → left, row 2 → right).
- Built on Motion's scroll-velocity/marquee pattern: a `useAnimationFrame` loop advancing
  an `x` `MotionValue`, `wrap`ped for seamless looping; content duplicated to fill.
- **Drag-nudgeable** (`drag="x"` on the track) — dragging adds to the base velocity, then
  it eases back to the idle drift.
- **Pause on hover** of the wall.
- One continuous stream, **tags only** — no filter bar. Each card shows: poster,
  `App`/`Business` tag, title, small play glyph on hover.
- `prefers-reduced-motion`: no auto-drift and no drag — render a static, horizontally
  scrollable (`overflow-x-auto`) staggered strip instead.
- ColorBends breathes behind this band (§3.6).
- Tapping any card opens the lightbox (§3.4) for that reel.

### 3.4 Reel lightbox player (`reel-lightbox.tsx`)
- Opens on tap of the featured card or any wall card. `AnimatePresence` mount.
- Full-screen fixed overlay: dimmed + blurred page backdrop; centered 9:16 `<video>`.
- Controls: play/pause toggle, mute toggle, and the **ElasticSlider** (§4) as the
  **volume** control. Caption: title + `App`/`Business` + subject.
- Close affordance (✕ button) + `Esc` key + backdrop click all close it.
- **Focus-trapped**, `role="dialog"` + `aria-modal`, focus returns to the invoking card
  on close, body scroll locked while open.
- The `<video>` uses the reel's `src` (placeholder clip for now) with `poster`.
- Scale + fade in (`prefers-reduced-motion`: fade only).

### 3.5 Closing CTA (`work-cta.tsx`)
- Minimal: a Playfair line ("Seen enough? Let's make something honest.") + a
  `Work with me ↗` `CurtainLink` to `/contact` (+ a secondary "Read her story →"
  `CurtainLink` to `/about`, optional).
- No offer restatement (kept lean per decision).

### 3.6 Ambient ColorBends (part of `work-page.tsx` / `reel-wall.tsx` region)
- A single ColorBends layer behind the featured + wall region (not the whole page), the
  way About scopes Aurora to a region.
- Wine/crimson stops, e.g. `colors={["#9a1a2c", "#5b0f1a", "#38070f"]}`, low `speed`
  (~0.18), `transparent`, gentle `intensity`.
- Feathered with a vertical linear-gradient mask (top+bottom transparent) so it blends
  into the velvet with no hard seam — same technique used across About/Connect.
- Mounted early / kept mounted while opacity is ~0 (mount-fade to a steady low opacity),
  so the WebGL first-frame flash is hidden. Reduced-motion still renders it (static-ish);
  it never blocks content.

### 3.7 Bottom edge
- Global `GradualBlur position="bottom" target="page"` pinned across the page (same as
  About), so content dissolves as it leaves the viewport.

## 4. ElasticSlider (vendored React Bits component)

- Not present in the repo — vendor `components/ElasticSlider.jsx` from React Bits (the
  Framer-Motion version, imports from `motion/react`), consumed via the JS-interop cast
  pattern used for the other `.jsx` components
  (`as unknown as React.ComponentType<Record<string, unknown>>`).
- **Re-skin to tokens** (per CLAUDE.md — never ship the generic look): track/thumb/fill in
  crème/taupe/amber-dot, not the stock colors. Strip any icon set that doesn't fit; a
  small speaker glyph (lucide `Volume2`/`VolumeX`) may bookend it.
- Role: **volume** control inside the lightbox. `value` 0–1 (or 0–100) → sets
  `video.volume`; springy overshoot on drag is the whole point.
- Reduced-motion: the spring still functions but respects reduced overshoot where the
  component allows.

## 5. Data model (`lib/work.ts`)

Mirror `lib/contact-info.ts`'s shape and `// TODO(real):` discipline.

```ts
export type ReelKind = "app" | "business";

export type Reel = {
  id: string;
  title: string;       // e.g. "The note-taking app that finally stuck"
  subject: string;     // the app/business reviewed, e.g. "Granola"
  kind: ReelKind;
  poster: string;      // /work/posters/<id>.jpg  — placeholder still for now
  src: string;         // /work/reels/<id>.mp4    — placeholder clip for now
  featured?: boolean;  // exactly one true → the featured reel
  href?: string;       // optional external IG/YT link (unused in shell)
};

export const REELS: Reel[];  // ~10–12 tasteful placeholders, one featured
```

- Draw subject names from the existing `public/assets/logos/` set (Granola, Cred, Slice,
  Jupiter, Sarvam, Napkin, Gamma, etc.) so placeholders read as real.
- Placeholder `poster`/`src`: point at a small set of committed placeholder assets under
  `public/work/` (a couple of generated posters + one looping sample clip reused across
  ids is acceptable for the shell). Each flagged `// TODO(real):`.
- Helpers: `FEATURED = REELS.find(r => r.featured)`, `WALL = REELS.filter(r => !r.featured)`
  (or expose both rows by splitting `WALL`).

## 6. Components & files

- `app/work/page.tsx` — replace `<PagePlaceholder/>` with `<WorkPage/>`; keep the existing
  `metadata`.
- `components/work/work-page.tsx` — composes hero + featured + wall + cta; owns the
  lightbox open/close state + the currently-selected reel; renders the region ColorBends
  and the page `GradualBlur`.
- `components/work/work-hero.tsx`
- `components/work/featured-reel.tsx`
- `components/work/reel-wall.tsx`
- `components/work/reel-card.tsx`
- `components/work/reel-lightbox.tsx`
- `components/work/work-cta.tsx`
- `lib/work.ts`
- `components/ElasticSlider.jsx` (+ `.css` if the vendor ships one) — re-skinned.
- `public/work/` — placeholder posters + sample clip.

Lightbox state is lifted to `work-page.tsx` and passed down (or a tiny local zustand store
if prop-drilling gets noisy — prefer props first). `reel-card` receives an `onOpen(reel)`
callback.

## 7. Motion plan

- Reveals: mask-wipe / soft-settle via `Reveal` (existing).
- Parallax on hero heading (existing `Parallax`).
- Reel wall: `useAnimationFrame` velocity marquee, drag-nudge, hover-pause; reduced-motion
  → static scrollable strip.
- Lightbox: `AnimatePresence` scale+fade (fade only under reduced-motion); backdrop blur.
- ElasticSlider: springy volume drag.
- ColorBends: mount-fade to steady low opacity, feathered mask.
- Everything respects `prefers-reduced-motion` and never blocks content.

## 8. Accessibility & quality floor

- Responsive: hero recomposes; featured stacks; wall becomes a scrollable strip on small
  screens; lightbox is full-bleed on mobile.
- Lightbox: `role="dialog"`, `aria-modal`, focus trap, `Esc` to close, focus restore,
  body scroll lock.
- Cards are real buttons (`<button>`), keyboard-activable, visible focus ring.
- Videos: `playsInline`, `muted` for hover-previews; captions/alt where meaningful;
  posters carry meaningful `alt`.
- `prefers-reduced-motion` honored everywhere (drift, marquee, lightbox, ColorBends).
- Colors from tokens only; gold reserved as a restrained accent.

## 9. Testing

Vitest + `@testing-library/react` (jsdom), matching existing test patterns
(`tests/setup.ts` stubs IntersectionObserver/ResizeObserver; WebGL components are mocked
in tests, not run).

- `lib/work.ts`: exactly one `featured`; all reels have non-empty `title`/`subject`/`poster`
  /`src`; `kind` ∈ {app, business}; ids unique; `FEATURED`/`WALL` helpers partition `REELS`.
- `reel-card`: renders title + subject + tag; clicking calls `onOpen` with its reel; is a
  focusable button.
- `reel-lightbox`: given `open` + a reel, renders the title and a `<video>` with the reel's
  `src`; `Esc` and close-button call `onClose`; renders nothing when closed. Mock
  `ElasticSlider` and any WebGL.
- `work-page`: renders the hero headline and the CTA link to `/contact`; mock WebGL
  (ColorBends) + ElasticSlider.
- Update/extend `tests/setup.ts` only if a new jsdom gap appears (e.g. `HTMLMediaElement`
  `play`/`pause`/`volume` — stub these; jsdom does not implement media playback).

## 10. Constraints (verbatim from CLAUDE.md)

- Palette/type locked: wine `#5B0F1A`, espresso `#3B2A24`, mocha `#6B4E42`, taupe `#B79E8C`,
  crème `#F7F3EE`, amber-dot `#D9A05B`; Playfair / Montserrat / Alex Brush. No new brand
  colors — Work reuses wine + the existing tokens.
- Animation stack = Framer Motion (`motion/react`) + Lenis. GSAP is a scoped escape hatch,
  not used here.
- React Bits = idea source: **re-skin ElasticSlider to the wine/crème tokens**, build on
  existing primitives; never ship the generic look.
- React Compiler safe: no synchronous setState in effects (use rAF / imperative refs); no
  `Math.random` / `Date.now` in render.
- shadcn/ui primitives for DOM UI where one fits; `cn()` from `lib/utils.ts`.
- Git: precise `git add <path>`, never `-A`; leave `.gitmodules`, `skills/`,
  `public/assets/incoming/` untracked; Co-Authored-By trailer on commits.
- Install latest stable package versions (none expected — ElasticSlider is vendored source,
  not an npm dep; three/motion already present).
