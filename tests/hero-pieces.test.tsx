import { render, screen } from "@testing-library/react";
import { NeonName } from "@/components/hero/neon-name";
import { WaxSeal } from "@/components/hero/wax-seal";

test("NeonName renders the given name text", () => {
  render(<NeonName>Varsheni</NeonName>);
  expect(screen.getByText("Varsheni")).toBeInTheDocument();
});

test("WaxSeal is an accessible link to contact", () => {
  render(<WaxSeal />);
  const link = screen.getByRole("link", { name: /work with me/i });
  expect(link).toHaveAttribute("href", "#contact");
});
