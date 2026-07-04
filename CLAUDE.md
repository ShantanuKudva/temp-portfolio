# CLAUDE.md

Orientation for Claude Code working in this repo. Keep this concise and high-signal; put detail in the spec.

## Project

**Varsheni** — a portfolio site for a **tech UGC creator who reviews apps & businesses**. The centerpiece is a **scroll-driven 3D landing sequence**.

## Status (as of 2026-07-04)

**Build underway** on branch `build/landing-sequence` (master clean), executed via subagent-driven-development against `docs/superpowers/plans/2026-07-04-landing-sequence.md`. Committed: scaffold, scroll engine (`p`), photoreal gate, mock room, phone, camera, hook text, and a `/spike` live scrubbable preview. **Resume from `.superpowers/sdd/RESUME.md`** (+ `progress.md`) — it has the exact next steps. Mid-swap: iPhone 14 Pro (`~/Downloads/iphone_14_pro.glb`, uncompressed → compress + wire in).

**Design updates this session (these OVERRIDE the palette table below + the phone/room spec):** NO cream (hard rule), cherry-maroon now optional, **wall color matches the props**; phone = **iPhone 14 Pro** (Sketchfab); room to be dressed with the Sketchfab "desk-setup" collection + a window with golden sun-rays + a glowing lamp + spotlights on the lift/apps beats. **Order:** iPhone 14 swap → finalize room → then continue (logos, screen, title, preloader, portfolio, tuning).

## The landing sequence (locked)

One continuous, fully scroll-driven page. The hero is a photoreal cherry-maroon creator's room:

1. **Establish** — room, phone resting on a propped walnut desk, golden daylight
2. **Lift** — scroll lifts the phone off the desk → *"Tech is loud."*
3. **Burst** — 3D logos of real companies the creator covers (YouTube, Instagram, Claude, OpenAI, Gemini, Figma, Notion, GitHub, Perplexity, Spotify, Stripe, Midjourney, Meta, Linear, Radix UI) erupt out of the phone, out of order
4. **Constellation** — logos connect into a network map above the desk → *"I make it make sense."*
5. **Return** — the map flows back into the phone → *"Sixty seconds. Zero fluff."*
6. **Rotate + Push-through** — phone turns landscape, camera dives through the screen
7. **Reveal → Portfolio** — name decodes in → *"Varsheni — tech that actually clicks."* → bridges into "Recent obsessions."

The cherry-maroon room is the **persistent setting** (desk + props stay visible while the phone lifts and logos form above). Copy is one **morphing scramble line** (Bold/Confident voice), scroll-triggered/time-played.

**Full detail:** [docs/superpowers/specs/2026-07-04-landing-sequence-design.md](docs/superpowers/specs/2026-07-04-landing-sequence-design.md) — source of truth.

## Tech stack (decided)

- **Next.js** (latest, App Router) + **React Three Fiber** (latest) + `@react-three/drei` + `@react-three/postprocessing` (bloom)
- **DOM/UI:** Tailwind + **shadcn/ui** (Radix primitives) for **all** DOM UI — overlays, preloader, portfolio handoff, buttons/cards/progress. **No hand-rolled UI primitives ever.** Palette wired into shadcn theme tokens. Custom-only where shadcn has no equivalent (R3F scene, scramble effect), rendered inside shadcn/Tailwind containers. **Always install latest stable package versions.**
- **Scroll:** Lenis (smooth) + GSAP ScrollTrigger to pin the hero canvas and expose progress. **Not** drei `ScrollControls` (it owns its own scroll container and fights a long mixed 3D+DOM page).
- **One normalized scroll progress `p` (0..1)** drives every rig; each rig maps `p` → its state via a checkpoint table (independently tunable). Modules: `ScrollProvider`, `HeroCanvas`, `RoomEnvironment`, `LogoField`, `PhoneRig`, `ScreenContent`, `CameraRig`, `HookText`, `TitleReveal`, `Preloader`, `PortfolioHandoff`.
- **Photoreal is a build given** — real modeled/textured assets, PBR, HDRI, baked GI, Draco geometry + KTX2 textures, gated preloader. Validate fidelity + perf budget as **build step one** (real desk asset + HDRI). Primitive mocks only prove choreography.

## Palette (cherry maroon)

| Token | Hex | Use |
|---|---|---|
| Cherry maroon | `#7B1E2B` | Accent wall, brand, primary |
| Deep wine | `#571620` | Curtains, deep shadow, hover/pressed |
| Wine ink | `#2A1A1C` | Darkest surfaces, text on light |
| Taupe | `#8A7268` | Muted / secondary |
| Antique gold | `#B08D4C` | Thin accents only — frames, molding, hairlines |
| Dusty blush | `#E8C9C4` | Rug, soft washes |
| Warm sand | `#EADFCF` | Floor, baseboards |
| Warm cream | `#F4EBDD` | Side wall, ceiling, light surfaces |
| Forest green | `#2F4A3A` | Plant, minor accents |

## Out of scope / deferred

- Portfolio content sections (Work / About / Contact) — separate later spec.
- Mobile choreography — decided after the desktop build (architecture must allow a reduced path).
- Final company list, official 3D logo assets (trademark/asset step), production copy & stats.
- A **separate** wine-label design-studio brief exists (its palette was adopted here; its layout was not) — do not merge its layout unless asked.

## Brainstorm artifacts (gitignored, under `.superpowers/brainstorm/`)

These are throwaway mocks, not shipped code, but useful reference for the intended feel:

- `webgl-room.html` — the **consolidated moving mock** (Three.js via CDN): full room → lift → logos → constellation → return → push-through.
- `styleframes.html` — art-directed styleframes of the target look (CSS illustration).
- `sequence-prototype-v4.html` — scramble-text + scroll-timing prototype.

## Working with the WebGL mocks — gotchas

- **`THREE.Object3D.position` / `.rotation` / `.scale` / `.quaternion` are non-writable.** Mutate them (`obj.position.set(...)`, `obj.position.z = ...`) — **never reassign** (`Object.assign(mesh, {position})` or `mesh.position = v` throws in strict-mode ES modules and blanks the whole scene).
- Mocks import Three.js from unpkg via an import map — they need network in the browser.
- **Verify a mock actually renders** by driving system Chrome headless (puppeteer-core with `executablePath` = the installed Chrome), waiting for `networkidle2` + a few seconds, capturing `pageerror`/`console` and a screenshot. `--virtual-time-budget` screenshots are unreliable (they don't wait for the CDN); a transparent center-pixel readback is also a false signal (WebGL discards the drawing buffer without `preserveDrawingBuffer`).
