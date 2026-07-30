import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { WorkPage } from "@/components/work/work-page";
import type { ReelCategory } from "@/lib/work";
import type { WorkContent } from "@/lib/content/map/work";

vi.mock("@/components/ColorBends", () => ({ default: () => null }));
vi.mock("@/components/SoftAurora", () => ({ default: () => null }));
vi.mock("@/components/ElasticSlider", () => ({ ElasticSlider: () => null }));

const CATEGORIES: ReelCategory[] = [
  {
    label: "Money & fintech",
    reels: [
      {
        id: "1",
        title: "Is the hype worth your credit score?",
        subject: "CRED",
        kind: "app",
        category: "Money & fintech",
        poster: "/p.jpg",
        src: "/v.mp4",
      },
    ],
  },
];


const CONTENT: WorkContent = {
  hero: {
    eyebrow: "The Work",
    script: "press play",
    headline: "Reviews worth your tap.",
    intro: "Every reel is an app or a business I actually lived with.",
    availability: "Available for brand deals",
  },
  gallery: {
    eyebrow: "The gallery",
    heading: "Reviews, grouped by what they are.",
    emptyState: "New reels are on the way — check back soon.",
  },
  caseStudy: {
    eyebrow: "Case study",
    heading: "The first deep-dive lands here.",
    intro: "No case studies yet.",
    badge: "First one in the works",
    coverTitle: "What a breakdown will cover",
    items: [{ label: "The brief", body: "The goal and the audience." }],
  },
  process: {
    eyebrow: "How the reels get made",
    heading: "From brief to your feed — the honest way.",
    steps: [{ title: "The brief", body: "We align on goals up front." }],
  },
  cta: {
    script: "seen enough?",
    heading: "Let's make something honest.",
    primaryLabel: "Work with me ↗",
    secondaryLabel: "Read her story →",
  },
};

describe("WorkPage", () => {
  it("renders the hero headline", () => {
    render(<WorkPage categories={CATEGORIES} content={CONTENT} />);
    expect(
      screen.getByRole("heading", { name: /reviews worth your tap/i }),
    ).toBeInTheDocument();
  });

  it("links to /contact in the closing CTA", () => {
    render(<WorkPage categories={CATEGORIES} content={CONTENT} />);
    const cta = screen.getByRole("link", { name: /work with me/i });
    expect(cta).toHaveAttribute("href", "/contact");
  });

  it("renders the reel category and its reels", () => {
    render(<WorkPage categories={CATEGORIES} content={CONTENT} />);
    expect(
      screen.getByRole("heading", { name: "Money & fintech" }),
    ).toBeInTheDocument();
  });

  it("shows an empty state instead of the gallery when there are no reels", () => {
    render(<WorkPage categories={[]} content={CONTENT} />);
    expect(screen.getByText(/new reels are on the way/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Money & fintech" }),
    ).not.toBeInTheDocument();
  });
});
