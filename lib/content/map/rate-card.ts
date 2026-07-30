import type { Package } from "@/lib/contact-info";
import type { RateCardPackage } from "@/payload-types";

export const mapPackage = (doc: RateCardPackage): Package => ({
  key: String(doc.id),
  name: doc.name,
  blurb: doc.blurb,
  priceFrom: doc.priceFrom,
  deliverables: (doc.deliverables ?? []).map((d) => d.item),
});
