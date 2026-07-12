import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/hero/hero";

test("Hero renders as a banner with the name, subject alt, and CTAs", () => {
  render(<Hero />);
  expect(screen.getByRole("banner")).toBeInTheDocument();
  // "Varsheni" appears twice by design — the nav logotype and the hero wordmark.
  expect(screen.getAllByText("Varsheni").length).toBeGreaterThanOrEqual(2);
  expect(screen.getByAltText(/tech ugc creator/i)).toBeInTheDocument();
  expect(screen.getByText(/available for brand deals/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /work with me/i })).toBeInTheDocument();
});
