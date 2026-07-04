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
    // Lower-left editorial placement: the bold line lives in one fixed zone that
    // stays clear of the centre phone across every beat. Legibility comes from a
    // SOFT radial pool feathered right under the text (not a hard corner wash) plus
    // the drop-shadow, and the whole caption fades in so it never snaps on.
    <div className="pointer-events-none fixed inset-0 z-40 flex items-end bg-[radial-gradient(56%_46%_at_15%_86%,rgba(0,0,0,0.44),transparent_72%)] animate-in fade-in duration-700">
      <ScrambleLine
        text={text}
        className="mb-[9vh] ml-[6vw] max-w-lg font-mono text-4xl font-bold leading-[1.04] tracking-tight text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.7)] md:text-6xl"
      />
    </div>
  );
}
