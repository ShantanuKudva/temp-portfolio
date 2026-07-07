import Reveal from '../Reveal';
import SectionHead from '../SectionHead';
import { CHIPS, STATS } from '@/lib/pitchContent';
import { Card, CardContent } from '@/components/ui/card';

// Post-scroll portfolio section (NOT a phone beat). The deliverables (headline →
// package → the numbers), then a full-width scrolling wall of the apps & tools
// she reviews as coloured logo chips.
export default function WhatYouGet() {
  return (
    <section className="flex min-h-screen flex-col justify-center px-[7vw] py-28">
      <div className="mx-auto w-full max-w-[1100px]">
        <SectionHead
          index="N° 06"
          title={<>One 60-second review. <span className="text-[#EADFCF]/[0.42]">Yours to run anywhere.</span></>}
          kicker="What you get"
          ghost="06"
        />

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CHIPS.map((c, i) => (
            <Reveal key={c.text} delay={120 + i * 60}>
              <Card className="h-full border-none bg-white/[0.03] py-5 ring-1 ring-[#B08D4C]/20">
                <CardContent className="flex items-baseline gap-3">
                  <span className="font-mono text-[15px] font-bold text-[#B08D4C]">{c.pre || '·'}</span>
                  <span className="text-[16px] leading-snug text-[#EADFCF]/85">{c.text}</span>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={140}>
          <div className="mt-14 flex flex-wrap gap-x-16 gap-y-8 border-t border-[#B08D4C]/20 pt-10">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-white font-extrabold tracking-[-0.02em] text-[clamp(38px,5vw,60px)] tabular-nums">{s.value}</div>
                <div className="mt-1 font-mono text-[12px] uppercase tracking-[0.22em] text-[#EADFCF]/50">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
