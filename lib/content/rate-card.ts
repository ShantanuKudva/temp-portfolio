import { getPayloadClient } from "@/lib/payload";
import { mapPackage } from "@/lib/content/map/rate-card";
import type { Package } from "@/lib/contact-info";

export { mapPackage };

export const getPackages = async (): Promise<Package[]> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "rate-card-packages",
    limit: 50,
    sort: "order",
  });
  return docs.map(mapPackage);
};
