"use client";

import { Reveal } from "@/components/motion/reveal";

import type { AboutContent } from "@/lib/content/map/about";

function FactColumn({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div className="pt-1">
      <p className="mb-4 font-sans text-[11px] uppercase tracking-[0.24em] text-amber-dot/80">
        {label}
      </p>
      <ul className="space-y-2.5">
        {items.map((it) => (
          <li
            key={it}
            className="flex gap-2.5 font-sans text-[14px] leading-snug text-creme/80"
          >
            <span className="mt-1 text-amber-dot">✦</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * "Who I am" — the personal ground: upbringing, education, qualifications and
 * the languages she speaks. Sits on the velvet, between the story and the
 * value-props. All copy is placeholder for Varsheni to make real.
 */
export function WhoIAm({ content }: { content: AboutContent["whoIAm"] }) {
  return (
    <section id="who" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal>
          <p className="mb-3 font-sans text-xs font-medium uppercase tracking-[0.3em] text-amber-dot">
            <span>✦</span>&nbsp;&nbsp;{content.eyebrow}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_1fr] md:gap-16">
          {/* Upbringing narrative */}
          <div className="space-y-6">
            <Reveal>
              <h2 className="font-display text-3xl leading-tight sm:text-4xl">
                {content.heading}
              </h2>
            </Reveal>
            {content.paragraphs.map((text, i) => (
              <Reveal key={i} delay={0.08 + i * 0.06}>
                <p className="font-sans text-[15px] leading-relaxed text-creme/75 sm:text-base">
                  {text}
                </p>
              </Reveal>
            ))}
          </div>

          {/* Facts: education, qualifications, languages */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <Reveal>
              <FactColumn label="Education" items={content.education} />
            </Reveal>
            <Reveal delay={0.06}>
              <FactColumn label="Qualifications" items={content.qualifications} />
            </Reveal>
            {content.languages.length > 0 && (
            <Reveal delay={0.12} className="sm:col-span-2">
              <div className="pt-1">
                <p className="mb-4 font-sans text-[11px] uppercase tracking-[0.24em] text-amber-dot/80">
                  Languages
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {content.languages.map((l) => (
                    <span
                      key={l}
                      className="rounded-full border border-creme/20 bg-creme/[0.05] px-4 py-1.5 font-sans text-sm text-creme/85"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
