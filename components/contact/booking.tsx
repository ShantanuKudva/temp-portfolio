"use client";

import { CalEmbed } from "./cal-embed";
import { MailComposer } from "./mail-composer";
import { Reveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import type { ContactInfo, MailTemplate } from "@/lib/contact-info";

/**
 * "Book & reach me" — the Cal.com booking as the star, with a simple email
 * composer in line beside it (stacked on mobile).
 */
export function Booking({
  contact,
  mailTemplates,
}: {
  contact: ContactInfo;
  mailTemplates: MailTemplate[];
}) {
  return (
    <section id="book" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Parallax speed={26}>
          <Reveal>
            <h2 className="mb-12 max-w-xl font-display text-3xl leading-tight sm:text-5xl">
              Book a call — or write a note.
            </h2>
          </Reveal>
        </Parallax>

        <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-[1fr_1.4fr] md:gap-10">
          <MailComposer contact={contact} templates={mailTemplates} />
          <CalEmbed calLink={contact.calLink} />
        </div>
      </div>
    </section>
  );
}
