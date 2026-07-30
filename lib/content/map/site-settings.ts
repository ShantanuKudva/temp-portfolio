import type { ContactInfo, MailTemplate } from "@/lib/contact-info";
import type { SiteSetting } from "@/payload-types";

const fileUrl = (value: SiteSetting["rateCardPdf"]): string =>
  typeof value === "object" && value !== null && "url" in value ? (value.url ?? "") : "";

export const mapContact = (doc: SiteSetting): ContactInfo => ({
  email: doc.email,
  calLink: doc.calLink,
  instagram: doc.instagram,
  youtube: doc.youtube,
  rateCardPdf: fileUrl(doc.rateCardPdf),
  responseTime: doc.responseTime,
});

export const mapMailTemplates = (doc: SiteSetting): MailTemplate[] =>
  (doc.mailTemplates ?? []).map((t) => ({
    key: t.key,
    label: t.label,
    subject: t.subject,
    body: t.body,
  }));
