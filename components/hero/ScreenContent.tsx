"use client";
import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import { CanvasTexture, SRGBColorSpace, type Texture } from "three";
import { PHONE_SCALE } from "@/lib/phone";

// The phone's resting screen is a real iOS home-screen capture. We redraw it into a
// rounded-rect canvas so the screen corners are transparent and match the phone's
// rounded display — otherwise the flat image's sharp corners poke outside the glass.
export default function ScreenContent() {
  const raw = useTexture("/assets/textures/ios-home.png");
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
        ctx.beginPath();
        ctx.roundRect(0, 0, iw, ih, iw * 0.086); // rounded display corners
        ctx.clip();
        ctx.drawImage(img, 0, 0);
        const t = new CanvasTexture(cv);
        t.colorSpace = SRGBColorSpace;
        t.anisotropy = 16;
        out = t;
      }
    }
    // sits just inside the bezel, a hair proud of the glass (must be in front of
    // the body face to render — can't go behind it or it's occluded)
    const planeW = 0.0712 * PHONE_SCALE;
    return { tex: out, w: planeW, h: planeW * (ih / iw) };
  }, [raw]);

  const faceZ = (0.0131 / 2) * PHONE_SCALE + 0.0002;
  return (
    <mesh position={[0, 0, faceZ]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} />
    </mesh>
  );
}
