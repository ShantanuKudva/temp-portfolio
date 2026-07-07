import Reveal from '../Reveal';
import SectionHead from '../SectionHead';
import { FAQ } from '@/lib/pitchContent';

// N° 08 — the questions that come up before booking. Native <details> so it's
// keyboard- and screen-reader-friendly with no JS; the "+" rotates to "×" open.
export default function Faq() {
  return (
    <section className="relative flex items-center px-[7vw] py-32">
      <div className="mx-auto w-full max-w-[820px]">
        <SectionHead index="N° 08" title="Good to know." kicker="Before you book" ghost="08" />

        <div className="mt-12 border-y border-[#B08D4C]/15">
          {FAQ.map((item, i) => (
            <Reveal key={item.q} delay={i * 60}>
              <details className="group border-b border-[#B08D4C]/15 py-5 last:border-b-0 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[19px] font-semibold text-white">
                  {item.q}
                  <span className="shrink-0 text-[28px] leading-none text-[#B08D4C] transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-[62ch] text-[16px] leading-relaxed text-[#EADFCF]/65">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
