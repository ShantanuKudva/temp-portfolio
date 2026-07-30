import { render, screen } from "@testing-library/react";
import { RateCard } from "@/components/contact/rate-card";
import type { Package } from "@/lib/contact-info";

const PACKAGES: Package[] = [
  {
    key: "1",
    name: "Single Review",
    blurb: "One product, one honest verdict.",
    deliverables: ["1 reel (30–60s)", "1 revision"],
    priceFrom: "from ₹25,000",
  },
  {
    key: "2",
    name: "Campaign Package",
    blurb: "A multi-touch push across a launch.",
    deliverables: ["3 reels", "2 revisions"],
    priceFrom: "from ₹75,000",
  },
];

const RATE_CARD_PDF = "/rate-card.pdf";

const CONTENT = {
  eyebrow: "Rate card",
  heading: "What working together looks like.",
  downloadLabel: "↓ Download rate card (PDF)",
};

test("RateCard renders every package with its name and 'from ₹' price", () => {
  render(<RateCard packages={PACKAGES} rateCardPdf={RATE_CARD_PDF} content={CONTENT} />);
  for (const p of PACKAGES) {
    expect(screen.getByText(p.name)).toBeInTheDocument();
    expect(screen.getByText(p.priceFrom)).toBeInTheDocument();
    expect(screen.getByText(p.deliverables[0])).toBeInTheDocument();
  }
});

test("RateCard links the PDF download to the configured rate card", () => {
  render(<RateCard packages={PACKAGES} rateCardPdf={RATE_CARD_PDF} content={CONTENT} />);
  const link = screen.getByRole("link", { name: /rate card/i });
  expect(link).toHaveAttribute("href", RATE_CARD_PDF);
});

test("RateCard renders nothing but the section when there are no packages", () => {
  render(<RateCard packages={[]} rateCardPdf={RATE_CARD_PDF} content={CONTENT} />);
  expect(screen.queryByText("Single Review")).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: /rate card/i })).toBeInTheDocument();
});
