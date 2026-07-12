import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import type { ReactNode } from "react";
import { CardNav } from "@/components/card-nav";

// The nav's WebGL/canvas backdrops (three / ogl) can't run under jsdom — stub
// them so these tests exercise the nav's markup + toggle behaviour, not shaders.
vi.mock("@/components/nav-card-bg", () => ({
  NavCardBg: () => null,
}));
vi.mock("@/components/GlassSurface", () => ({
  default: ({ children }: { children?: ReactNode }) => children,
}));

test("CardNav shows the logotype, an inquire link, and a collapsed menu", () => {
  render(<CardNav />);
  expect(screen.getByText("Varsheni")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /inquire/i })).toHaveAttribute("href", "/contact");
  const toggle = screen.getByRole("button", { name: /open menu/i });
  expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("CardNav toggles open when the hamburger is clicked", () => {
  render(<CardNav />);
  const toggle = screen.getByRole("button", { name: /open menu/i });
  fireEvent.click(toggle);
  expect(
    screen.getByRole("button", { name: /close menu/i })
  ).toHaveAttribute("aria-expanded", "true");
});
