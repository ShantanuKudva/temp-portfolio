import { describe, it, expect } from "vitest";
import { REELS, FEATURED, WALL_ROWS, type Reel } from "@/lib/work";

describe("work reel data", () => {
  it("has at least 9 reels", () => {
    expect(REELS.length).toBeGreaterThanOrEqual(9);
  });
  it("has exactly one featured reel and FEATURED points at it", () => {
    const featured = REELS.filter((r) => r.featured);
    expect(featured).toHaveLength(1);
    expect(FEATURED).toBe(featured[0]);
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
  it("WALL_ROWS partitions the non-featured reels across two rows", () => {
    const [a, b] = WALL_ROWS;
    expect(a.length).toBeGreaterThan(0);
    expect(b.length).toBeGreaterThan(0);
    expect(a.length + b.length).toBe(REELS.filter((r) => !r.featured).length);
    expect([...a, ...b].every((r) => !r.featured)).toBe(true);
  });
});
