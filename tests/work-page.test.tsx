import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { WorkPage } from "@/components/work/work-page";
import type { ReelCategory } from "@/lib/work";

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

describe("WorkPage", () => {
  it("renders the hero headline", () => {
    render(<WorkPage categories={CATEGORIES} />);
    expect(
      screen.getByRole("heading", { name: /reviews worth your tap/i }),
    ).toBeInTheDocument();
  });

  it("links to /contact in the closing CTA", () => {
    render(<WorkPage categories={CATEGORIES} />);
    const cta = screen.getByRole("link", { name: /work with me/i });
    expect(cta).toHaveAttribute("href", "/contact");
  });

  it("renders the reel category and its reels", () => {
    render(<WorkPage categories={CATEGORIES} />);
    expect(
      screen.getByRole("heading", { name: "Money & fintech" }),
    ).toBeInTheDocument();
  });

  it("shows an empty state instead of the gallery when there are no reels", () => {
    render(<WorkPage categories={[]} />);
    expect(screen.getByText(/new reels are on the way/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Money & fintech" }),
    ).not.toBeInTheDocument();
  });
});
