import { getPayloadClient } from "@/lib/payload";
import { mapReel, groupByCategory } from "@/lib/content/map/reels";
import type { Reel, ReelCategory } from "@/lib/work";

export { mapReel, groupByCategory };

export const getReels = async (): Promise<Reel[]> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "reels",
    limit: 200,
    sort: "order",
    depth: 1,
  });
  return docs.map(mapReel);
};

export const getReelCategories = async (): Promise<ReelCategory[]> =>
  groupByCategory(await getReels());
