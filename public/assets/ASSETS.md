# Asset manifest

Acquired 2026-07-04 for the Varsheni scroll-driven 3D landing build. Download-only pass — no code was written against these assets yet. All assets are untracked until a later commit.

## Trademark caveat

The 15 company marks below (`public/assets/logos/`) are used for **editorial / nominative purposes** — Varsheni is a creator who reviews these products, and the marks identify the companies being reviewed. Each brand mark remains the trademark/property of its respective owner. The SVG *files* themselves are sourced from CC0-licensed community icon collections (simple-icons, SVG Logos), which covers redistribution of the vector artwork, but **does not grant trademark rights**. Final per-company clearance (or a decision to swap any mark for a generic/abstracted representation) is a real pre-launch legal step, not covered by this acquisition pass.

---

## 1. HDRI — warm interior lighting

| File | Source | License | Size | Notes |
|---|---|---|---|---|
| `public/assets/hdri/room.hdr` | [Poly Haven — Brown Photostudio 02](https://polyhaven.com/a/brown_photostudio_02), 2k: `https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/brown_photostudio_02_2k.hdr` | CC0 1.0 | 6.19 MB (6,492,863 bytes) | Warm-toned indoor studio HDRI. Downloaded on the first try (no fallback slug needed). Verified valid RADIANCE (`#?RADIANCE`) header. If a more literally "room-like" (vs. studio) warm interior is wanted later, `hotel_room` and `cozy_living_room` are other CC0 Poly Haven candidates worth a second pass. |

## 2. Desk model

| File | Source | License | Size | Notes |
|---|---|---|---|---|
| `public/assets/desk.glb` | [Poly Haven — Wooden Table 02](https://polyhaven.com/a/wooden_table_02) (`wooden_table_02`), 2k gltf set: `https://dl.polyhaven.org/file/ph-assets/Models/gltf/2k/wooden_table_02/wooden_table_02_2k.gltf` + `.bin` + 3 textures (diffuse/normal-gl/arm) | CC0 1.0 | 886 KB (886,428 bytes) | Downloaded the separate glTF + bin + 2k JPG texture set, then packed into a single self-contained, Draco/meshopt-compressed `.glb` with WebP textures via `npx @gltf-transform/cli optimize <in.gltf> public/assets/desk.glb --texture-compress webp`. Verified: starts with `glTF` magic, `gltf-transform inspect` shows 1 mesh (196 verts), 1 material (baseColor/normal/metallicRoughness, all WebP @ 2048x2048), no errors. **Caveat:** this is a plain rustic/worn wooden table (tags: "wooden, worn, village, rural"), not literally a "walnut writing desk" — closest available CC0 match on Poly Haven for a desk-sized wood surface (dimensions ~113 × 71 × 80 cm, desk-height-appropriate). `metal_office_desk` (also CC0 on Poly Haven) was considered and rejected — vintage/scratched metal industrial desk, worse tonal match for the cherry-maroon warm room than a wood table. Retexturing/recoloring toward walnut is expected as a later material pass, not redone here. |

## 3. Brand logos (SVG)

13 of 15 came directly from simple-icons. `openai` and `midjourney` are **not present in simple-icons** at all (confirmed against the full current `data/simple-icons.json` index — likely pulled for trademark-request reasons in OpenAI's case; never added for Midjourney) — sourced instead from the CC0-licensed "SVG Logos" collection (gilbarbara/logos, served via the Iconify API), which supplies clean single-filled-path marks consistent with the simple-icons style.

| id | File | Source slug/name | Source URL | License | Size |
|---|---|---|---|---|---|
| youtube | `youtube.svg` | `youtube` | `https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/youtube.svg` | CC0 1.0 (simple-icons) | 459 B |
| instagram | `instagram.svg` | `instagram` | same pattern, `icons/instagram.svg` | CC0 1.0 (simple-icons) | 2101 B |
| figma | `figma.svg` | `figma` | `icons/figma.svg` | CC0 1.0 (simple-icons) | 1093 B |
| notion | `notion.svg` | `notion` | `icons/notion.svg` | CC0 1.0 (simple-icons) | 978 B |
| github | `github.svg` | `github` | `icons/github.svg` | CC0 1.0 (simple-icons) | 822 B |
| spotify | `spotify.svg` | `spotify` | `icons/spotify.svg` | CC0 1.0 (simple-icons) | 697 B |
| stripe | `stripe.svg` | `stripe` | `icons/stripe.svg` | CC0 1.0 (simple-icons) | 588 B |
| meta | `meta.svg` | `meta` | `icons/meta.svg` | CC0 1.0 (simple-icons) | 1324 B |
| linear | `linear.svg` | `linear` | `icons/linear.svg` | CC0 1.0 (simple-icons) | 453 B |
| perplexity | `perplexity.svg` | `perplexity` | `icons/perplexity.svg` | CC0 1.0 (simple-icons) | 618 B |
| gemini | `gemini.svg` | `googlegemini` | `icons/googlegemini.svg` | CC0 1.0 (simple-icons) | 401 B |
| radix | `radix.svg` | `radixui` | `icons/radixui.svg` | CC0 1.0 (simple-icons) | 256 B |
| claude | `claude.svg` | `claude` | `icons/claude.svg` | CC0 1.0 (simple-icons) | 1921 B |
| **openai** | `openai.svg` | `logos:openai-icon` (GAP-FILL, not in simple-icons) | `https://api.iconify.design/logos/openai-icon.svg` (icon-only mark, no wordmark) | CC0 1.0 (gilbarbara/logos via Iconify) | 1589 B |
| **midjourney** | `midjourney.svg` | `logos:midjourney` (GAP-FILL, not in simple-icons) | `https://api.iconify.design/logos/midjourney.svg` | CC0 1.0 (gilbarbara/logos via Iconify) | 4401 B |

**Gaps: none** — all 15 logos acquired. All 15 files verified to start with `<svg`, contain a single filled `<path>` (extrudes cleanly to 3D), and (for the 13 simple-icons files) carry a `<title>` matching the intended brand.

All-15 checklist: youtube, instagram, openai, figma, notion, github, spotify, stripe, meta, linear, perplexity, gemini, radix, claude, midjourney.

---

## 4. Phone model

| File | Source | License | Size | Notes |
|---|---|---|---|---|
| `public/assets/phone.glb` | [Icosa Gallery](https://icosa.gallery) — open-source archive/revival of the defunct Google Poly library. Asset `iphone11`, id `9L0oQ5qAqX_`: `https://api.icosa.gallery/v1/assets/9L0oQ5qAqX_`; self-hosted glTF2 package pulled from `https://s3.us-east-005.backblazeb2.com/icosa-gallery/poly/9L0oQ5qAqX_/` (`model.gltf` + `model.bin` + `gryl.jpg` + `camera.jpg` + `scr2.jpg`) | CC-BY 3.0 (attribution required; original Google Poly upload, individual author not surfaced by the Icosa API beyond the asset id) | 191 KB (195,648 bytes) | Modern notch-style silhouette (no home button, unlike most other free "phone" models found — see acquisition notes below), built as **15 separately named material/mesh parts**: `/A, alu, fash, gryl, lense, dchr, bezel, but, ant, chr, scr, glsl, glass, misc1, logo`. **`scr` is the dedicated screen-face material** — its own mesh plus its own `scr2.jpg` (512×1024) texture — a later task can select it via `mesh.material.name === 'scr'` and swap in rendered screen content. Body materials (`alu`, `bezel`, `dchr`, `ant`, `misc1`, `logo`, `glass`/`glsl`) already have near-black baseColors (~0.01–0.15, dark-navy-tinted glass) — it reads as a black phone with no recolor pass needed; only `fash` (camera-flash ring) and `chr` (chrome trim) are light gray, which is realistic rather than a defect. Back has a correct 3-lens Pro-camera bump. Packed from the original glTF+bin+JPGs into a single glb via `gltf-transform optimize --texture-compress webp --palette false --join false --simplify false` (kept `--palette`/`--join` off deliberately, unlike `desk.glb`'s pipeline, so the 15 named materials — especially `scr` — stay independently addressable instead of being merged into one baked-palette mesh); geometry compressed with meshopt (`EXT_meshopt_compression`), so the three.js loader needs `GLTFLoader.setMeshoptDecoder(MeshoptDecoder)` wired in. **Scale note:** authored at roughly 10x real-world scale — bounding box is 0.791 × 1.580 × 0.082 m (a real iPhone is ≈0.075 × 0.15 × 0.008 m); the tall/thin/flat *ratio* already matches, it just needs a uniform ×0.1 scale (or normalize-by-bbox) when wired into the scene. Verified by rendering it headlessly (Chrome + puppeteer-core + three.js GLTFLoader/MeshoptDecoder, per this repo's usual mock-verification approach): both the front (dark edge-to-edge screen, notch, side buttons) and back (triple-camera bump, dark glass) look correctly phone-shaped with no missing/black/broken geometry. |

**Acquisition notes — why not a "real" iPhone-16-branded high-poly scan:** Sketchfab has several strong candidates explicitly named "iPhone 15/16 Pro" with full PBR and tens of thousands of triangles (e.g. ["Apple iPhone 15 Pro Black" by polyman Studio](https://sketchfab.com/3d-models/apple-iphone-15-pro-black-6fd1283ec05d412d99a3f23b2e80e473), 61.5k tris, 36 textures, CC-BY) but Sketchfab's API now requires an authenticated bearer token for essentially everything — confirmed via a direct `401 {"detail":"...","www-authenticate":"Token"}` response on plain metadata GETs, not just the download button — so there is no headless/no-login path, only manual sign-in (out of scope here). Poly Pizza (poly.pizza) mirrors the same old Google-Poly-era catalog with a genuine "no login required" policy, but its download action is gated server-side by reCAPTCHA v3: a full real-Chrome click-through (puppeteer, clicking "Download" → "Download GLB" on its CC0 "Smartphone" model) still received a `403` from `poly.pizza/api/model/.../download/glb` — i.e. it's a bot-wall in practice, not a script/curl-downloadable source, despite the marketing copy. CGTrader and Free3D were also ruled out (account-gated download flows; Free3D additionally 403s plain scripted requests outright). Icosa Gallery was the one source that serves the raw glTF/bin/texture files directly and statically from Backblaze B2 with no auth, session, or captcha step, which is why it's the source used here. Other Icosa-hosted "iphone"-tagged assets were previewed too (`5iM7cbvhvPr` "iPhone", 22.5k tris, older home-button-style shape; `4SOLQXn6kR3` "Rui Wang iphone", broken/non-phone-looking thumbnail) — `9L0oQ5qAqX_` was the best match for a modern notch-style silhouette.

**Trademark caveat:** Apple's product design and the "iPhone" name/shape are Apple trademarks, and recent iPhone designs also carry design-patent/trade-dress protection. Use here is nominative/editorial — Varsheni is a creator whose content is *about* reviewing real tech products, and a recognizable "modern smartphone" silhouette identifies that subject matter rather than implying any Apple affiliation, sponsorship, or endorsement. This is explicitly **not** an official Apple asset — it's a fan-made community model (titled "iphone11" / "iPhone 11 Pro"), consistent with the brief's "iPhone 16 Pro, or close: iPhone 15 Pro / generic modern Pro-style phone" fallback allowance. Per-Apple-guidelines legal clearance (or a fallback decision to abstract the shape further — drop the camera bump, the logo, etc.) is a real pre-launch step and is **not** covered by this download pass.

---

## Verification performed

- `room.hdr`: `head -c 12` shows `#?RADIANCE`; 6.19 MB.
- `desk.glb`: `head -c 4` shows `glTF`; `gltf-transform inspect` clean (1 mesh, 1 material, 3 WebP textures, no animations/errors).
- All 15 logo SVGs: `head -c 5` shows `<svg`; spot-checked several (`radix`, `gemini`, `claude`) for correct `<title>` and non-trivial path data.
- `phone.glb`: `head -c 4` shows `glTF`; `gltf-transform inspect` clean (15 meshes, 14 materials post-dedup, 3 WebP textures @ 2048x2048/512x512/512x1024, meshopt-compressed, no animations/errors); bounding box confirmed tall/thin/flat and phone-proportioned (see scale note above); headless Chrome + three.js GLTFLoader render (front and back) confirmed correct geometry, materials, and the separately-addressable `scr` screen face — screenshots inspected visually, no black/missing/broken meshes.
