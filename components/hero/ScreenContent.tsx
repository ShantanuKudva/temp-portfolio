"use client";
import { useMemo } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";
import { PHONE_SCALE } from "@/lib/phone";

// The app grid = the real companies the creator covers (CLAUDE.md). Brand colour +
// a simple glyph per app — real trademarked logos are a later asset step. These are
// the icons that will later erupt out of the phone in the LogoField (T9).
export const APPS: { name: string; color: string; glyph: string; fg?: string }[] = [
  { name: "YouTube", color: "#FF0033", glyph: "▶" },
  { name: "Instagram", color: "#E1306C", glyph: "◉" },
  { name: "Claude", color: "#D97757", glyph: "✳" },
  { name: "OpenAI", color: "#0F9D77", glyph: "⬡" },
  { name: "Gemini", color: "#4285F4", glyph: "✦" },
  { name: "Figma", color: "#F24E1E", glyph: "◑" },
  { name: "Notion", color: "#2F2F2F", glyph: "N", fg: "#fff" },
  { name: "GitHub", color: "#24292F", glyph: "⌥", fg: "#fff" },
  { name: "Perplexity", color: "#20808D", glyph: "✷" },
  { name: "Spotify", color: "#1DB954", glyph: "♫" },
  { name: "Stripe", color: "#635BFF", glyph: "S" },
  { name: "Midjourney", color: "#111114", glyph: "⛵", fg: "#fff" },
  { name: "Meta", color: "#0866FF", glyph: "∞" },
  { name: "Linear", color: "#5E6AD2", glyph: "▲" },
  { name: "Notion AI", color: "#8A63D2", glyph: "◆" },
  { name: "Radix", color: "#161618", glyph: "◆", fg: "#fff" },
];

const DOCK = [
  { name: "Phone", color: "#34C759", glyph: "✆" },
  { name: "Safari", color: "#1E88E5", glyph: "◈" },
  { name: "Messages", color: "#30D158", glyph: "◗" },
  { name: "Camera", color: "#3A3A3C", glyph: "◉", fg: "#fff" },
];

const W = 590;
const H = 1280; // ~iPhone 14 Pro screen aspect (0.461)

function roundedTile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  s: number,
  r: number,
  app: { color: string; glyph: string; fg?: string },
  glyphPx: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, s, s, r);
  ctx.fillStyle = app.color;
  ctx.fill();
  // subtle top sheen
  const sh = ctx.createLinearGradient(x, y, x, y + s);
  sh.addColorStop(0, "rgba(255,255,255,0.16)");
  sh.addColorStop(0.5, "rgba(255,255,255,0)");
  ctx.fillStyle = sh;
  ctx.fill();
  ctx.fillStyle = app.fg ?? "#ffffff";
  ctx.font = `600 ${glyphPx}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(app.glyph, x + s / 2, y + s / 2 + 2);
}

function buildHomeScreen(): CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext("2d");
  if (!ctx) return null;

  // wallpaper — warm-to-deep vertical gradient (matches the room's mood)
  const g = ctx.createLinearGradient(0, 0, W * 0.4, H);
  g.addColorStop(0, "#3a2140");
  g.addColorStop(0.5, "#241a2e");
  g.addColorStop(1, "#0e0a16");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // status bar
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = "600 34px system-ui, sans-serif";
  ctx.fillText("9:41", 46, 52);
  // battery pill (right)
  ctx.textAlign = "right";
  ctx.font = "500 26px system-ui, sans-serif";
  ctx.fillText("5G", W - 120, 52);
  ctx.beginPath();
  ctx.roundRect(W - 92, 38, 46, 26, 7);
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.roundRect(W - 88, 42, 34, 18, 4);
  ctx.fill();

  // app grid
  const cols = 4;
  const icon = 108;
  const gapX = (W - cols * icon) / (cols + 1);
  const rowGap = icon + 52;
  const top = 150;
  APPS.forEach((app, i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const x = gapX + c * (icon + gapX);
    const y = top + r * rowGap;
    roundedTile(ctx, x, y, icon, 26, app, 54);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "400 22px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(app.name, x + icon / 2, y + icon + 10);
  });

  // dock
  const dockH = 168;
  const dockY = H - dockH - 26;
  ctx.beginPath();
  ctx.roundRect(24, dockY, W - 48, dockH, 46);
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fill();
  const dIcon = 108;
  const dGap = (W - 48 - 4 * dIcon) / 5;
  DOCK.forEach((app, i) => {
    const x = 24 + dGap + i * (dIcon + dGap);
    roundedTile(ctx, x, dockY + 30, dIcon, 26, app, 54);
  });

  const tex = new CanvasTexture(cv);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

// Overlay plane sitting on the phone's screen face. Lives in the PhoneRig's group
// (screen → +Z at rot 0), a hair proud of the glass. Unlit + toneMapped off so it
// reads as an emissive display (and blooms a touch like a real screen).
export default function ScreenContent() {
  const tex = useMemo(() => buildHomeScreen(), []);
  // phone bbox 0.0836 x 0.1709 x 0.0131m × scale; screen face ≈ half-thickness out
  const faceZ = (0.0131 / 2) * PHONE_SCALE + 0.0004;
  const w = 0.0742 * PHONE_SCALE;
  const h = w * (H / W);
  return (
    <mesh position={[0, 0, faceZ]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={tex ?? undefined} toneMapped={false} />
    </mesh>
  );
}
