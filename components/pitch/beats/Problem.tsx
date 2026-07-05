import BeatShell from '../BeatShell';
import WordReveal from '@/components/overlay/WordReveal';
import { HEADS } from '@/lib/pitchContent';

export default function Problem() {
  return (
    <BeatShell>
      <p className="mb-6 font-mono text-[13px] uppercase tracking-[0.32em] text-[#B08D4C]">The problem</p>
      <WordReveal text={HEADS.problem} className="max-w-[15ch] text-white font-bold leading-[1.16] tracking-[-0.02em] text-[clamp(34px,5.6vw,72px)]" />
    </BeatShell>
  );
}
