"use client";

import { CalEmbed } from "./cal-embed";
import { ContactRail } from "./contact-rail";
import { Reveal } from "@/components/motion/reveal";

/**
 * "Book & reach me" — the Cal.com booking as the star, with the contact rail
 * (email + socials) alongside on desktop, stacked above on mobile.
 */
export function Booking() {
  return (
    <section id="book" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal>
          <h2 className="mb-12 max-w-xl font-display text-3xl leading-tight sm:text-5xl">
            Book a call — or just say hi.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.6fr] md:gap-12">
          <ContactRail />
          <CalEmbed />
        </div>
      </div>
    </section>
  );
}
