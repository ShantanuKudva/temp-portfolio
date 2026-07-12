import { describe, it, expect } from "vitest";
import { REELS, type Reel } from "@/lib/work";

describe("work reel data", () => {
  it("is a small curated set", () => {
    expect(REELS.length).toBeGreaterThanOrEqual(2);
    expect(REELS.length).toBeLessThanOrEqual(6);
  });
  it("every reel has non-empty required fields and a valid kind", () => {
    for (const r of REELS) {
      for (const k of ["id", "title", "subject", "poster", "src"] as const) {
        expect((r as Reel)[k]).toBeTruthy();
      }
      expect(["app", "business"]).toContain(r.kind);
    }
  });
  it("reel ids are unique", () => {
    expect(new Set(REELS.map((r) => r.id)).size).toBe(REELS.length);
  });
});
