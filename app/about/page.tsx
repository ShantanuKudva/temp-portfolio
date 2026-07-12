import type { Metadata } from "next";
import { AboutPage } from "@/components/about/about-page";

export const metadata: Metadata = {
  title: "About — Varsheni",
  description:
    "Meet Varsheni, a tech UGC creator making honest reviews of the apps and businesses worth your attention.",
};

export default function Page() {
  return <AboutPage />;
}
