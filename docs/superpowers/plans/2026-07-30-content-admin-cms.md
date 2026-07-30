# Content Admin (Payload CMS) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give Varsheni an authenticated `/admin` panel (and an MCP endpoint for Claude) to CRUD the reels, rate-card packages, About copy, and contact settings that are currently hardcoded in TypeScript.

**Architecture:** Payload CMS 3.x mounts inside this same Next.js app under an `app/(payload)/` route group; the existing site moves into an `app/(frontend)/` route group. Content lives in Neon Postgres, uploads in Vercel Blob. Public pages read via Payload's Local API from Server Components and render through the **existing, unchanged** presentational components.

**Tech Stack:** Payload 3.86.0, `@payloadcms/db-postgres`, `@payloadcms/storage-vercel-blob`, `@payloadcms/plugin-mcp`, `@payloadcms/richtext-lexical`, sharp, Neon Postgres, Vercel Blob, Next.js 16.2.10, React 19.2.4, Vitest.

**Spec:** `docs/superpowers/specs/2026-07-30-content-admin-cms-design.md`

## Global Constraints

- **Package manager is npm.** Payload requires `npm i --legacy-peer-deps` for every Payload install in this repo.
- **Install latest stable versions.** Payload packages must all be the **same version** as each other (currently `3.86.0`) or Payload throws a version-mismatch error at boot.
- **Git:** precise `git add <path>` — **never `git add -A`**. Leave `.gitmodules`, `skills/`, `public/assets/incoming/` untracked. Every commit ends with the trailer `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`.
- **React Compiler safe:** no synchronous `setState` in effects; no `Math.random()` / `Date.now()` in render.
- **No visual redesign.** Presentational components (`ReelCard`, `RateCard`, `WhoIAm`, `WhatIBring`, …) keep their existing markup, classes, and motion. They change **only** to accept data as props instead of importing module constants.
- **Secrets never get committed.** `.env.local` is already gitignored — verify before writing to it.
- **Text limits** (used consistently across collections): reel `title` 80, reel `subject` 40, package `name` 40, package `blurb` 120, package `priceFrom` 40, deliverable item 60, About headline 120, About paragraph 600, short label 60.
- **Upload ceiling:** 50 MB (`52428800` bytes), enforced Payload-wide. Videos accept `video/mp4` only; posters/images accept `image/*` only.

---

## File Structure

**Moved (route-group refactor, Task 1) — content unchanged unless noted:**

- `app/layout.tsx` → `app/(frontend)/layout.tsx`
- `app/page.tsx` → `app/(frontend)/page.tsx`
- `app/about/page.tsx` → `app/(frontend)/about/page.tsx`
- `app/work/page.tsx` → `app/(frontend)/work/page.tsx`
- `app/contact/page.tsx` → `app/(frontend)/contact/page.tsx`
- `app/globals.css` → `app/(frontend)/globals.css`
- `app/icon.png` → `app/(frontend)/icon.png`

**Created:**

- `payload.config.ts` — root Payload config: db, collections, globals, plugins
- `app/(payload)/layout.tsx`, `app/(payload)/custom.scss` — Payload admin shell
- `app/(payload)/admin/[[...segments]]/page.tsx`, `.../not-found.tsx` — admin UI routes
- `app/(payload)/admin/importMap.js` — generated, do not hand-edit
- `app/(payload)/api/[...slug]/route.ts` — Payload REST API
- `app/(payload)/api/graphql/route.ts`, `.../graphql-playground/route.ts`
- `collections/Users.ts` — auth collection (Varsheni + dev)
- `collections/Media.ts` — image uploads (posters, misc)
- `collections/Videos.ts` — mp4 uploads (reels)
- `collections/Reels.ts`
- `collections/RateCardPackages.ts`
- `globals/About.ts`
- `globals/SiteSettings.ts`
- `lib/payload.ts` — `getPayloadClient()` helper
- `lib/content/reels.ts` — `getReels()`, `getReelCategories()`
- `lib/content/rate-card.ts` — `getPackages()`
- `lib/content/site-settings.ts` — `getContact()`, `getMailTemplates()`
- `lib/content/about.ts` — `getAboutContent()`, `AboutContent` type
- `scripts/seed.ts` — ports today's hardcoded content into the database
- `tests/content/reels.test.ts`, `tests/content/rate-card.test.ts`, `tests/content/about.test.ts`
- `docs/DEPLOYMENT.md` — env vars + Neon/Blob/MCP setup runbook

**Modified:**

- `next.config.ts` — wrap with `withPayload`
- `tsconfig.json` — add `@payload-config` path
- `package.json` — Payload deps + `payload` / `seed` scripts
- `lib/work.ts` — keep types, drop the `REELS` const
- `lib/contact-info.ts` — keep types, drop the `PACKAGES` / `CONTACT` / `MAIL_TEMPLATES` consts
- `components/work/work-page.tsx` — accept `reels`/`categories` props
- `components/contact/contact-page.tsx`, `components/contact/rate-card.tsx` — accept props
- `components/about/about-page.tsx`, `who-i-am.tsx`, `what-i-bring.tsx` — accept props
- `tests/work-data.test.ts`, `tests/contact-info.test.ts` — retarget from consts to mappers
- `.gitignore` — ignore generated `payload-types.ts`? **No** — commit it (other tasks import it).

---

## Deviation from the spec (read before starting)

The spec's "Public site integration" section specifies cache tags plus `revalidateTag` in a Payload `afterChange` hook. **This plan uses `export const dynamic = 'force-dynamic'` on the three content pages instead.** Reasons:

1. This repo does **not** have Next 16's `cacheComponents` flag enabled. Turning it on is an app-wide migration (every uncached data access and every `cookies()`/`searchParams` read must be reworked or wrapped in `<Suspense>`) — far outside this feature's scope.
2. Without `cacheComponents`, a direct database read (Payload's Local API is not `fetch`) gets **statically prerendered at build time**, so the page would freeze at build-time content — the exact failure the spec's "instant" requirement forbids.
3. In Next 16 the single-argument `revalidateTag('reels')` form is deprecated and raises a TypeScript error, so the spec's literal snippet would not compile.

`force-dynamic` delivers the spec's stated requirement (edits visible immediately, no rebuild) with the least machinery. Cost: each page view issues a small Postgres query. At this site's traffic that is negligible; if it ever matters, `use cache` + `cacheTag` can be layered on later without touching the components.

## Second deviation: no email provider

The spec's auth section planned a transactional email provider (Resend) for Payload's forgot-password flow. **This plan ships no email adapter.** With exactly two accounts, either user can reset the other's password from inside `/admin` (Users → edit → set password), which covers the realistic lockout case without adding a vendor, an API key, and a domain-verification step. Task 12's runbook documents that path plus the both-locked-out fallback. Add an email adapter later if self-service reset becomes worth the setup.

---

### Task 1: Payload scaffold, auth, and the route-group refactor

Mounts Payload at `/admin` with a working login. Nothing content-specific yet. This task is deliberately large because the route-group move, the config, and the admin routes are useless — and untestable — apart from each other.

**Files:**
- Move: `app/layout.tsx`, `app/page.tsx`, `app/about/`, `app/work/`, `app/contact/`, `app/globals.css`, `app/icon.png` → under `app/(frontend)/`
- Create: `payload.config.ts`, `collections/Users.ts`, `app/(payload)/layout.tsx`, `app/(payload)/custom.scss`, `app/(payload)/admin/[[...segments]]/page.tsx`, `app/(payload)/admin/[[...segments]]/not-found.tsx`, `app/(payload)/api/[...slug]/route.ts`, `app/(payload)/api/graphql/route.ts`, `app/(payload)/api/graphql-playground/route.ts`
- Modify: `next.config.ts`, `tsconfig.json`, `package.json`, `.env.local`

**Interfaces:**
- Consumes: nothing.
- Produces: `payload.config.ts` default export (imported everywhere as `@payload-config`); `collections/Users.ts` exporting `Users: CollectionConfig` with slug `users`; a running `/admin`.

- [ ] **Step 1: Create the Neon database and capture the connection string**

Go to <https://vercel.com/marketplace/neon> → Install → *Create New Neon Account* → accept terms, pick a region, choose the **Free** plan, name the database `varsheni-portfolio`. Then Vercel dashboard → Storage → your database → **Connect Project** → select the `varsheni-portfolio` project and check Development, Preview, and Production.

This injects `DATABASE_URL` (pooled) into the Vercel project automatically. Copy that value for local use — Vercel dashboard → Settings → Environment Variables → reveal `DATABASE_URL`.

- [ ] **Step 2: Write local env vars**

Confirm `.env.local` is gitignored first:

```bash
git check-ignore -v .env.local
```

Expected: prints a line naming `.gitignore` (if it prints nothing, STOP and add `.env.local` to `.gitignore` before continuing).

Create/append `.env.local`:

```bash
DATABASE_URL=<paste the Neon pooled connection string from Step 1>
PAYLOAD_SECRET=<paste output of: openssl rand -hex 32>
```

Generate the secret with:

```bash
openssl rand -hex 32
```

- [ ] **Step 3: Install Payload packages**

```bash
npm i --legacy-peer-deps payload@3.86.0 @payloadcms/next@3.86.0 @payloadcms/db-postgres@3.86.0 @payloadcms/richtext-lexical@3.86.0 sharp graphql
```

- [ ] **Step 4: Move the existing app into a `(frontend)` route group**

Payload's `app/(payload)/layout.tsx` renders its own `<html>`/`<body>`. A root `app/layout.tsx` would conflict, so the site moves into its own route group. Route groups do not affect URLs — `/about` stays `/about`.

```bash
mkdir -p "app/(frontend)"
git mv app/layout.tsx "app/(frontend)/layout.tsx"
git mv app/page.tsx "app/(frontend)/page.tsx"
git mv app/globals.css "app/(frontend)/globals.css"
git mv app/icon.png "app/(frontend)/icon.png"
git mv app/about "app/(frontend)/about"
git mv app/work "app/(frontend)/work"
git mv app/contact "app/(frontend)/contact"
```

`app/(frontend)/layout.tsx` imports `"./globals.css"` — that relative path still resolves after the move, so no edit is needed.

- [ ] **Step 5: Verify the site still builds after the move**

```bash
npm run build
```

Expected: build succeeds; the route list shows `/`, `/about`, `/work`, `/contact` (no `(frontend)` segment in the URLs).

- [ ] **Step 6: Add the `@payload-config` path alias**

In `tsconfig.json`, extend `compilerOptions.paths` so it reads:

```json
    "paths": {
      "@/*": ["./*"],
      "@payload-config": ["./payload.config.ts"]
    }
```

- [ ] **Step 7: Wrap the Next config**

Replace `next.config.ts` with:

```typescript
import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {};

export default withPayload(nextConfig);
```

- [ ] **Step 8: Create the Users collection**

Create `collections/Users.ts`:

```typescript
import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: { useAsTitle: "email" },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      maxLength: 60,
    },
  ],
};
```

- [ ] **Step 9: Create the Payload config**

Create `payload.config.ts` at the repo root:

```typescript
import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";

import { Users } from "./collections/Users";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections: [Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL },
  }),
  upload: {
    limits: { fileSize: 52428800 },
  },
  sharp,
});
```

- [ ] **Step 10: Create the Payload admin route files**

These are Payload's standard generated files. Create `app/(payload)/layout.tsx`:

```tsx
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from "@payload-config";
import "@payloadcms/next/css";
import type { ServerFunctionClient } from "payload";
import {
  generatePayloadViewport,
  handleServerFunctions,
  RootLayout,
} from "@payloadcms/next/layouts";
import React from "react";

import { importMap } from "./admin/importMap.js";
import "./custom.scss";

export const generateViewport = generatePayloadViewport;

type Args = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({ ...args, config, importMap });
};

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
);

export default Layout;
```

Create `app/(payload)/custom.scss` with a single comment so the import resolves:

```scss
/* Payload admin overrides. Intentionally empty — admin styling is out of scope. */
```

Create `app/(payload)/admin/[[...segments]]/page.tsx`:

```tsx
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from "next";

import config from "@payload-config";
import { RootPage, generatePageMetadata } from "@payloadcms/next/views";
import { importMap } from "../importMap";

type Args = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
};

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams });

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config, params, searchParams, importMap });

export default Page;
```

Create `app/(payload)/admin/[[...segments]]/not-found.tsx`:

```tsx
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from "next";

import config from "@payload-config";
import { NotFoundPage, generatePageMetadata } from "@payloadcms/next/views";
import { importMap } from "../importMap";

type Args = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
};

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams });

const NotFound = ({ params, searchParams }: Args) =>
  NotFoundPage({ config, params, searchParams, importMap });

export default NotFound;
```

Create `app/(payload)/api/[...slug]/route.ts`:

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from "@payload-config";
import "@payloadcms/next/css";
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from "@payloadcms/next/routes";

export const GET = REST_GET(config);
export const POST = REST_POST(config);
export const DELETE = REST_DELETE(config);
export const PATCH = REST_PATCH(config);
export const PUT = REST_PUT(config);
export const OPTIONS = REST_OPTIONS(config);
```

Create `app/(payload)/api/graphql/route.ts`:

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from "@payload-config";
import { GRAPHQL_POST, REST_OPTIONS } from "@payloadcms/next/routes";

export const POST = GRAPHQL_POST(config);
export const OPTIONS = REST_OPTIONS(config);
```

Create `app/(payload)/api/graphql-playground/route.ts`:

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from "@payload-config";
import "@payloadcms/next/css";
import { GRAPHQL_PLAYGROUND_GET } from "@payloadcms/next/routes";

export const GET = GRAPHQL_PLAYGROUND_GET(config);
```

- [ ] **Step 11: Add Payload scripts to package.json**

In `package.json`, add to `"scripts"`:

```json
    "payload": "cross-env NODE_OPTIONS=--no-deprecation payload",
    "generate:types": "cross-env NODE_OPTIONS=--no-deprecation payload generate:types",
    "generate:importmap": "cross-env NODE_OPTIONS=--no-deprecation payload generate:importmap",
```

Install `cross-env`:

```bash
npm i --legacy-peer-deps -D cross-env
```

- [ ] **Step 12: Generate the import map and types**

```bash
npm run generate:importmap && npm run generate:types
```

Expected: creates `app/(payload)/admin/importMap.js` and `payload-types.ts` at the repo root. Both are committed.

- [ ] **Step 13: Boot the dev server and create the first admin user**

```bash
npm run dev
```

Open <http://localhost:3000/admin>. Expected: Payload's "Create first user" screen (Payload creates the Postgres tables on first boot). Create Varsheni's account, then in the admin go to **Users → Create New** and add the developer account.

Then verify the public site is untouched: open <http://localhost:3000/>, `/about`, `/work`, `/contact` — all render exactly as before.

- [ ] **Step 14: Verify the existing test suite still passes**

```bash
npm test
```

Expected: all existing tests pass (the route-group move does not touch component imports).

- [ ] **Step 15: Commit**

```bash
git add payload.config.ts collections/Users.ts payload-types.ts next.config.ts tsconfig.json package.json package-lock.json "app/(payload)" "app/(frontend)"
git commit -m "$(cat <<'EOF'
feat(cms): mount Payload CMS at /admin with Postgres + auth

Moves the public site into an (frontend) route group so Payload can own
its own root layout, and wires up the Neon Postgres adapter.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Upload collections (Media + Videos) on Vercel Blob

**Files:**
- Create: `collections/Media.ts`, `collections/Videos.ts`
- Modify: `payload.config.ts`, `.env.local`, `package.json`

**Interfaces:**
- Consumes: `payload.config.ts` from Task 1.
- Produces: collection slugs `media` (images) and `videos` (mp4), both upload-enabled and Blob-backed. Task 3's `Reels` collection references them via `relationTo: "media"` / `relationTo: "videos"`. Generated types `Media` and `Video` in `payload-types.ts`.

- [ ] **Step 1: Create the Vercel Blob store**

Vercel dashboard → the `varsheni-portfolio` project → Storage → **Create Database** → Blob → name it `varsheni-media` → Connect to the project (Development, Preview, Production).

This injects `BLOB_READ_WRITE_TOKEN` automatically. Copy its value into `.env.local`:

```bash
BLOB_READ_WRITE_TOKEN=<paste from Vercel dashboard>
```

- [ ] **Step 2: Install the storage adapter**

```bash
npm i --legacy-peer-deps @payloadcms/storage-vercel-blob@3.86.0
```

- [ ] **Step 3: Create the Media collection (images)**

Create `collections/Media.ts`:

```typescript
import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  admin: { useAsTitle: "filename", group: "Uploads" },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  upload: {
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      maxLength: 120,
      admin: { description: "Describes the image for screen readers." },
    },
  ],
};
```

- [ ] **Step 4: Create the Videos collection (mp4)**

Create `collections/Videos.ts`:

```typescript
import type { CollectionConfig } from "payload";

export const Videos: CollectionConfig = {
  slug: "videos",
  admin: { useAsTitle: "filename", group: "Uploads" },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  upload: {
    mimeTypes: ["video/mp4"],
  },
  fields: [],
};
```

- [ ] **Step 5: Wire both collections into the config with Blob storage**

In `payload.config.ts`, add the imports:

```typescript
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";

import { Media } from "./collections/Media";
import { Videos } from "./collections/Videos";
```

Change `collections` to `[Users, Media, Videos]`, and add a `plugins` array to `buildConfig`:

```typescript
  plugins: [
    vercelBlobStorage({
      enabled: true,
      collections: { media: true, videos: true },
      clientUploads: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
```

`clientUploads: true` is required — it uploads from the browser straight to Blob, bypassing Vercel's 4.5 MB serverless request-body cap that reel videos would otherwise exceed.

- [ ] **Step 6: Regenerate types**

```bash
npm run generate:types
```

Expected: `payload-types.ts` now contains `Media` and `Video` interfaces.

- [ ] **Step 7: Verify uploads end-to-end in the admin**

```bash
npm run dev
```

In <http://localhost:3000/admin>: **Uploads → Media → Create New**, upload any `.jpg`. Expected: saves, and the returned URL is on `*.public.blob.vercel-storage.com`.

Then **Uploads → Videos → Create New**, upload an `.mp4` larger than 4.5 MB. Expected: upload succeeds (proving `clientUploads` works).

Finally, try uploading a `.txt` to Videos. Expected: rejected for wrong file type.

- [ ] **Step 8: Commit**

```bash
git add collections/Media.ts collections/Videos.ts payload.config.ts payload-types.ts package.json package-lock.json
git commit -m "$(cat <<'EOF'
feat(cms): add Media and Videos upload collections on Vercel Blob

Client-side uploads are enabled so reel videos can exceed Vercel's
4.5MB serverless request-body limit.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Reels collection

**Files:**
- Create: `collections/Reels.ts`
- Modify: `payload.config.ts`

**Interfaces:**
- Consumes: `media` and `videos` slugs from Task 2.
- Produces: collection slug `reels`; generated type `Reel` in `payload-types.ts` (note: this shadows nothing — the hand-written UI type also called `Reel` lives in `lib/work.ts` and is mapped to in Task 7).

Field names deliberately match today's `lib/work.ts` shape so the Task 7 mapper stays trivial.

- [ ] **Step 1: Create the collection**

Create `collections/Reels.ts`:

```typescript
import type { CollectionConfig } from "payload";

export const CATEGORY_OPTIONS = [
  "Money & fintech",
  "AI & creator tools",
  "Commerce & brands",
  "Ed-tech",
  "Health & fitness",
  "Real estate",
  "SaaS & B2B",
] as const;

export const Reels: CollectionConfig = {
  slug: "reels",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "subject", "category", "order"],
    group: "Content",
  },
  defaultSort: "order",
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      maxLength: 80,
      admin: { description: "The hook / review headline." },
    },
    {
      name: "subject",
      type: "text",
      required: true,
      maxLength: 40,
      admin: { description: "The app or business being reviewed." },
    },
    {
      name: "category",
      type: "select",
      required: true,
      options: CATEGORY_OPTIONS.map((c) => ({ label: c, value: c })),
    },
    {
      name: "kind",
      type: "select",
      required: true,
      defaultValue: "app",
      options: [
        { label: "App", value: "app" },
        { label: "Business", value: "business" },
      ],
    },
    {
      name: "video",
      type: "upload",
      relationTo: "videos",
      required: true,
    },
    {
      name: "poster",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: { description: "9:16 still shown before the video plays." },
    },
    {
      name: "href",
      type: "text",
      admin: { description: "Optional link to the original Instagram / YouTube post." },
    },
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 0,
      admin: { description: "Lower numbers appear first within the category." },
    },
  ],
};
```

`CATEGORY_OPTIONS` is exported because Task 7 reuses it to order the gallery.

- [ ] **Step 2: Register it**

In `payload.config.ts` add `import { Reels } from "./collections/Reels";` and change `collections` to `[Users, Media, Videos, Reels]`.

- [ ] **Step 3: Regenerate types**

```bash
npm run generate:types
```

- [ ] **Step 4: Verify in the admin**

```bash
npm run dev
```

In <http://localhost:3000/admin>: **Content → Reels → Create New**. Expected: form shows title, subject, a category dropdown with exactly the 7 options, a kind dropdown, video + poster upload pickers, href, and order. Save one reel using the media uploaded in Task 2.

Then try saving a reel with a title longer than 80 characters. Expected: rejected with a max-length validation error.

- [ ] **Step 5: Commit**

```bash
git add collections/Reels.ts payload.config.ts payload-types.ts
git commit -m "$(cat <<'EOF'
feat(cms): add Reels collection

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: RateCardPackages collection and SiteSettings global

**Files:**
- Create: `collections/RateCardPackages.ts`, `globals/SiteSettings.ts`
- Modify: `payload.config.ts`

**Interfaces:**
- Consumes: Task 1 config.
- Produces: collection slug `rate-card-packages`; global slug `site-settings`. Generated types `RateCardPackage` and `SiteSetting` in `payload-types.ts`.

`SiteSettings` also covers `MAIL_TEMPLATES` — the mailto starter copy in `lib/contact-info.ts`. The spec listed only the `CONTACT` fields for this global; the mail templates live in the same file, are equally placeholder copy, and would otherwise be the one piece of contact content still requiring a code deploy, so they are included here.

- [ ] **Step 1: Create the packages collection**

Create `collections/RateCardPackages.ts`:

```typescript
import type { CollectionConfig } from "payload";

export const RateCardPackages: CollectionConfig = {
  slug: "rate-card-packages",
  labels: { singular: "Rate Card Package", plural: "Rate Card Packages" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "priceFrom", "order"],
    group: "Content",
  },
  defaultSort: "order",
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: "name", type: "text", required: true, maxLength: 40 },
    { name: "blurb", type: "text", required: true, maxLength: 120 },
    {
      name: "deliverables",
      type: "array",
      required: true,
      minRows: 1,
      maxRows: 8,
      fields: [{ name: "item", type: "text", required: true, maxLength: 60 }],
    },
    {
      name: "priceFrom",
      type: "text",
      required: true,
      maxLength: 40,
      admin: { description: 'Shown verbatim, e.g. "from ₹25,000".' },
    },
    { name: "order", type: "number", required: true, defaultValue: 0 },
  ],
};
```

- [ ] **Step 2: Create the SiteSettings global**

Create `globals/SiteSettings.ts`:

```typescript
import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  admin: { group: "Settings" },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: "email", type: "email", required: true },
    {
      name: "calLink",
      type: "text",
      required: true,
      maxLength: 60,
      admin: { description: 'Cal.com "<username>/<event>", e.g. "varsheni/intro".' },
    },
    { name: "instagram", type: "text", required: true, maxLength: 120 },
    { name: "youtube", type: "text", required: true, maxLength: 120 },
    {
      name: "rateCardPdf",
      type: "text",
      required: true,
      maxLength: 200,
      admin: { description: 'Path or URL to the rate-card PDF, e.g. "/rate-card.pdf".' },
    },
    { name: "responseTime", type: "text", required: true, maxLength: 60 },
    {
      name: "mailTemplates",
      type: "array",
      label: "Email starters",
      minRows: 1,
      maxRows: 8,
      admin: { description: "Pre-written mailto: starters for the Connect page carousel." },
      fields: [
        { name: "key", type: "text", required: true, maxLength: 30 },
        { name: "label", type: "text", required: true, maxLength: 40 },
        { name: "subject", type: "text", required: true, maxLength: 120 },
        { name: "body", type: "textarea", required: true, maxLength: 1200 },
      ],
    },
  ],
};
```

- [ ] **Step 3: Register both**

In `payload.config.ts` add:

```typescript
import { RateCardPackages } from "./collections/RateCardPackages";
import { SiteSettings } from "./globals/SiteSettings";
```

Change `collections` to `[Users, Media, Videos, Reels, RateCardPackages]` and add a top-level `globals: [SiteSettings],` key to `buildConfig`.

- [ ] **Step 4: Regenerate types and verify**

```bash
npm run generate:types && npm run dev
```

In <http://localhost:3000/admin>: expect a **Content → Rate Card Packages** list and a **Settings → Site Settings** single-document page. Create one package and save the settings once.

- [ ] **Step 5: Commit**

```bash
git add collections/RateCardPackages.ts globals/SiteSettings.ts payload.config.ts payload-types.ts
git commit -m "$(cat <<'EOF'
feat(cms): add rate card packages collection and site settings global

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: About global

**Files:**
- Create: `globals/About.ts`
- Modify: `payload.config.ts`

**Interfaces:**
- Consumes: Task 1 config.
- Produces: global slug `about`; generated type `About` in `payload-types.ts`. Task 7's `getAboutContent()` reads it.

Every field here corresponds to copy that is hardcoded today — grouped to mirror the page's own sections.

- [ ] **Step 1: Create the global**

Create `globals/About.ts`:

```typescript
import type { GlobalConfig } from "payload";

export const About: GlobalConfig = {
  slug: "about",
  label: "About Page",
  admin: { group: "Content" },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      type: "group",
      name: "hero",
      label: "Hero",
      fields: [
        { name: "availability", type: "text", required: true, maxLength: 60 },
        { name: "eyebrow", type: "text", required: true, maxLength: 60 },
        { name: "headline", type: "text", required: true, maxLength: 120 },
        { name: "intro", type: "textarea", required: true, maxLength: 600 },
        {
          name: "bio",
          type: "array",
          label: "Bio paragraphs",
          minRows: 1,
          maxRows: 4,
          fields: [{ name: "text", type: "textarea", required: true, maxLength: 600 }],
        },
        { name: "signature", type: "text", required: true, maxLength: 60 },
      ],
    },
    {
      type: "group",
      name: "whoIAm",
      label: "Who I Am",
      fields: [
        { name: "eyebrow", type: "text", required: true, maxLength: 60 },
        { name: "heading", type: "text", required: true, maxLength: 120 },
        {
          name: "paragraphs",
          type: "array",
          minRows: 1,
          maxRows: 4,
          fields: [{ name: "text", type: "textarea", required: true, maxLength: 600 }],
        },
        {
          name: "education",
          type: "array",
          minRows: 1,
          maxRows: 8,
          fields: [{ name: "item", type: "text", required: true, maxLength: 80 }],
        },
        {
          name: "qualifications",
          type: "array",
          minRows: 1,
          maxRows: 8,
          fields: [{ name: "item", type: "text", required: true, maxLength: 80 }],
        },
        {
          name: "languages",
          type: "array",
          minRows: 1,
          maxRows: 10,
          fields: [{ name: "item", type: "text", required: true, maxLength: 30 }],
        },
      ],
    },
    {
      type: "group",
      name: "values",
      label: "What I Stand For",
      fields: [
        { name: "eyebrow", type: "text", required: true, maxLength: 60 },
        {
          name: "items",
          type: "array",
          minRows: 1,
          maxRows: 8,
          fields: [
            { name: "title", type: "text", required: true, maxLength: 60 },
            { name: "body", type: "textarea", required: true, maxLength: 400 },
          ],
        },
      ],
    },
    {
      type: "group",
      name: "bring",
      label: "What I Bring",
      fields: [
        {
          name: "items",
          type: "array",
          minRows: 1,
          maxRows: 8,
          fields: [
            { name: "title", type: "text", required: true, maxLength: 60 },
            { name: "body", type: "textarea", required: true, maxLength: 400 },
          ],
        },
      ],
    },
    {
      type: "group",
      name: "quote",
      label: "Pull Quote",
      fields: [
        { name: "text", type: "textarea", required: true, maxLength: 300 },
        { name: "attribution", type: "text", required: true, maxLength: 60 },
      ],
    },
  ],
};
```

The "What I Bring" numbering (`01`–`05` in today's `BRING` const) is derived from array position at render time, so it is not an editable field.

- [ ] **Step 2: Register it**

In `payload.config.ts` add `import { About } from "./globals/About";` and change globals to `globals: [About, SiteSettings],`.

- [ ] **Step 3: Regenerate types and verify**

```bash
npm run generate:types && npm run dev
```

In <http://localhost:3000/admin>: expect **Content → About Page** with the five grouped sections.

- [ ] **Step 4: Commit**

```bash
git add globals/About.ts payload.config.ts payload-types.ts
git commit -m "$(cat <<'EOF'
feat(cms): add About page global

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Seed script — port today's hardcoded content into the database

Without this, wiring the pages up in Tasks 8–10 would blank the site.

**Files:**
- Create: `scripts/seed.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: all collections/globals from Tasks 2–5.
- Produces: a populated database. Run with `npm run seed`.

Reel **videos and posters are not seeded** — the current repo only has one shared placeholder clip (`/work/reels/sample.mp4`) and generated posters, and Blob uploads need real files. Seeded reels therefore carry copy only; Varsheni attaches media per reel in the admin. This is called out in the verification step.

- [ ] **Step 1: Write the seed script**

Create `scripts/seed.ts`:

```typescript
import { getPayload } from "payload";
import config from "@payload-config";

const REELS = [
  { title: "Is the hype worth your credit score?", subject: "CRED", kind: "app", category: "Money & fintech" },
  { title: "Banking that doesn't make you think", subject: "Jupiter", kind: "app", category: "Money & fintech" },
  { title: "The note-taker that finally stuck", subject: "Granola", kind: "app", category: "AI & creator tools" },
  { title: "Voiceovers without a booth", subject: "Murf", kind: "app", category: "AI & creator tools" },
  { title: "A storefront in an afternoon", subject: "Dukaan", kind: "business", category: "Commerce & brands" },
  { title: "Loyalty that small shops can run", subject: "Reelo", kind: "business", category: "Commerce & brands" },
  { title: "Running a coaching class from your phone", subject: "Classplus", kind: "app", category: "Ed-tech" },
  { title: "Does live tutoring actually hold up?", subject: "Vedantu", kind: "app", category: "Ed-tech" },
  { title: "The calorie tracker that stops nagging", subject: "HealthifyMe", kind: "app", category: "Health & fitness" },
  { title: "Booking a workout you'll actually show up to", subject: "Cult.fit", kind: "business", category: "Health & fitness" },
  { title: "Renting a flat without the broker cut", subject: "NoBroker", kind: "business", category: "Real estate" },
  { title: "How honest are the listing photos?", subject: "Housing", kind: "business", category: "Real estate" },
  { title: "Support and product in one place", subject: "DevRev", kind: "business", category: "SaaS & B2B" },
  { title: "The HR tool your team won't dread", subject: "Keka", kind: "business", category: "SaaS & B2B" },
] as const;

const PACKAGES = [
  {
    name: "Single Review",
    blurb: "One product, one honest verdict.",
    deliverables: ["1 reel (30–60s)", "3 story frames", "Usage rights (30 days)", "1 revision"],
    priceFrom: "from ₹25,000",
  },
  {
    name: "Campaign Package",
    blurb: "A multi-touch push across a launch.",
    deliverables: ["3 reels", "Story series", "Usage rights (90 days)", "2 revisions"],
    priceFrom: "from ₹75,000",
  },
  {
    name: "Custom / Retainer",
    blurb: "Ongoing collaboration, bespoke scope.",
    deliverables: ["Monthly deliverables", "Priority slots", "Extended rights", "Strategy input"],
    priceFrom: "from ₹1,50,000/mo",
  },
];

const MAIL_TEMPLATES = [
  {
    key: "collab",
    label: "Brand collaboration",
    subject: "Brand collaboration with Varsheni",
    body: "Hi Varsheni,\n\nWe're [brand] and we'd love to work with you on [product / campaign]. A quick sense of what we have in mind:\n\n- \n- \n\nTimeline: \nBudget range: \n\nLooking forward to hearing from you!",
  },
  {
    key: "review",
    label: "Product review",
    subject: "Review request: [product]",
    body: "Hi Varsheni,\n\nWe'd love an honest review of [product] — a [category] app/product we think your audience would find useful.\n\nWhat it does: \nWhat we'd love you to cover: \n\nHappy to send access or a sample. Thanks!",
  },
  {
    key: "retainer",
    label: "Ongoing partnership",
    subject: "Ongoing collaboration with Varsheni",
    body: "Hi Varsheni,\n\nWe're exploring a longer-term partnership (monthly content / retainer). Rough thinking:\n\nDeliverables: \nCadence: \nBudget: \n\nWould love to set up a call.",
  },
  {
    key: "hi",
    label: "Just saying hi",
    subject: "Hello, Varsheni!",
    body: "Hi Varsheni,\n\nNo pitch — just wanted to say I love your work. [your note here]\n\nCheers!",
  },
];

const seed = async () => {
  const payload = await getPayload({ config });

  const existing = await payload.find({ collection: "reels", limit: 1 });
  if (existing.totalDocs > 0) {
    payload.logger.info("Reels already exist — skipping reel seed.");
  } else {
    let order = 0;
    for (const reel of REELS) {
      await payload.create({
        collection: "reels",
        data: { ...reel, order: order++ },
      });
    }
    payload.logger.info(`Seeded ${REELS.length} reels.`);
  }

  const existingPackages = await payload.find({ collection: "rate-card-packages", limit: 1 });
  if (existingPackages.totalDocs > 0) {
    payload.logger.info("Packages already exist — skipping package seed.");
  } else {
    let order = 0;
    for (const pkg of PACKAGES) {
      await payload.create({
        collection: "rate-card-packages",
        data: {
          name: pkg.name,
          blurb: pkg.blurb,
          priceFrom: pkg.priceFrom,
          deliverables: pkg.deliverables.map((item) => ({ item })),
          order: order++,
        },
      });
    }
    payload.logger.info(`Seeded ${PACKAGES.length} packages.`);
  }

  await payload.updateGlobal({
    slug: "site-settings",
    data: {
      email: "hello@varsheni.com",
      calLink: "varsheni/intro",
      instagram: "https://instagram.com/",
      youtube: "https://youtube.com/",
      rateCardPdf: "/rate-card.pdf",
      responseTime: "Usually replies within 48h",
      mailTemplates: MAIL_TEMPLATES,
    },
  });
  payload.logger.info("Seeded site settings.");

  await payload.updateGlobal({
    slug: "about",
    data: {
      hero: {
        availability: "Available for brand deals",
        eyebrow: "About",
        headline: "Honest reviews, for people done being let down.",
        intro:
          "Hi, I'm Varsheni — a tech UGC creator who reviews the apps and businesses worth your attention.",
        bio: [
          {
            text: "I started reviewing apps because glossy ads said everything and told you nothing. So I began doing the boring, honest part — actually living with a product before I ever recommend it.",
          },
          {
            text: "Today I help brands reach an audience that trusts what I say, because I only say it when I mean it. If it earns a spot on your home screen, I'll tell you why — and if it doesn't, I'll tell you that too.",
          },
        ],
        signature: "— honest, always.",
      },
      whoIAm: {
        eyebrow: "Who I am",
        heading: "Where I come from, and what shaped the eye.",
        paragraphs: [
          {
            text: "Raised in southern India, I grew up equal parts curious and skeptical — the kind of kid who took gadgets apart to see how they worked, then argued about whether they were any good. That mix never left me.",
          },
          {
            text: "Reviewing tech is just that instinct, grown up: an honest eye, a soft spot for products made with care, and zero patience for the ones that waste your time.",
          },
        ],
        education: [
          { item: "Bachelor's degree — [field], [university]" },
          { item: "[Any relevant course / diploma]" },
        ],
        qualifications: [
          { item: "Years of hands-on tech & app reviewing" },
          { item: "Comfortable on-camera, script to edit" },
          { item: "Disclosure-first, brand-safe creator" },
        ],
        languages: [
          { item: "Hindi" },
          { item: "English" },
          { item: "Kannada" },
          { item: "Tamil" },
        ],
      },
      values: {
        eyebrow: "What I stand for",
        items: [
          {
            title: "Honest to a fault",
            body: "If it's not worth your tap, I'll say so. No paid praise, no polishing over the cracks.",
          },
          {
            title: "I actually test it",
            body: "Every app and business gets used the way you would — days, not a five-minute demo.",
          },
          {
            title: "Made for real people",
            body: "No jargon walls. Clear, warm reviews that respect your time and your money.",
          },
          {
            title: "Apps & businesses",
            body: "From the tool you open every morning to the small brand worth knowing.",
          },
        ],
      },
      bring: {
        items: [
          {
            title: "Honest reviews",
            body: "No paid praise. If it isn't worth your tap, I say so — on camera, in plain words. That honesty is exactly why the recommendation lands.",
          },
          {
            title: "Real, hands-on testing",
            body: "Days of living with the product before a single line of script gets written.",
          },
          {
            title: "Brand-safe & clear",
            body: "Disclosure-first, always on-brand, never clickbait.",
          },
          {
            title: "Thumb-stopping craft",
            body: "Short-form built to be watched to the very last second.",
          },
          {
            title: "Apps & businesses",
            body: "From the app you open every morning to the small brand worth knowing.",
          },
        ],
      },
      quote: {
        text: "The best review saves you from a purchase you'd regret — and points you to the one you'll love.",
        attribution: "Est. 2026 — Made in India",
      },
    },
  });
  payload.logger.info("Seeded about page.");

  process.exit(0);
};

await seed();
```

The reel-seed and package-seed blocks are guarded so re-running the script never duplicates rows. Globals are idempotent by nature (`updateGlobal` overwrites).

- [ ] **Step 2: Add the seed script to package.json**

Add to `"scripts"`:

```json
    "seed": "cross-env NODE_OPTIONS=--no-deprecation payload run scripts/seed.ts",
```

- [ ] **Step 3: Run the seed**

```bash
npm run seed
```

Expected output includes `Seeded 14 reels.`, `Seeded 3 packages.`, `Seeded site settings.`, `Seeded about page.`

- [ ] **Step 4: Verify idempotency**

```bash
npm run seed
```

Expected: `Reels already exist — skipping reel seed.` and `Packages already exist — skipping package seed.` — still exactly 14 reels in the admin, not 28.

- [ ] **Step 5: Attach media to one reel (manual, for later verification)**

In <http://localhost:3000/admin> → **Content → Reels** → open the CRED reel → attach the video and poster uploaded in Task 2 → Save. Task 8's verification needs at least one reel with real media.

- [ ] **Step 6: Commit**

```bash
git add scripts/seed.ts package.json
git commit -m "$(cat <<'EOF'
feat(cms): seed script porting hardcoded content into the database

Reel media is intentionally not seeded — only one shared placeholder
clip exists today, so Varsheni attaches per-reel video and poster in
the admin.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Data layer — Payload client and content mappers

Pure data functions plus their tests. No page is wired up yet, so the site keeps working throughout.

**Files:**
- Create: `lib/payload.ts`, `lib/content/reels.ts`, `lib/content/rate-card.ts`, `lib/content/site-settings.ts`, `lib/content/about.ts`
- Create: `tests/content/reels.test.ts`, `tests/content/rate-card.test.ts`, `tests/content/about.test.ts`
- Modify: `lib/work.ts`, `lib/contact-info.ts`, `tests/work-data.test.ts`, `tests/contact-info.test.ts`

**Interfaces:**
- Consumes: collections/globals from Tasks 3–5; seeded data from Task 6.
- Produces:
  - `getPayloadClient(): Promise<Payload>`
  - `mapReel(doc: PayloadReel): Reel` and `getReels(): Promise<Reel[]>`, `getReelCategories(): Promise<ReelCategory[]>`
  - `mapPackage(doc: PayloadRateCardPackage): Package` and `getPackages(): Promise<Package[]>`
  - `getContact(): Promise<ContactInfo>`, `getMailTemplates(): Promise<MailTemplate[]>`
  - `getAboutContent(): Promise<AboutContent>` plus the exported `AboutContent` type
  - `Reel`, `ReelKind`, `ReelCategory` types stay exported from `lib/work.ts`; `Package`, `ContactInfo`, `MailTemplate` stay exported from `lib/contact-info.ts`

- [ ] **Step 1: Write the failing test for the reel mapper**

Create `tests/content/reels.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { mapReel, groupByCategory } from "@/lib/content/reels";

const doc = {
  id: 7,
  title: "Is the hype worth your credit score?",
  subject: "CRED",
  kind: "app",
  category: "Money & fintech",
  href: null,
  order: 0,
  video: { id: 1, url: "https://blob.example/cred.mp4" },
  poster: { id: 2, url: "https://blob.example/cred.jpg" },
};

describe("mapReel", () => {
  it("maps a Payload doc onto the UI Reel shape", () => {
    const reel = mapReel(doc as never);
    expect(reel).toEqual({
      id: "7",
      title: "Is the hype worth your credit score?",
      subject: "CRED",
      kind: "app",
      category: "Money & fintech",
      poster: "https://blob.example/cred.jpg",
      src: "https://blob.example/cred.mp4",
      href: undefined,
    });
  });

  it("falls back to empty media strings when an upload is missing", () => {
    const reel = mapReel({ ...doc, video: null, poster: null } as never);
    expect(reel.src).toBe("");
    expect(reel.poster).toBe("");
  });
});

describe("groupByCategory", () => {
  it("groups reels in the declared category order and drops empty groups", () => {
    const reels = [
      { ...mapReel(doc as never), category: "Ed-tech" },
      { ...mapReel(doc as never), category: "Money & fintech" },
    ];
    const groups = groupByCategory(reels);
    expect(groups.map((g) => g.label)).toEqual(["Money & fintech", "Ed-tech"]);
    expect(groups.every((g) => g.reels.length > 0)).toBe(true);
  });

  it("returns an empty array when there are no reels", () => {
    expect(groupByCategory([])).toEqual([]);
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

```bash
npx vitest run tests/content/reels.test.ts
```

Expected: FAIL — cannot resolve `@/lib/content/reels`.

- [ ] **Step 3: Create the Payload client helper**

Create `lib/payload.ts`:

```typescript
import { getPayload } from "payload";
import config from "@payload-config";

export const getPayloadClient = () => getPayload({ config });
```

- [ ] **Step 4: Trim `lib/work.ts` to types only**

Replace the whole contents of `lib/work.ts` with:

```typescript
export type ReelKind = "app" | "business";

export type Reel = {
  id: string;
  title: string; // the hook / review headline
  subject: string; // the app or business reviewed
  kind: ReelKind;
  category: string; // gallery grouping
  poster: string; // Vercel Blob URL for the still
  src: string; // Vercel Blob URL for the clip
  href?: string; // optional external IG/YT link
};

export type ReelCategory = { label: string; reels: Reel[] };
```

- [ ] **Step 5: Write the reels data module**

Create `lib/content/reels.ts`:

```typescript
import { getPayloadClient } from "@/lib/payload";
import { CATEGORY_OPTIONS } from "@/collections/Reels";
import type { Reel, ReelCategory, ReelKind } from "@/lib/work";
import type { Reel as PayloadReel } from "@/payload-types";

const mediaUrl = (value: PayloadReel["poster"] | PayloadReel["video"]): string =>
  typeof value === "object" && value !== null && "url" in value ? (value.url ?? "") : "";

export const mapReel = (doc: PayloadReel): Reel => ({
  id: String(doc.id),
  title: doc.title,
  subject: doc.subject,
  kind: doc.kind as ReelKind,
  category: doc.category,
  poster: mediaUrl(doc.poster),
  src: mediaUrl(doc.video),
  href: doc.href ?? undefined,
});

export const groupByCategory = (reels: Reel[]): ReelCategory[] =>
  CATEGORY_OPTIONS.map((label) => ({
    label,
    reels: reels.filter((r) => r.category === label),
  })).filter((c) => c.reels.length > 0);

export const getReels = async (): Promise<Reel[]> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "reels",
    limit: 200,
    sort: "order",
    depth: 1,
  });
  return docs.map(mapReel);
};

export const getReelCategories = async (): Promise<ReelCategory[]> =>
  groupByCategory(await getReels());
```

- [ ] **Step 6: Run the test to confirm it passes**

```bash
npx vitest run tests/content/reels.test.ts
```

Expected: PASS (4 tests).

- [ ] **Step 7: Write the failing test for packages and contact settings**

Create `tests/content/rate-card.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { mapPackage } from "@/lib/content/rate-card";
import { mapContact } from "@/lib/content/site-settings";

describe("mapPackage", () => {
  it("flattens the deliverables array onto the UI Package shape", () => {
    const pkg = mapPackage({
      id: 3,
      name: "Single Review",
      blurb: "One product, one honest verdict.",
      priceFrom: "from ₹25,000",
      deliverables: [{ id: "a", item: "1 reel (30–60s)" }, { id: "b", item: "1 revision" }],
      order: 0,
    } as never);

    expect(pkg).toEqual({
      key: "3",
      name: "Single Review",
      blurb: "One product, one honest verdict.",
      priceFrom: "from ₹25,000",
      deliverables: ["1 reel (30–60s)", "1 revision"],
    });
  });

  it("tolerates a package with no deliverables", () => {
    expect(mapPackage({ id: 4, name: "X", blurb: "y", priceFrom: "z", deliverables: null, order: 0 } as never).deliverables).toEqual([]);
  });
});

describe("mapContact", () => {
  it("maps the settings global onto the UI ContactInfo shape", () => {
    const contact = mapContact({
      id: 1,
      email: "hello@varsheni.com",
      calLink: "varsheni/intro",
      instagram: "https://instagram.com/",
      youtube: "https://youtube.com/",
      rateCardPdf: "/rate-card.pdf",
      responseTime: "Usually replies within 48h",
      mailTemplates: [],
    } as never);

    expect(contact.email).toBe("hello@varsheni.com");
    expect(contact.calLink).toBe("varsheni/intro");
    expect(contact.responseTime).toBe("Usually replies within 48h");
  });
});
```

- [ ] **Step 8: Run it to confirm it fails**

```bash
npx vitest run tests/content/rate-card.test.ts
```

Expected: FAIL — cannot resolve `@/lib/content/rate-card`.

- [ ] **Step 9: Trim `lib/contact-info.ts` to types only**

Replace the whole contents of `lib/contact-info.ts` with:

```typescript
export type Package = {
  key: string;
  name: string;
  blurb: string;
  deliverables: string[];
  priceFrom: string;
};

export type MailTemplate = {
  key: string;
  label: string;
  subject: string;
  body: string;
};

export type ContactInfo = {
  email: string;
  calLink: string;
  instagram: string;
  youtube: string;
  rateCardPdf: string;
  responseTime: string;
};
```

- [ ] **Step 10: Write the packages and settings modules**

Create `lib/content/rate-card.ts`:

```typescript
import { getPayloadClient } from "@/lib/payload";
import type { Package } from "@/lib/contact-info";
import type { RateCardPackage } from "@/payload-types";

export const mapPackage = (doc: RateCardPackage): Package => ({
  key: String(doc.id),
  name: doc.name,
  blurb: doc.blurb,
  priceFrom: doc.priceFrom,
  deliverables: (doc.deliverables ?? []).map((d) => d.item),
});

export const getPackages = async (): Promise<Package[]> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "rate-card-packages",
    limit: 50,
    sort: "order",
  });
  return docs.map(mapPackage);
};
```

Create `lib/content/site-settings.ts`:

```typescript
import { getPayloadClient } from "@/lib/payload";
import type { ContactInfo, MailTemplate } from "@/lib/contact-info";
import type { SiteSetting } from "@/payload-types";

export const mapContact = (doc: SiteSetting): ContactInfo => ({
  email: doc.email,
  calLink: doc.calLink,
  instagram: doc.instagram,
  youtube: doc.youtube,
  rateCardPdf: doc.rateCardPdf,
  responseTime: doc.responseTime,
});

export const mapMailTemplates = (doc: SiteSetting): MailTemplate[] =>
  (doc.mailTemplates ?? []).map((t) => ({
    key: t.key,
    label: t.label,
    subject: t.subject,
    body: t.body,
  }));

const getSettings = async (): Promise<SiteSetting> => {
  const payload = await getPayloadClient();
  return payload.findGlobal({ slug: "site-settings" });
};

export const getContact = async (): Promise<ContactInfo> => mapContact(await getSettings());

export const getMailTemplates = async (): Promise<MailTemplate[]> =>
  mapMailTemplates(await getSettings());
```

- [ ] **Step 11: Run the test to confirm it passes**

```bash
npx vitest run tests/content/rate-card.test.ts
```

Expected: PASS (3 tests).

- [ ] **Step 12: Write the failing test for the About mapper**

Create `tests/content/about.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { mapAbout } from "@/lib/content/about";

const doc = {
  id: 1,
  hero: {
    availability: "Available for brand deals",
    eyebrow: "About",
    headline: "Honest reviews, for people done being let down.",
    intro: "Hi, I'm Varsheni.",
    bio: [{ id: "a", text: "First para." }, { id: "b", text: "Second para." }],
    signature: "— honest, always.",
  },
  whoIAm: {
    eyebrow: "Who I am",
    heading: "Where I come from.",
    paragraphs: [{ id: "a", text: "Raised in southern India." }],
    education: [{ id: "a", item: "Bachelor's degree" }],
    qualifications: [{ id: "a", item: "Years of reviewing" }],
    languages: [{ id: "a", item: "Hindi" }, { id: "b", item: "Tamil" }],
  },
  values: { eyebrow: "What I stand for", items: [{ id: "a", title: "Honest", body: "Body." }] },
  bring: { items: [{ id: "a", title: "Honest reviews", body: "Body." }] },
  quote: { text: "The best review.", attribution: "Est. 2026 — Made in India" },
};

describe("mapAbout", () => {
  it("flattens Payload's array-of-objects into plain string lists", () => {
    const about = mapAbout(doc as never);
    expect(about.hero.bio).toEqual(["First para.", "Second para."]);
    expect(about.whoIAm.languages).toEqual(["Hindi", "Tamil"]);
    expect(about.whoIAm.education).toEqual(["Bachelor's degree"]);
  });

  it("preserves title/body pairs for values and bring", () => {
    const about = mapAbout(doc as never);
    expect(about.values.items).toEqual([{ title: "Honest", body: "Body." }]);
    expect(about.bring).toEqual([{ title: "Honest reviews", body: "Body." }]);
  });

  it("returns empty lists rather than throwing when arrays are null", () => {
    const bare = {
      ...doc,
      hero: { ...doc.hero, bio: null },
      whoIAm: { ...doc.whoIAm, languages: null, education: null, qualifications: null, paragraphs: null },
      values: { ...doc.values, items: null },
      bring: { items: null },
    };
    const about = mapAbout(bare as never);
    expect(about.hero.bio).toEqual([]);
    expect(about.whoIAm.languages).toEqual([]);
    expect(about.values.items).toEqual([]);
    expect(about.bring).toEqual([]);
  });
});
```

- [ ] **Step 13: Run it to confirm it fails**

```bash
npx vitest run tests/content/about.test.ts
```

Expected: FAIL — cannot resolve `@/lib/content/about`.

- [ ] **Step 14: Write the About module**

Create `lib/content/about.ts`:

```typescript
import { getPayloadClient } from "@/lib/payload";
import type { About } from "@/payload-types";

export type TitledItem = { title: string; body: string };

export type AboutContent = {
  hero: {
    availability: string;
    eyebrow: string;
    headline: string;
    intro: string;
    bio: string[];
    signature: string;
  };
  whoIAm: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    education: string[];
    qualifications: string[];
    languages: string[];
  };
  values: { eyebrow: string; items: TitledItem[] };
  bring: TitledItem[];
  quote: { text: string; attribution: string };
};

const texts = (rows?: { text: string }[] | null): string[] => (rows ?? []).map((r) => r.text);
const items = (rows?: { item: string }[] | null): string[] => (rows ?? []).map((r) => r.item);
const titled = (rows?: { title: string; body: string }[] | null): TitledItem[] =>
  (rows ?? []).map((r) => ({ title: r.title, body: r.body }));

export const mapAbout = (doc: About): AboutContent => ({
  hero: {
    availability: doc.hero.availability,
    eyebrow: doc.hero.eyebrow,
    headline: doc.hero.headline,
    intro: doc.hero.intro,
    bio: texts(doc.hero.bio),
    signature: doc.hero.signature,
  },
  whoIAm: {
    eyebrow: doc.whoIAm.eyebrow,
    heading: doc.whoIAm.heading,
    paragraphs: texts(doc.whoIAm.paragraphs),
    education: items(doc.whoIAm.education),
    qualifications: items(doc.whoIAm.qualifications),
    languages: items(doc.whoIAm.languages),
  },
  values: { eyebrow: doc.values.eyebrow, items: titled(doc.values.items) },
  bring: titled(doc.bring.items),
  quote: { text: doc.quote.text, attribution: doc.quote.attribution },
});

export const getAboutContent = async (): Promise<AboutContent> => {
  const payload = await getPayloadClient();
  return mapAbout(await payload.findGlobal({ slug: "about" }));
};
```

- [ ] **Step 15: Run the test to confirm it passes**

```bash
npx vitest run tests/content/about.test.ts
```

Expected: PASS (3 tests).

- [ ] **Step 16: Retarget the two obsolete data tests**

`tests/work-data.test.ts` and `tests/contact-info.test.ts` assert on the consts deleted in Steps 4 and 9, so they no longer compile. Replace the whole contents of `tests/work-data.test.ts` with:

```typescript
import { describe, it, expect } from "vitest";
import { mapReel, groupByCategory } from "@/lib/content/reels";
import type { Reel } from "@/lib/work";

const make = (over: Partial<Reel> & { id: string }): Reel => ({
  title: "t",
  subject: "s",
  kind: "app",
  category: "Money & fintech",
  poster: "/p.jpg",
  src: "/v.mp4",
  ...over,
});

describe("reel shaping", () => {
  it("keeps every reel's required fields non-empty and its kind valid", () => {
    const reel = mapReel({
      id: 1,
      title: "T",
      subject: "S",
      kind: "business",
      category: "Ed-tech",
      href: null,
      order: 0,
      video: { id: 1, url: "/v.mp4" },
      poster: { id: 2, url: "/p.jpg" },
    } as never);

    for (const k of ["id", "title", "subject", "poster", "src", "category"] as const) {
      expect(reel[k]).toBeTruthy();
    }
    expect(["app", "business"]).toContain(reel.kind);
  });

  it("groups every reel into a non-empty category", () => {
    const reels = [make({ id: "1" }), make({ id: "2", category: "Ed-tech" })];
    const groups = groupByCategory(reels);
    expect(groups.flatMap((c) => c.reels).length).toBe(reels.length);
    for (const c of groups) {
      expect(c.label).toBeTruthy();
      expect(c.reels.length).toBeGreaterThan(0);
    }
  });
});
```

Then open `tests/contact-info.test.ts` and delete it — its assertions about `PACKAGES`, `CONTACT`, and `MAIL_TEMPLATES` shape are now covered by `tests/content/rate-card.test.ts`:

```bash
git rm tests/contact-info.test.ts
```

- [ ] **Step 17: Run the whole suite**

```bash
npm test
```

Expected: PASS. Component tests (`reel-card`, `rate-card`, `work-page`, …) still pass because they construct their own fixture props and never imported the deleted consts.

- [ ] **Step 18: Commit**

```bash
git add lib/payload.ts lib/content lib/work.ts lib/contact-info.ts tests/content tests/work-data.test.ts
git commit -m "$(cat <<'EOF'
feat(cms): add Payload-backed content data layer

lib/work.ts and lib/contact-info.ts keep their UI types; the module-level
constants move into the database and are read through mappers.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Wire the Work page to the database

**Files:**
- Modify: `app/(frontend)/work/page.tsx`, `components/work/work-page.tsx`

**Interfaces:**
- Consumes: `getReels()`, `getReelCategories()` from Task 7.
- Produces: `WorkPage` accepting `{ reels: Reel[]; categories: ReelCategory[] }`.

- [ ] **Step 1: Read the current component to find every `REELS` / `REEL_CATEGORIES` reference**

```bash
grep -n "REELS\|REEL_CATEGORIES\|from \"@/lib/work\"" components/work/work-page.tsx components/work/reel-gallery.tsx components/work/process.tsx components/card-nav.tsx
```

Note each file and line — Step 3 replaces them with props threaded from `WorkPage`.

- [ ] **Step 2: Make the page a data-fetching Server Component**

Replace `app/(frontend)/work/page.tsx` with:

```tsx
import type { Metadata } from "next";
import { WorkPage } from "@/components/work/work-page";
import { getReels, getReelCategories } from "@/lib/content/reels";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Work — Varsheni",
  description: "Reels and honest reviews of the apps and businesses worth your tap.",
};

export default async function Page() {
  const [reels, categories] = await Promise.all([getReels(), getReelCategories()]);
  return <WorkPage reels={reels} categories={categories} />;
}
```

`force-dynamic` is what makes admin edits appear immediately — see "Deviation from the spec" above.

- [ ] **Step 3: Thread the data through `WorkPage`**

In `components/work/work-page.tsx`: delete the `REELS` / `REEL_CATEGORIES` import from `@/lib/work` (keep any type-only imports), add the props, and pass them down to whichever children previously imported the constants directly:

```tsx
export function WorkPage({
  reels,
  categories,
}: {
  reels: Reel[];
  categories: ReelCategory[];
}) {
```

Apply the same treatment to any file Step 1 flagged: replace its module-constant import with a prop supplied by `WorkPage`. Do **not** change markup, class names, or motion props.

- [ ] **Step 4: Handle the empty state**

Inside `WorkPage`, where the gallery renders, guard the empty case so a fully-cleared collection degrades instead of rendering a bare grid. Place this immediately before the gallery markup:

```tsx
{categories.length === 0 ? (
  <p className="mx-auto max-w-6xl px-6 py-20 font-sans text-[15px] text-creme/60 sm:px-10">
    New reels are on the way — check back soon.
  </p>
) : (
  /* existing gallery markup, unchanged */
)}
```

- [ ] **Step 5: Verify in the browser**

```bash
npm run dev
```

Open <http://localhost:3000/work>. Expected: the 14 seeded reels render in the same layout as before. The reel given real media in Task 6 Step 5 plays its hover preview and opens in the lightbox; the others show empty posters (expected — no media attached yet).

Now edit that reel's title in <http://localhost:3000/admin>, save, and reload `/work`. Expected: the new title appears immediately, with no rebuild.

- [ ] **Step 6: Run tests and typecheck**

```bash
npm test && npx tsc --noEmit
```

Expected: both pass.

- [ ] **Step 7: Commit**

```bash
git add "app/(frontend)/work/page.tsx" components/work
git commit -m "$(cat <<'EOF'
feat(work): render reels from the CMS

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: Wire the Connect page to the database

**Files:**
- Modify: `app/(frontend)/contact/page.tsx`, `components/contact/contact-page.tsx`, `components/contact/rate-card.tsx`, `tests/rate-card.test.tsx`

**Interfaces:**
- Consumes: `getPackages()`, `getContact()`, `getMailTemplates()` from Task 7.
- Produces: `ContactPage` accepting `{ packages: Package[]; contact: ContactInfo; mailTemplates: MailTemplate[] }`; `RateCard` accepting `{ packages: Package[]; rateCardPdf: string }`.

- [ ] **Step 1: Find every consumer of the deleted constants**

```bash
grep -rn "PACKAGES\|CONTACT\|MAIL_TEMPLATES" components app tests
```

Each hit needs a prop instead of an import.

- [ ] **Step 2: Make the page a data-fetching Server Component**

Replace `app/(frontend)/contact/page.tsx`'s default export and add the fetches — keep the existing `metadata` export exactly as it is:

```tsx
import { getPackages } from "@/lib/content/rate-card";
import { getContact, getMailTemplates } from "@/lib/content/site-settings";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [packages, contact, mailTemplates] = await Promise.all([
    getPackages(),
    getContact(),
    getMailTemplates(),
  ]);
  return <ContactPage packages={packages} contact={contact} mailTemplates={mailTemplates} />;
}
```

- [ ] **Step 3: Thread the data through `ContactPage` and `RateCard`**

In `components/contact/contact-page.tsx`, add the three props and pass them to the children flagged in Step 1.

In `components/contact/rate-card.tsx`, delete `import { CONTACT, PACKAGES, type Package } from "@/lib/contact-info";`, replace it with `import type { Package } from "@/lib/contact-info";`, and change the signature:

```tsx
export function RateCard({
  packages,
  rateCardPdf,
}: {
  packages: Package[];
  rateCardPdf: string;
}) {
```

Then replace `PACKAGES.map(...)` with `packages.map(...)` and `href={CONTACT.rateCardPdf}` with `href={rateCardPdf}`. Leave every class name, `SpotlightCard` prop, and `LightRays` prop untouched.

- [ ] **Step 4: Update the RateCard component test**

`tests/rate-card.test.tsx` renders `<RateCard />` with no props, which no longer typechecks. Open it and pass fixtures:

```tsx
const packages = [
  {
    key: "1",
    name: "Single Review",
    blurb: "One product, one honest verdict.",
    deliverables: ["1 reel (30–60s)", "1 revision"],
    priceFrom: "from ₹25,000",
  },
];

// then, at each render site:
render(<RateCard packages={packages} rateCardPdf="/rate-card.pdf" />);
```

Keep every existing assertion — they should still hold against this fixture.

- [ ] **Step 5: Run tests**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 6: Verify in the browser**

```bash
npm run dev
```

Open <http://localhost:3000/contact>. Expected: the 3 seeded packages render identically to before, and the Cal.com embed still loads. Change a package's `priceFrom` in the admin, save, reload — the new price shows immediately.

- [ ] **Step 7: Typecheck and commit**

```bash
npx tsc --noEmit
```

```bash
git add "app/(frontend)/contact/page.tsx" components/contact tests/rate-card.test.tsx
git commit -m "$(cat <<'EOF'
feat(connect): render packages and contact details from the CMS

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: Wire the About page to the database

**Files:**
- Modify: `app/(frontend)/about/page.tsx`, `components/about/about-page.tsx`, `components/about/who-i-am.tsx`, `components/about/what-i-bring.tsx`

**Interfaces:**
- Consumes: `getAboutContent()` and the `AboutContent` type from Task 7.
- Produces: `AboutPage` accepting `{ content: AboutContent }`; `WhoIAm` accepting `{ content: AboutContent["whoIAm"] }`; `WhatIBring` accepting `{ items: TitledItem[] }`.

- [ ] **Step 1: Make the page a data-fetching Server Component**

Replace `app/(frontend)/about/page.tsx` with:

```tsx
import type { Metadata } from "next";
import { AboutPage } from "@/components/about/about-page";
import { getAboutContent } from "@/lib/content/about";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About — Varsheni",
  description:
    "Meet Varsheni, a tech UGC creator making honest reviews of the apps and businesses worth your attention.",
};

export default async function Page() {
  const content = await getAboutContent();
  return <AboutPage content={content} />;
}
```

- [ ] **Step 2: Replace the hardcoded copy in `about-page.tsx`**

Delete the `VALUES` constant. Add the prop and swap each hardcoded string for its field. Change the signature to:

```tsx
export function AboutPage({ content }: { content: AboutContent }) {
```

with `import type { AboutContent } from "@/lib/content/about";` at the top. Then substitute, leaving all wrapper elements and class names untouched:

- the availability pill text → `{content.hero.availability}`
- the `✦ About` eyebrow's label → `{content.hero.eyebrow}` (keep the `<span>✦</span>&nbsp;&nbsp;` prefix markup)
- the `<h1>` copy → `{content.hero.headline}`
- the intro `<p>` → `{content.hero.intro}`
- the two bio `<p>` blocks → `{content.hero.bio.map((text, i) => (<Reveal key={i} delay={i * 0.08}><p className="font-sans text-[15px] leading-relaxed text-creme/75 sm:text-base">{text}</p></Reveal>))}`
- the script signature `<p>` → `{content.hero.signature}`
- the "What I stand for" label → `{content.values.eyebrow}`
- `VALUES.map(...)` → `content.values.items.map(...)`
- the pull-quote `<p>` → `{content.quote.text}` (this removes the inline `<span className="font-script text-amber-dot">love</span>` accent, since the quote is now a single editable string)
- the "Est. 2026 — Made in India" line → `{content.quote.attribution}`

Pass the child data down: `<WhoIAm content={content.whoIAm} />` and `<WhatIBring items={content.bring} />`.

- [ ] **Step 3: Replace the hardcoded copy in `who-i-am.tsx`**

Delete the `EDUCATION`, `QUALIFICATIONS`, and `LANGUAGES` constants. Change the signature to:

```tsx
export function WhoIAm({ content }: { content: AboutContent["whoIAm"] }) {
```

Then swap: the `✦ Who I am` label → `{content.eyebrow}`; the `<h2>` → `{content.heading}`; the two narrative `<p>` blocks → `content.paragraphs.map(...)` (this drops the inline `(Placeholder — your real story goes here.)` span, which was placeholder scaffolding); `<FactColumn label="Education" items={EDUCATION} />` → `items={content.education}`; likewise `qualifications`; and `LANGUAGES.map` → `content.languages.map`. `FactColumn` itself needs no changes.

- [ ] **Step 4: Replace the hardcoded copy in `what-i-bring.tsx`**

Delete the `BRING` constant. Change the signature to:

```tsx
export function WhatIBring({ items }: { items: TitledItem[] }) {
```

with `import type { TitledItem } from "@/lib/content/about";`. The `Card` component's `item` prop is typed `(typeof BRING)[number]` — retype it to `TitledItem & { n: string }`. Since the numbering came from the deleted constant, derive it at the call site:

```tsx
const numbered = items.map((item, i) => ({ ...item, n: String(i + 1).padStart(2, "0") }));
```

Then map over `numbered` wherever the file previously mapped over `BRING`, preserving the existing featured/bento layout logic exactly.

- [ ] **Step 5: Verify in the browser**

```bash
npm run dev
```

Open <http://localhost:3000/about>. Expected: the page reads identically to before (bar the two intentional drops noted in Steps 2 and 3 — the `love` script accent inside the pull-quote and the placeholder parenthetical). Sparkles, aurora, logo wall, seal, and the bottom blur are unchanged.

Then edit `hero.headline` in the admin, save, reload. Expected: new headline appears immediately.

- [ ] **Step 6: Run tests and typecheck**

```bash
npm test && npx tsc --noEmit
```

Expected: both pass.

- [ ] **Step 7: Commit**

```bash
git add "app/(frontend)/about/page.tsx" components/about
git commit -m "$(cat <<'EOF'
feat(about): render page copy from the CMS

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 11: MCP server for AI-agent editing

**Files:**
- Modify: `payload.config.ts`, `package.json`

**Interfaces:**
- Consumes: every collection and global from Tasks 2–5.
- Produces: an authenticated MCP endpoint at `/api/mcp`.

Per the approved spec, agents get **full read/write/delete parity** with human editors.

- [ ] **Step 1: Install the plugin**

```bash
npm i --legacy-peer-deps @payloadcms/plugin-mcp@3.86.0
```

- [ ] **Step 2: Register the plugin**

In `payload.config.ts`, add `import { mcpPlugin } from "@payloadcms/plugin-mcp";` and append to the existing `plugins` array (after `vercelBlobStorage`):

```typescript
    mcpPlugin({
      collections: {
        reels: { enabled: { find: true, create: true, update: true, delete: true } },
        "rate-card-packages": { enabled: { find: true, create: true, update: true, delete: true } },
        media: { enabled: { find: true, create: true, update: true, delete: true } },
        videos: { enabled: { find: true, create: true, update: true, delete: true } },
      },
    }),
```

`users` is deliberately omitted — account management stays a human-only, GUI-only operation.

- [ ] **Step 3: Regenerate types and boot**

```bash
npm run generate:types && npm run dev
```

- [ ] **Step 4: Create an MCP API key**

In <http://localhost:3000/admin> → **MCP → API Keys** → create a key named `claude-dev`. Copy the key immediately (it is shown once).

- [ ] **Step 5: Verify the endpoint rejects unauthenticated calls**

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/mcp -H 'Content-Type: application/json'
```

Expected: `401` (or another 4xx) — never `200`.

- [ ] **Step 6: Verify an authenticated call works**

```bash
npx @modelcontextprotocol/inspector
```

In the Inspector UI: transport **Streamable HTTP**, URL `http://localhost:3000/api/mcp`, header `Authorization: Bearer <key from Step 4>`. Connect and list tools. Expected: tools for `reels`, `rate-card-packages`, `media`, and `videos`, plus tools for the `about` and `site-settings` globals. Call the reels find tool. Expected: returns the seeded reels.

- [ ] **Step 7: Commit**

```bash
git add payload.config.ts payload-types.ts package.json package-lock.json
git commit -m "$(cat <<'EOF'
feat(cms): expose content over Payload's MCP server

Reels, packages, and uploads get full CRUD parity for AI agents; the
users collection is excluded so account management stays GUI-only.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 12: Deploy to Vercel and write the runbook

**Files:**
- Create: `docs/DEPLOYMENT.md`

**Interfaces:**
- Consumes: everything above.
- Produces: a live `/admin` on the deployed site and a written setup runbook.

- [ ] **Step 1: Confirm the required env vars exist in Vercel**

Vercel dashboard → project → Settings → Environment Variables. Confirm all of these are present for Production, Preview, and Development:

- `DATABASE_URL` — added by the Neon integration (Task 1)
- `BLOB_READ_WRITE_TOKEN` — added by the Blob store (Task 2)
- `PAYLOAD_SECRET` — **add manually**; use the same value as `.env.local` or generate a new one with `openssl rand -hex 32`

- [ ] **Step 2: Verify the production build locally first**

```bash
npm run build
```

Expected: succeeds. The route list shows `/`, `/about`, `/work`, `/contact` as dynamic (ƒ), plus `/admin/[[...segments]]` and the `/api` routes.

- [ ] **Step 3: Push and deploy**

```bash
git push origin v2
```

Then confirm the Vercel deployment succeeds. If the branch is not the production branch, use the preview URL for the remaining steps.

- [ ] **Step 4: Smoke-test the deployment**

Visit, in order:
- `/` , `/about`, `/work`, `/contact` — render with seeded content
- `/admin` — login screen appears; log in with Varsheni's account
- Edit a reel title in the deployed admin, save, reload `/work` — change appears immediately

- [ ] **Step 5: Verify unauthenticated access is refused**

In a private/incognito window, open `<deployment-url>/admin`. Expected: redirected to the login screen, not into the panel.

- [ ] **Step 6: Write the runbook**

Create `docs/DEPLOYMENT.md` with exactly the content below (the outer fence is four backticks so the nested JSON block survives — do not copy the outer fence itself):

````markdown
# Deployment & Content Admin Runbook

## Environment variables

| Var | Where it comes from | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Neon integration (Vercel → Storage) | Pooled connection string. Injected automatically. |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob store | Injected automatically once a Blob store is connected. |
| `PAYLOAD_SECRET` | Set manually | Signs sessions. `openssl rand -hex 32`. Changing it logs everyone out. |

Local development uses the same values in `.env.local` (gitignored).

## Free-tier limits to watch

- **Vercel Blob:** 1 GB storage, 10 GB transfer/month. Videos dominate both. Check
  Vercel → Storage → Blob → Usage as the reel library grows.
- **Neon Postgres:** 500 MB. Text content will not come close.
- Payload rejects uploads over **50 MB** and accepts `video/mp4` for reels and
  `image/*` for posters.

## Editing content

Log in at `/admin`:

- **Content → Reels** — the `/work` gallery. Each reel needs a video and a poster.
  `order` controls position within a category (lower first).
- **Content → Rate Card Packages** — the `/contact` pricing tiles.
- **Content → About Page** — all `/about` copy.
- **Settings → Site Settings** — email, Cal.com link, socials, rate-card PDF,
  response time, and the mailto starter templates.

Saved changes appear on the live site immediately (the three content pages are
rendered per-request).

## Editing content with Claude

The site exposes an MCP server at `<site-url>/api/mcp`.

1. In `/admin` → **MCP → API Keys**, create a key (shown once — copy it).
2. Add the server to the MCP client. For Claude Code / Claude Desktop:

```json
{
  "mcpServers": {
    "varsheni": {
      "type": "http",
      "url": "https://<site-url>/api/mcp",
      "headers": { "Authorization": "Bearer <API-KEY>" }
    }
  }
}
```

Agent calls run through the same access control and validation as the admin UI,
**including delete**. Treat the API key like a password.

## Resetting a password

There is no email provider wired up, so the "forgot password" link cannot send
mail. To reset an account:

- **Normal case** — the other user logs in at `/admin` → **Users** → open the
  account → set a new password → Save.
- **Both accounts locked out** — create a fresh admin from the machine that has
  `.env.local`, then log in with it and fix the others:

```bash
npm run payload -- run scripts/create-user.ts
```

Write that one-off script with `payload.create({ collection: 'users', data: {
email, password } })`, run it, then delete it.

## Adding a new reel category

Categories are a fixed dropdown. To add one, append it to `CATEGORY_OPTIONS` in
`collections/Reels.ts`, then run `npm run generate:types` and redeploy.

## Restoring seed content

`npm run seed` repopulates the packages, site settings, and About copy. It skips
reels and packages if any already exist, so it is safe to re-run.
````

- [ ] **Step 7: Commit**

```bash
git add docs/DEPLOYMENT.md
git commit -m "$(cat <<'EOF'
docs: deployment and content admin runbook

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Manual QA checklist (run after Task 12)

From the spec's testing plan — run against the deployed site:

- [ ] Log in as Varsheni's account; log in as the developer account
- [ ] Create a reel with a real video + poster upload; confirm it appears on `/work` with no rebuild
- [ ] Edit a reel; delete a reel; confirm both reflect immediately
- [ ] Edit a rate-card package price; confirm `/contact` updates
- [ ] Edit an About field; confirm `/about` updates
- [ ] Attempt a video upload over 50 MB; confirm it is rejected
- [ ] Attempt a non-mp4 upload into Videos; confirm it is rejected
- [ ] Confirm a logged-out visitor cannot reach `/admin`
- [ ] Confirm `/api/mcp` rejects a request with no bearer token
- [ ] Delete every reel; confirm `/work` shows the empty state rather than breaking; restore with `npm run seed`
