import type { GlobalConfig } from "payload";

export const About: GlobalConfig = {
  slug: "about",
  label: "Page copy",
  admin: {
    group: "About page",
    description:
      "Every piece of writing on your About page, section by section. Edit any field and the live site updates as soon as you save.",
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      type: "group",
      name: "hero",
      label: "Hero",
      fields: [
        { name: "availability", type: "text", required: true, maxLength: 60 },
        { name: "eyebrow", type: "text", required: true, maxLength: 60 },
        { name: "headline", type: "text", required: true, maxLength: 120 },
        { name: "intro", type: "textarea", required: true, maxLength: 600 },
        {
          name: "bio",
          type: "array",
          label: "Bio paragraphs",
          minRows: 1,
          maxRows: 4,
          fields: [{ name: "text", type: "textarea", required: true, maxLength: 600 }],
        },
        { name: "signature", type: "text", required: true, maxLength: 60 },
      ],
    },
    {
      type: "group",
      name: "whoIAm",
      label: "Who I Am",
      fields: [
        { name: "eyebrow", type: "text", required: true, maxLength: 60 },
        { name: "heading", type: "text", required: true, maxLength: 120 },
        {
          name: "paragraphs",
          type: "array",
          minRows: 1,
          maxRows: 4,
          fields: [{ name: "text", type: "textarea", required: true, maxLength: 600 }],
        },
        {
          name: "education",
          type: "array",
          minRows: 1,
          maxRows: 8,
          fields: [{ name: "item", type: "text", required: true, maxLength: 80 }],
        },
        {
          name: "qualifications",
          type: "array",
          minRows: 1,
          maxRows: 8,
          fields: [{ name: "item", type: "text", required: true, maxLength: 80 }],
        },
        {
          name: "languages",
          type: "array",
          minRows: 1,
          maxRows: 10,
          fields: [{ name: "item", type: "text", required: true, maxLength: 30 }],
        },
      ],
    },
    {
      type: "group",
      name: "values",
      label: "What I Stand For",
      fields: [
        { name: "eyebrow", type: "text", required: true, maxLength: 60 },
        {
          name: "items",
          type: "array",
          minRows: 1,
          maxRows: 8,
          fields: [
            { name: "title", type: "text", required: true, maxLength: 60 },
            { name: "body", type: "textarea", required: true, maxLength: 400 },
          ],
        },
      ],
    },
    {
      type: "group",
      name: "bring",
      label: "What I Bring",
      fields: [
        { name: "eyebrow", type: "text", required: true, maxLength: 60 },
        {
          name: "heading",
          type: "text",
          required: true,
          maxLength: 120,
          admin: {
            description:
              "Mentions how many reasons there are, so update it if you add or remove items below.",
          },
        },
        {
          name: "items",
          type: "array",
          minRows: 1,
          maxRows: 8,
          fields: [
            { name: "title", type: "text", required: true, maxLength: 60 },
            { name: "body", type: "textarea", required: true, maxLength: 400 },
          ],
        },
      ],
    },
    {
      type: "group",
      name: "quote",
      label: "Pull Quote",
      fields: [
        { name: "text", type: "textarea", required: true, maxLength: 300 },
        { name: "attribution", type: "text", required: true, maxLength: 60 },
      ],
    },
    {
      type: "group",
      name: "radar",
      label: "On My Radar",
      admin: {
        description:
          "Headings for the scrolling logo wall. The logos themselves are set in code.",
      },
      fields: [
        { name: "eyebrow", type: "text", required: true, maxLength: 60 },
        { name: "heading", type: "text", required: true, maxLength: 120 },
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
          admin: { description: "The outlined button. Always links to the Work page." },
        },
      ],
    },
    {
      type: "group",
      name: "images",
      label: "Photos",
      admin: {
        description:
          "The three photos of you on this page. Replace any of them by uploading a new file — the layout and effects stay the same.",
      },
      fields: [
        {
          name: "portrait",
          type: "upload",
          relationTo: "media",
          label: "Main portrait",
          admin: {
            description:
              "The tall photo down the left side. Portrait orientation works best; it is cropped to fill the column.",
          },
        },
        {
          name: "quotePortrait",
          type: "upload",
          relationTo: "media",
          label: "Photo beside the quote",
          admin: { description: "Small square, next to the pull quote and wax seal." },
        },
        {
          name: "bringPortrait",
          type: "upload",
          relationTo: "media",
          label: "Photo in 'What I bring'",
          admin: { description: "Sits beside that section's heading. Roughly 4:5." },
        },
      ],
    },
    {
      type: "group",
      name: "props",
      label: "Small decorative text",
      admin: {
        description:
          "Tiny flourishes: the sideways label running up the left edge, and the words circling the rotating wax seal.",
      },
      fields: [
        { name: "sideLabel", type: "text", required: true, maxLength: 80 },
        {
          name: "sealText",
          type: "text",
          required: true,
          maxLength: 90,
          admin: { description: "Wraps a circle, so keep it short or it will overlap." },
        },
      ],
    },
  ],
};
