import type { CollectionConfig } from "payload";

export const RateCardPackages: CollectionConfig = {
  slug: "rate-card-packages",
  labels: { singular: "Rate Card Package", plural: "Rate Card Packages" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "priceFrom", "order"],
    group: "Content",
  },
  defaultSort: "order",
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: "name", type: "text", required: true, maxLength: 40 },
    { name: "blurb", type: "text", required: true, maxLength: 120 },
    {
      name: "deliverables",
      type: "array",
      required: true,
      minRows: 1,
      maxRows: 8,
      fields: [{ name: "item", type: "text", required: true, maxLength: 60 }],
    },
    {
      name: "priceFrom",
      type: "text",
      required: true,
      maxLength: 40,
      admin: { description: 'Shown verbatim, e.g. "from ₹25,000".' },
    },
    { name: "order", type: "number", required: true, defaultValue: 0 },
  ],
};
