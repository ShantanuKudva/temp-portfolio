import type { Connect, Home } from "@/payload-types";

export type ConnectContent = {
  hero: {
    eyebrow: string;
    script: string;
    headline: string;
    intro: string;
    availability: string;
  };
  rateCard: { eyebrow: string; heading: string; downloadLabel: string };
  booking: {
    heading: string;
    composerEyebrow: string;
    composerHeading: string;
    sendLabel: string;
  };
  close: { marqueeText: string };
};

export type HomeContent = { name: string; portraitAlt: string };

export const mapConnect = (doc: Connect): ConnectContent => ({
  hero: {
    eyebrow: doc.hero.eyebrow,
    script: doc.hero.script,
    headline: doc.hero.headline,
    intro: doc.hero.intro,
    availability: doc.hero.availability,
  },
  rateCard: {
    eyebrow: doc.rateCard.eyebrow,
    heading: doc.rateCard.heading,
    downloadLabel: doc.rateCard.downloadLabel,
  },
  booking: {
    heading: doc.booking.heading,
    composerEyebrow: doc.booking.composerEyebrow,
    composerHeading: doc.booking.composerHeading,
    sendLabel: doc.booking.sendLabel,
  },
  close: { marqueeText: doc.close.marqueeText },
});

export const mapHome = (doc: Home): HomeContent => ({
  name: doc.name,
  portraitAlt: doc.portraitAlt,
});
