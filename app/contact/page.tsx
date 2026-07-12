import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = {
  title: "Contact — Varsheni",
  description: "Work with Varsheni — brand deals, honest reviews, and collaborations.",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Connect"
      title="Let's make something honest."
      blurb="Booking and inquiries are opening up here shortly. In the meantime, the door's open — this is where we'll talk brand deals and collaborations."
      accent="var(--color-amber-dot)"
    />
  );
}
