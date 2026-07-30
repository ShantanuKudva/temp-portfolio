import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "filename",
    // Hidden from the sidebar: these rows are created implicitly when a file is
    // attached to a reel, so surfacing them as their own section is noise for a
    // non-technical editor. Still reachable at /admin/collections/<slug> for
    // clearing out unused files.
    hidden: true,
    description:
      "Images used across the site, including reel posters. Uploaded automatically when you attach an image elsewhere — you rarely need to add anything here by hand.",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  upload: {
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      maxLength: 120,
      admin: { description: "Describes the image for screen readers." },
    },
  ],
};
