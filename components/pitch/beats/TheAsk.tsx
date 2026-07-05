import BeatShell from '../BeatShell';
import ScrambleLine from '@/components/overlay/ScrambleLine';
import { Button } from '@/components/ui/button';
import BookCallButton from '@/components/pitch/BookCallButton';
import { HEADS, CONTACT } from '@/lib/pitchContent';

export default function TheAsk() {
  return (
    <BeatShell>
      <p className="mb-6 font-mono text-[13px] uppercase tracking-[0.32em] text-[#B08D4C]">Let&apos;s talk</p>
      <ScrambleLine text={HEADS.ask} className="block whitespace-pre-line text-white font-extrabold leading-[0.95] tracking-[-0.025em] text-[clamp(46px,8.6vw,108px)]" />
      <div className="mt-9 flex flex-wrap gap-4">
        <BookCallButton />
        <Button variant="outline" size="lg" className="rounded-full" render={<a href={`mailto:${CONTACT.email}`} />}>
          Work with me
        </Button>
        <Button variant="ghost" size="lg" className="rounded-full" render={<a href="#" />}>
          Download media kit
        </Button>
      </div>
      <div className="mt-8 flex items-center gap-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#3ECf8E] animate-pulse" />
        <p className="text-[14px] text-[#EADFCF]/60">
          Free 15-min intro · pick a slot on <b className="font-bold text-white">Cal.com</b> — real availability, instant confirm.
        </p>
      </div>
      <p className="mt-4 font-mono text-[13px] text-[#EADFCF]/45">{CONTACT.email} · {CONTACT.handle}  (placeholder — swap real)</p>
    </BeatShell>
  );
}
