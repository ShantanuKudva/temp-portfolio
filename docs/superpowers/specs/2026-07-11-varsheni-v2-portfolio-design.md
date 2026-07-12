# Varsheni — v2 Portfolio Design Spec

**Date:** 2026-07-11 · **Branch:** `v2` · **Status:** Design locked, ready for implementation plan

Visual reference for the hero: [`assets/2026-07-11-hero-reference.html`](assets/2026-07-11-hero-reference.html) (open in a browser) and [`assets/2026-07-11-hero-reference.png`](assets/2026-07-11-hero-reference.png). These are the source of truth for the hero — the Next.js build recreates them.

## 1. Purpose

A portfolio site for **Varsheni**, a **tech UGC creator who reviews apps & businesses**. It is a **hybrid pitch + hub**:

- **Pitch** to brand/marketing teams: build trust, show the person and the work, drive an inquiry.
- **Hub** for her audience: a home for her review/UGC content and socials.

Primary CTA: **work with me / inquire**. Secondary: watch the reels, follow socials.

## 2. Content constraints (design only for what's real)

She has, or will have:
- **Portraits** on warm backgrounds (`varsheni-1/2/3.png`). `varsheni-2` (centered, symmetric) is the hero face.
- **UGC video clips / reels** (vertical 9:16).

She does **not** yet have brand logos or written stats. Do **not** fabricate a "trusted by" logo wall or "120+ projects" counters. Leave a clean, designed-for slot where a brand-logo strip can drop in later, but ship without it.

## 3. Locked visual identity

From her "Identité Visuelle" moodboard. **Do not deviate from palette or type.**

**Palette** (set as Tailwind v4 `@theme` tokens in `app/globals.css`):
| Token | Hex | Role |
|---|---|---|
| wine | `#5B0F1A` | primary brand / dark bg |
| espresso | `#3B2A24` | secondary dark |
| mocha | `#6B4E42` | mid-tone |
| taupe | `#B79E8C` | muted accent, captions, hairlines |
| crème | `#F7F3EE` | text on dark, light section bg |

Supporting: warm amber `#D9A05B` (status dot), a warm-crème glow `rgba(247,240,227,·)` for the neon effect.

**Type** (via `next/font/google`, exposed as CSS variables):
- **Playfair Display** — headings / display (élégante & sophistiquée).
- **Montserrat** — body, nav, captions, data, UI (épurée & moderne).
- **Alex Brush** — the hero cursive name only. Not for body.

**Voice & motifs:** sobre, élégant, intemporel, féminin, ambitieux, authentique. Four-point sparkle ✦, wax-seal badge, and the wordmark-behind-subject device.

## 4. Page structure

Single long page, top to bottom:

1. **Hero** (§5)
2. **About** — the crème "Hi, I'm Varsheni" intro
3. **The Work / Reels** — 9:16 vertical reel gallery
4. **What I Offer** — short "for brands" panel (honest reviews · UGC · collaborations); no fake stats
5. **Contact / Inquire** — Cal.com booking + email, closing on the wordmark motif

Section rhythm alternates **wine (dark)** and **crème (light)** surfaces. A brand-logo strip can later slot between 3 and 4.

## 5. Hero (locked — high fidelity)

Full-viewport (`min-height:100vh`). Layer order back→front:

1. **Velvet/suede wine wall** — CSS texture: a warm sheen pool (`radial-gradient` of `rgba(236,182,152,·)` upper-centre), a darkened base, a fine directional "nap" (`repeating-linear-gradient(94deg, rgba(255,255,255,.055) 0 1px, transparent 1px 4px)` at `soft-light`), plus a faint overlay grain. Sits on a wine radial base gradient. (Chosen over plaster/concrete/marble/linen/paper/grunge/stucco/smooth.)
2. **Giant Alex Brush "Varsheni"** wordmark, crème, layered **behind** the subject. Resting warm glow via `text-shadow` (`--glow`). **Neon flicker-on** startup animation (`@keyframes neonOn` — dim → stutter → steady). Respect `prefers-reduced-motion`.
3. **Faint crème back-glow** — soft radial halo behind her upper body.
4. **Subject** — `varsheni-2` as a background-removed cut-out (rembg), **edges feathered/anti-aliased**, crisp (no fade/mask/window). Centred, bottom-anchored, ~60vh tall, subtle drop-shadow.
5. **Overlays:** minimal nav (Playfair italic "Varsheni" logotype left; Work · About · Reels · Inquire right); rotating **wax-seal CTA** "· work with me · tech ugc · honest reviews ·" with ↗ core (bottom-right); **availability pill** with amber status dot "Available for brand deals" (bottom-left); **vertical side text** (left "Apps · Businesses · Honest reviews", right "Est. 2026 — Made in India"); scattered **sparkles ✦**; **corner registration ticks**.

Below the hero, a clean **crème section** begins (hard section boundary — the rejected "cream page-fade" is **not** used).

**Rejected during design (do not reintroduce):** satin photo/video wall background; beige arch "window" frame; cream page-fade transition; linear or circular image-edge fades; the duotone/grain/halftone/reflection image treatments.

## 6. About / Reels / Offer / Contact (build fidelity: follow the system)

These reuse the locked tokens, type, and motifs; detailed visual comps happen in-build against the hero's language.

- **About** — crème surface. Eyebrow "✦ Introduction", Playfair "Hi, I'm Varsheni.", a short Montserrat bio, an Alex Brush pull-line ("Reviews worth trusting."), and a portrait (`varsheni-3`, the sunset-glow shot). Optionally the moodboard values (Élégance · Ambition · Qualité · Confiance · Authenticité) as an elegant list.
- **The Work / Reels** — the core proof. A gallery of **9:16 vertical** reels (embla-carousel or a responsive grid), each a tapping-to-play card with title + the app/business reviewed. Hover/scroll reveal.
- **What I Offer** — a compact wine panel: honest reviews, UGC content, brand collaborations. Copy-led, no counters.
- **Contact / Inquire** — `@calcom/embed-react` booking + email, on a wine surface, closing with the cursive wordmark and seal motif.

## 7. Motion plan

**Shipped in hero:** neon flicker-on of the name; rotating wax-seal; resting glow.

**Language for the rest:** restrained editorial reveals on scroll (mask-wipe headlines, soft settle on images) via **GSAP + Lenis** (already installed). Playful kinetic touches (drifting marquee) reserved for section seams only. No heavy 3D/WebGL as the core (v1's retired mistake).

**Global edge FX — GradualBlur (ship):** a **progressive bottom-edge blur** applied across scroll sections so content dissolves softly as it leaves the viewport (React Bits `GradualBlur` pattern — stacked `backdrop-filter` layers with progressive `mask` gradients; `divCount ~6`, exponential, `to bottom`). **Suppressed on the section that contains the footer** — the footer/contact info renders crisp with no blur overlay (conditional prop, e.g. `hasFooter`). Pure CSS; the listed `mathjs` dependency is **not** needed. Respect the no-`backdrop-filter` fallback.

**Background WebGL — deferred (None for now):** Side Rays and Aurora (React Bits, `ogl`) were both prototyped over the velvet. **Decision: ship with no background WebGL effect.** If revisited, **Side Rays recolored warm** (gold `#EAB308` + crème rays, `origin: top-right`) is the on-palette option; Aurora's cool-cosmic character fights the wine and is not recommended.

**Planned enhancements for the build phase** (owner: Varsheni, layered in during implementation):
- Particle animation around the name letters.
- Load-in animation of the subject cut-out.
- Additional micro-interactions per section.

All motion must respect `prefers-reduced-motion` and never block content.

## 8. Assets & pipeline

- Source portraits: `~/Downloads/varsheni-{1,2,3}.png`. Move working copies to `public/assets/incoming/` (untracked); ship finals under `public/`.
- **Hero cut-out:** produced with **rembg** (installed) + alpha-matting, then a tighten-erode + gaussian-alpha feather for smooth edges (see `.superpowers/brainstorm/**/cutout_v2.py` and the edge-smooth step). Export a transparent PNG for `public/`.
- Fonts via `next/font/google` (Playfair Display, Montserrat, Alex Brush) — no CDN `<link>` in production.
- Satin `satin.png` / `satin-flow.mp4` exist but are **not used** (velvet wall chosen).

## 9. Tech approach

- **Next.js 16** App Router + Turbopack, **React 19**, **TypeScript** (existing toolchain).
- **Tailwind v4** CSS-first `@theme inline` in `app/globals.css`; add the wine/espresso/mocha/taupe/crème tokens + font-family vars. Extend the existing neutral shadcn theme; keep light/dark tokens sane but the site is intentionally wine/crème.
- **shadcn/ui** primitives in `components/ui/` for all DOM UI (buttons, cards, carousel). No hand-rolled primitives. `cn()` from `lib/utils.ts`.
- **GSAP + Lenis** for scroll motion; **embla-carousel** for the reel gallery; **@calcom/embed-react** for booking.
- **React Compiler safe:** no synchronous setState in effects (use rAF/imperative refs); no `Math.random`/`Date.now` in render.
- Component boundaries: `Hero`, `HeroWall`, `NeonName`, `SubjectCutout`, `WaxSeal`, `About`, `ReelGallery`, `ReelCard`, `Offer`, `Contact`, `SiteNav`. Each focused and independently understandable.

## 10. Quality floor

- Responsive to mobile (hero recomposes: name scales, side text/seal hide on small screens, subject shrinks).
- Visible keyboard focus; semantic landmarks; alt text on the portrait.
- `prefers-reduced-motion` respected everywhere.
- Git: precise `git add <path>`, never `-A`; leave `.gitmodules`, `skills/`, `public/assets/incoming/` untracked; Co-Authored-By trailer on commits.

## 11. Out of scope (for now)

Brand-logo wall, written case studies / numeric stats, blog/press, multi-page routing, CMS. Revisit when real content exists.
