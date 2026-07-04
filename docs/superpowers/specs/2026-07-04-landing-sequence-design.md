# Landing Sequence — Design Spec

**Project:** Varsheni — portfolio for a tech UGC creator who reviews **apps & businesses**
**Scope:** The scroll-driven landing sequence only (the opening movement of one continuous-scroll page). Portfolio content sections are a separate, later spec.
**Date:** 2026-07-04
**Status:** Direction locked, pending spec review.

---

## 1. Concept

The portfolio opens inside a warm, photoreal **cherry-maroon creator's room** — a phone resting on a propped walnut desk, golden daylight through a gold-framed window. As the visitor scrolls, the phone **lifts off the desk** and **3D logos of the real companies the creator covers** (YouTube, Instagram, Claude, OpenAI, Gemini, Figma…) **erupt out of it in disarray**, then **organize into a constellation** — a connected map of the landscape — before **flowing back into the phone**. The phone rotates to landscape, the camera **pushes through the screen** until content fills the viewport, the name resolves out of scrambling type, and the scroll carries the visitor — unbroken — into the portfolio.

The room is the persistent **setting**; the logos are the **subject** (this creator makes sense of apps & businesses). The three hook lines map one-to-one onto the logo choreography:

- **Chaos → "Tech is loud."** — logos erupt from the phone, out of order.
- **Order → "I make it make sense."** — logos connect into a constellation map.
- **Distill → "Sixty seconds. Zero fluff."** — the map condenses back into the phone.

---

## 2. Goals & non-goals

**Goals**
- A cinematic, fully scroll-driven hero that establishes the creator's craft and personality in seconds.
- The subject (apps/businesses) is told through **real-company 3D logos** erupting from, and returning to, the phone.
- The **cherry-maroon room stays the grounded setting** throughout — the phone lifts off a propped desk that remains visible.
- Seamless, continuous scroll from the climax into the portfolio (no page change / hard cut).

**Non-goals (this spec)**
- Portfolio content sections (Work / About / Contact) — later spec.
- Final mobile choreography — decided after the desktop build (a reduced fallback is in scope as a principle).
- Final production copy beyond the locked hook lines; real handles/stats deferred with the portfolio content.
- The final, exhaustive company list — a representative set is defined; the creator confirms later.

---

## 3. Audience & positioning

Primary: brands, collaborators, and clients evaluating the creator, plus fans. A flashy personal showcase that also says "hire me." The creator's niche is **reviewing and making sense of apps & businesses** — the constellation of logos *is* the positioning statement.

---

## 4. The setting — cherry-maroon room (photoreal)

A warm, editorial, vintage-luxe **creator's room**, rendered photoreal, that persists as the backdrop for the whole sequence.

**Palette** (cherry maroon):

| Token | Hex | Use |
|---|---|---|
| Cherry maroon | `#7B1E2B` | Accent wall, brand, primary |
| Deep wine | `#571620` | Curtains, deep shadow, hover/pressed |
| Wine ink | `#2A1A1C` | Darkest surfaces, text on light |
| Taupe | `#8A7268` | Muted / secondary |
| Antique gold | `#B08D4C` | Thin accents — window frame, crown molding, art frames |
| Dusty blush | `#E8C9C4` | Rug, soft washes |
| Warm sand | `#EADFCF` | Floor, baseboards |
| Warm cream | `#F4EBDD` | Side wall, ceiling, light surfaces |
| Forest green | `#2F4A3A` | Plant, one framed piece (minor accent) |

**Set dressing:** maroon accent back wall, warm-cream side wall & ceiling with antique-gold crown molding, warm-sand floor, blush-and-maroon rug; a walnut desk with props (laptop, mug, books, plant, desk lamp with warm pool); a gold-framed window with golden daylight and light shafts; a bookshelf with colored spines; a framed-art trio. Warm, lived-in, luxe.

**Art style: photoreal.** Real modeled + textured assets, PBR materials, HDRI image-based lighting, baked GI/lightmaps where possible, post-process bloom for the window/screen/gold glow. (Fidelity is validated as **step one of the build**, with a real desk asset + HDRI — not in a primitive blockout.)

**The setting persists:** the desk and props stay grounded and visible while the phone lifts off and the logo constellation forms above them. The room never empties.

---

## 5. Master timeline

One normalized scroll progress `p` (0→1) drives everything. Percentages are provisional, tuned in-engine.

| p | Beat | Room / Phone / Camera | Logos | Copy (one morphing line) |
|---|---|---|---|---|
| 0–10% | **Establish** | Room in golden daylight; phone rests on the desk; 3/4 establishing camera | in phone | *(line resolves in)* |
| 10–22% | **Lift** | Phone rises off the desk into the room; camera eases frontal | in phone | **"Tech is loud."** |
| 22–30% | **Burst** | Phone hero; desk + props stay below | logos **erupt** out of the phone, out of order | **"Tech is loud."** |
| 30–40% | **Swirl** | — | logos flow toward organization | *(morphing…)* |
| 40–50% | **Constellation** | warm glow peaks | logos **connect into a network map** above the desk | **"I make it make sense."** |
| 50–58% | **Hold** | — | the map holds, lightly alive | *(holds)* |
| 58–65% | **Return** | spotlight narrows to the phone | logos **flow back into the phone** | **"Sixty seconds. Zero fluff."** |
| 64–74% | **Rotate** | phone turns to landscape; notch/contact fade | — | *(line clears)* |
| 74–88% | **Push-through** | camera dives through the screen (bezels exit) + screen breakout | — | — |
| 88–95% | **Reveal** | full-bleed content; soft vignette | — | **"Varsheni — tech that actually clicks."** |
| 95–100% | **Bridge → portfolio** | continuous scroll into portfolio | — | **"So here's what that looks like."** → **"Recent obsessions."** |

---

## 6. The logo system

**Subject:** real companies the creator reviews. Representative set (final list TBD with creator): **YouTube, Instagram** (hero — also the creator's platforms), **Claude, OpenAI, Gemini, Figma, Notion, GitHub, Perplexity, Spotify, Stripe, Midjourney, Meta, Linear**.

**Form:** each is a **3D version of the company's official logo** (extruded, glossy, PBR). Using the real marks is editorial/nominative (the creator reviews these companies) — **verify trademark usage per company; this is a defined asset step.** Hero logos (YouTube, Instagram) sit centrally and read slightly larger.

**Constellation:** at the order stage the logos become **nodes connected by thin lines** — a map of the landscape ("making sense" of it). Organic golden-angle spread facing camera, hero logos near center; edges connect nearest neighbours; lines fade in as the map forms and follow the nodes' idle drift.

**Choreography — 7 checkpoints** (the module's public contract; driven only by `p`):
`Dormant (in phone) → Burst (erupt, chaos) → Swirl → Constellation (connected) → Hold → Return (into phone) → Clean`

---

## 7. Phone & camera rig

- **Phone:** photoreal iPhone 16 Pro, matte titanium; screen is a live render surface. Starts **on the desk on a stand**, **lifts** into the room as hero, later **rotates** to landscape.
- **Screen content:** a home-screen app grid at rest (the source of the logos); a short-form reel look for the push-through.
- **Push-through:** camera dollies toward the screen until bezels exit the viewport (true perspective — the reason for real 3D), with a slight **screen breakout** (content scales ~1.1× past the frame) for punch.
- **Camera path:** 3/4 establishing room shot → eases frontal as the phone lifts → holds frontal through the constellation (gentle drift) → squares up → push-through. Shallow depth of field keeps the phone hero while the room stays a soft, present backdrop.

---

## 8. Copy, voice & motion

**Voice:** Bold / Confident. **Structure:** independent punchlines building to the name reveal, then a *continuation* bridge into the portfolio.

**The lines** (one persistent line, re-scrambling between each):
1. "Tech is loud." 2. "I make it make sense." 3. "Sixty seconds. Zero fluff." 4. "Varsheni — tech that actually clicks." *(reveal)* 5. "So here's what that looks like." *(bridge)* → portfolio header "Recent obsessions."

**Motion — Decode / Scramble morph.** A single line re-scrambles its own characters from one statement into the next — never a fade; unsettled glyphs at ~50% opacity. Because a scramble is time-based while the scene is scroll-driven, it is **scroll-triggered, time-played**: crossing a beat triggers the ~0.7s decode; the phone/camera/logos scrub directly with `p`. Reversing scroll re-morphs to the previous line.

---

## 9. Technical architecture

**Stack:** Next.js (latest, App Router) + React Three Fiber (latest) + `@react-three/drei` + `@react-three/postprocessing` (bloom). **Scroll:** Lenis (smooth scroll) + GSAP ScrollTrigger to pin the hero canvas and expose `p`; portfolio DOM sections live below in the same continuous scroll. *(Chosen over drei `ScrollControls`, which owns its own scroll container and fights a long mixed 3D+DOM page.)*

**Single source of truth:** one normalized `p` from a `ScrollProvider`, consumed by every rig; each maps `p` → its own state via a checkpoint table, independently tunable.

**Modules (designed for isolation):**

| Module | Responsibility | Input |
|---|---|---|
| `ScrollProvider` | Lenis + ScrollTrigger; emits `p` + section progress | scroll |
| `HeroCanvas` | Pinned R3F `<Canvas>` + PostFX (bloom) | — |
| `RoomEnvironment` | The cherry-maroon room: walls, desk, props, HDRI, lighting choreography | `p` |
| `LogoField` | Real-company 3D logos: 7-checkpoint erupt → constellation → return, + connecting lines | `p` |
| `PhoneRig` | Phone: rest-on-desk → lift → hero → rotate → push/breakout | `p` |
| `ScreenContent` | App-grid → reel on the phone screen | `p` |
| `CameraRig` | Establishing → frontal → push-through path | `p` |
| `HookText` | DOM overlay; morphing scramble line | `p` |
| `TitleReveal` | Name + bridge at climax | `p` |
| `Preloader` | Asset loading + progress gate | — |
| `PortfolioHandoff` | Seam into the portfolio (stub) | section progress |

**Asset pipeline:** Draco geometry + KTX2 textures; HDRI environment; baked lighting/lightmaps where possible; a few dynamic lights (window sun, lamp, screen glow); instancing/LODs for logos; capped dynamic shadows; a gated loading screen with progress. **First build step: a photoreal material/lighting test** (real desk asset + HDRI) to validate fidelity and budget before full assembly.

**Performance budget (desktop target):** 60 fps on a mid-range laptop; initial compressed payload target ≤ ~10–12 MB (validate early; the photoreal room is the heavy item). Mobile fallback deferred but architecture must allow a reduced path.

---

## 10. Risks & mitigations

1. **Photoreal room cost (highest).** A photoreal, lit, propped room is heavy to build and optimize. **Mitigation:** validate fidelity + budget in a step-one material/lighting test; bake lighting; instance; LODs; aggressive compression; gated preloader.
2. **Logo trademark/asset.** Real company marks rendered in 3D. **Mitigation:** editorial/nominative use (the creator reviews them), but verify per-company trademark guidance; treat official-logo modelling as a defined, licensed asset step; keep a neutral fallback.
3. **Scroll pacing.** Eleven sub-beats in one pinned section risks feeling long or rushed. **Mitigation:** tune scroll distances in-engine against the checkpoint tables; percentages here are provisional.
4. **Mobile.** The photoreal scene may be too heavy for touch. **Mitigation:** deferred by decision; architecture allows a reduced path (fewer logos, simpler lighting, or a cross-fade instead of push-through).
5. **Scramble legibility.** Constant re-scrambling can hurt readability. **Mitigation:** each line fully settles and holds before the next beat can trigger; tune decode duration.

---

## 11. Open items (tracked, not blocking the plan)

- **Company list** — confirm the final set and which are hero.
- **Logo asset sourcing** — official 3D logos: model in-house vs commission; verify trademark use per company.
- **Room asset sourcing** — desk + props + room as a matched photoreal set (buy matched pack vs commission/build).
- **Mobile design** — after desktop build.
- **Production copy & real stats** — with the (deferred) portfolio content.
- **Name confirmation** — "Varsheni" assumed from the repo — confirm.

---

## 12. Success criteria

- Scrolling top → portfolio seam plays the full arc smoothly, scrubbable both directions, at the perf target on desktop.
- The **room stays the grounded setting**; the phone visibly lifts off the desk and the logos erupt → connect → return, reading as intentional choreography.
- The morphing line lands all five statements legibly, synced to their beats.
- The push-through reaches true full-bleed with no visible bezel, then hands into the portfolio with no hard cut.
- Each module consumes only `p` (or section progress) and can be tuned in isolation.
