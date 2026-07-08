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
        <div className="relative mx-auto max-w-[1040px] overflow-hidden rounded-[36px] px-[8%] py-20 ring-1 ring-[#B08D4C]/40 shadow-[0_50px_140px_-50px_rgba(0,0,0,0.95)] sm:py-24">
          {/* Layered ground: a diagonal maroon gradient, two soft off-screen glows
              (gold, then blush) for depth, and an inset hairline frame. */}
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(155deg,#7B1E2B_0%,#571620_52%,#3A0E16_100%)]" />
          <div className="pointer-events-none absolute -left-24 -top-28 -z-10 h-80 w-80 rounded-full bg-[#B08D4C]/30 blur-[110px]" />
          <div className="pointer-events-none absolute -bottom-32 -right-20 -z-10 h-96 w-96 rounded-full bg-[#E8C9C4]/10 blur-[130px]" />
          <div className="pointer-events-none absolute inset-4 rounded-[28px] ring-1 ring-inset ring-white/[0.06]" />

          <div className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-[#B08D4C]" />
            <p className="font-mono text-[13px] uppercase tracking-[0.34em] text-[#E8C9C4]">Let&apos;s talk</p>
          </div>

          <ScrambleLine
            text={HEADS.ask}
            className="block whitespace-pre-line text-white font-extrabold leading-[0.92] tracking-[-0.03em] text-[clamp(42px,7.2vw,92px)]"
          />

          <p className="mt-7 max-w-[42ch] text-[17px] leading-relaxed text-[#EADFCF]/70">
            One honest sixty-second review — brief to posted in seven days. Tell me about your product and we&apos;ll find the hook worth stopping for.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <BookCallButton className="bg-[#EADFCF] text-[#2A1A1C] shadow-[0_16px_40px_-16px_rgba(0,0,0,0.7)] hover:bg-white" />
            <Button variant="outline" size="lg" nativeButton={false} className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/10" render={<a href={`mailto:${CONTACT.email}`} />}>
              Email me
            </Button>
          </div>

          <div className="mt-10 inline-flex items-center gap-2.5 rounded-full border border-white/[0.12] bg-black/15 px-4 py-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#3ECf8E] opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-[#3ECf8E]" />
            </span>
            <p className="text-[13px] text-[#EADFCF]/80">
              Free 15-min intro · real availability on <b className="font-semibold text-white">Cal.com</b>
            </p>
          </div>

          <p className="mt-6 font-mono text-[13px] text-[#EADFCF]/45">{CONTACT.email} · {CONTACT.handle}</p>
        </div>
      </Reveal>
    </section>
  );
}
