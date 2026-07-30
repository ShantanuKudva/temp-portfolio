import type { GlobalConfig } from "payload";

export const About: GlobalConfig = {
  slug: "about",
  label: "About Page",
  admin: { group: "Content" },
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
  ],
};
