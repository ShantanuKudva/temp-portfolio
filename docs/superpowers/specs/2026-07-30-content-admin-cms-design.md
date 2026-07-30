# Content Admin (Payload CMS) — Design Spec

**Date:** 2026-07-30 · **Branch:** `v2` · **Status:** approved, ready for plan

## Problem

v2 is deployed on Vercel, but every piece of content — the 14 stub video reels, the
About page copy, and the rate-card packages — is hardcoded in TypeScript files
(`lib/work.ts`, `lib/contact-info.ts`, inline constants in `components/about/*.tsx`).
Changing anything requires editing code and redeploying. Varsheni, who isn't
technical, has no way to update her own site.

This spec adds an authenticated admin surface that lets Varsheni (and the
developer) do CRUD on that content without touching code, and makes the same
content editable by an AI agent (Claude) as a second interface into the same
system.

## Approach

**Payload CMS**, self-hosted inside this same Next.js app (mounted at `/admin`).
Payload runs as a Next.js plugin as of v3 — no separate service, no separate
deployment. It's MIT-licensed and free to self-host. In exchange for adding it as
a dependency, we get a generated admin UI, built-in auth, file uploads, and an
official MCP server, instead of hand-building CRUD forms, an upload pipeline, and
auth from scratch.

Two other approaches were considered and rejected:

- **Fully custom `/admin` panel** (Supabase/Neon + hand-rolled forms + hand-rolled
  auth) — full control over branding, but the most code to write and maintain, for
  a small, finite content model that doesn't need that control.
- **Sanity Studio** — most polished editing UX for structured/rich content, but
  editors log into an external, separately-branded Studio, and Sanity doesn't
  handle video itself (still needs a bolt-on video host), which undercuts the
  "one polished tool" pitch.

## Architecture & infrastructure

- **App:** Payload packages (`payload`, `@payloadcms/next`, `@payloadcms/db-postgres`,
  `@payloadcms/storage-vercel-blob`) added to this repo. `/admin` ships in the same
  `next build`/Vercel deployment as the public site — one deployment target, one
  hosting bill.
- **Database:** Postgres via **Neon's free tier**, not Supabase. Payload's own
  built-in auth removes the reason to use Supabase (bundled Postgres + Auth); as a
  bare Postgres host, Neon is the better fit because its free tier auto-suspends
  after 5 minutes idle and **auto-resumes on the next request in ~1s**. Supabase's
  free tier fully pauses projects after 7 days of inactivity and requires a manual
  "restore" click in their dashboard — a real risk for a low-traffic portfolio site
  with infrequent admin edits.
- **File storage:** **Vercel Blob**, free tier (1GB storage / 10GB transfer per
  month), via Payload's official storage adapter. Stores reel videos, poster
  images, and any other uploaded assets.
- **Secrets:** `DATABASE_URI` (Neon), `BLOB_READ_WRITE_TOKEN` (Vercel, auto-set),
  `PAYLOAD_SECRET` (session signing) — all Vercel environment variables, never
  committed.
- **Local dev:** points at the same Neon instance (or a local Postgres later, if
  wanted) — no separate local backend to stand up.

## Data model (collections)

**`Reels`** (replaces `REELS` in `lib/work.ts`)

- `title` (headline/hook, max-length guarded — see Validation)
- `subject` (app/business name)
- `category` — fixed dropdown of the current 7 (Money & fintech, AI & creator
  tools, Commerce & brands, Ed-tech, Health & fitness, Real estate, SaaS & B2B).
  Adding an 8th category is a small code change (one line in the enum), not an
  admin action — acceptable since the taxonomy rarely changes and it keeps the
  gallery layout predictable.
- `kind` — select: App / Business
- `video` — upload field → Vercel Blob, `video/mp4` only, size-capped (see
  Validation)
- `poster` — upload field → Vercel Blob, `image/*` only
- `href` — optional external IG/YT link
- `order` — controls position within its category

**`RateCardPackages`** (replaces `PACKAGES` in `lib/contact-info.ts`)

- `name`, `blurb`, `priceFrom`, `deliverables` (repeatable list of strings), `order`

**`SiteSettings`** (global, singleton — replaces `CONTACT` in `lib/contact-info.ts`)

- `email`, `calLink`, `instagram`, `youtube`, `rateCardPdf`, `responseTime`

**`About`** (global, singleton — replaces the constants scattered across
`about-page.tsx`, `who-i-am.tsx`, `what-i-bring.tsx`, plus inline hero/bio JSX text
that wasn't in a named constant). Per the "everything editable" decision, this
covers all of it:

- Availability badge text
- Hero eyebrow label ("About") + headline (h1)
- Sub-intro line ("Hi, I'm Varsheni…")
- Hero bio paragraphs (2, repeatable) + signature line ("— honest, always.")
- "Who I am" section eyebrow label
- "Who I am" narrative: heading ("Where I come from, and what shaped the eye.") +
  two paragraphs (repeatable — replaces the `who-i-am.tsx` copy currently marked
  `(Placeholder — your real story goes here.)`)
- `values` — repeatable `{ title, body }` (replaces `VALUES`)
- `bring` — repeatable `{ title, body }` (replaces `BRING` in `what-i-bring.tsx`)
- `education`, `qualifications` — repeatable strings
- `languages` — repeatable strings
- "What I stand for" section eyebrow label
- Pull-quote text + "Est. 2026 — Made in India" line

**`Users`** — Payload's built-in auth collection, seeded with exactly two accounts
(Varsheni, developer). No public signup.

## Auth & admin UX

- Email + password login at `/admin/login`, Payload's built-in session handling.
  Forgot-password uses Payload's built-in email-reset flow (needs a transactional
  email provider env var, e.g. Resend's free tier — small additional free
  dependency, confirmed acceptable under "best-fit, must be free").
- Every collection restricts create/update/delete to authenticated users only. The
  public site reads through a separate, read-only path (Payload's Local API from
  Server Components) — visitors never touch `/admin` or need authorization.
- Admin sidebar: **Reels**, **Rate Card Packages**, **About**, **Site Settings**.
  Reels and Rate Card Packages are list views (table → add/edit/delete, drag to
  reorder); About and Site Settings are single-record settings pages.
- This is Payload's stock generated admin UI, configured with the fields above —
  no custom screens built from scratch. Optional low-priority polish: swap the
  default Payload logo/favicon in `/admin` for something Varsheni-branded.

## Validation & storage limits

The binding constraint is Vercel Blob's free tier (1GB storage, 10GB transfer/
month) — videos are the expensive asset, not database rows.

- **Video uploads:** capped at a fixed max file size (default ~50MB, exact number
  finalized during implementation), `video/mp4` only. Enforced **both**
  server-side (real Payload field validation, not just UI hinting) **and**
  client-side before the upload starts, so an oversized file is rejected
  immediately rather than after a multi-minute upload fails at the end.
- **Poster uploads:** `image/*` only.
- **Text fields:** soft max-lengths on title/blurb/deliverable items/etc., sized
  to what the existing card layouts can hold without breaking (e.g. title ~60
  chars) — a layout-integrity guard as much as a data one.
- **Count of reels/packages:** no hard cap. Arbitrary caps are brittle; instead,
  storage usage is something to monitor via Vercel's Blob usage dashboard as the
  library grows, not something to enforce in code for v1.

## Public site integration & instant updates

- Static imports (`import { REELS } from "@/lib/work"`) are replaced with async
  data-fetch functions (e.g. `getReels()`) that query Payload's Local API,
  called from page-level Server Components (`app/work/page.tsx`,
  `app/about/page.tsx`, the rate-card section of `app/contact/page.tsx`).
- Downstream client components (`ReelCard`, `RateCard`, About sections, etc.) are
  **unchanged** — they still receive plain `Reel[]`/`Package[]` props, so none of
  the existing Framer Motion/GSAP animation code is touched. See "Design impact"
  below.
- **Instant updates:** each collection is cache-tagged (e.g. `tags: ['reels']`).
  Every create/update/delete in `/admin` (or via the MCP agent path) runs a
  Payload hook calling `revalidateTag(...)` immediately after the write. The next
  request gets fresh data — no rebuild, no waiting on a time-based ISR window.
- **Empty states:** if a collection is empty (e.g. all reels deleted), pages
  degrade gracefully — `/work` shows an empty-state message instead of a blank
  grid; empty About subsections simply don't render.

## Design impact

No visual redesign is required. The components that render content already take
plain data as props; only the data source changes (hardcoded array → Payload
query). The wine/crème styling, Framer Motion reveals, and the GSAP hero sequence
are untouched.

The only new visual surface is `/admin` itself (Payload's generic, functional
admin theme) — never seen by site visitors, optional to reskin later.

## AI-agent access (MCP)

Payload has an official MCP server that exposes every collection as tools
(create/read/update/delete/search) an MCP-compatible client can call, generated
automatically from the same collection config above — no custom chat interface
is built for this.

- **Developer:** connects Claude Code to the site's MCP server, authenticated as
  their own seeded Payload user.
- **Varsheni:** since she won't configure an MCP client herself, the developer
  does a one-time setup adding the site's MCP server as a custom connector in her
  Claude Desktop/claude.ai account. After that she edits content by chatting
  normally ("update the Single Review price to ₹30,000") — the admin GUI still
  exists for her if she prefers clicking over typing.
- **Access parity:** agent calls authenticate as a real Payload user and go
  through the exact same access-control and validation rules as the GUI —
  including delete. Full read/write/delete parity between agent and human access
  was chosen deliberately (convenience over an extra confirmation step); this is
  a real trade-off — a misfired agent action can delete real content the same way
  a misclicking human could, with no extra safety net beyond what already exists
  for the GUI.

## Testing plan

- **Data-layer functions** (`getReels()`, `getRateCardPackages()`,
  `getAboutContent()`, etc.) — unit tests with a mocked Payload Local API
  response, covering the empty-state fallback behavior.
- **Field validation** — unit tests against the Payload collection configs
  directly (oversized upload rejected, required fields rejected empty, overlong
  title rejected) — no browser needed.
- **Existing component tests** keep passing unchanged, since `ReelCard`/`RateCard`/
  etc. still just receive plain props.
- **Manual QA checklist** (not automated — inherently UI/upload-flow heavy): log
  in as both seeded accounts; create/edit/delete a reel including a real
  video+poster upload; verify it appears on `/work` without a rebuild; repeat for
  a rate-card package and an About field; verify an oversized video is rejected
  client-side before upload starts; verify logged-out visitors can't reach
  `/admin`.
- No E2E browser automation (e.g. Playwright) in scope for v1 — proportional to a
  small internal tool, not a new test framework in the repo.

## Non-goals (for this spec)

- Reskinning `/admin` to match wine/crème branding.
- A hard cap on the number of reels/packages.
- A custom-built chat UI for AI editing (Claude itself is the interface, via MCP).
- End-to-end browser test automation.
