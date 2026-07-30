import { getPayloadClient } from "@/lib/payload";
import { mapContact, mapMailTemplates } from "@/lib/content/map/site-settings";
import type { ContactInfo, MailTemplate } from "@/lib/contact-info";
import type { SiteSetting } from "@/payload-types";

export { mapContact, mapMailTemplates };

const getSettings = async (): Promise<SiteSetting> => {
  const payload = await getPayloadClient();
  return payload.findGlobal({ slug: "site-settings" });
};

export const getContact = async (): Promise<ContactInfo> => mapContact(await getSettings());

export const getMailTemplates = async (): Promise<MailTemplate[]> =>
  mapMailTemplates(await getSettings());
