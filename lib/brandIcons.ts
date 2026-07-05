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
} from "simple-icons";
import { CanvasTexture, SRGBColorSpace } from "three";

// The tech brands the creator covers — the icons that erupt from the phone. Real
// brand logos from the Simple Icons set (official 24×24 path + brand hex). Simple
// Icons has dropped OpenAI + Midjourney (trademark policy), so Hugging Face + Vercel
// stand in until real openai.png / midjourney.png are supplied.
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
];

function lum(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  return (
    (0.299 * ((n >> 16) & 255) +
      0.587 * ((n >> 8) & 255) +
      0.114 * (n & 255)) /
    255
  );
}
// additive lighten/darken → "rgb()"
function adj(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, v + amt));
  return `rgb(${c((n >> 16) & 255)},${c((n >> 8) & 255)},${c(n & 255)})`;
}

// A glossy iOS-style app icon rendered to a high-res texture: rounded-square with a
// vertical brand-colour gradient, a top sheen, and the crisp centred logo.
export function buildIconTexture(brand: Brand): CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const S = 512;
  const cv = document.createElement("canvas");
  cv.width = cv.height = S;
  const ctx = cv.getContext("2d");
  if (!ctx) return null;

  ctx.beginPath();
  ctx.roundRect(0, 0, S, S, S * 0.225);
  ctx.clip();

  // brand-colour gradient (lighter top → darker bottom) for depth
  const bg = ctx.createLinearGradient(0, 0, 0, S);
  bg.addColorStop(0, adj(brand.hex, 30));
  bg.addColorStop(1, adj(brand.hex, -16));
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, S, S);

  // top gloss sheen
  const gl = ctx.createLinearGradient(0, 0, 0, S * 0.55);
  gl.addColorStop(0, "rgba(255,255,255,0.22)");
  gl.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gl;
  ctx.fillRect(0, 0, S, S * 0.55);

  // logo (24×24 viewBox) centred at ~50%, contrast-aware colour
  const t = S * 0.5;
  const s = t / 24;
  ctx.translate((S - t) / 2, (S - t) / 2);
  ctx.scale(s, s);
  ctx.fillStyle = lum(brand.hex) > 0.62 ? "#141414" : "#ffffff";
  ctx.fill(new Path2D(brand.path));

  const tex = new CanvasTexture(cv);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 16;
  return tex;
}
