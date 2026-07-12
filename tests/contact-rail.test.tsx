import { render, screen } from "@testing-library/react";
import { ContactRail } from "@/components/contact/contact-rail";
import { CONTACT } from "@/lib/contact-info";

test("ContactRail renders a mailto link, both socials, and the response time", () => {
  render(<ContactRail />);

  const email = screen.getByRole("link", { name: /email/i });
  expect(email).toHaveAttribute("href", `mailto:${CONTACT.email}`);

  const ig = screen.getByRole("link", { name: /instagram/i });
  expect(ig).toHaveAttribute("href", CONTACT.instagram);
  expect(ig).toHaveAttribute("target", "_blank");

  const yt = screen.getByRole("link", { name: /youtube/i });
  expect(yt).toHaveAttribute("href", CONTACT.youtube);

  expect(screen.getByText(CONTACT.responseTime)).toBeInTheDocument();
});
