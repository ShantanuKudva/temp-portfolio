'use client';

import { useState } from 'react';
import HeroCanvas from '@/components/hero/HeroCanvas';
import { useScrollStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

// Dev preview: scrub the whole scroll choreography with a slider instead of scrolling.
// Renders the SAME scene as the landing page, so every new rig (phone, camera, logos…)
// shows up here automatically as it lands. Beat labels mirror the spec §5 timeline.
const BEATS: [string, number][] = [
  ['Establish', 0.0],
  ['Lift', 0.16],
  ['Burst', 0.26],
  ['Swirl', 0.35],
  ['Constellation', 0.45],
  ['Hold', 0.54],
  ['Return', 0.6],
  ['Rotate', 0.69],
  ['Push', 0.81],
  ['Reveal', 0.9],
  ['Bridge', 0.97],
];

export default function ScenePreview() {
  const [p, setLocal] = useState(0);

  const apply = (v: number) => {
    const c = Math.min(1, Math.max(0, v));
    setLocal(c);
    // drive the shared progress store directly; every rig reads getP() in useFrame
    useScrollStore.getState().setP(c);
  };

  return (
    <>
      <HeroCanvas />
      <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col gap-3 border-t border-white/10 bg-black/70 p-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="w-24 shrink-0 font-mono text-sm text-white">p = {p.toFixed(3)}</span>
          <input
            aria-label="scrub scroll progress"
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={p}
            onChange={(e) => apply(parseFloat(e.target.value))}
            className="h-2 flex-1 cursor-pointer accent-[#7B1E2B]"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {BEATS.map(([label, v]) => (
            <Button key={label} size="sm" variant="secondary" onClick={() => apply(v)}>
              {label}
              <span className="ml-1 opacity-60">{v.toFixed(2)}</span>
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}
