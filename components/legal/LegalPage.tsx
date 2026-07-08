import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PitchFooter from '@/components/pitch/PitchFooter';
import type { LegalDoc } from '@/lib/legalContent';

// One shell for every legal route (privacy, terms, cookies, disclosure). A quiet,
// readable document page in the same editorial world as the portfolio — dark
// ground, gold hairlines, Fraunces headings, a single ~68ch measure. Server
// component (static content, no interactivity). The site footer is included so
// the legal pages stay navigable back into the portfolio.
export default function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#0B0708]">
      <main className="mx-auto w-full max-w-[720px] flex-1 px-[7vw] py-24 md:px-8 md:py-32">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] text-[#B08D4C] transition-colors hover:text-white"
        >
          <ArrowLeft className="size-3.5" />
          Back to Varsheni
        </Link>

        <header className="mt-12 border-b border-[#B08D4C]/25 pb-10">
          <p className="font-mono text-[12px] uppercase tracking-[0.28em] text-[#B08D4C]">Legal</p>
          <h1 className="mt-4 font-serif text-white font-semibold tracking-[-0.02em] text-[clamp(38px,6vw,58px)]">
            {doc.title}
          </h1>
          <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.18em] text-[#EADFCF]/40">
            Last updated {doc.updated}
          </p>
        </header>

        <p className="mt-10 text-[18px] leading-relaxed text-[#EADFCF]/75">{doc.intro}</p>

        <div className="mt-14 flex flex-col gap-12">
          {doc.sections.map((s) => (
            <section key={s.h}>
              <h2 className="text-[22px] font-bold tracking-[-0.01em] text-white">{s.h}</h2>
              <div className="mt-4 flex flex-col gap-4">
                {s.body.map((p, i) => (
                  <p key={i} className="text-[16px] leading-relaxed text-[#EADFCF]/65">{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <PitchFooter />
    </div>
  );
}
