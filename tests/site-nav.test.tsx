import { render, screen } from "@testing-library/react";
import { SiteNav } from "@/components/site-nav";

test("SiteNav exposes a navigation landmark with the brand + links", () => {
  render(<SiteNav />);
  expect(screen.getByRole("navigation")).toBeInTheDocument();
  expect(screen.getByText("Varsheni")).toBeInTheDocument();
  ["Work", "About", "Reels"].forEach((label) =>
    expect(screen.getByRole("link", { name: label })).toBeInTheDocument()
  );
  expect(screen.getByRole("link", { name: /inquire/i })).toHaveAttribute("href", "#contact");
});
