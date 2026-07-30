import { getPayloadClient } from "@/lib/payload";
import { mapConnect, mapHome } from "@/lib/content/map/connect";
import type { ConnectContent, HomeContent } from "@/lib/content/map/connect";

export { mapConnect, mapHome };
export type { ConnectContent, HomeContent } from "@/lib/content/map/connect";

export const getConnectContent = async (): Promise<ConnectContent> => {
  const payload = await getPayloadClient();
  return mapConnect(await payload.findGlobal({ slug: "connect" }));
};

export const getHomeContent = async (): Promise<HomeContent> => {
  const payload = await getPayloadClient();
  return mapHome(await payload.findGlobal({ slug: "home" }));
};
