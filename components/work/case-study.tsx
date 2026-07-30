"use client";

import { Reveal } from "@/components/motion/reveal";
import type { WorkContent } from "@/lib/content/map/work";


/**
 * Case study — an honest empty-state. Nothing has been posted yet, so instead of
 * fabricating a collaboration, this reserves the slot and sets expectations for
 * what the first real breakdown will cover.
 */
export function CaseStudy({ content }: { content: WorkContent["caseStudy"] }) {
  return (
    <section
      id="case-study"
      className="relative scroll-mt-24 px-6 py-20 sm:px-10 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-3 font-sans text-xs font-medium uppercase tracking-[0.3em] text-[#eebb79]">
            <span>✦</span>&nbsp;&nbsp;{content.eyebrow}
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mb-5 max-w-xl font-display text-3xl leading-tight sm:text-5xl">
            {content.heading}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mb-12 max-w-lg font-sans text-[15px] leading-relaxed text-creme/65">
            {content.intro}
          </p>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="relative overflow-hidden rounded-3xl border border-dashed border-creme/20 bg-creme/[0.03] p-8 sm:p-12">
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-creme/20 to-transparent" />
            <span className="inline-flex items-center gap-2 rounded-full border border-[#eebb79]/40 bg-[#eebb79]/10 px-4 py-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-[#eebb79]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#eebb79] opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#eebb79]" />
              </span>
              {content.badge}
            </span>

            <p className="mt-7 mb-6 font-display text-xl text-creme sm:text-2xl">
              {content.coverTitle}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {content.items.map((b, i) => (
                <div key={b.label}>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="font-display text-lg text-[#eebb79]/70">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px flex-1 bg-[#eebb79]/30" />
                  </div>
                  <p className="mb-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-[#eebb79]/80">
                    {b.label}
                  </p>
                  <p className="font-sans text-[14px] leading-relaxed text-creme/70">
                    {b.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
