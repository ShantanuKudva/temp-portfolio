import Image from 'next/image';
import Reveal from '../Reveal';
import Parallax from '../Parallax';
import SectionHead from '../SectionHead';
import { MEET, ABOUT, ABOUT_FACTS, LANGUAGES, PORTRAIT_SRC } from '@/lib/pitchContent';

// Post-scroll "personal info" section — the face and voice behind the reels.
// Portrait on the left (a designed placeholder frame until a real photo lands
// at PORTRAIT_SRC), story + quick facts on the right. Simple, revealed on scroll.
export default function About() {
  return (
    <section id="about" className="flex min-h-screen flex-col justify-center px-[7vw] py-28 scroll-mt-24">
      <div className="mx-auto w-full max-w-[1100px]">
        <SectionHead index="N° 01" title="Meet Varsheni." kicker={ABOUT.eyebrow} ghost="01" />
        <div className="mt-14 grid grid-cols-1 items-center gap-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-16">
        {/* Portrait — drifts slower than the story beside it (parallax). */}
        <Reveal>
          <Parallax strength={0.12}>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[380px] overflow-hidden rounded-[28px] ring-1 ring-[#B08D4C]/40 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)]">
              {PORTRAIT_SRC ? (
                <Image src={PORTRAIT_SRC} alt={MEET.name} fill sizes="380px" className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(150deg,#7B1E2B,#571620_55%,#2A1A1C)]">
                  <span className="font-extrabold leading-none text-white/90 text-[clamp(90px,16vw,150px)]">V</span>
                  <span className="absolute bottom-4 left-5 font-mono text-[11px] uppercase tracking-[0.24em] text-[#EADFCF]/45">portrait — placeholder</span>
                </div>
              )}
            </div>
          </Parallax>
        </Reveal>

        {/* Story + facts */}
        <div>
          <Reveal>
            <h2 className="text-white font-extrabold leading-[1.02] tracking-[-0.02em] text-[clamp(32px,4.6vw,54px)]">{ABOUT.lead}</h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-6 max-w-[54ch] text-[17px] leading-relaxed text-[#EADFCF]/70">{ABOUT.body}</p>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-6 max-w-[46ch] text-[18px] font-semibold italic leading-snug text-white/90">“{ABOUT.kicker}”</p>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[#B08D4C]/20 pt-8">
            {ABOUT_FACTS.map((f, i) => (
              <Reveal key={f.k} delay={120 + i * 60}>
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#B08D4C]">{f.k}</div>
                  <div className="mt-1.5 text-[16px] leading-snug text-[#EADFCF]/85">{f.v}</div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="mt-8 border-t border-[#B08D4C]/20 pt-8">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#B08D4C]">Languages</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {LANGUAGES.map((l) => (
                  <span
                    key={l}
                    className="rounded-full border border-[#B08D4C]/30 bg-white/[0.03] px-3.5 py-1.5 text-[14px] text-[#EADFCF]/85"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
        </div>
      </div>
    </section>
  );
}
