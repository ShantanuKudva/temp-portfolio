import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Contact & links",
  admin: {
    group: "Connect page",
    description:
      "How people reach you from the Connect page: your email, your Cal.com booking link, your social links, the rate-card PDF, and the ready-made email starters visitors can pick from.",
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: "email", type: "email", required: true },
    {
      name: "calLink",
      type: "text",
      required: true,
      maxLength: 60,
      admin: { description: 'Cal.com "<username>/<event>", e.g. "varsheni/intro".' },
    },
    { name: "instagram", type: "text", required: true, maxLength: 120 },
    { name: "youtube", type: "text", required: true, maxLength: 120 },
    {
      name: "rateCardPdf",
      type: "upload",
      relationTo: "documents",
      label: "Rate card PDF",
      admin: {
        description:
          "Upload the PDF visitors download from your Connect page. Leave it empty and the download button is hidden rather than linking to a missing file.",
      },
    },
    { name: "responseTime", type: "text", required: true, maxLength: 60 },
    {
      name: "mailTemplates",
      type: "array",
      label: "Email starters",
      minRows: 1,
      maxRows: 8,
      admin: { description: "Pre-written mailto: starters for the Connect page carousel." },
      fields: [
        { name: "key", type: "text", required: true, maxLength: 30 },
        { name: "label", type: "text", required: true, maxLength: 40 },
        { name: "subject", type: "text", required: true, maxLength: 120 },
        { name: "body", type: "textarea", required: true, maxLength: 1200 },
      ],
    },
  ],
};
