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

  // status bar + Dynamic Island (kept visible by drawing the pill ourselves)
  const sbY = 46;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = "600 33px system-ui, sans-serif";
  ctx.fillText("9:41", 44, sbY);
  // Dynamic Island
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.roundRect(W / 2 - 66, 26, 132, 39, 19.5);
  ctx.fill();
  // signal bars
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 4; i++) {
    const h = 9 + i * 5;
    ctx.beginPath();
    ctx.roundRect(W - 168 + i * 12, sbY + 9 - h, 7, h, 2);
    ctx.fill();
  }
  // wifi arcs
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 4;
  for (let i = 1; i <= 3; i++) {
    ctx.beginPath();
    ctx.arc(W - 104, sbY + 9, i * 7, Math.PI * 1.28, Math.PI * 1.72);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(W - 104, sbY + 8, 3.2, 0, Math.PI * 2);
  ctx.fill();
  // battery
  const bx = W - 78;
  const by = sbY - 12;
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(bx, by, 48, 25, 7);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.beginPath();
  ctx.roundRect(bx + 51, by + 8, 4, 9, 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.roundRect(bx + 3, by + 3, 30, 19, 4);
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

  // dock — frosted-glass bar with everyday apps
  const dockH = 176;
  const dockY = H - dockH - 22;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(20, dockY, W - 40, dockH, 48);
  ctx.fillStyle = "rgba(72,66,88,0.4)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
  const dIcon = 112;
  const dGap = (W - 40 - 4 * dIcon) / 5;
  DOCK_BRANDS.forEach((brand, i) => {
    const x = 20 + dGap + i * (dIcon + dGap);
    drawBrandTile(ctx, x, dockY + (dockH - dIcon) / 2, dIcon, 27, brand);
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
