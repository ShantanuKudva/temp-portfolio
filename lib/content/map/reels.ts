import { CATEGORY_OPTIONS } from "@/collections/Reels";
import type { Reel, ReelCategory, ReelKind } from "@/lib/work";
import type { Reel as PayloadReel } from "@/payload-types";

/**
 * Pure Payload-doc → UI-shape mapping. Kept free of any Payload runtime import
 * so unit tests never boot the CMS config.
 */

const mediaUrl = (value: PayloadReel["poster"] | PayloadReel["video"]): string =>
  typeof value === "object" && value !== null && "url" in value ? (value.url ?? "") : "";

export const mapReel = (doc: PayloadReel): Reel => ({
  id: String(doc.id),
  title: doc.title,
  subject: doc.subject,
  kind: doc.kind as ReelKind,
  category: doc.category,
  poster: mediaUrl(doc.poster),
  src: mediaUrl(doc.video),
  href: doc.href ?? undefined,
});

export const groupByCategory = (reels: Reel[]): ReelCategory[] =>
  CATEGORY_OPTIONS.map((label) => ({
    label,
    reels: reels.filter((r) => r.category === label),
  })).filter((c) => c.reels.length > 0);
