import type { About } from "@/payload-types";

export type TitledItem = { title: string; body: string };

export type AboutContent = {
  hero: {
    availability: string;
    eyebrow: string;
    headline: string;
    intro: string;
    bio: string[];
    signature: string;
  };
  whoIAm: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    education: string[];
    qualifications: string[];
    languages: string[];
  };
  values: { eyebrow: string; items: TitledItem[] };
  bring: TitledItem[];
  quote: { text: string; attribution: string };
};

const texts = (rows?: { text: string }[] | null): string[] => (rows ?? []).map((r) => r.text);
const items = (rows?: { item: string }[] | null): string[] => (rows ?? []).map((r) => r.item);
const titled = (rows?: { title: string; body: string }[] | null): TitledItem[] =>
  (rows ?? []).map((r) => ({ title: r.title, body: r.body }));

export const mapAbout = (doc: About): AboutContent => ({
  hero: {
    availability: doc.hero.availability,
    eyebrow: doc.hero.eyebrow,
    headline: doc.hero.headline,
    intro: doc.hero.intro,
    bio: texts(doc.hero.bio),
    signature: doc.hero.signature,
  },
  whoIAm: {
    eyebrow: doc.whoIAm.eyebrow,
    heading: doc.whoIAm.heading,
    paragraphs: texts(doc.whoIAm.paragraphs),
    education: items(doc.whoIAm.education),
    qualifications: items(doc.whoIAm.qualifications),
    languages: items(doc.whoIAm.languages),
  },
  values: { eyebrow: doc.values.eyebrow, items: titled(doc.values.items) },
  bring: titled(doc.bring?.items),
  quote: { text: doc.quote.text, attribution: doc.quote.attribution },
});
