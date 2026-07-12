import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = {
  title: "Work — Varsheni",
  description: "Reels and honest reviews of the apps and businesses worth your tap.",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Work"
      title="The reel wall is being set up."
      blurb="Honest app & business reviews are on the way. Fresh reels drop here soon — come back to watch what's worth your tap."
      accent="var(--color-wine)"
    />
  );
}
