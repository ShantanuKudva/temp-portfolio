# CLAUDE.md

Orientation for Claude Code working in this repo. Keep this concise and high-signal.

## Project

**Varsheni** — a portfolio site for a **tech UGC creator who reviews apps & businesses**.

## Status — v2 (direction locked, build not started)

`v2` is a **fresh start** off a clean slate. The v1 build (a scroll-driven 3D landing
sequence + editorial portfolio) is preserved on the **`v1` branch** — refer to it there if
you need the old components, specs, or assets.

**v2 direction (locked 2026-07-11):**

- **Palette:** wine / crème (deep velvet burgundy + warm off-white). No neutral shadcn palette
  anymore — set these as the brand tokens in `app/globals.css` when the first UI lands.
- **Type:** Playfair Display (display/serif) · Montserrat (UI/sans) · Alex Brush (cursive accent).
- **Hero:** velvet-wall backdrop with a **neon-flicker cursive name** (Alex Brush) over a
  rembg cut-out of `varsheni-2`. See the design spec commit (`f5888c4`) for the section plan.

Nothing is built yet — the hero is specced but not implemented. Run `brainstorming` /
`writing-plans` before building a section.

What's kept from v1:

- **Toolchain & config** — Next.js 16 (App Router, Turbopack), React 19, TypeScript, ESLint,
  Vitest, PostCSS.
- **Styling** — Tailwind v4 (CSS-first, `@theme inline` in `app/globals.css`), currently still
  the **neutral shadcn theme** (light + dark). Swap in the locked wine/crème brand tokens when
  the first UI lands.
- **UI** — **shadcn/ui** primitives in `components/ui/` (on `@base-ui/react`). Use these for
  all DOM UI; **no hand-rolled UI primitives**. `lib/utils.ts` has the `cn()` helper.
- **Non-3D packages** — gsap, lenis, embla-carousel, zustand, lucide-react, simple-icons,
  @calcom/embed-react remain available.

What was removed: the entire 3D stack (`three`, `@react-three/*`, `postprocessing`), all v1
app code, assets, tests, and scripts.

## Design & motion workflow

- **Animation stack = Framer Motion + Lenis.** Framer Motion (installed as `motion`, import
  from `motion/react`) is the backbone — the preferred default for all component motion,
  reveals, gestures, and layout transitions. Lenis stays for smooth scroll and pairs fine
  with Motion's `useScroll`/`useTransform`.
- **GSAP is a scoped escape hatch, not the default.** It's still installed; reach for it (with
  ScrollTrigger) only if a specific beat needs true scroll-*scrubbing*/pinning that's awkward
  in Motion — e.g. the hero's scrubbed cinematic sequence. Don't default to it. (If it ends
  up unused once the hero's built, we can drop `gsap`.)
- **Component libraries (21st.dev, reactbits) = idea sources, not dependencies.** Don't drop
  their code in raw — it carries a recognizable generic look. Lift the *layout/motion idea*,
  then re-skin to the wine/crème tokens, port Motion→GSAP where needed, and build on the
  existing shadcn / `@base-ui` primitives so everything stays one system.

## Skills to use

Installed at `~/.claude/skills` — lean on these for the build:

- `frontend-design`, `web-design-guidelines` — visual taste + UI-guideline review.
- `shadcn` — adding/composing shadcn components (this project uses `components.json`).
- `vercel-react-best-practices` — React 19 / Next 16 performance patterns.
- `animation-vocabulary`, `review-animations` — name motion effects precisely, then review
  the animation quality (Emil Kowalski). Use when tuning the hero's flicker/reveal motion.

## Conventions

- **Git:** precise `git add <path>` — **never `-A`**. Leave `.gitmodules`, `skills/`,
  `public/assets/incoming/` untracked. Commits end with the Co-Authored-By trailer.
- **React Compiler safe:** no synchronous setState in effects (use rAF / imperative refs);
  no `Math.random` / `Date.now` in render.
- Install latest stable package versions.
