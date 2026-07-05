import BeatShell from '../BeatShell';
import ScrambleLine from '@/components/overlay/ScrambleLine';
import { HEADS } from '@/lib/pitchContent';

export default function PortalLine() {
  return (
    <BeatShell>
      <p className="mb-6 font-mono text-[13px] uppercase tracking-[0.32em] text-[#B08D4C]">Varsheni · tech UGC</p>
      <ScrambleLine text={HEADS.portal} className="block text-white font-extrabold leading-[0.95] tracking-[-0.025em] text-[clamp(46px,8.6vw,108px)]" />
      <p className="mt-6 max-w-[48ch] text-[18px] leading-relaxed text-[#EADFCF]/60">A creator who turns your product into something a real person actually understands — in the time it takes to lose them.</p>
    </BeatShell>
  );
}
