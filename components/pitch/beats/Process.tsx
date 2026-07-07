import Reveal from '../Reveal';
import SectionHead from '../SectionHead';
import { PROCESS_STEPS } from '@/lib/pitchContent';

// N° 04 — the four moves from brief to feed, as a hairline-divided grid.
export default function Process() {
  return (
    <section className="relative flex items-center px-[7vw] py-32">
      <div className="mx-auto w-full max-w-[1100px]">
        <SectionHead index="N° 04" title="Brief to feed, in four moves." kicker="How it works" ghost="04" />

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-[#B08D4C]/15 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 90}>
              <div className="flex h-full flex-col gap-4 bg-[#160C0E] p-8">
                <span className="font-mono text-[13px] text-[#B08D4C]">{s.n}</span>
                <h3 className="text-[22px] font-bold text-white">{s.title}</h3>
                <p className="text-[15px] leading-relaxed text-[#EADFCF]/60">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
