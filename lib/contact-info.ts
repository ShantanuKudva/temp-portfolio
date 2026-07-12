export type Package = {
  key: string;
  name: string;
  blurb: string;
  deliverables: string[];
  priceFrom: string;
};

export type MailTemplate = {
  key: string;
  label: string;
  subject: string;
  body: string;
};

export type ContactInfo = {
  email: string;
  calLink: string;
  instagram: string;
  youtube: string;
  rateCardPdf: string;
  responseTime: string;
};

/**
 * Placeholder rate-card tiers. Deliverables + starting prices are stand-ins —
 * swap for Varsheni's real numbers.
 */
export const PACKAGES: Package[] = [
  {
    key: "single",
    name: "Single Review",
    blurb: "One product, one honest verdict.",
    deliverables: ["1 reel (30–60s)", "3 story frames", "Usage rights (30 days)", "1 revision"],
    priceFrom: "from ₹25,000", // TODO(real): confirm starting price
  },
  {
    key: "campaign",
    name: "Campaign Package",
    blurb: "A multi-touch push across a launch.",
    deliverables: ["3 reels", "Story series", "Usage rights (90 days)", "2 revisions"],
    priceFrom: "from ₹75,000", // TODO(real): confirm starting price
  },
  {
    key: "retainer",
    name: "Custom / Retainer",
    blurb: "Ongoing collaboration, bespoke scope.",
    deliverables: ["Monthly deliverables", "Priority slots", "Extended rights", "Strategy input"],
    priceFrom: "from ₹1,50,000/mo", // TODO(real): confirm starting price
  },
];

export const CONTACT: ContactInfo = {
  email: "kudvashantanu2002@gmail.com", // TEST inbox — swap for Varsheni's real one before launch
  calLink: "varsheni/intro", // TODO(real): real Cal.com <username>/<event>
  instagram: "https://instagram.com/", // TODO(real): handle
  youtube: "https://youtube.com/", // TODO(real): channel
  rateCardPdf: "/rate-card.pdf", // TODO(real): drop the PDF into /public
  responseTime: "Usually replies within 48h",
};

/**
 * Pre-written email starters for the "write to me" carousel. Each opens the
 * visitor's mail app via mailto: with the subject + body prefilled (still fully
 * editable before they send). Copy is placeholder — tune to Varsheni's voice.
 */
export const MAIL_TEMPLATES: MailTemplate[] = [
  {
    key: "collab",
    label: "Brand collaboration",
    subject: "Brand collaboration with Varsheni",
    body: "Hi Varsheni,\n\nWe're [brand] and we'd love to work with you on [product / campaign]. A quick sense of what we have in mind:\n\n- \n- \n\nTimeline: \nBudget range: \n\nLooking forward to hearing from you!",
  },
  {
    key: "review",
    label: "Product review",
    subject: "Review request: [product]",
    body: "Hi Varsheni,\n\nWe'd love an honest review of [product] — a [category] app/product we think your audience would find useful.\n\nWhat it does: \nWhat we'd love you to cover: \n\nHappy to send access or a sample. Thanks!",
  },
  {
    key: "retainer",
    label: "Ongoing partnership",
    subject: "Ongoing collaboration with Varsheni",
    body: "Hi Varsheni,\n\nWe're exploring a longer-term partnership (monthly content / retainer). Rough thinking:\n\nDeliverables: \nCadence: \nBudget: \n\nWould love to set up a call.",
  },
  {
    key: "hi",
    label: "Just saying hi",
    subject: "Hello, Varsheni!",
    body: "Hi Varsheni,\n\nNo pitch — just wanted to say I love your work. [your note here]\n\nCheers!",
  },
];
