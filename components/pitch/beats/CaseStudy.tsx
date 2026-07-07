import Reveal from '../Reveal';
import SectionHead from '../SectionHead';
import PullQuote from '../PullQuote';
import { CASE_STUDY } from '@/lib/pitchContent';

// N° 03 — one worked example, told as an approach, not a results dashboard.
// No view/like counts (she's new — the honest proof is the thinking, not
// invented numbers). CASE_STUDY.metrics stays in content for a future numbers
// panel once real data exists.
export default function CaseStudy() {
  return (
    <section className="relative flex min-h-screen items-center px-[7vw] py-28">
      <div className="mx-auto w-full max-w-[1100px]">
        <SectionHead index="N° 03" title="Proof, not promises." kicker={CASE_STUDY.eyebrow} ghost="03" />

        <div className="mt-16 max-w-[880px]">
          <Reveal>
            <p className="text-[clamp(19px,2.3vw,25px)] leading-relaxed text-[#EADFCF]/75">{CASE_STUDY.brief}</p>
          </Reveal>
          <Reveal delay={120}>
            <PullQuote cite={`the ${CASE_STUDY.brand} brief`} className="mt-14">{CASE_STUDY.quote}</PullQuote>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
