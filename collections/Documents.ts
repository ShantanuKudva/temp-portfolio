import type { CollectionConfig } from "payload";

export const Documents: CollectionConfig = {
  slug: "documents",
  admin: {
    useAsTitle: "filename",
    // Hidden like the other upload collections: rows are created implicitly
    // when a file is attached elsewhere. Reachable at
    // /admin/collections/documents for clearing out unused files.
    hidden: true,
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  upload: {
    mimeTypes: ["application/pdf"],
  },
  fields: [],
};
