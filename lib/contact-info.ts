export type Package = {
  key: string;
  name: string;
  blurb: string;
  deliverables: string[];
  priceFrom: string;
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
  email: "hello@varsheni.com", // TODO(real): real inbox
  calLink: "varsheni/intro", // TODO(real): real Cal.com <username>/<event>
  instagram: "https://instagram.com/", // TODO(real): handle
  youtube: "https://youtube.com/", // TODO(real): channel
  rateCardPdf: "/rate-card.pdf", // TODO(real): drop the PDF into /public
  responseTime: "Usually replies within 48h",
};
