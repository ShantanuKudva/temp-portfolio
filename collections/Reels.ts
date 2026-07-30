import type { CollectionConfig } from "payload";

export const CATEGORY_OPTIONS = [
  "Money & fintech",
  "AI & creator tools",
  "Commerce & brands",
  "Ed-tech",
  "Health & fitness",
  "Real estate",
  "SaaS & B2B",
] as const;

export const Reels: CollectionConfig = {
  slug: "reels",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "subject", "category", "order"],
    group: "Work page",
    description:
      "Everything in the gallery on your Work page. Each reel needs a video file and a poster image — the still shown before it plays. Reels are grouped on the site by category, and 'order' decides which comes first inside a group: lower numbers appear earlier.",
  },
  defaultSort: "order",
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      maxLength: 80,
      admin: { description: "The hook / review headline." },
    },
    {
      name: "subject",
      type: "text",
      required: true,
      maxLength: 40,
      admin: { description: "The app or business being reviewed." },
    },
    {
      name: "category",
      type: "select",
      required: true,
      options: CATEGORY_OPTIONS.map((c) => ({ label: c, value: c })),
    },
    {
      name: "kind",
      type: "select",
      required: true,
      defaultValue: "app",
      options: [
        { label: "App", value: "app" },
        { label: "Business", value: "business" },
      ],
    },
    {
      name: "video",
      type: "upload",
      relationTo: "videos",
      required: true,
    },
    {
      name: "poster",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: { description: "9:16 still shown before the video plays." },
    },
    {
      name: "href",
      type: "text",
      admin: { description: "Optional link to the original Instagram / YouTube post." },
    },
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 0,
      admin: { description: "Lower numbers appear first within the category." },
    },
  ],
};
