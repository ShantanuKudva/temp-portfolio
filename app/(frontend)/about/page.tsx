import type { Metadata } from "next";
import { AboutPage } from "@/components/about/about-page";
import { getAboutContent } from "@/lib/content/about";

// Content is CMS-driven and must reflect admin edits immediately.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About — Varsheni",
  description:
    "Meet Varsheni, a tech UGC creator making honest reviews of the apps and businesses worth your attention.",
};

export default async function Page() {
  const content = await getAboutContent();
  return <AboutPage content={content} />;
}
