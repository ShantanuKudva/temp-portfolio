import { getPayloadClient } from "@/lib/payload";
import { mapAbout } from "@/lib/content/map/about";
import type { AboutContent } from "@/lib/content/map/about";

export { mapAbout };
export type { AboutContent, TitledItem } from "@/lib/content/map/about";

export const getAboutContent = async (): Promise<AboutContent> => {
  const payload = await getPayloadClient();
  return mapAbout(await payload.findGlobal({ slug: "about" }));
};
