# Connect (`/contact`) Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the warm, Aurora-backed `/contact` ("Connect") page — a booking-first "work with me" page with a hero, a "from ₹X" rate-card band, and an inline Cal.com booking beside a contact rail.

**Architecture:** A client-composed page (`ContactPage`) sits over a page-wide gold/terracotta **Aurora** backdrop (scroll-eased opacity, modeled on About's `AuroraRegion`). Content is decomposed into small, focused components: a data module (`lib/contact-info.ts`) holds all placeholder copy/links so real values live in one place; `RateCard`, `ContactRail`, `CalEmbed` are each self-contained; `Booking` lays out the last two; `ContactAurora` is the backdrop. The route file swaps the current `PagePlaceholder` for `ContactPage`.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, Framer Motion (`motion/react`), `@calcom/embed-react` v1.5.3, the `Aurora` React-Bits (OGL) component, Vitest + `@testing-library/react`.

## Global Constraints

- **Palette:** espresso base `#3f2d25 → #201410`; accents gold `#d9a05b` (existing `--color-amber-dot`) + terracotta/clay `#a8674a` (new `--color-clay`); crème highlight `#f3e6cf`. Fonts: Playfair (`font-display`), Montserrat (`font-sans`), Alex Brush (`font-script`).
- **Main background = Aurora**, gold/terracotta tinted, scroll-eased opacity (never a flashbang). No Silk on this page.
- **Animation backbone = Framer Motion**, imported from `motion/react`. GSAP only if a beat truly needs scrubbing (none here).
- **React-Compiler-safe:** no synchronous `setState` in effects (use rAF / async); no `Math.random` / `Date.now` in render.
- **React-Bits JS-interop components** must be cast: `AuroraBase as unknown as React.ComponentType<Record<string, unknown>>`.
- **Git:** precise `git add <path>` — never `-A`. Leave `.gitmodules`, `skills/`, `public/assets/incoming/` untracked. Commit messages end with:
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`
- **Reuse, don't duplicate:** `Reveal` (`@/components/motion/reveal`), `GradualBlur` (`@/components/effects/gradual-blur`), `CurtainLink` (`@/components/transition/curtain-link`).
- **Placeholders** (Cal link, prices, email, IG/YouTube handles, rate-card PDF) live only in `lib/contact-info.ts`, each marked `// TODO(real):` so the user can fill them in one file.

---

## File Structure

- **Create** `lib/contact-info.ts` — typed placeholder data: `CONTACT` (email, calLink, instagram, youtube, rateCardPdf, responseTime) + `PACKAGES` (3 tiers).
- **Modify** `app/globals.css` — add `--color-clay: #a8674a;` to the `@theme inline` brand palette.
- **Create** `components/contact/rate-card.tsx` — the three package tiles + PDF button (uses `PACKAGES`).
- **Create** `components/contact/contact-rail.tsx` — email + IG + YouTube + response-time (uses `CONTACT`).
- **Create** `components/contact/cal-embed.tsx` — themed inline Cal.com booking (uses `CONTACT.calLink`).
- **Create** `components/contact/booking.tsx` — two-column layout: `CalEmbed` + `ContactRail`.
- **Create** `components/contact/contact-aurora.tsx` — page-wide gold/terracotta Aurora backdrop.
- **Create** `components/contact/contact-page.tsx` — full composition (hero + `RateCard` + `Booking` + close + `GradualBlur`), wrapped in `ContactAurora`.
- **Modify** `app/contact/page.tsx` — replace `PagePlaceholder` with `ContactPage`; keep metadata.
- **Create** `tests/contact-info.test.ts`, `tests/rate-card.test.tsx`, `tests/contact-rail.test.tsx`.

---

## Task 1: Theme token + contact data module

**Files:**
- Modify: `app/globals.css` (brand palette in the `@theme inline` block, near line 21)
- Create: `lib/contact-info.ts`
- Test: `tests/contact-info.test.ts`

**Interfaces:**
- Produces:
  - `type Package = { key: string; name: string; blurb: string; deliverables: string[]; priceFrom: string }`
  - `type ContactInfo = { email: string; calLink: string; instagram: string; youtube: string; rateCardPdf: string; responseTime: string }`
  - `export const PACKAGES: Package[]` (length 3)
  - `export const CONTACT: ContactInfo`

- [ ] **Step 1: Add the clay token**

In `app/globals.css`, inside the `@theme inline { … }` block, immediately after the `--color-amber-dot: #d9a05b;` line, add:

```css
  --color-clay: #a8674a;
```

- [ ] **Step 2: Write the failing test**

Create `tests/contact-info.test.ts`:

```ts
import { CONTACT, PACKAGES } from "@/lib/contact-info";

test("PACKAGES has three tiers, each with a 'from ₹' price and deliverables", () => {
  expect(PACKAGES).toHaveLength(3);
  for (const p of PACKAGES) {
    expect(p.name.length).toBeGreaterThan(0);
    expect(p.priceFrom).toMatch(/from ₹/);
    expect(p.deliverables.length).toBeGreaterThan(0);
  }
  // keys are unique (used as React keys)
  expect(new Set(PACKAGES.map((p) => p.key)).size).toBe(3);
});

test("CONTACT exposes an email, cal link, and both socials", () => {
  expect(CONTACT.email).toContain("@");
  expect(CONTACT.calLink.length).toBeGreaterThan(0);
  expect(CONTACT.instagram).toMatch(/^https?:\/\//);
  expect(CONTACT.youtube).toMatch(/^https?:\/\//);
  expect(CONTACT.responseTime.length).toBeGreaterThan(0);
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run tests/contact-info.test.ts`
Expected: FAIL — `Cannot find module '@/lib/contact-info'`.

- [ ] **Step 4: Create the data module**

Create `lib/contact-info.ts`:

```ts
export type Package = {
  key: string;
  name: string;
  blurb: string;
  deliverables: string[];
  priceFrom: string;
};

export type ContactInfo = {
  email: string;
  calLink: string;
  instagram: string;
  youtube: string;
  rateCardPdf: string;
  responseTime: string;
};

/**
 * Placeholder rate-card tiers. Deliverables + starting prices are stand-ins —
 * swap for Varsheni's real numbers.
 */
export const PACKAGES: Package[] = [
  {
    key: "single",
    name: "Single Review",
    blurb: "One product, one honest verdict.",
    deliverables: ["1 reel (30–60s)", "3 story frames", "Usage rights (30 days)", "1 revision"],
    priceFrom: "from ₹25,000", // TODO(real): confirm starting price
  },
  {
    key: "campaign",
    name: "Campaign Package",
    blurb: "A multi-touch push across a launch.",
    deliverables: ["3 reels", "Story series", "Usage rights (90 days)", "2 revisions"],
    priceFrom: "from ₹75,000", // TODO(real): confirm starting price
  },
  {
    key: "retainer",
    name: "Custom / Retainer",
    blurb: "Ongoing collaboration, bespoke scope.",
    deliverables: ["Monthly deliverables", "Priority slots", "Extended rights", "Strategy input"],
    priceFrom: "from ₹1,50,000/mo", // TODO(real): confirm starting price
  },
];

export const CONTACT: ContactInfo = {
  email: "hello@varsheni.com", // TODO(real): real inbox
  calLink: "varsheni/intro", // TODO(real): real Cal.com <username>/<event>
  instagram: "https://instagram.com/", // TODO(real): handle
  youtube: "https://youtube.com/", // TODO(real): channel
  rateCardPdf: "/rate-card.pdf", // TODO(real): drop the PDF into /public
  responseTime: "Usually replies within 48h",
};
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run tests/contact-info.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add app/globals.css lib/contact-info.ts tests/contact-info.test.ts
git commit -m "feat(contact): add clay token + contact-info data module

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Rate-card band

**Files:**
- Create: `components/contact/rate-card.tsx`
- Test: `tests/rate-card.test.tsx`

**Interfaces:**
- Consumes: `PACKAGES` from `@/lib/contact-info`; `CONTACT.rateCardPdf`; `Reveal` from `@/components/motion/reveal`.
- Produces: `export function RateCard(): JSX.Element` (a `<section id="packages">`).

- [ ] **Step 1: Write the failing test**

Create `tests/rate-card.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { RateCard } from "@/components/contact/rate-card";
import { PACKAGES, CONTACT } from "@/lib/contact-info";

test("RateCard renders every package with its name and 'from ₹' price", () => {
  render(<RateCard />);
  for (const p of PACKAGES) {
    expect(screen.getByText(p.name)).toBeInTheDocument();
    expect(screen.getByText(p.priceFrom)).toBeInTheDocument();
    expect(screen.getByText(p.deliverables[0])).toBeInTheDocument();
  }
});

test("RateCard links the PDF download to CONTACT.rateCardPdf", () => {
  render(<RateCard />);
  const link = screen.getByRole("link", { name: /rate card/i });
  expect(link).toHaveAttribute("href", CONTACT.rateCardPdf);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/rate-card.test.tsx`
Expected: FAIL — `Cannot find module '@/components/contact/rate-card'`.

- [ ] **Step 3: Implement the component**

Create `components/contact/rate-card.tsx`:

```tsx
"use client";

import { CONTACT, PACKAGES, type Package } from "@/lib/contact-info";
import { Reveal } from "@/components/motion/reveal";

function Tile({ pkg, delay }: { pkg: Package; delay: number }) {
  return (
    <Reveal delay={delay} className="h-full">
      <div className="flex h-full flex-col rounded-3xl border border-creme/12 bg-gradient-to-br from-[#3f2d25]/90 via-[#2a1c14]/85 to-[#140d09]/92 p-7 backdrop-blur-md transition-colors duration-300 hover:border-amber-dot/50 sm:p-8">
        <h3 className="font-display text-2xl sm:text-[1.7rem]">{pkg.name}</h3>
        <p className="mt-1.5 font-sans text-[14px] leading-relaxed text-creme/60">
          {pkg.blurb}
        </p>
        <ul className="mt-6 flex-1 space-y-2.5">
          {pkg.deliverables.map((d) => (
            <li key={d} className="flex items-start gap-2.5 font-sans text-[14px] text-creme/75">
              <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-clay" />
              {d}
            </li>
          ))}
        </ul>
        <p className="mt-7 font-display text-xl text-amber-dot">{pkg.priceFrom}</p>
      </div>
    </Reveal>
  );
}

/**
 * "What working together looks like" — three package tiles with "from ₹X"
 * anchors and a downloadable rate-card PDF. Same card family as About's bento.
 */
export function RateCard() {
  return (
    <section id="packages" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal>
          <p className="mb-3 font-sans text-xs font-medium uppercase tracking-[0.3em] text-amber-dot">
            <span>✦</span>&nbsp;&nbsp;Rate card
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mb-12 max-w-xl font-display text-3xl leading-tight sm:text-5xl">
            What working together looks like.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PACKAGES.map((pkg, i) => (
            <Tile key={pkg.key} pkg={pkg} delay={i * 0.06} />
          ))}
        </div>

        <Reveal delay={0.12}>
          <a
            href={CONTACT.rateCardPdf}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-creme/25 px-6 py-3 font-sans text-sm font-semibold uppercase tracking-[0.14em] text-creme transition-colors hover:border-amber-dot/60 hover:text-amber-dot"
            download
          >
            ↓ Download rate card (PDF)
          </a>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/rate-card.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add components/contact/rate-card.tsx tests/rate-card.test.tsx
git commit -m "feat(contact): rate-card band with three package tiles + PDF

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Contact rail

**Files:**
- Create: `components/contact/contact-rail.tsx`
- Test: `tests/contact-rail.test.tsx`

**Interfaces:**
- Consumes: `CONTACT` from `@/lib/contact-info`; `Reveal`.
- Produces: `export function ContactRail(): JSX.Element`.

- [ ] **Step 1: Write the failing test**

Create `tests/contact-rail.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { ContactRail } from "@/components/contact/contact-rail";
import { CONTACT } from "@/lib/contact-info";

test("ContactRail renders a mailto link, both socials, and the response time", () => {
  render(<ContactRail />);

  const email = screen.getByRole("link", { name: /email/i });
  expect(email).toHaveAttribute("href", `mailto:${CONTACT.email}`);

  const ig = screen.getByRole("link", { name: /instagram/i });
  expect(ig).toHaveAttribute("href", CONTACT.instagram);
  expect(ig).toHaveAttribute("target", "_blank");

  const yt = screen.getByRole("link", { name: /youtube/i });
  expect(yt).toHaveAttribute("href", CONTACT.youtube);

  expect(screen.getByText(CONTACT.responseTime)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/contact-rail.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the component**

Create `components/contact/contact-rail.tsx`:

```tsx
"use client";

import { CONTACT } from "@/lib/contact-info";
import { Reveal } from "@/components/motion/reveal";

const CHANNELS = [
  { label: "Email", href: `mailto:${CONTACT.email}`, value: CONTACT.email, external: false },
  { label: "Instagram", href: CONTACT.instagram, value: "@varsheni", external: true },
  { label: "YouTube", href: CONTACT.youtube, value: "Varsheni", external: true },
];

/**
 * Secondary contact channels beside the Cal booking: email + socials + a
 * response-time reassurance line.
 */
export function ContactRail() {
  return (
    <Reveal className="flex flex-col justify-center gap-6">
      <div>
        <p className="font-sans text-xs font-medium uppercase tracking-[0.3em] text-amber-dot">
          <span>✦</span>&nbsp;&nbsp;Or reach me directly
        </p>
        <p className="mt-3 max-w-xs font-sans text-[15px] leading-relaxed text-creme/70">
          Prefer email or a DM? I read every one.
        </p>
      </div>

      <ul className="space-y-3">
        {CHANNELS.map((c) => (
          <li key={c.label}>
            <a
              href={c.href}
              {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="group flex items-baseline gap-3 font-sans text-creme/85 transition-colors hover:text-amber-dot"
            >
              <span className="w-24 shrink-0 text-xs uppercase tracking-[0.2em] text-creme/45 group-hover:text-amber-dot/70">
                {c.label}
              </span>
              <span className="text-[15px]">{c.value}</span>
            </a>
          </li>
        ))}
      </ul>

      <p className="font-sans text-xs uppercase tracking-[0.22em] text-creme/45">
        {CONTACT.responseTime}
      </p>
    </Reveal>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/contact-rail.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add components/contact/contact-rail.tsx tests/contact-rail.test.tsx
git commit -m "feat(contact): contact rail — email + socials + response time

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Themed Cal.com inline embed

**Files:**
- Create: `components/contact/cal-embed.tsx`

**Interfaces:**
- Consumes: `CONTACT.calLink`; `getCalApi`, `Cal` (default) from `@calcom/embed-react`.
- Produces: `export function CalEmbed(): JSX.Element`.

No unit test: the embed loads an external iframe + WebGL-adjacent script that jsdom can't exercise meaningfully. Verified via typecheck + production build + visual.

- [ ] **Step 1: Implement the component**

Create `components/contact/cal-embed.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { CONTACT } from "@/lib/contact-info";

/**
 * Inline Cal.com booking, themed dark with the gold brand colour and wrapped in
 * a chocolate frame (amber hairline + feathered top) so the light iframe reads
 * as part of the velvet instead of a floating white slab.
 */
export function CalEmbed() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cal = await getCalApi();
      if (cancelled) return;
      cal("ui", {
        theme: "dark",
        cssVarsPerTheme: { dark: { "cal-brand": "#d9a05b" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber-dot/25 bg-[#140d09]/70 p-1.5 shadow-[0_40px_100px_-50px_rgba(0,0,0,0.9)] backdrop-blur-md">
      {/* Top hairline sheen. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-creme/25 to-transparent"
      />
      <div className="overflow-hidden rounded-[1.35rem]">
        <Cal
          calLink={CONTACT.calLink}
          config={{ theme: "dark", layout: "month_view" }}
          style={{ width: "100%", height: "100%", minHeight: "560px", overflow: "scroll" }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep -v "tests/" | grep "contact/cal-embed" || echo "no cal-embed type errors"`
Expected: `no cal-embed type errors`.

- [ ] **Step 3: Commit**

```bash
git add components/contact/cal-embed.tsx
git commit -m "feat(contact): themed inline Cal.com embed (dark + gold brand)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Booking layout

**Files:**
- Create: `components/contact/booking.tsx`

**Interfaces:**
- Consumes: `CalEmbed` from `./cal-embed`; `ContactRail` from `./contact-rail`; `Reveal`.
- Produces: `export function Booking(): JSX.Element` (a `<section id="book">`).

- [ ] **Step 1: Implement the component**

Create `components/contact/booking.tsx`:

```tsx
"use client";

import { CalEmbed } from "./cal-embed";
import { ContactRail } from "./contact-rail";
import { Reveal } from "@/components/motion/reveal";

/**
 * "Book & reach me" — the Cal.com booking as the star, with the contact rail
 * (email + socials) alongside on desktop, stacked above on mobile.
 */
export function Booking() {
  return (
    <section id="book" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal>
          <h2 className="mb-12 max-w-xl font-display text-3xl leading-tight sm:text-5xl">
            Book a call — or just say hi.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.6fr] md:gap-12">
          <ContactRail />
          <CalEmbed />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep -v "tests/" | grep "contact/booking" || echo "no booking type errors"`
Expected: `no booking type errors`.

- [ ] **Step 3: Commit**

```bash
git add components/contact/booking.tsx
git commit -m "feat(contact): booking layout — Cal embed + contact rail

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Aurora page backdrop

**Files:**
- Create: `components/contact/contact-aurora.tsx`

**Interfaces:**
- Consumes: `Aurora` (default) from `@/components/Aurora`; `motion`, `useInView`, `useReducedMotion`, `useScroll`, `useTransform` from `motion/react`.
- Produces: `export function ContactAurora({ children }: { children: React.ReactNode }): JSX.Element`.

No unit test: WebGL/OGL can't render under jsdom. Verified via build + visual.

- [ ] **Step 1: Implement the component**

Create `components/contact/contact-aurora.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import AuroraBase from "@/components/Aurora";

// JS-interop component — flexible props (its .jsx infers strict types from defaults).
const Aurora = AuroraBase as unknown as React.ComponentType<Record<string, unknown>>;

/**
 * Connect's signature backdrop: a gold/terracotta Aurora spanning the whole
 * page beneath the espresso base. Sticky + viewport-sized; opacity is
 * scroll-linked so it eases in (hiding the WebGL first-frame flash) and never
 * pops. Reduced-motion pins it to a gentle static glow.
 */
export function ContactAurora({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mounted = useInView(ref, { margin: "40% 0px 40% 0px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Ease in from transparent, hold, soften toward the end.
  const opacity = useTransform(scrollYProgress, [0, 0.12, 0.85, 1], [0, 0.55, 0.55, 0.2]);

  return (
    <div ref={ref} className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="sticky top-0 h-screen w-full"
          style={{ opacity: reduce ? 0.4 : opacity }}
        >
          {mounted && (
            <Aurora
              colorStops={["#f3e6cf", "#d9a05b", "#a8674a"]}
              blend={0.4}
              amplitude={0.9}
              speed={0.35}
            />
          )}
        </motion.div>
      </div>
      {/* Soft floor so content keeps contrast over the aurora. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 60% at 50% 30%, transparent 20%, rgba(20,13,9,0.65) 100%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep -v "tests/" | grep "contact-aurora" || echo "no aurora type errors"`
Expected: `no aurora type errors`.

- [ ] **Step 3: Commit**

```bash
git add components/contact/contact-aurora.tsx
git commit -m "feat(contact): gold/terracotta Aurora page backdrop

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Page composition (hero + bands)

**Files:**
- Create: `components/contact/contact-page.tsx`

**Interfaces:**
- Consumes: `ContactAurora`, `RateCard`, `Booking` from `./*`; `GradualBlur` from `@/components/effects/gradual-blur`; `Reveal`; `motion`, `useReducedMotion` from `motion/react`.
- Produces: `export function ContactPage(): JSX.Element` (a `<main>`).

No unit test: composition of WebGL + iframe children. Verified via build + visual.

- [ ] **Step 1: Implement the component**

Create `components/contact/contact-page.tsx`:

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/motion/reveal";
import { GradualBlur } from "@/components/effects/gradual-blur";
import { ContactAurora } from "./contact-aurora";
import { RateCard } from "./rate-card";
import { Booking } from "./booking";

const EASE = [0.16, 1, 0.3, 1] as const;

function Sparkle({ className, size = 16, delay = 0 }: { className: string; size?: number; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      className={`pointer-events-none absolute font-script text-amber-dot ${className}`}
      style={{ fontSize: size }}
      initial={{ opacity: 0.25 }}
      animate={reduce ? { opacity: 0.4 } : { opacity: [0.25, 0.8, 0.25] }}
      transition={{ duration: 4.5, ease: EASE, repeat: Infinity, delay }}
    >
      ✦
    </motion.span>
  );
}

/**
 * The Connect page: an Aurora-backed hero → rate card → booking + contact rail,
 * with the shared bottom gradual blur. Warm espresso base with gold/terracotta
 * accents — the Connect nav-card's world.
 */
export function ContactPage() {
  return (
    <main
      className="relative flex-1 text-creme"
      style={{ background: "linear-gradient(165deg, #3f2d25 0%, #201410 45%)" }}
    >
      <ContactAurora>
        {/* ═══ Hero ═══ */}
        <section className="relative overflow-hidden px-6 pb-10 pt-32 text-center sm:px-10 sm:pt-40">
          <Sparkle className="left-[18%] top-28" size={20} />
          <Sparkle className="right-[20%] top-40" size={14} delay={1.6} />
          <Sparkle className="left-[30%] top-[60%]" size={12} delay={2.8} />

          <Reveal className="mx-auto max-w-2xl">
            <p className="mb-4 font-sans text-xs font-medium uppercase tracking-[0.34em] text-amber-dot">
              <span>✦</span>&nbsp;&nbsp;Connect
            </p>
            <p className="mb-2 font-script text-5xl text-amber-dot sm:text-6xl">let&apos;s talk</p>
            <h1 className="mb-6 font-display text-4xl leading-[1.08] sm:text-6xl">
              Have an app or business worth an honest look?
            </h1>
            <p className="mx-auto mb-8 max-w-md font-sans text-base leading-relaxed text-creme/70">
              Brand deals, honest reviews, and collaborations — here&apos;s where we start.
            </p>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-dot/40 bg-amber-dot/10 px-4 py-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-amber-dot">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-dot opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-dot" />
              </span>
              Booking new collabs
            </span>
          </Reveal>
        </section>

        {/* ═══ Rate card ═══ */}
        <RateCard />

        {/* ═══ Book & reach me ═══ */}
        <Booking />

        {/* ═══ Close ═══ */}
        <section className="relative px-6 py-20 text-center sm:py-28">
          <Reveal className="mx-auto max-w-xl">
            <p className="font-display text-2xl leading-snug text-creme/90 sm:text-3xl">
              No hard sell, no fluff — just an{" "}
              <span className="font-script text-amber-dot">honest</span> conversation.
            </p>
          </Reveal>
        </section>
      </ContactAurora>

      {/* Bottom gradual blur, pinned across the page. */}
      <GradualBlur position="bottom" target="page" height="5.5rem" strength={3.2} />
    </main>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep -v "tests/" | grep "contact-page" || echo "no contact-page type errors"`
Expected: `no contact-page type errors`.

- [ ] **Step 3: Commit**

```bash
git add components/contact/contact-page.tsx
git commit -m "feat(contact): compose the Connect page — hero, rate card, booking

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Wire the route + full build

**Files:**
- Modify: `app/contact/page.tsx`

**Interfaces:**
- Consumes: `ContactPage` from `@/components/contact/contact-page`.

- [ ] **Step 1: Swap the placeholder for the real page**

Replace the entire body of `app/contact/page.tsx` with:

```tsx
import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/contact-page";

export const metadata: Metadata = {
  title: "Connect — Varsheni",
  description: "Work with Varsheni — brand deals, honest reviews, and collaborations.",
};

export default function Page() {
  return <ContactPage />;
}
```

- [ ] **Step 2: Run the full test suite**

Run: `npx vitest run`
Expected: PASS — all suites green (including the three new contact suites; existing card-nav / gradual-blur unaffected).

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: `✓ Compiled successfully`; the route table lists `/contact` with no type or lint errors.

- [ ] **Step 4: Visual verification (real browser)**

Start `npm run dev`, open `/contact`, and confirm:
- Aurora glows gold/terracotta behind the page and eases in on scroll (no flash/pop).
- Hero: cursive "let's talk", headline, pulsing availability pill, drifting sparkles.
- Rate card: three tiles with deliverables + "from ₹X"; the "Download rate card (PDF)" button.
- Booking: contact rail (email/IG/YouTube + response time) beside a dark, gold-accented Cal calendar in its chocolate frame.
- Bottom gradual blur present; nav curtain-links into `/contact` work.

- [ ] **Step 5: Commit**

```bash
git add app/contact/page.tsx
git commit -m "feat(contact): wire /contact route to the Connect page

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**
- Warm velvet theme + Connect palette → Task 1 (clay token) + Task 7 (espresso base) ✓
- Aurora as main background → Task 6 ✓
- Hero (eyebrow/cursive/headline/pill/sparkles) → Task 7 ✓
- Rate card, "from ₹X" anchors, PDF button → Tasks 1 + 2 ✓
- Inline Cal.com embed, dark + gold brand, chocolate frame → Task 4 ✓
- Contact rail: email + IG + YouTube + response time → Task 3 ✓
- Bottom gradual blur → Task 7 ✓
- Placeholders centralized + flagged → Task 1 (`lib/contact-info.ts`, all `// TODO(real):`) ✓
- Out of scope (testimonials, FAQ, form backend) → not built ✓

**Placeholder scan:** No plan-level TODOs; every step has full code. The `// TODO(real):` markers are intentional data placeholders the user fills, per spec.

**Type consistency:** `Package`/`ContactInfo` fields (`key`, `name`, `blurb`, `deliverables`, `priceFrom`; `email`, `calLink`, `instagram`, `youtube`, `rateCardPdf`, `responseTime`) are defined in Task 1 and used identically in Tasks 2–3. Component exports (`RateCard`, `ContactRail`, `CalEmbed`, `Booking`, `ContactAurora`, `ContactPage`) match their consumers. `Cal`/`getCalApi` usage matches `@calcom/embed-react` v1.5.3 (`calLink: string`, `config?: PrefillAndIframeAttrsConfig`).

**Note on tests:** Visual/WebGL/iframe components (Cal, Aurora, page composition) are verified by typecheck + build + browser rather than jsdom unit tests — jsdom can't exercise OGL/WebGL or the Cal iframe. Logic/data/link components (contact-info, rate-card, contact-rail) get real unit tests.
