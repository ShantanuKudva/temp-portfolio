"use client";

import { useState } from "react";
import type { ContactInfo, MailTemplate } from "@/lib/contact-info";
import type { ConnectContent } from "@/lib/content/map/connect";

function mailtoHref(email: string, subject: string, body: string) {
  return `mailto:${email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

const EMPTY_TEMPLATE: MailTemplate = { key: "blank", label: "", subject: "", body: "" };

const FIELD =
  "w-full rounded-2xl border border-creme/10 bg-[#05060c]/70 px-4 py-3 font-sans text-[14px] text-creme outline-none transition-[border-color,box-shadow] placeholder:text-creme/25 focus:border-moonlight/50 focus:shadow-[0_0_0_3px_rgba(174,178,230,0.12)]";

/**
 * A simple, refined email composer that sits in line with the Cal.com embed:
 * pick a starter, tweak the subject + message, and Send opens the visitor's mail
 * app via mailto: with everything prefilled. No backend.
 */
export function MailComposer({
  contact,
  templates,
  content,
}: {
  contact: ContactInfo;
  templates: MailTemplate[];
  content: ConnectContent["booking"];
}) {
  const first = templates[0] ?? EMPTY_TEMPLATE;
  const socials = [
    { label: "Instagram", href: contact.instagram },
    { label: "YouTube", href: contact.youtube },
  ];

  const [active, setActive] = useState(first.key);
  const [subject, setSubject] = useState(first.subject);
  const [body, setBody] = useState(first.body);

  const pick = (t: MailTemplate) => {
    setActive(t.key);
    setSubject(t.subject);
    setBody(t.body);
  };

  return (
    <div
      id="write"
      className="flex h-full scroll-mt-24 flex-col overflow-hidden rounded-3xl border border-moonlight/20 bg-gradient-to-br from-[#232647]/80 via-[#161832]/85 to-[#0b0c1a]/92 backdrop-blur-md"
    >
      {/* Header. */}
      <div className="border-b border-creme/10 px-6 pb-5 pt-6 sm:px-7">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-moonlight">
          {content.composerEyebrow}
        </p>
        <p className="mt-1 font-display text-xl text-creme sm:text-2xl">
          {content.composerHeading}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4 px-6 py-6 sm:px-7">
        {/* Starter chips. */}
        <div className="flex flex-wrap gap-2">
          {templates.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => pick(t)}
              className={`rounded-full border px-3.5 py-1.5 font-sans text-[11px] tracking-[0.06em] transition-colors ${
                active === t.key
                  ? "border-moonlight/50 bg-moonlight/15 text-moonlight"
                  : "border-creme/12 text-creme/55 hover:border-creme/30 hover:text-creme/85"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <input
          aria-label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          className={FIELD}
          spellCheck={false}
        />

        <textarea
          aria-label="Message"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Your message…"
          className={`${FIELD} min-h-[9rem] flex-1 resize-none leading-relaxed`}
        />

        <a
          href={mailtoHref(contact.email, subject, body)}
          className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-moonlight px-6 py-3.5 font-sans text-sm font-semibold uppercase tracking-[0.14em] text-[#141733] transition-colors hover:bg-creme"
        >
          {content.sendLabel}
          <span className="transition-transform group-hover:translate-x-0.5">↗</span>
        </a>
      </div>

      {/* Footer — direct channels + response time. */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-creme/10 px-6 py-4 font-sans text-[13px] sm:px-7">
        <a
          href={`mailto:${contact.email}`}
          className="text-creme/70 transition-colors hover:text-moonlight"
        >
          {contact.email}
        </a>
        <span className="h-3 w-px bg-creme/15" aria-hidden />
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className="text-creme/60 transition-colors hover:text-moonlight"
          >
            {s.label}
          </a>
        ))}
        {contact.responseTime && (
          <>
            <span className="h-3 w-px bg-creme/15" aria-hidden />
            <span className="text-creme/50">{contact.responseTime}</span>
          </>
        )}
      </div>
    </div>
  );
}
