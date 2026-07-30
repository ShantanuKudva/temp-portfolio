import type { CollectionConfig } from "payload";

export const Videos: CollectionConfig = {
  slug: "videos",
  admin: {
    useAsTitle: "filename",
    group: "Uploads",
    description:
      "Reel video files (MP4 only, up to 50MB each). Usually uploaded straight from a reel rather than added here directly.",
  },
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
