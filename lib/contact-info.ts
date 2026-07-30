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
