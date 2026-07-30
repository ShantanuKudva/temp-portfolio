import type { Metadata } from "next";
import { WorkPage } from "@/components/work/work-page";
import { getReelCategories } from "@/lib/content/reels";
import { getWorkContent } from "@/lib/content/work";

// Content is CMS-driven and must reflect admin edits immediately.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Work — Varsheni",
  description: "Reels and honest reviews of the apps and businesses worth your tap.",
};

export default async function Page() {
  const [categories, content] = await Promise.all([
    getReelCategories(),
    getWorkContent(),
  ]);
  return <WorkPage categories={categories} content={content} />;
}
