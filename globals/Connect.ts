import type { GlobalConfig } from "payload";

export const Connect: GlobalConfig = {
  slug: "connect",
  label: "Page copy",
  admin: {
    group: "Connect page",
    description:
      "All the writing on your Connect page — the headline at the top, the section headings, and the closing marquee. Your prices live under 'Rate card', and your email and links under 'Contact & links'.",
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
        { name: "intro", type: "textarea", required: true, maxLength: 400 },
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
      name: "rateCard",
      label: "Rate card section",
      fields: [
        { name: "eyebrow", type: "text", required: true, maxLength: 60 },
        { name: "heading", type: "text", required: true, maxLength: 120 },
        {
          name: "downloadLabel",
          type: "text",
          required: true,
          maxLength: 60,
          admin: { description: "The button under the pricing tiles." },
        },
      ],
    },
    {
      type: "group",
      name: "booking",
      label: "Booking section",
      fields: [
        { name: "heading", type: "text", required: true, maxLength: 120 },
        {
          name: "composerEyebrow",
          type: "text",
          required: true,
          maxLength: 60,
          admin: { description: "Above the email box, next to the calendar." },
        },
        { name: "composerHeading", type: "text", required: true, maxLength: 60 },
        { name: "sendLabel", type: "text", required: true, maxLength: 40 },
      ],
    },
    {
      type: "group",
      name: "close",
      label: "Closing marquee",
      fields: [
        {
          name: "marqueeText",
          type: "text",
          required: true,
          maxLength: 120,
          admin: {
            description:
              "Scrolls in a curve at the bottom of the page and repeats, so end it with a space.",
          },
        },
      ],
    },
  ],
};
