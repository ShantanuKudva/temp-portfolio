import { Hero } from "@/components/hero/hero";
import { getHomeContent } from "@/lib/content/connect";

// Content is CMS-driven and must reflect admin edits immediately.
export const dynamic = "force-dynamic";

export default async function Page() {
  const content = await getHomeContent();
  return (
    <main className="flex-1">
      <Hero content={content} />
    </main>
  );
}
