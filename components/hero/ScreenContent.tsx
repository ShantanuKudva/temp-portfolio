"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import {
  CanvasTexture,
  SRGBColorSpace,
  type Texture,
  type MeshBasicMaterial,
} from "three";
import { PHONE_SCALE } from "@/lib/phone";
import { getP } from "@/lib/store";
import { BEAT } from "@/lib/timeline";

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// The phone's resting screen is a real iOS home-screen capture. Redrawn into a
// rounded-rect canvas so the corners match the phone's rounded display. Once the
// eruption scene is done, the screen fades to BLACK (rotate → push) so the
// push-through dives into a dark portal instead of the home screen.
export default function ScreenContent() {
  const raw = useTexture("/assets/textures/ios-home.png");
  const matRef = useRef<MeshBasicMaterial>(null);
  const { tex, w, h } = useMemo(() => {
    const img = raw.image as HTMLImageElement | undefined;
    const iw = img?.width ?? 303;
    const ih = img?.height ?? 660;
    let out: Texture = raw;
    if (img && typeof document !== "undefined") {
      const cv = document.createElement("canvas");
      cv.width = iw;
      cv.height = ih;
      const ctx = cv.getContext("2d");
      if (ctx) {
        const R = iw * 0.14; // match the iPhone 14 Pro display corner radius (~55pt / 393pt ≈ 0.14 of width). 0.185 over-carved icons; 0.092 was too square.
        ctx.beginPath();
        ctx.roundRect(0, 0, iw, ih, R);
        ctx.clip();
        ctx.drawImage(img, 0, 0);
        // (The wallpaper capture already includes the Dynamic Island, so we no
        // longer draw our own pill — that would double it.)
        // Bake a thin dark display border INTO the texture so the bright
        // wallpaper edge can't bleed onto the bezel (survives bloom too). The
        // stroke is clipped to the rounded rect, so only its inner half shows.
        ctx.beginPath();
        ctx.roundRect(0, 0, iw, ih, R);
        ctx.lineWidth = iw * 0.013;
        ctx.strokeStyle = "rgba(8,6,7,0.9)";
        ctx.stroke();
        const t = new CanvasTexture(cv);
        t.colorSpace = SRGBColorSpace;
        t.anisotropy = 16;
        out = t;
      }
    }
    // Width AND height are INDEPENDENT knobs (not tied to the image aspect) so
    // the overlay matches the glass rectangle. This size covers the glass right
    // at every angle; the only remaining issue was the corner CURVE (see R
    // below), not the overall size.
    const planeW = 0.0770 * PHONE_SCALE;
    const planeH = 0.1665 * PHONE_SCALE;
    return { tex: out, w: planeW, h: planeH };
  }, [raw]);

  useFrame(() => {
    if (!matRef.current) return;
    // white (map shows) → black once the constellation has returned
    const k = smooth(BEAT.rotateStart, BEAT.pushStart, getP());
    matRef.current.color.setScalar(1 - k);
  });

  const faceZ = (0.0131 / 2) * PHONE_SCALE + 0.0002;
  // Vertical registration of the overlay on the glass. The previous +0.0013 up-bias
  // (tuned for the old phone/image) now rides too HIGH — it left black glass at the
  // bottom chin. Centred for the current iPhone 14 Pro + home-screen capture; tune in
  // small steps if the top/bottom margins look uneven.
  const yOffset = 0.0 * PHONE_SCALE;
  return (
    <mesh position={[0, yOffset, faceZ]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial ref={matRef} map={tex} transparent toneMapped={false} />
    </mesh>
  );
}
