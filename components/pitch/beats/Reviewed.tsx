import Reveal from '../Reveal';
import SectionHead from '../SectionHead';
import { REVIEWED_BRANDS } from '@/lib/appLogos';

// N° 05 — the curated grid of apps she's reviewed, with the real brand marks and
// a category tag. (The full scrolling wall lives under "What you get".)
export default function Reviewed() {
  return (
    <section className="relative flex items-center px-[7vw] py-32">
      <div className="mx-auto w-full max-w-[1100px]">
        <SectionHead index="N° 05" title="On her radar." kicker={`${REVIEWED_BRANDS.length} recent picks`} ghost="05" />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {REVIEWED_BRANDS.map((b, i) => (
            <Reveal key={b.slug} delay={(i % 4) * 70}>
              <div className="group flex h-full items-center gap-3.5 rounded-xl bg-white/[0.03] p-4 ring-1 ring-white/10 transition-colors duration-300 hover:ring-[#B08D4C]/45">
                {/* real brand mark; plain img keeps it a static asset */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/assets/logos/${b.slug}.png`}
                  alt={b.name}
                  width={40}
                  height={40}
                  loading="lazy"
                  className="size-10 shrink-0 rounded-[22%] object-contain"
                />
                <div className="min-w-0">
                  <div className="truncate text-[15px] font-semibold text-white">{b.name}</div>
                  <div className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#B08D4C]">{b.category}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
