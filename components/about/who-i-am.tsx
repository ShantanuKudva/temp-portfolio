"use client";

import { Reveal } from "@/components/motion/reveal";

// All placeholder — Varsheni edits these; no invented credentials.
const EDUCATION = [
  "Bachelor's degree — [field], [university]",
  "[Any relevant course / diploma]",
];

const QUALIFICATIONS = [
  "Years of hands-on tech & app reviewing",
  "Comfortable on-camera, script to edit",
  "Disclosure-first, brand-safe creator",
];

const LANGUAGES = ["Hindi", "English", "Kannada", "Tamil"];

function FactColumn({ label, items }: { label: string; items: string[] }) {
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
export function WhoIAm() {
  return (
    <section id="who" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal>
          <p className="mb-3 font-sans text-xs font-medium uppercase tracking-[0.3em] text-amber-dot">
            <span>✦</span>&nbsp;&nbsp;Who I am
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_1fr] md:gap-16">
          {/* Upbringing narrative */}
          <div className="space-y-6">
            <Reveal>
              <h2 className="font-display text-3xl leading-tight sm:text-4xl">
                Where I come from, and what shaped the eye.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="font-sans text-[15px] leading-relaxed text-creme/75 sm:text-base">
                Raised in southern India, I grew up equal parts curious and
                skeptical — the kind of kid who took gadgets apart to see how
                they worked, then argued about whether they were any good. That
                mix never left me.
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="font-sans text-[15px] leading-relaxed text-creme/75 sm:text-base">
                Reviewing tech is just that instinct, grown up: an honest eye, a
                soft spot for products made with care, and zero patience for the
                ones that waste your time. <span className="text-creme">(Placeholder — your real story goes here.)</span>
              </p>
            </Reveal>
          </div>

          {/* Facts: education, qualifications, languages */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <Reveal>
              <FactColumn label="Education" items={EDUCATION} />
            </Reveal>
            <Reveal delay={0.06}>
              <FactColumn label="Qualifications" items={QUALIFICATIONS} />
            </Reveal>
            <Reveal delay={0.12} className="sm:col-span-2">
              <div className="pt-1">
                <p className="mb-4 font-sans text-[11px] uppercase tracking-[0.24em] text-amber-dot/80">
                  Languages
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {LANGUAGES.map((l) => (
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
          </div>
        </div>
      </div>
    </section>
  );
}
