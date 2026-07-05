import {
  siYoutube,
  siInstagram,
  siClaude,
  siGooglegemini,
  siFigma,
  siNotion,
  siGithub,
  siPerplexity,
  siSpotify,
  siStripe,
  siMeta,
  siLinear,
  siRadixui,
  siHuggingface,
  siVercel,
  siDiscord,
  siX,
  siTiktok,
  siReddit,
  siTwitch,
} from "simple-icons";
import { CanvasTexture, SRGBColorSpace } from "three";

// Real brand logos (Simple Icons) for the apps/businesses the creator covers — used
// both on the phone's home screen and, later, in the 3D logo-eruption field. Each
// icon carries the official brand hex + the 24×24 SVG path (we don't hand-draw any
// logo). Note: Simple Icons has dropped OpenAI + Midjourney (trademark policy), so
// those slots use other real brands a tech-review creator covers.
export type Brand = { name: string; hex: string; path: string };

const b = (
  ic: { title: string; hex: string; path: string },
  name?: string,
): Brand => ({ name: name ?? ic.title, hex: "#" + ic.hex, path: ic.path });

export const BRANDS: Brand[] = [
  b(siYoutube),
  b(siInstagram),
  b(siClaude),
  b(siGooglegemini, "Gemini"),
  b(siFigma),
  b(siNotion),
  b(siGithub),
  b(siPerplexity),
  b(siSpotify),
  b(siStripe),
  b(siMeta),
  b(siLinear),
  b(siRadixui, "Radix"),
  b(siHuggingface, "Hugging Face"),
  b(siVercel),
  b(siDiscord),
];

export const DOCK_BRANDS: Brand[] = [
  b(siX, "X"),
  b(siTiktok, "TikTok"),
  b(siReddit),
  b(siTwitch),
];

// relative luminance of a #rrggbb colour
function lum(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const bl = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * bl) / 255;
}

// Draw a real brand app-icon (rounded brand-colour tile + logo) into a 2D context.
export function drawBrandTile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  radius: number,
  brand: Brand,
) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, size, size, radius);
  ctx.fillStyle = brand.hex;
  ctx.fill();
  // subtle top sheen
  const sh = ctx.createLinearGradient(x, y, x, y + size);
  sh.addColorStop(0, "rgba(255,255,255,0.16)");
  sh.addColorStop(0.5, "rgba(255,255,255,0)");
  ctx.fillStyle = sh;
  ctx.fill();
  ctx.clip(); // keep the logo inside the tile
  // logo: 24×24 viewBox, centred at ~54% of the tile, contrast-aware colour
  const t = size * 0.54;
  const s = t / 24;
  ctx.translate(x + (size - t) / 2, y + (size - t) / 2);
  ctx.scale(s, s);
  ctx.fillStyle = lum(brand.hex) > 0.62 ? "#141414" : "#ffffff";
  ctx.fill(new Path2D(brand.path));
  ctx.restore();
}

// A single brand icon rendered to a texture (for the 3D LogoField).
export function buildIconTexture(brand: Brand): CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const S = 192;
  const cv = document.createElement("canvas");
  cv.width = cv.height = S;
  const ctx = cv.getContext("2d");
  if (!ctx) return null;
  drawBrandTile(ctx, 0, 0, S, S * 0.22, brand);
  const tex = new CanvasTexture(cv);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}
