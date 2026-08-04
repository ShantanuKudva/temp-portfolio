import type { About } from "@/payload-types";

export type TitledItem = { title: string; body: string };

/** A resolved upload. `url` is empty when nothing is set, so callers can skip it. */
export type ImageRef = { url: string; alt: string };

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
  bring: { eyebrow: string; heading: string; items: TitledItem[] };
  quote: { text: string; attribution: string };
  radar: { eyebrow: string; heading: string };
  cta: {
    script: string;
    heading: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
  props: { sideLabel: string; sealText: string };
  images: {
    portrait: ImageRef;
    quotePortrait: ImageRef;
    bringPortrait: ImageRef;
  };
};

const image = (value: unknown, fallbackAlt: string): ImageRef =>
  typeof value === "object" && value !== null && "url" in value
    ? {
        url: (value as { url?: string | null }).url ?? "",
        alt: (value as { alt?: string | null }).alt || fallbackAlt,
      }
    : { url: "", alt: fallbackAlt };

const texts = (rows?: { text: string }[] | null): string[] =>
  (rows ?? []).map((r) => r.text);
const items = (rows?: { item: string }[] | null): string[] =>
  (rows ?? []).map((r) => r.item);
const titled = (
  rows?: { title: string; body: string }[] | null,
): TitledItem[] => (rows ?? []).map((r) => ({ title: r.title, body: r.body }));

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
  bring: {
    eyebrow: doc.bring.eyebrow,
    heading: doc.bring.heading,
    items: titled(doc.bring.items),
  },
  quote: { text: doc.quote.text, attribution: doc.quote.attribution },
  radar: { eyebrow: doc.radar.eyebrow, heading: doc.radar.heading },
  cta: {
    script: doc.cta.script,
    heading: doc.cta.heading,
    primaryLabel: doc.cta.primaryLabel,
    secondaryLabel: doc.cta.secondaryLabel,
  },
  props: { sideLabel: doc.props.sideLabel, sealText: doc.props.sealText },
  images: {
    portrait: image(doc.images?.portrait, "Varsheni, bathed in warm light"),
    quotePortrait: image(doc.images?.quotePortrait, "Varsheni"),
    bringPortrait: image(doc.images?.bringPortrait, "Varsheni"),
  },
});
