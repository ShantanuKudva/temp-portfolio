import { describe, it, expect } from "vitest";
import { mapReel, groupByCategory } from "@/lib/content/map/reels";

const doc = {
  id: 7,
  title: "Is the hype worth your credit score?",
  subject: "CRED",
  kind: "app",
  category: "Money & fintech",
  href: null,
  order: 0,
  video: { id: 1, url: "https://blob.example/cred.mp4" },
  poster: { id: 2, url: "https://blob.example/cred.jpg" },
};

describe("mapReel", () => {
  it("maps a Payload doc onto the UI Reel shape", () => {
    const reel = mapReel(doc as never);
    expect(reel).toEqual({
      id: "7",
      title: "Is the hype worth your credit score?",
      subject: "CRED",
      kind: "app",
      category: "Money & fintech",
      poster: "https://blob.example/cred.jpg",
      src: "https://blob.example/cred.mp4",
      href: undefined,
    });
  });

  it("falls back to empty media strings when an upload is missing", () => {
    const reel = mapReel({ ...doc, video: null, poster: null } as never);
    expect(reel.src).toBe("");
    expect(reel.poster).toBe("");
  });

  it("falls back to empty media strings when an upload is an unpopulated id", () => {
    const reel = mapReel({ ...doc, video: 1, poster: 2 } as never);
    expect(reel.src).toBe("");
    expect(reel.poster).toBe("");
  });
});

describe("groupByCategory", () => {
  it("groups reels in the declared category order and drops empty groups", () => {
    const reels = [
      { ...mapReel(doc as never), category: "Ed-tech" },
      { ...mapReel(doc as never), category: "Money & fintech" },
    ];
    const groups = groupByCategory(reels);
    expect(groups.map((g) => g.label)).toEqual(["Money & fintech", "Ed-tech"]);
    expect(groups.every((g) => g.reels.length > 0)).toBe(true);
  });

  it("returns an empty array when there are no reels", () => {
    expect(groupByCategory([])).toEqual([]);
  });
});
