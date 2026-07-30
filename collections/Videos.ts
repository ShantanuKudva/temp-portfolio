import type { CollectionConfig } from "payload";

export const Videos: CollectionConfig = {
  slug: "videos",
  admin: {
    useAsTitle: "filename",
    // Hidden from the sidebar: these rows are created implicitly when a file is
    // attached to a reel, so surfacing them as their own section is noise for a
    // non-technical editor. Still reachable at /admin/collections/<slug> for
    // clearing out unused files.
    hidden: true,
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
