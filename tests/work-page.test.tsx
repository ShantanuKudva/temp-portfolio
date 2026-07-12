import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { WorkPage } from "@/components/work/work-page";

vi.mock("@/components/ColorBends", () => ({ default: () => null }));
vi.mock("@/components/SoftAurora", () => ({ default: () => null }));
vi.mock("@/components/ElasticSlider", () => ({ ElasticSlider: () => null }));

describe("WorkPage", () => {
  it("renders the hero headline", () => {
    render(<WorkPage />);
    expect(
      screen.getByRole("heading", { name: /reviews worth your tap/i }),
    ).toBeInTheDocument();
  });
  it("links to /contact in the closing CTA", () => {
    render(<WorkPage />);
    const cta = screen.getByRole("link", { name: /work with me/i });
    expect(cta).toHaveAttribute("href", "/contact");
  });
});
