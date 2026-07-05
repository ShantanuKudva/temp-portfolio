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
        ctx.beginPath();
        ctx.roundRect(0, 0, iw, ih, iw * 0.086);
        ctx.clip();
        ctx.drawImage(img, 0, 0);
        const t = new CanvasTexture(cv);
        t.colorSpace = SRGBColorSpace;
        t.anisotropy = 16;
        out = t;
      }
    }
    const planeW = 0.0745 * PHONE_SCALE;
    return { tex: out, w: planeW, h: planeW * (ih / iw) };
  }, [raw]);

  useFrame(() => {
    if (!matRef.current) return;
    // white (map shows) → black once the constellation has returned
    const k = smooth(BEAT.rotateStart, BEAT.pushStart, getP());
    matRef.current.color.setScalar(1 - k);
  });

  const faceZ = (0.0131 / 2) * PHONE_SCALE + 0.0002;
  return (
    <mesh position={[0, 0, faceZ]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial ref={matRef} map={tex} transparent toneMapped={false} />
    </mesh>
  );
}
