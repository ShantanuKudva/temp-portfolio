# Portfolio Pitch — Scrollytelling Design

> Source of truth for the **portfolio** half of the Varsheni site — the scroll-driven pitch that begins the moment the landing dives through the phone screen into black. Companion to [2026-07-04-landing-sequence-design.md](2026-07-04-landing-sequence-design.md). Orientation: repo `CLAUDE.md`.

**Date:** 2026-07-05
**Status:** Approved — ready for implementation plan.
**Branch:** continues on `build/landing-sequence`.

---

## 1. What this is

Not a portfolio. A **pitch**. Varsheni is a new tech-UGC creator; this page's single job is to make a **brand** (marketing lead / founder) *or* a **talent agency** want to book her. It is one continuous, scroll-driven story that picks up out of the landing's black portal and continues the landing's motion + typographic voice (one recurring phone, scramble text, the cherry-maroon world).

Because she is new, the page is **personality- and POV-forward**, not catalogue-forward. Proof is the *format itself*: the phone (the landing's hero, reused) reappears between claims and plays a review reel. A sparse feed would read as "no traction"; a small set of reels spaced against sharp claims reads as *intentional*.

**Audience:** brands **and** agencies (dual). **Primary action:** book a call (Cal.com). Secondary: "Work with me" (contact) + "Download media kit."

## 2. Success criteria

- Scrolls top-to-bottom as one continuous story, no dead/empty beats.
- The phone is a stable recurring character — reads as *the same phone* from the landing, not a new object; motion is calm (holds its lane, scales; no swinging).
- Every beat pins a claim to proof or to the person; nothing is a floating headline in a void.
- The ask is unmissable and its Cal.com CTA is a real booking action.
- Works with **placeholder** reels/photo/contact today and swaps to real assets with no structural change.
- Reuses the landing's architecture (single normalized progress + checkpoint tables), assets (phone GLB, brand icons), and theme (shadcn cherry-maroon tokens).

## 3. The story (locked beat order)

One continuous scroll. Nine stops:

| # | Beat | Copy (voice) | Phone | Proof/Person |
|---|------|------|-------|------|
| 0 | **Portal line** | *"I make tech make sense."* (scramble) + sub | centred, home screen, emerging from black | — |
| 1 | **Meet her** | name · role · bio · 3 stats (60s / 7-day / 100%) | recedes small, right | **her photo** (portrait) |
| 2 | **The problem** | *"You built something great. But nobody understands it in the six seconds they'll give you. That's exactly what I fix."* (**scroll-linked word reveal**) | small, right | — |
| 3 | **Reel 1** | *"Sixty seconds. Zero fluff."* (scramble) + note | **grows to hero**, plays reel | review reel |
| 4 | **Why her** | 3 pillars: Clarity / Speed / Taste | small, right | — |
| 5 | **Reel 2** | *"Your product, made obvious."* (scramble) + note | **hero**, plays reel | review reel |
| 6 | **What you get** | "One 60-second review." + honest chips + upsell line | small, right | — |
| 7 | **The ask** | *"Let's make your tech click."* + **Book a call (Cal.com)** / Work with me / Media kit | docked, right | — |
| — | **Footer** | brand blurb · Explore · Connect · **Legal (policies)** · © | (canvas ends) | — |

**Motion vocabulary** (all continue the landing): one 3D phone (right-of-centre, scales between small/hero, plays reels), **orbiting brand icons** (the landing's eruption set, now a constant ring around the phone), **scramble** on headlines, **scroll-linked word reveal** on manifesto/body statements.

Reference prototype (throwaway, gitignored): `.superpowers/brainstorm/pitch-scroll.html`.

## 4. Architecture

### 4.1 How it hooks into the app

The landing hero pins and owns `p∈[0,1]`. The pitch is a **second, independent scroll region** mounted after it, owning its own progress `q∈[0,1]`. `app/page.tsx` replaces the current below-hero spacer `<section>` with `<PitchSection>`.

```
app/page.tsx
  ScrollProvider (landing, p)         → HeroCanvas + HookText + ScrollIndicator   [pinned hero]
  PitchSection                        → PitchProvider (q) + PitchCanvas + PitchOverlay + PitchFooter
  Preloader                           (unchanged)
```

The two regions never share a progress value. The **seam is black-on-black**: the landing ends on the black portal (screen faded to black, dark room); `PitchCanvas` fades up from black over the first slice of `q`. No shared canvas is needed — the black cover hides the handoff.

### 4.2 Progress model

- `q∈[0,1]` = normalized scroll progress across the pitch region, produced by a dedicated GSAP ScrollTrigger in `PitchProvider` (mirrors `ScrollProvider`), Lenis-smoothed by the same Lenis instance.
- Stored in the existing Zustand store as a new field `q` with `setQ` + non-reactive `getQ()` (mirrors `p`/`getP`). `useFrame` loops in the pitch canvas read `getQ()`; DOM beats read `q` reactively only where needed (most DOM reveal is local via IntersectionObserver, see §6.3).
- **Layout model = stacked sections, fixed canvas** (NOT a pinned crossfade). `PitchCanvas` is a `position: fixed` full-viewport 3D layer behind the DOM. The DOM beats are real full-height stacked sections in normal flow (like the prototype). This is robust for long copy + a real footer, and matches the approved prototype exactly. `q` is derived from the pitch region's scroll offset so the phone rig tracks scroll continuously.

### 4.3 Module map

**New `lib/`:**
- `lib/pitch.ts` — `PBEAT` beat constants (q-space), `PITCH_PHONE` checkpoint table (x-offset frac + scale + opacity + orbit opacity per beat), `activeReel(q)` selector. Pure; unit-tested.
- `lib/pitchContent.ts` — all copy/data: `REELS[]`, `PILLARS[]`, `STATS[]`, `FOOTER_LINKS`, headline/sub strings, contact + Cal.com placeholders. One edit point for content.

**New `components/scroll/`:**
- `PitchProvider.tsx` — ScrollTrigger over the pitch region → `store.setQ`. Client component.

**New `components/pitch/`:**
- `PitchSection.tsx` — wraps provider + canvas + overlay + footer; owns the region height.
- `PitchCanvas.tsx` — fixed R3F `<Canvas>`; mounts `PitchPhone` + `PitchOrbit`; fades from black over early `q`.
- `PitchPhone.tsx` — reuses `phone.glb` (same loader/scale as landing `PhoneRig`); `q`-driven transform via `PITCH_PHONE`; hosts `ReelScreen`.
- `ReelScreen.tsx` — screen-plane content: shows the phone home image at rest and swaps to the **active reel** (`activeReel(q)`) as a `VideoTexture` (real files) or a `CanvasTexture` placeholder (gradient + caption) until videos exist. Crossfades between reels.
- `PitchOrbit.tsx` — ring of `BRANDS` (from `lib/brandIcons.ts`) as billboarded icon planes around the phone; slow spin; tracks the phone's `q`-driven position + scale.
- `PitchOverlay.tsx` — the stacked DOM beats (shadcn/Tailwind). Renders one `<BeatShell>` per beat.
- `beats/` — `PortalLine.tsx`, `MeetHer.tsx`, `Problem.tsx`, `ReelBeat.tsx`, `WhyHer.tsx`, `WhatYouGet.tsx`, `TheAsk.tsx`. Each is one focused DOM section.
- `BeatShell.tsx` — shared full-height section wrapper (enter animation via IntersectionObserver, alignment, spacing).
- `BookCallButton.tsx` — Cal.com booking trigger (see §7).
- `PitchFooter.tsx` — footer with Explore / Connect / **Legal** columns + © line.

**New reusable `components/overlay/`:**
- `WordReveal.tsx` — scroll-linked word-by-word brightening (see §6.3). Reusable beyond the pitch.

**New routes (`app/`):**
- `app/(legal)/privacy/page.tsx`, `terms/page.tsx`, `cookies/page.tsx`, `disclosure/page.tsx` — static shadcn-styled policy pages with **placeholder legal copy** (real text later). Footer links target these.

**Modified:**
- `lib/store.ts` — add `q`, `setQ`, `getQ` (mirror `p`/`getP`; `setQ` respects `locked` like `setP`).
- `app/page.tsx` — swap the spacer `<section>` for `<PitchSection>`.

**Reused as-is:** `lib/track.ts` (`sampleNumber`, `sampleTuple3`, easings, `Keyframe`), `lib/scramble.ts` + `components/overlay/ScrambleLine.tsx`, `lib/brandIcons.ts` (`BRANDS`, `buildIconTexture`), `lib/phone.ts` (`PHONE_SCALE`), `components/ui/*` (shadcn button/card/badge/separator), the shadcn cherry-maroon theme tokens.

## 5. Beat table (q-space, provisional — tune in `lib/pitch.ts`)

```ts
export const PBEAT = {
  portalOut:   0.00,  // black → line
  meetHer:     0.11,
  problem:     0.24,  // word-reveal region
  reel1:       0.37,
  pillars:     0.50,
  reel2:       0.63,
  whatYouGet:  0.75,
  theAsk:      0.86,
  end:         1.00,  // footer follows in normal flow
} as const;
```

`PITCH_PHONE` (per-beat, calm motion — phone stays right, only scale/opacity change; **no rotation, no vertical swing**):

| beat | x (frac of vw) | scale | phone opacity | orbit opacity | screen |
|---|---|---|---|---|---|
| portalOut | 0.00 | 0.60 | 1.0 | 0.85 | home |
| meetHer | 0.32 | 0.42 | 0.45 | 0.30 | home |
| problem | 0.32 | 0.44 | 0.45 | 0.35 | home |
| reel1 | 0.28 | 0.92 | 1.0 | 0.80 | reel[0] |
| pillars | 0.32 | 0.44 | 0.50 | 0.40 | home |
| reel2 | 0.28 | 0.92 | 1.0 | 0.80 | reel[1] |
| whatYouGet | 0.32 | 0.46 | 0.55 | 0.40 | home |
| theAsk | 0.29 | 0.82 | 1.0 | 0.75 | reel[2] |

Sampled with the existing `sampleNumber`/`sampleTuple3` over `Keyframe<T>[]` keyed on `PBEAT` values, `inOutCubic` between beats. `activeReel(q)` returns the reel index whose beat is nearest (reel1→0, reel2→1, theAsk→2), else `-1` (home screen).

## 6. Motion details

### 6.1 Phone (`PitchPhone`)
Same GLB + `PHONE_SCALE` as the landing so it reads as the same device. Transform driven by `getQ()` → `PITCH_PHONE`. The phone's screen faces the camera (front face +Z, per the landing's PhoneRig π-Y correction). It sits in a `position: fixed` canvas, so it visually persists while DOM beats scroll past — the "recurring character."

### 6.2 Orbiting icons (`PitchOrbit`)
The landing's `BRANDS` set as billboarded planes on a ring (radius ≈ phone half-height × k) centred on the phone, slow constant spin (~26s), icons counter-rotate to stay upright. The whole ring inherits the phone's `q`-driven position + scale and its own per-beat opacity (dim on person/pillar beats, bright on reel beats). Textures via existing `buildIconTexture`.

### 6.3 Text reveal
Two mechanisms, both continuing the landing's voice:
- **Scramble** (`ScrambleLine`, existing) — the big headlines (beats 0, 3, 5, 7). Fires once on beat enter.
- **Scroll-linked word reveal** (`WordReveal`, new) — manifesto/body statements (beat 2, optionally reused). Splits text into word `<span>`s; each word's opacity is a function of the block's scroll position through the viewport: `frac = clamp01((vh*0.82 − rectTop) / (vh*0.5))`, word `i` opacity `= 0.15 + 0.85 * clamp01(frac*N − i)`. Updates on scroll via the same rAF loop or a passive scroll listener. Respects `prefers-reduced-motion` (renders fully lit, no per-word animation).
- **Beat enter** — `BeatShell` fades/translates its content in via IntersectionObserver (threshold ~0.55).

### 6.4 Reels (`ReelScreen`)
Rendered on the phone screen plane (reuse `ScreenContent`'s plane geometry math: full-size, rounded-corner canvas, Dynamic Island, `faceZ` just proud of the model). At rest → home image. On a reel beat → the active reel. **Primitive/locked-choreography default:** a `CanvasTexture` placeholder per reel (brand gradient + caption + progress bar, from `REELS[i]`). **Real path:** drop an MP4/WebM into `public/assets/reels/`; `ReelScreen` upgrades that reel to a `VideoTexture` (muted, loop, `playsInline`), played only while its beat is active (pause otherwise for perf). Crossfade between reels via material opacity. Same "no bubble/opacity-emerge" rule as the landing — swaps are crossfades, not scale-pops.

## 7. Cal.com booking (`BookCallButton`)
Primary CTA on beat 7. Uses the official `@calcom/embed-react` popup (`getCalApi` + `data-cal-link`) so booking happens in-page. Rendered as a shadcn `Button` (primary/cherry-maroon). Config in `lib/pitchContent.ts`: `CAL_LINK` (placeholder `"varsheni/15min"` until the real handle exists). A live-availability note ("Free 15-min intro · Cal.com") with a pulsing green dot sits under the CTA. If the embed script is blocked/absent, the button falls back to a plain `https://cal.com/<link>` anchor (progressive enhancement). Secondary CTAs: "Work with me" (mailto/contact placeholder) and "Download media kit" (links to a placeholder asset).

## 8. Content model (`lib/pitchContent.ts`)
All strings/data centralized so copy + assets swap without touching components:
- `REELS: { brand, gradient, caption, sub, videoSrc? }[]` (3 entries; `videoSrc` optional → placeholder until present).
- `PILLARS: { n, title, body }[]` (Clarity / Speed / Taste).
- `STATS: { value, label }[]` (60s / 7-day / 100%).
- `MEET: { name, role, bio }`, portrait asset path (placeholder gradient frame until a real photo is dropped in `public/assets/`).
- `HEADLINES`/`SUBS` per beat, `CHIPS` for "what you get".
- `CONTACT: { email, handle }`, `CAL_LINK`, `MEDIA_KIT_URL` — all placeholders, flagged.
- `FOOTER_LINKS: { explore[], connect[], legal[] }`.

## 9. Styling / theme
All DOM UI is **shadcn/ui + Radix + Tailwind** on the existing cherry-maroon theme tokens (no hand-rolled primitives). Ground is near-black (`--bg` ~`#0B0708`) continuing the portal; accents from the palette (maroon primary, antique gold hairlines/eyebrows, blush/sand text). Typography: large frame-filling display weights for headlines, mono for eyebrows/badges/technical notes. Theme-aware is N/A here — the pitch deliberately commits to the dark cherry world (single visual world, a deliberate choice, matching the landing).

## 10. Testing strategy
- **Unit (Vitest, like `tests/camera.test.ts`):**
  - `lib/pitch.ts`: `PITCH_PHONE` sampling — monotonic/expected scale at each `PBEAT` (small on context beats, ~0.92 on reels); `activeReel(q)` returns correct index at each beat centre and `-1` between.
  - `WordReveal` math: word opacity is 0.15 at `frac=0`, ~1.0 for early words at `frac=1`, monotonic in word index.
- **Render checks (extend `scripts/verify-scene.mjs`):** add a `?q=` lock (or a pitch-anchored URL) that scrolls to and freezes the pitch region at a given `q`, bypassing the preloader, so headless Chrome can screenshot each pitch beat (mirrors the landing's `?p=` harness). Capture beats 0/1/3/7; assert no console/page errors and the canvas is present.
- **Manual:** scroll top-to-bottom in Chrome on :3000; verify continuity from the portal, calm phone motion, reel swaps, reveal timing, Cal.com popup, footer links resolve.

## 11. Out of scope / deferred
- Real reel videos, real portrait photo, real contact (email/handle/Cal link), real legal copy — all ship as flagged placeholders; swap later with no structural change.
- Mobile choreography — desktop-first (matches the landing decision); architecture must allow a reduced path (single-column beats, phone centred, reels inline).
- Any actual "packages/pricing" table — "what you get" stays a single honest line + chips (we're new; a pricing grid reads as overreach).
- Analytics / form backend for "Work with me" — placeholder mailto for now.

## 12. Open items to confirm during build
- Exact `PBEAT` spacing + `PITCH_PHONE` offsets are provisional; tune live on :3000 against real copy.
- Whether `WordReveal` is used only on beat 2 (recommended: 1–2 hero uses) or more broadly.
- Portrait aspect/treatment once a real photo exists.
