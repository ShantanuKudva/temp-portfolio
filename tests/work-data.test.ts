import { describe, it, expect } from "vitest";
import { REELS, REEL_CATEGORIES, type Reel } from "@/lib/work";

describe("work reel data", () => {
  it("is a curated set", () => {
    expect(REELS.length).toBeGreaterThanOrEqual(2);
    expect(REELS.length).toBeLessThanOrEqual(30);
  });
  it("every reel has non-empty required fields and a valid kind", () => {
    for (const r of REELS) {
      for (const k of ["id", "title", "subject", "poster", "src", "category"] as const) {
        expect((r as Reel)[k]).toBeTruthy();
      }
      expect(["app", "business"]).toContain(r.kind);
    }
  });
  it("reel ids are unique", () => {
    expect(new Set(REELS.map((r) => r.id)).size).toBe(REELS.length);
  });
  it("groups every reel into a non-empty category", () => {
    expect(REEL_CATEGORIES.length).toBeGreaterThan(0);
    const grouped = REEL_CATEGORIES.flatMap((c) => c.reels);
    expect(grouped.length).toBe(REELS.length);
    for (const c of REEL_CATEGORIES) {
      expect(c.label).toBeTruthy();
      expect(c.reels.length).toBeGreaterThan(0);
    }
  });
});
