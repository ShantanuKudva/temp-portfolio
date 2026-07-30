import { getPayloadClient } from "@/lib/payload";
import { mapWork } from "@/lib/content/map/work";
import type { WorkContent } from "@/lib/content/map/work";

export { mapWork };
export type { WorkContent, LabelledItem, StepItem } from "@/lib/content/map/work";

export const getWorkContent = async (): Promise<WorkContent> => {
  const payload = await getPayloadClient();
  return mapWork(await payload.findGlobal({ slug: "work" }));
};
