'use client';
import { useScrollStore, activeIndex } from '@/lib/store';
import { BEAT } from '@/lib/timeline';
import ScrambleLine from '@/components/overlay/ScrambleLine';

// Line-change boundaries → text (spec §8 lines 1–3; empty clears during rotate).
const HOOK_BOUNDARIES = [BEAT.liftStart, BEAT.constellStart, BEAT.returnStart, BEAT.rotateStart];
const HOOK_TEXT = ['Tech is loud.', 'I make it make sense.', 'Sixty seconds. Zero fluff.', ''];

export default function HookText() {
  const idx = useScrollStore((s) => activeIndex(s.p, HOOK_BOUNDARIES));
  const text = idx >= 0 ? HOOK_TEXT[idx] : '';
  if (!text) return null;
  return (
    // Bottom-anchored caption band: a soft gradient scrim gives a consistent,
    // legible zone for the line regardless of the busy 3D scene behind it,
    // and separates it from the phone/desk instead of crowding that gap.
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center bg-linear-to-t from-black/60 via-black/25 to-transparent px-6 pb-[8vh] pt-28">
      <ScrambleLine
        text={text}
        className="max-w-3xl text-center font-mono text-2xl font-semibold tracking-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.65)] md:text-4xl"
      />
    </div>
  );
}
