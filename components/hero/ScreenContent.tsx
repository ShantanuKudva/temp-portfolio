"use client";
import { useMemo } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";
import { PHONE_SCALE } from "@/lib/phone";
import { BRANDS, DOCK_BRANDS, drawBrandTile } from "@/lib/brandIcons";

const W = 590;
const H = 1280; // ~iPhone 14 Pro screen aspect (0.461)

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

  // app grid — real brand logos
  const cols = 4;
  const icon = 108;
  const gapX = (W - cols * icon) / (cols + 1);
  const rowGap = icon + 52;
  const top = 150;
  BRANDS.forEach((brand, i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const x = gapX + c * (icon + gapX);
    const y = top + r * rowGap;
    drawBrandTile(ctx, x, y, icon, 26, brand);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "400 22px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(brand.name, x + icon / 2, y + icon + 10);
  });

  // dock — four more real brands
  const dockH = 168;
  const dockY = H - dockH - 26;
  ctx.beginPath();
  ctx.roundRect(24, dockY, W - 48, dockH, 46);
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fill();
  const dIcon = 108;
  const dGap = (W - 48 - 4 * dIcon) / 5;
  DOCK_BRANDS.forEach((brand, i) => {
    const x = 24 + dGap + i * (dIcon + dGap);
    drawBrandTile(ctx, x, dockY + 30, dIcon, 26, brand);
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
