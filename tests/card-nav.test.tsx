import { render, screen, fireEvent } from "@testing-library/react";
import { CardNav } from "@/components/card-nav";

test("CardNav shows the logotype, an inquire link, and a collapsed menu", () => {
  render(<CardNav />);
  expect(screen.getByText("Varsheni")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /inquire/i })).toHaveAttribute("href", "#contact");
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
