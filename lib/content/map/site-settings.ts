import type { ContactInfo, MailTemplate } from "@/lib/contact-info";
import type { SiteSetting } from "@/payload-types";

export const mapContact = (doc: SiteSetting): ContactInfo => ({
  email: doc.email,
  calLink: doc.calLink,
  instagram: doc.instagram,
  youtube: doc.youtube,
  rateCardPdf: doc.rateCardPdf,
  responseTime: doc.responseTime,
});

export const mapMailTemplates = (doc: SiteSetting): MailTemplate[] =>
  (doc.mailTemplates ?? []).map((t) => ({
    key: t.key,
    label: t.label,
    subject: t.subject,
    body: t.body,
  }));
