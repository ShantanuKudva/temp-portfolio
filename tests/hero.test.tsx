import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/hero/hero";

test("Hero renders as a banner with the name, subject alt, and CTAs", () => {
  render(<Hero />);
  expect(screen.getByRole("banner")).toBeInTheDocument();
  expect(screen.getByText("Varsheni")).toBeInTheDocument();
  expect(screen.getByAltText(/tech ugc creator/i)).toBeInTheDocument();
  expect(screen.getByText(/available for brand deals/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /work with me/i })).toBeInTheDocument();
});
