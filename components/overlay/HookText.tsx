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
    <div className="pointer-events-none fixed inset-x-0 bottom-[14vh] z-40 flex justify-center px-6">
      <ScrambleLine
        text={text}
        className="text-center font-mono text-2xl font-semibold tracking-tight text-primary-foreground drop-shadow-[0_2px_12px_rgba(42,26,28,0.6)] md:text-4xl"
      />
    </div>
  );
}
