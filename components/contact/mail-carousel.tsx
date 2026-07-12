"use client";

import { useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { CONTACT, MAIL_TEMPLATES, type MailTemplate } from "@/lib/contact-info";
import { Reveal } from "@/components/motion/reveal";

function mailtoHref(subject: string, body: string) {
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

function Slide({ tpl }: { tpl: MailTemplate }) {
  const [subject, setSubject] = useState(tpl.subject);
  const [body, setBody] = useState(tpl.body);

  return (
    <div className="min-w-0 flex-[0_0_88%] pl-4 sm:flex-[0_0_66%] lg:flex-[0_0_52%]">
      <div className="flex h-full flex-col rounded-3xl border border-creme/12 bg-gradient-to-br from-[#232647]/90 via-[#161832]/85 to-[#0b0c1a]/92 p-6 backdrop-blur-md sm:p-7">
        <p className="mb-4 font-sans text-[11px] font-medium uppercase tracking-[0.26em] text-moonlight">
          {tpl.label}
        </p>

        <label className="mb-1.5 block font-sans text-[11px] uppercase tracking-[0.2em] text-creme/45">
          Subject
        </label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mb-4 w-full rounded-xl border border-creme/12 bg-[#0b0c1a]/60 px-3.5 py-2.5 font-sans text-[14px] text-creme outline-none transition-colors placeholder:text-creme/30 focus:border-moonlight/60"
          spellCheck={false}
        />

        <label className="mb-1.5 block font-sans text-[11px] uppercase tracking-[0.2em] text-creme/45">
          Message
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={7}
          className="mb-5 w-full flex-1 resize-none rounded-xl border border-creme/12 bg-[#0b0c1a]/60 px-3.5 py-2.5 font-sans text-[14px] leading-relaxed text-creme/90 outline-none transition-colors placeholder:text-creme/30 focus:border-moonlight/60"
        />

        <a
          href={mailtoHref(subject, body)}
          className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-moonlight px-6 py-3 font-sans text-sm font-semibold uppercase tracking-[0.14em] text-[#151833] transition-colors hover:bg-creme"
        >
          Send email ↗
        </a>
      </div>
    </div>
  );
}

/**
 * "Write to me" — a draggable carousel of email starters. Each slide has an
 * editable subject + body; Send opens the visitor's mail app via mailto: with
 * everything prefilled. No backend — the message is composed in their own client.
 */
export function MailCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section id="write" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto mb-10 flex max-w-6xl flex-col gap-6 px-6 sm:flex-row sm:items-end sm:justify-between sm:px-10">
        <div>
          <Reveal>
            <p className="mb-3 font-sans text-xs font-medium uppercase tracking-[0.3em] text-moonlight">
              <span>✦</span>&nbsp;&nbsp;Write to me
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="max-w-xl font-display text-3xl leading-tight sm:text-5xl">
              Prefer to write? Pick a starter.
            </h2>
          </Reveal>
        </div>

        {/* Carousel controls. */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous starter"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-creme/20 font-sans text-creme transition-colors hover:border-moonlight/60 hover:text-moonlight"
          >
            ←
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next starter"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-creme/20 font-sans text-creme transition-colors hover:border-moonlight/60 hover:text-moonlight"
          >
            →
          </button>
        </div>
      </div>

      {/* Embla viewport — bleed a little past the container so neighbours peek in. */}
      <div className="cursor-grab overflow-hidden active:cursor-grabbing" ref={emblaRef}>
        <div className="mx-auto flex max-w-6xl px-2 sm:px-6">
          {MAIL_TEMPLATES.map((tpl) => (
            <Slide key={tpl.key} tpl={tpl} />
          ))}
        </div>
      </div>
    </section>
  );
}
