"use client";
import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import { SRGBColorSpace } from "three";
import { PHONE_SCALE } from "@/lib/phone";

// The phone's resting screen is a real iOS home-screen capture (status bar,
// Dynamic Island, wallpaper, widgets, apps + dock all baked in). Overlaid on the
// phone's screen face (screen → +Z in the PhoneRig group), a hair proud of the
// glass, unlit + toneMapped off so it reads as an emissive display.
const IMG_W = 640;
const IMG_H = 1391;

export default function ScreenContent() {
  const raw = useTexture("/assets/textures/ios-home.png");
  const tex = useMemo(() => {
    const t = raw.clone(); // hook return is frozen (React Compiler); clone to configure
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 8;
    t.needsUpdate = true;
    return t;
  }, [raw]);
  // phone bbox 0.0836 x 0.1709 x 0.0131m × scale; screen face ≈ half-thickness out
  const faceZ = (0.0131 / 2) * PHONE_SCALE + 0.0004;
  const w = 0.0742 * PHONE_SCALE;
  const h = w * (IMG_H / IMG_W);
  return (
    <mesh position={[0, 0, faceZ]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}
