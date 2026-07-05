'use client';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CanvasTexture, SRGBColorSpace, type Texture, type MeshBasicMaterial } from 'three';
import { PHONE_SCALE } from '@/lib/phone';
import { getQ } from '@/lib/store';
import { activeReel } from '@/lib/pitch';
import { REELS } from '@/lib/pitchContent';

function buildReelTexture(r: (typeof REELS)[number]): Texture | null {
  if (typeof document === 'undefined') return null;
  const W = 512, H = 1080;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');
  if (!ctx) return null;
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, r.gradient[0]); g.addColorStop(0.55, r.gradient[1]); g.addColorStop(1, r.gradient[2]);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // badge
  ctx.font = '600 22px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText(`REVIEWING · ${r.brand.toUpperCase()}`, 40, 90);
  // caption (supports \n)
  ctx.fillStyle = '#fff'; ctx.font = '800 64px Helvetica, Arial, sans-serif';
  r.caption.split('\n').forEach((line, i) => ctx.fillText(line, 40, H - 220 + i * 68));
  ctx.font = '500 26px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.fillText(r.sub, 40, H - 90);
  const t = new CanvasTexture(cv); t.colorSpace = SRGBColorSpace; t.anisotropy = 16;
  return t;
}

export default function ReelScreen() {
  const texs = useMemo(() => REELS.map(buildReelTexture), []);
  const matRef = useRef<MeshBasicMaterial>(null);
  const cur = useRef<number>(-1);

  useFrame(() => {
    const m = matRef.current;
    if (!m) return;
    const idx = activeReel(getQ());
    if (idx !== cur.current) {
      cur.current = idx;
      m.map = idx >= 0 ? (texs[idx] ?? null) : null;
      m.color.setScalar(idx >= 0 ? 1 : 0); // black when no reel
      m.needsUpdate = true;
    }
  });

  const planeW = 0.0745 * PHONE_SCALE;
  const h = planeW * (1080 / 512);
  const faceZ = (0.0131 / 2) * PHONE_SCALE + 0.0002; // just proud of the screen face
  return (
    <mesh position={[0, 0, faceZ]}>
      <planeGeometry args={[planeW, h]} />
      <meshBasicMaterial ref={matRef} transparent toneMapped={false} />
    </mesh>
  );
}
