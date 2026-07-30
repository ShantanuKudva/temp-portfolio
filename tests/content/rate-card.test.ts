import { describe, it, expect } from "vitest";
import { mapPackage } from "@/lib/content/map/rate-card";
import { mapContact, mapMailTemplates } from "@/lib/content/map/site-settings";

describe("mapPackage", () => {
  it("flattens the deliverables array onto the UI Package shape", () => {
    const pkg = mapPackage({
      id: 3,
      name: "Single Review",
      blurb: "One product, one honest verdict.",
      priceFrom: "from ₹25,000",
      deliverables: [{ id: "a", item: "1 reel (30–60s)" }, { id: "b", item: "1 revision" }],
      order: 0,
    } as never);

    expect(pkg).toEqual({
      key: "3",
      name: "Single Review",
      blurb: "One product, one honest verdict.",
      priceFrom: "from ₹25,000",
      deliverables: ["1 reel (30–60s)", "1 revision"],
    });
  });

  it("tolerates a package with no deliverables", () => {
    const pkg = mapPackage({
      id: 4,
      name: "X",
      blurb: "y",
      priceFrom: "z",
      deliverables: null,
      order: 0,
    } as never);
    expect(pkg.deliverables).toEqual([]);
  });
});

const settings = {
  id: 1,
  email: "hello@varsheni.com",
  calLink: "varsheni/intro",
  instagram: "https://instagram.com/",
  youtube: "https://youtube.com/",
  rateCardPdf: "/rate-card.pdf",
  responseTime: "Usually replies within 48h",
  mailTemplates: [
    { id: "a", key: "collab", label: "Brand collaboration", subject: "Subj", body: "Body" },
  ],
};

describe("mapContact", () => {
  it("maps the settings global onto the UI ContactInfo shape", () => {
    const contact = mapContact(settings as never);
    expect(contact).toEqual({
      email: "hello@varsheni.com",
      calLink: "varsheni/intro",
      instagram: "https://instagram.com/",
      youtube: "https://youtube.com/",
      rateCardPdf: "/rate-card.pdf",
      responseTime: "Usually replies within 48h",
    });
  });
});

describe("mapMailTemplates", () => {
  it("drops Payload's row ids and keeps the mailto fields", () => {
    expect(mapMailTemplates(settings as never)).toEqual([
      { key: "collab", label: "Brand collaboration", subject: "Subj", body: "Body" },
    ]);
  });

  it("returns an empty list when no templates are set", () => {
    expect(mapMailTemplates({ ...settings, mailTemplates: null } as never)).toEqual([]);
  });
});
