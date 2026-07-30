import type { Work } from "@/payload-types";

export type LabelledItem = { label: string; body: string };
export type StepItem = { title: string; body: string };

export type WorkContent = {
  hero: {
    eyebrow: string;
    script: string;
    headline: string;
    intro: string;
    availability: string;
  };
  gallery: { eyebrow: string; heading: string; emptyState: string };
  caseStudy: {
    eyebrow: string;
    heading: string;
    intro: string;
    badge: string;
    coverTitle: string;
    items: LabelledItem[];
  };
  process: { eyebrow: string; heading: string; steps: StepItem[] };
  cta: {
    script: string;
    heading: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
};

const labelled = (rows?: { label: string; body: string }[] | null): LabelledItem[] =>
  (rows ?? []).map((r) => ({ label: r.label, body: r.body }));

const steps = (rows?: { title: string; body: string }[] | null): StepItem[] =>
  (rows ?? []).map((r) => ({ title: r.title, body: r.body }));

export const mapWork = (doc: Work): WorkContent => ({
  hero: {
    eyebrow: doc.hero.eyebrow,
    script: doc.hero.script,
    headline: doc.hero.headline,
    intro: doc.hero.intro,
    availability: doc.hero.availability,
  },
  gallery: {
    eyebrow: doc.gallery.eyebrow,
    heading: doc.gallery.heading,
    emptyState: doc.gallery.emptyState,
  },
  caseStudy: {
    eyebrow: doc.caseStudy.eyebrow,
    heading: doc.caseStudy.heading,
    intro: doc.caseStudy.intro,
    badge: doc.caseStudy.badge,
    coverTitle: doc.caseStudy.coverTitle,
    items: labelled(doc.caseStudy.items),
  },
  process: {
    eyebrow: doc.process.eyebrow,
    heading: doc.process.heading,
    steps: steps(doc.process.steps),
  },
  cta: {
    script: doc.cta.script,
    heading: doc.cta.heading,
    primaryLabel: doc.cta.primaryLabel,
    secondaryLabel: doc.cta.secondaryLabel,
  },
});
