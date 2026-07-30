import { describe, it, expect } from "vitest";
import { mapAbout } from "@/lib/content/map/about";

const doc = {
  id: 1,
  hero: {
    availability: "Available for brand deals",
    eyebrow: "About",
    headline: "Honest reviews, for people done being let down.",
    intro: "Hi, I'm Varsheni.",
    bio: [{ id: "a", text: "First para." }, { id: "b", text: "Second para." }],
    signature: "— honest, always.",
  },
  whoIAm: {
    eyebrow: "Who I am",
    heading: "Where I come from.",
    paragraphs: [{ id: "a", text: "Raised in southern India." }],
    education: [{ id: "a", item: "Bachelor's degree" }],
    qualifications: [{ id: "a", item: "Years of reviewing" }],
    languages: [{ id: "a", item: "Hindi" }, { id: "b", item: "Tamil" }],
  },
  values: { eyebrow: "What I stand for", items: [{ id: "a", title: "Honest", body: "Body." }] },
  bring: {
    eyebrow: "What I bring to the table",
    heading: "Five reasons the review is worth trusting.",
    items: [{ id: "a", title: "Honest reviews", body: "Body." }],
  },
  quote: { text: "The best review.", attribution: "Est. 2026 — Made in India" },
  radar: { eyebrow: "On my radar", heading: "The apps I want next." },
  cta: {
    script: "let's talk",
    heading: "Have an app worth an honest look?",
    primaryLabel: "Work with me ↗",
    secondaryLabel: "See the work",
  },
  props: {
    sideLabel: "Apps · Businesses · Honest reviews",
    sealText: "✦ Honest reviews ✦",
  },
};

describe("mapAbout", () => {
  it("flattens Payload's array-of-objects into plain string lists", () => {
    const about = mapAbout(doc as never);
    expect(about.hero.bio).toEqual(["First para.", "Second para."]);
    expect(about.whoIAm.languages).toEqual(["Hindi", "Tamil"]);
    expect(about.whoIAm.education).toEqual(["Bachelor's degree"]);
    expect(about.whoIAm.paragraphs).toEqual(["Raised in southern India."]);
  });

  it("preserves title/body pairs for values and bring", () => {
    const about = mapAbout(doc as never);
    expect(about.values.items).toEqual([{ title: "Honest", body: "Body." }]);
    expect(about.bring.items).toEqual([{ title: "Honest reviews", body: "Body." }]);
  });

  it("carries the scalar hero and quote fields through unchanged", () => {
    const about = mapAbout(doc as never);
    expect(about.hero.headline).toBe("Honest reviews, for people done being let down.");
    expect(about.hero.signature).toBe("— honest, always.");
    expect(about.quote).toEqual({
      text: "The best review.",
      attribution: "Est. 2026 — Made in India",
    });
  });

  it("returns empty lists rather than throwing when arrays are null", () => {
    const bare = {
      ...doc,
      hero: { ...doc.hero, bio: null },
      whoIAm: {
        ...doc.whoIAm,
        languages: null,
        education: null,
        qualifications: null,
        paragraphs: null,
      },
      values: { ...doc.values, items: null },
      bring: { ...doc.bring, items: null },
    };
    const about = mapAbout(bare as never);
    expect(about.hero.bio).toEqual([]);
    expect(about.whoIAm.languages).toEqual([]);
    expect(about.values.items).toEqual([]);
    expect(about.bring.items).toEqual([]);
  });
});
