import type { CollectionConfig } from "payload";

export const Videos: CollectionConfig = {
  slug: "videos",
  admin: { useAsTitle: "filename", group: "Uploads" },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  upload: {
    mimeTypes: ["video/mp4"],
  },
  fields: [],
};
