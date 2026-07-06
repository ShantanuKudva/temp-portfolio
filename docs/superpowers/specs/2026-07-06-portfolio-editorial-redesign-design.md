# Portfolio Editorial Redesign — Design

**Date:** 2026-07-06
**Branch:** `build/landing-sequence`
**Status:** Approved (design), pending implementation plan
**Supersedes the layout of:** the post-transition portfolio sections defined in `2026-07-05-portfolio-pitch-scrollytelling-design.md` (the 3D landing + handoff mechanics are unchanged).

## Problem

After the 3D landing pushes through to black, the portfolio fades in (see `PortfolioReveal`). Today those DOM sections — About, ReelCatalogue, WhatYouGet, TheAsk, PitchFooter — read as **empty and simple**:

1. Every section is `min-h-screen` but content fills only the top third, leaving ~half a screen of dead black beneath each.
2. Flat pure-black ground, thin outlined chips, left/centre-aligned text floating in space. No depth, texture, imagery, or structure; the warm palette (maroon/gold) is barely used.

## Goal

Redesign the post-transition portfolio as an **editorial / magazine** experience: opinionated typography, asymmetric composition, richer surfaces, and three new sections — so it reads as a designed feature spread continuous with the cinematic hero, not a sparse landing page.

This spec covers **only** the post-transition DOM portfolio. The 3D landing, the `P_MAX=0.9` cap, the `LandingCurtain`, and the `PortfolioReveal` crossfade are unchanged (see [[project_scroll_pin_gotcha]]).

## Direction (locked with user)

- **Aesthetic:** editorial / magazine.
- **Type:** introduce **Fraunces** (open-license display serif, self-hosted via `next/font` — no external CDN) for the **wordmark + pull-quotes**; keep **Geist** sans (body + big display) and **Geist Mono** (labels, numerals, kickers).
- **Navigation:** none — pure scroll (no nav bar, no separate routes; the scroll is the experience).
- **Motion:** masthead **pinned-settle**; other sections fade/rise on reveal; subtle parallax on the oversized "ghost" section numerals. **No GSAP pins anywhere** — all motion is scroll-linked transform/opacity (React-safe; see Constraints).

## Palette (warm dark — committed single theme)

| Token | Hex | Use |
|---|---|---|
| Ground | `#160C0E` | Page background |
| Ink | `#0E0708` | Footer, deep surfaces |
| Cherry maroon | `#7B1E2B` | Accent, The Ask panel, glow |
| Deep wine | `#571620` | Deeper accent |
| Antique gold | `#B08D4C` | Hairlines, numerals, mono labels |
| Warm sand | `#EADFCF` | Body text (never pure white) |
| Dusty blush | `#E8C9C4` | Soft washes on maroon |

Neutrals are the sand family at varied opacity — chosen warm neutrals, not grey. White (`#fff`) only for the highest-emphasis display/pull-quote text.

## Editorial system (applied to every section)

A shared magazine language so sections stop floating:

- **Indexed section header** — a mono index numeral (`02`) + oversized display title + a mono kicker, sitting on a full-width hairline gold rule. Repeats down the page.
- **Oversized "ghost" numeral** — a large italic-serif section number bleeding off the right edge behind the header, with subtle scroll parallax. *Numbering encodes real reading order (a magazine's contents), which is legitimate sequence information.*
- **Asymmetric 12-column grid** (`max-w-1200`) — content spans specific columns, not centred blocks.
- **Mono metadata** — `N°01`, category tags, timeline labels.
- **Drop-cap** lead paragraph (masthead + case study).
- **Italic serif pull-quotes** (Fraunces), oversized.
- **Hairline maroon/gold rules** separating rows and columns.
- **Depth** — a fixed film-grain overlay (inline SVG noise, ~4.5% opacity) + soft maroon radial glows behind key elements.
- **Sections sized to content** — spacing via a `py` rhythm, not `min-h-screen` centring. This is the primary fix for the dead voids.

## Section flow (9 + footer)

| # | Section | Source | Notes |
|---|---|---|---|
| 01 | **Masthead** | rework `beats/About.tsx` | Serif wordmark + mono strapline, portrait spanning left columns, drop-cap bio, "thumb-stop" line as giant pull-quote, facts as a numbered index. **Pinned-settle motion.** |
| 02 | **Selected Work** | rework `ReelCatalogue.tsx` | Indexed header + a numbered reel index (left) that tracks the active slide. **Keep the Instagram reel hero carousel + thumbnails as built.** |
| 03 | **Case Study** | new `CaseStudy.tsx` | One reel unpacked: brief → hook (pull-quote) → outcome metrics. Reel on one side, story on the other. |
| 04 | **How it's made** | new `HowItsMade.tsx` | 4 numbered steps (Brief → Script → Shoot → Ship), oversized gold serif numerals, hairline rules. |
| 05 | **The Package** | rework `beats/WhatYouGet.tsx` | Deliverables as a ruled **spec-sheet** (not thin chips); stats as oversized numerals. App wall **removed** (moves to Reviewed). |
| 06 | **Pricing** | new `Pricing.tsx` | 3 ruled tier columns (Single / Bundle "Most booked" / Retainer). Placeholder rates. |
| 07 | **Reviewed** | new `Reviewed.tsx` | The apps & tools she covers as a fuller editorial **logo grid** with names + categories. Uses real logo assets from `lib/appLogos`. |
| 08 | **FAQ** | new `Faq.tsx` | Ruled Q&A rows (Q left columns, A right columns), numbered. |
| 09 | **The Ask** | rework `beats/TheAsk.tsx` | Cherry-maroon closing spread: giant serif line + contact **colophon** + the existing CTA buttons (keep `BookCallButton`, `nativeButton` anchors). |
| — | **Footer** | rework `PitchFooter.tsx` | Tightened to the system (serif wordmark, mono column heads, hairlines). |

## Motion spec

- **Masthead pinned-settle** — as you scroll the masthead, the giant wordmark condenses to a compact running header: its font-size (or scale) interpolates from large → small on a smoothstep of scroll progress, the strapline fades, and a hairline + backdrop-blur appear under the header. Implemented as a **scroll-linked transform** reading `getBoundingClientRect()` in a rAF loop — **not** a GSAP pin, **not** CSS `position: sticky` inside the transformed `PortfolioReveal` wrapper (that wrapper's `transform`/`will-change` would become the sticky containing block and break it). Must **coordinate with `PortfolioReveal`**: the settle should only compute once the reveal's transform-hold has released (e.g., gate on the masthead's natural top ≤ 0), so the two transforms don't fight.
- **Section reveals** — reuse the existing `Reveal` component (fade + rise on IntersectionObserver) for section content.
- **Ghost numeral parallax** — a small scroll-linked `translateY` on the oversized section numerals as they cross the viewport. Subtle.
- **Reduced motion** — `prefers-reduced-motion: reduce` disables the settle (static wordmark) and parallax; `Reveal` already respects it.

## New content (placeholder — clearly marked, swap later)

**How it's made** (4 steps):
1. **Brief** — You send the product and the one thing you wish people understood. We find the hook worth sixty seconds.
2. **Script** — A tight script — the hook, the point, the verdict. Written the way a friend talks, not a sponsored read.
3. **Shoot** — Shot and cut for the feed: vertical, captioned, thumb-stopping from the very first frame.
4. **Ship** — Posted to her audience within seven days — with full usage rights to run it anywhere you like.

**Case Study** (Linear):
- Eyebrow: `The brief · Linear`
- Brief: "Linear is fast — but 'fast' is invisible in a screenshot. They needed people to *feel* it, not read about it."
- Pull-quote: "So we didn't say fast. We showed the half-second between click and done."
- Metrics (PLACEHOLDER): `1.3M views · 24k saves · 3.1k comments`
- Note line: "Placeholder numbers — real case metrics on request."

**Pricing** (3 tiers, rates are PLACEHOLDER `$—`):
- **Single — One review** · `$— / reel` · 1× 60-second vertical reel · 7-day turnaround · one revision round · full usage rights.
- **Bundle — Three reviews** *(Most booked)* · `$— / three` · 3× reels your cadence · priority turnaround · bundle saving · full usage rights.
- **Retainer — Monthly** · `$— / month` · 4 reels every month · first pick of drops · ongoing, cancel anytime · full usage rights.

**FAQ** (5):
1. Who writes the script? — She does, from your brief — and you approve it before anything gets shot.
2. How many revisions? — One round is included. Approving the script up front keeps it tight and on-message.
3. Do I own the reel? — Yes — full usage rights to run it on your channels, ads, and site, for good.
4. Will you post it too? — Yes, to her audience. That reach is part of the deal, not an add-on.
5. How fast is it? — Seven days from brief to posted — faster on a bundle or retainer.

**Reviewed** — expand the current app wall into a grid of logo + name + category, using existing assets in `lib/appLogos` / `public/assets/logos` where available (e.g. Linear · Productivity, Notion · Workspace, Claude · AI, Figma · Design, Perplexity · AI Search, GitHub · Dev, Vercel · Dev, Raycast · Productivity, Framer · Web, Arc · Browser, Superhuman · Email, Cursor · AI Dev). Categories are placeholder.

## Architecture

**Fonts** — add Fraunces via `next/font/google` (or self-hosted `next/font/local`), exposing `--font-serif`; wire alongside the existing Geist setup in `app/layout.tsx`. Expose a `.font-serif` utility / Tailwind token.

**Shared editorial primitives** (new, in `components/pitch/`):
- `SectionHead.tsx` — indexed header (index numeral, title, kicker, rule) + optional ghost numeral with parallax.
- `PullQuote.tsx` — oversized italic serif quote with gold quotation marks.
- `EditorialBackdrop.tsx` (or global CSS utilities) — film grain overlay + maroon radial glow helpers.
- Drop-cap as a utility class in `app/globals.css`.

**Section components** — new: `CaseStudy`, `HowItsMade`, `Pricing`, `Reviewed`, `Faq`. Reworked: `Masthead` (from `About`, now a client component for the settle), `ReelCatalogue`, `WhatYouGet` → `ThePackage`, `TheAsk`, `PitchFooter`. `PortfolioPage.tsx` renders the new 9-section order. Each section stays a small, single-purpose module.

**Content** — extend `lib/pitchContent.ts` with `PROCESS_STEPS`, `CASE_STUDY`, `PRICING_TIERS`, `FAQ`, and a `BRANDS` list (name + category, referencing `lib/appLogos`). All new copy marked PLACEHOLDER where not real.

## Constraints & risks

- **No GSAP pins in the portfolio.** Pin applies a transform to its wrapper (breaks the fixed 3D canvas) and reparents live React subtrees (crashes with `insertBefore`). All motion is scroll-linked transform/opacity. See [[project_scroll_pin_gotcha]].
- **Masthead settle must coordinate with `PortfolioReveal`'s transform-hold** — engage only after the reveal releases; do not use `position: sticky` inside the transformed wrapper.
- **Fraunces self-hosted** via `next/font` — never a webfont `<link>` (blocked/fragile).
- **Keep the fixed 3D canvas untouched**; portfolio stays `z-10` above it, above the `LandingCurtain` (`z-[5]`).
- **Preserve the Instagram reel carousel** (already built) — frame it editorially, don't rebuild it.
- **Quality over perf** on visuals (see [[feedback_quality_over_perf]]): grain/glow are cheap; the settle is one rAF-driven element.

## Out of scope

- Real copy, real pricing, real case metrics, real portrait photo (all placeholder, clearly marked).
- Testimonials / Praise (user declined).
- Section navigation / deep-link anchors (user chose pure scroll).
- Mobile motion fine-tuning (responsive layout is in scope; motion tuning deferred).

## Verification

- `npx tsc --noEmit` clean (ignoring the pre-existing `LogoField.tsx` WIP).
- Puppeteer renders (headless system Chrome, the established channel) per section: confirm no dead voids, editorial layout, palette usage; capture masthead settle at rest → mid → condensed.
- Confirm no console/page errors, the 3D canvas stays `position: fixed` (top 0), and the portfolio is not covered black (the earlier stacking bug).
- Reduced-motion: settle disabled, layout intact.
