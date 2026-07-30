import { describe, it, expect } from "vitest";
import { mapReel, groupByCategory } from "@/lib/content/map/reels";
import type { Reel } from "@/lib/work";

const make = (over: Partial<Reel> & { id: string }): Reel => ({
  title: "t",
  subject: "s",
  kind: "app",
  category: "Money & fintech",
  poster: "/p.jpg",
  src: "/v.mp4",
  ...over,
});

describe("reel shaping", () => {
  it("keeps every reel's required fields non-empty and its kind valid", () => {
    const reel = mapReel({
      id: 1,
      title: "T",
      subject: "S",
      kind: "business",
      category: "Ed-tech",
      href: null,
      order: 0,
      video: { id: 1, url: "/v.mp4" },
      poster: { id: 2, url: "/p.jpg" },
    } as never);

    for (const k of ["id", "title", "subject", "poster", "src", "category"] as const) {
      expect(reel[k]).toBeTruthy();
    }
    expect(["app", "business"]).toContain(reel.kind);
  });

  it("groups every reel into a non-empty category", () => {
    const reels = [make({ id: "1" }), make({ id: "2", category: "Ed-tech" })];
    const groups = groupByCategory(reels);
    expect(groups.flatMap((c) => c.reels).length).toBe(reels.length);
    for (const c of groups) {
      expect(c.label).toBeTruthy();
      expect(c.reels.length).toBeGreaterThan(0);
    }
  });

  it("drops reels whose category is not a known gallery category", () => {
    const groups = groupByCategory([make({ id: "1", category: "Nonexistent" })]);
    expect(groups).toEqual([]);
  });
});
