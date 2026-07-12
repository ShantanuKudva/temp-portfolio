"use client";

import { CONTACT } from "@/lib/contact-info";
import { Reveal } from "@/components/motion/reveal";

const CHANNELS = [
  { label: "Email", href: `mailto:${CONTACT.email}`, value: CONTACT.email, external: false },
  { label: "Instagram", href: CONTACT.instagram, value: "@varsheni", external: true },
  { label: "YouTube", href: CONTACT.youtube, value: "Varsheni", external: true },
];

/**
 * Secondary contact channels beside the Cal booking: email + socials + a
 * response-time reassurance line.
 */
export function ContactRail() {
  return (
    <Reveal className="flex flex-col justify-center gap-6">
      <div>
        <p className="font-sans text-xs font-medium uppercase tracking-[0.3em] text-amber-dot">
          <span>✦</span>&nbsp;&nbsp;Or reach me directly
        </p>
        <p className="mt-3 max-w-xs font-sans text-[15px] leading-relaxed text-creme/70">
          Prefer email or a DM? I read every one.
        </p>
      </div>

      <ul className="space-y-3">
        {CHANNELS.map((c) => (
          <li key={c.label}>
            <a
              href={c.href}
              {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="group flex items-baseline gap-3 font-sans text-creme/85 transition-colors hover:text-amber-dot"
            >
              <span className="w-24 shrink-0 text-xs uppercase tracking-[0.2em] text-creme/45 group-hover:text-amber-dot/70">
                {c.label}
              </span>
              <span className="text-[15px]">{c.value}</span>
            </a>
          </li>
        ))}
      </ul>

      <p className="font-sans text-xs uppercase tracking-[0.22em] text-creme/45">
        {CONTACT.responseTime}
      </p>
    </Reveal>
  );
}
