import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RateCard } from "@/components/contact/rate-card";
import { WhoIAm } from "@/components/about/who-i-am";
import { WhatIBring } from "@/components/about/what-i-bring";
import { CaseStudy } from "@/components/work/case-study";
import { Process } from "@/components/work/process";
import { MailComposer } from "@/components/contact/mail-composer";
import type { Package, ContactInfo } from "@/lib/contact-info";

vi.mock("@/components/LightRays", () => ({ default: () => null }));
vi.mock("@/components/SoftAurora", () => ({ default: () => null }));

const pkg = (n: number): Package => ({
  key: String(n),
  name: `Package ${n}`,
  blurb: "Blurb.",
  deliverables: ["One thing"],
  priceFrom: `from ₹${n}0,000`,
});

const RATE_CONTENT = {
  eyebrow: "Rate card",
  heading: "What working together looks like.",
  downloadLabel: "↓ Download rate card (PDF)",
};

describe("rate card — package count extremes", () => {
  it("renders all of them when an editor adds ten packages", () => {
    const many = Array.from({ length: 10 }, (_, i) => pkg(i + 1));
    render(<RateCard packages={many} rateCardPdf="" content={RATE_CONTENT} />);
    for (const p of many) {
      expect(screen.getByText(p.name)).toBeInTheDocument();
    }
  });

  it("renders a single package without leaving empty columns", () => {
    render(<RateCard packages={[pkg(1)]} rateCardPdf="" content={RATE_CONTENT} />);
    expect(screen.getByText("Package 1")).toBeInTheDocument();
  });

  it("hides the download button when no PDF has been uploaded", () => {
    render(<RateCard packages={[pkg(1)]} rateCardPdf="" content={RATE_CONTENT} />);
    expect(screen.queryByRole("link", { name: /rate card/i })).not.toBeInTheDocument();
  });

  it("shows the download button once a PDF exists", () => {
    render(
      <RateCard packages={[pkg(1)]} rateCardPdf="https://blob/rate.pdf" content={RATE_CONTENT} />,
    );
    expect(screen.getByRole("link", { name: /rate card/i })).toHaveAttribute(
      "href",
      "https://blob/rate.pdf",
    );
  });
});

describe("about — empty lists", () => {
  const whoIAm = {
    eyebrow: "Who I am",
    heading: "Where I come from.",
    paragraphs: [],
    education: [],
    qualifications: [],
    languages: [],
  };

  it("does not crash when every fact list is emptied", () => {
    render(<WhoIAm content={whoIAm} />);
    expect(screen.getByRole("heading", { name: /where i come from/i })).toBeInTheDocument();
  });

  it("hides a fact column that has no items", () => {
    render(<WhoIAm content={whoIAm} />);
    expect(screen.queryByText("Education")).not.toBeInTheDocument();
    expect(screen.queryByText("Languages")).not.toBeInTheDocument();
  });

  it("renders 'what I bring' with no items without crashing", () => {
    render(
      <WhatIBring content={{ eyebrow: "Bring", heading: "Reasons.", items: [] }} />,
    );
    expect(screen.getByRole("heading", { name: "Reasons." })).toBeInTheDocument();
  });
});

describe("work — empty lists", () => {
  it("renders the case study with no breakdown items", () => {
    render(
      <CaseStudy
        content={{
          eyebrow: "Case study",
          heading: "First deep-dive.",
          intro: "None yet.",
          badge: "In the works",
          coverTitle: "What it covers",
          items: [],
        }}
      />,
    );
    expect(screen.getByRole("heading", { name: "First deep-dive." })).toBeInTheDocument();
  });

  it("renders the process with no steps", () => {
    render(<Process content={{ eyebrow: "How", heading: "The way.", steps: [] }} />);
    expect(screen.getByRole("heading", { name: "The way." })).toBeInTheDocument();
  });
});

describe("mail composer — no templates", () => {
  const contact: ContactInfo = {
    email: "hello@example.com",
    calLink: "x/y",
    instagram: "https://instagram.com/",
    youtube: "https://youtube.com/",
    rateCardPdf: "",
    responseTime: "Replies within 48h",
  };
  const content = {
    heading: "Book a call.",
    composerEyebrow: "Write a note",
    composerHeading: "Tell me about it.",
    sendLabel: "Send email",
  };

  it("still renders a usable composer when every template is deleted", () => {
    render(<MailComposer contact={contact} templates={[]} content={content} />);
    expect(screen.getByLabelText("Subject")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /send email/i })).toBeInTheDocument();
  });

  it("shows the response time from settings", () => {
    render(<MailComposer contact={contact} templates={[]} content={content} />);
    expect(screen.getByText("Replies within 48h")).toBeInTheDocument();
  });
});
