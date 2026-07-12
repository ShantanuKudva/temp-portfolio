# Connect (`/contact`) — Design Spec

**Date:** 2026-07-12 · **Branch:** `v2` · **Status:** approved, ready for plan

The Connect page is the site's "work with me" destination — booking-first, but also
the home of packages/pricing, contact channels, and a downloadable rate card. It
inherits the **Connect** nav-card's warm world and shares all page furniture with the
hero + About so the site reads as one system.

## Theme

- **Base:** espresso gradient `#3f2d25 → #201410` (the Connect card's `grad`).
- **Accents:** gold `#d9a05b` (primary / `--color-amber-dot` family) and terracotta
  `#a8674a`; crème `#f3e6cf` for warm highlights. Warmer + goldier than About's mocha/taupe.
- **Main background theme = Aurora.** A gold/terracotta-tinted Aurora is Connect's
  signature backdrop, spanning the whole page beneath the espresso base. It is a
  sticky/fixed, viewport-sized layer with **scroll-eased opacity** (mount early while
  transparent, ease in, gently fade — never a flashbang), reusing the proven pattern from
  About's `AuroraRegion`. Suggested `colorStops={["#f3e6cf", "#d9a05b", "#a8674a"]}`,
  low blend, low amplitude so it stays ambient behind content, not loud.
- **Shared furniture:** sparkle props, feathered edges, and the bottom `GradualBlur`
  (`position="bottom" target="page"`) exactly as on About. Type: Playfair (display),
  Montserrat (sans/UI), Alex Brush (cursive accent, gold).

## Page structure (top → bottom)

### 1 · Hero band
- Eyebrow `✦ Connect`; cursive **"let's talk"** (Alex Brush, gold); Playfair headline
  *"Have an app or business worth an honest look?"*; one line of subcopy.
- **Availability pill** — reuse About's pulsing amber-dot pill ("Booking Q3 collabs" /
  copy TBD).
- Sits over the Aurora backdrop; no separate Silk layer (Aurora replaces it).

### 2 · Rate card / Packages
- Section header: *"What working together looks like."*
- **Three package tiles** — gold-accented chocolate glass cards, same visual family as
  About's "What I bring" bento (chocolate gradient, sheen hairline, feathered/soft):
  - **Single Review** — e.g. *1 reel + stories, usage rights, 1 revision* · **from ₹X**
  - **Campaign Package** — e.g. *3 reels, stories, usage rights, 2 revisions* · **from ₹X**
  - **Custom / Retainer** — e.g. *ongoing collaboration, bespoke scope* · **from ₹X**
- Prices are **"from ₹X" anchors** (starting prices). Numbers are placeholders until she
  provides real ones.
- **"Download rate card (PDF)"** button beneath the row (links to a placeholder asset).

### 3 · Book & reach me
Two columns on desktop, stacked on mobile:
- **Cal.com inline embed** (the star) — `@calcom/embed-react`, `getCalApi()` to set
  `theme:"dark"` + `cal-brand` = gold `#d9a05b` once; `<Cal calLink="…" />` inline.
  Wrapped in a chocolate frame with an amber hairline + feathered top so the light iframe
  integrates instead of floating as a white slab.
- **Contact rail** (beside/above the calendar) — secondary channels:
  - **Email** (mailto:)
  - **Instagram**, **YouTube** (from the Connect nav-card links)
  - Response-time line — "usually replies within 48h".

### 4 · Close
- Short reassurance line; the page-level bottom `GradualBlur`.

## Components to build

- `components/contact/contact-page.tsx` — client composition (Aurora backdrop + all bands),
  replacing the `PagePlaceholder` in `app/contact/page.tsx`.
- `components/contact/rate-card.tsx` — the three package tiles + PDF button. Data-driven
  from a small `PACKAGES` const.
- `components/contact/booking.tsx` — Cal inline embed (themed) + contact rail.
- Reuse: `AuroraRegion` pattern (either reuse the component with warm `colorStops`, or a
  thin `ContactAurora` wrapper if the About one is too coupled), `Reveal`, `GradualBlur`,
  the availability pill + sparkle props (lift from About), `CurtainLink`.
- CSS Modules (`contact.module.css`) for any keyframes / masks (feathered frame, etc.).

## Data / placeholders (flag for real values)

- Cal link / username (`calLink`).
- 3× package deliverables + **"from ₹X"** starting prices.
- Rate-card **PDF** asset (drop into `public/`).
- Contact **email**.
- **Instagram** + **YouTube** handles/URLs (currently `#` in the nav card).

## Tech notes

- **Cal embed:** call `getCalApi()` in an effect, set `ui`/theme/brand once; render `<Cal>`
  inline. React-Compiler-safe (no sync setState in effects; use the async api call).
- **Aurora:** OGL/WebGL — mount early while opacity ~0 to hide the first-frame flash;
  scroll-linked opacity via `useScroll`/`useTransform`; a soft radial floor overlay keeps
  content contrast (as in About). Respect `useReducedMotion`.
- **JS-interop** React Bits components need the
  `as unknown as React.ComponentType<Record<string, unknown>>` cast.

## Out of scope (for now)

- Testimonials / "brands I've worked with" strip, FAQ — can be added later; keep the first
  build lean and focused on browse-packages → book/email.
- Real form submission backend — the primary action is the Cal booking + mailto; no custom
  form is being built this pass.

## Conventions

Precise `git add <path>` (never `-A`); leave `.gitmodules`, `skills/`,
`public/assets/incoming/` untracked. Framer Motion (`motion/react`) is the backbone; GSAP
only if a beat truly needs scrubbing. Commits end with the Co-Authored-By trailer.
