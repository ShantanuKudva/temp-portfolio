import { Check } from 'lucide-react';
import Reveal from '../Reveal';
import SectionHead from '../SectionHead';
import BookCallButton from '../BookCallButton';
import { PRICING_TIERS } from '@/lib/pitchContent';

// N° 07 — three cadences. The middle tier is featured (wine card + ribbon).
export default function Pricing() {
  return (
    <section className="relative flex items-center px-[7vw] py-32">
      <div className="mx-auto w-full max-w-[1100px]">
        <SectionHead index="N° 07" title="Pick a cadence." kicker="Simple, honest pricing" ghost="07" />

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {PRICING_TIERS.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <div
                className={`relative flex h-full flex-col rounded-2xl p-8 ring-1 ${
                  t.featured
                    ? 'bg-[#571620] ring-[#B08D4C]/50 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)] md:-translate-y-4'
                    : 'bg-white/[0.03] ring-white/10'
                }`}
              >
                {'ribbon' in t && t.ribbon && (
                  <span className="absolute -top-3 left-8 rounded-full bg-[#B08D4C] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#2A1A1C]">
                    {t.ribbon}
                  </span>
                )}
                <div className="font-mono text-[12px] uppercase tracking-[0.24em] text-[#B08D4C]">{t.tag}</div>
                <h3 className="mt-2 text-[26px] font-bold text-white">{t.name}</h3>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-white font-extrabold tracking-[-0.02em] text-[44px]">{t.price}</span>
                  <span className="text-[14px] text-[#EADFCF]/50">{t.unit}</span>
                </div>
                <ul className="mt-7 flex flex-1 flex-col gap-3">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[15px] text-[#EADFCF]/80">
                      <Check className="mt-0.5 size-4 shrink-0 text-[#B08D4C]" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-12 flex flex-col items-center gap-3">
            <BookCallButton />
            <p className="font-mono text-[12px] text-[#EADFCF]/40">Prices on request — every product is different. Book a call for a quote.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
