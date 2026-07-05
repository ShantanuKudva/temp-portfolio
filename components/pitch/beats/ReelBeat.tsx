import BeatShell from '../BeatShell';
import ScrambleLine from '@/components/overlay/ScrambleLine';

export default function ReelBeat({ eyebrow, head, note }: { eyebrow: string; head: string; note: string }) {
  return (
    <BeatShell>
      <p className="mb-6 font-mono text-[13px] uppercase tracking-[0.32em] text-[#B08D4C]">{eyebrow}</p>
      <ScrambleLine text={head} className="block whitespace-pre-line text-white font-extrabold leading-[0.95] tracking-[-0.025em] text-[clamp(46px,8.6vw,108px)]" />
      <p className="mt-6 max-w-[48ch] text-[18px] leading-relaxed text-[#EADFCF]/60">{note}</p>
    </BeatShell>
  );
}
