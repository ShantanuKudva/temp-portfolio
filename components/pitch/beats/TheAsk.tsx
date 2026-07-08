import Reveal from '../Reveal';
import ScrambleLine from '@/components/overlay/ScrambleLine';
import { Button } from '@/components/ui/button';
import BookCallButton from '@/components/pitch/BookCallButton';
import { HEADS, CONTACT } from '@/lib/pitchContent';

// Post-scroll portfolio CTA. The one place the cherry-maroon goes loud: a
// panel that reads as the destination of the whole page. Everything above it
// is dark and quiet so this pops.
export default function TheAsk() {
  return (
    <section id="contact" className="flex min-h-screen items-center px-[7vw] py-28 scroll-mt-24">
      <Reveal className="w-full">
        <div className="mx-auto max-w-[1000px] overflow-hidden rounded-[32px] bg-[#571620] px-[8%] py-16 ring-1 ring-[#B08D4C]/40 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] sm:py-20">
          <p className="mb-6 font-mono text-[13px] uppercase tracking-[0.32em] text-[#E8C9C4]">Let&apos;s talk</p>
          <ScrambleLine
            text={HEADS.ask}
            className="block whitespace-pre-line text-white font-extrabold leading-[0.95] tracking-[-0.025em] text-[clamp(40px,7vw,88px)]"
          />

          <div className="mt-10 flex flex-wrap gap-4">
            <BookCallButton />
            <Button variant="outline" size="lg" nativeButton={false} className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/10" render={<a href={`mailto:${CONTACT.email}`} />}>
              Email me
            </Button>
          </div>

          <div className="mt-9 flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#3ECf8E] animate-pulse" />
            <p className="text-[14px] text-[#EADFCF]/75">
              Free 15-min intro · pick a slot on <b className="font-bold text-white">Cal.com</b> — real availability, instant confirm.
            </p>
          </div>
          <p className="mt-4 font-mono text-[13px] text-[#EADFCF]/50">{CONTACT.email} · {CONTACT.handle} (placeholder — swap real)</p>
        </div>
      </Reveal>
    </section>
  );
}
