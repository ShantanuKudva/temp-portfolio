# CLAUDE.md

Orientation for Claude Code working in this repo. Keep this concise and high-signal.

## Project

**Varsheni** — a portfolio site for a **tech UGC creator who reviews apps & businesses**.

## Status — v2 (clean slate)

`v2` is a **fresh start**. The v1 build (a scroll-driven 3D landing sequence + editorial
portfolio) is preserved on the **`v1` branch** — refer to it there if you need the old
components, specs, or assets. The direction for v2 is **not yet decided**; brainstorm it
before building.

What's kept from v1:
- **Toolchain & config** — Next.js 16 (App Router, Turbopack), React 19, TypeScript, ESLint,
  Vitest, PostCSS.
- **Styling** — Tailwind v4 (CSS-first, `@theme inline` in `app/globals.css`) on a **neutral
  shadcn theme** (light + dark). No brand palette yet — set one when v2's direction is chosen.
- **UI** — **shadcn/ui** primitives in `components/ui/` (on `@base-ui/react`). Use these for
  all DOM UI; **no hand-rolled UI primitives**. `lib/utils.ts` has the `cn()` helper.
- **Non-3D packages** — gsap, lenis, embla-carousel, zustand, lucide-react, simple-icons,
  @calcom/embed-react remain available.

What was removed: the entire 3D stack (`three`, `@react-three/*`, `postprocessing`), all v1
app code, assets, tests, and scripts.

## Conventions

- **Git:** precise `git add <path>` — **never `-A`**. Leave `.gitmodules`, `skills/`,
  `public/assets/incoming/` untracked. Commits end with the Co-Authored-By trailer.
- **React Compiler safe:** no synchronous setState in effects (use rAF / imperative refs);
  no `Math.random` / `Date.now` in render.
- Install latest stable package versions.
