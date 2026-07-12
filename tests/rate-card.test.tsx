import { render, screen } from "@testing-library/react";
import { RateCard } from "@/components/contact/rate-card";
import { PACKAGES, CONTACT } from "@/lib/contact-info";

test("RateCard renders every package with its name and 'from ₹' price", () => {
  render(<RateCard />);
  for (const p of PACKAGES) {
    expect(screen.getByText(p.name)).toBeInTheDocument();
    expect(screen.getByText(p.priceFrom)).toBeInTheDocument();
    expect(screen.getByText(p.deliverables[0])).toBeInTheDocument();
  }
});

test("RateCard links the PDF download to CONTACT.rateCardPdf", () => {
  render(<RateCard />);
  const link = screen.getByRole("link", { name: /rate card/i });
  expect(link).toHaveAttribute("href", CONTACT.rateCardPdf);
});
