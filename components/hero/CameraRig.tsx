'use client';
import { useFrame, useThree } from '@react-three/fiber';
import { getP } from '@/lib/store';
import { sampleTuple3, clamp01, remap } from '@/lib/track';
import { BEAT } from '@/lib/timeline';
import { CAM_POS, CAM_LOOK } from '@/lib/camera';

export default function CameraRig() {
  const camera = useThree((s) => s.camera);
  useFrame((state) => {
    const p = getP();
    const pos = sampleTuple3(CAM_POS, p);
    const look = sampleTuple3(CAM_LOOK, p);
    // gentle idle drift, ramped smoothly in/out across the hold beat (0→1→0)
    // so it never snaps the camera when it turns on/off
    const w = clamp01(remap(p, BEAT.holdStart, BEAT.returnStart, 0, 1));
    const holdWin = Math.sin(Math.PI * w);
    const t = state.clock.elapsedTime;
    camera.position.set(pos[0] + Math.sin(t * 0.4) * 0.02 * holdWin, pos[1], pos[2]); // mutate — never reassign
    camera.lookAt(look[0], look[1], look[2]);
  });
  return null;
}
