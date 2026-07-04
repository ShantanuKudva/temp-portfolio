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

## Verification performed

- `room.hdr`: `head -c 12` shows `#?RADIANCE`; 6.19 MB.
- `desk.glb`: `head -c 4` shows `glTF`; `gltf-transform inspect` clean (1 mesh, 1 material, 3 WebP textures, no animations/errors).
- All 15 logo SVGs: `head -c 5` shows `<svg`; spot-checked several (`radix`, `gemini`, `claude`) for correct `<title>` and non-trivial path data.
