import type { GlobalConfig } from "payload";

export const Work: GlobalConfig = {
  slug: "work",
  label: "Page copy",
  admin: {
    group: "Work page",
    description:
      "All the writing on your Work page — the headline at the top, the section intros, the case-study placeholder, the process steps, and the closing call to action. The reels themselves live under 'Reels'.",
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      type: "group",
      name: "hero",
      label: "Top of the page",
      fields: [
        { name: "eyebrow", type: "text", required: true, maxLength: 60 },
        {
          name: "script",
          type: "text",
          required: true,
          maxLength: 40,
          admin: { description: "The handwritten line above the headline." },
        },
        { name: "headline", type: "text", required: true, maxLength: 120 },
        { name: "intro", type: "textarea", required: true, maxLength: 600 },
        {
          name: "availability",
          type: "text",
          required: true,
          maxLength: 60,
          admin: { description: "The small pill with the pulsing dot." },
        },
      ],
    },
    {
      type: "group",
      name: "gallery",
      label: "Gallery section",
      fields: [
        { name: "eyebrow", type: "text", required: true, maxLength: 60 },
        { name: "heading", type: "text", required: true, maxLength: 120 },
        {
          name: "emptyState",
          type: "text",
          required: true,
          maxLength: 160,
          admin: { description: "Shown in place of the gallery when there are no reels." },
        },
      ],
    },
    {
      type: "group",
      name: "caseStudy",
      label: "Case study section",
      fields: [
        { name: "eyebrow", type: "text", required: true, maxLength: 60 },
        { name: "heading", type: "text", required: true, maxLength: 120 },
        { name: "intro", type: "textarea", required: true, maxLength: 600 },
        {
          name: "badge",
          type: "text",
          required: true,
          maxLength: 60,
          admin: { description: "The small pill inside the dashed box." },
        },
        { name: "coverTitle", type: "text", required: true, maxLength: 120 },
        {
          name: "items",
          type: "array",
          label: "What a breakdown will cover",
          minRows: 1,
          maxRows: 6,
          admin: { description: "Numbered automatically in the order listed here." },
          fields: [
            { name: "label", type: "text", required: true, maxLength: 60 },
            { name: "body", type: "textarea", required: true, maxLength: 400 },
          ],
        },
      ],
    },
    {
      type: "group",
      name: "process",
      label: "Process section",
      fields: [
        { name: "eyebrow", type: "text", required: true, maxLength: 60 },
        { name: "heading", type: "text", required: true, maxLength: 120 },
        {
          name: "steps",
          type: "array",
          minRows: 1,
          maxRows: 8,
          admin: { description: "Numbered automatically in the order listed here." },
          fields: [
            { name: "title", type: "text", required: true, maxLength: 60 },
            { name: "body", type: "textarea", required: true, maxLength: 400 },
          ],
        },
      ],
    },
    {
      type: "group",
      name: "cta",
      label: "Closing call to action",
      fields: [
        { name: "script", type: "text", required: true, maxLength: 40 },
        { name: "heading", type: "text", required: true, maxLength: 120 },
        {
          name: "primaryLabel",
          type: "text",
          required: true,
          maxLength: 40,
          admin: { description: "The filled button. Always links to the Connect page." },
        },
        {
          name: "secondaryLabel",
          type: "text",
          required: true,
          maxLength: 40,
          admin: { description: "The outlined button. Always links to the About page." },
        },
      ],
    },
  ],
};
