import type { GlobalConfig } from "payload";

export const Home: GlobalConfig = {
  slug: "home",
  label: "Page copy",
  admin: {
    group: "Home page",
    description:
      "The landing page is almost entirely image and motion — the only words on it are the name that flickers on like a neon sign.",
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      maxLength: 30,
      admin: {
        description:
          "Shown in the handwritten neon script. Keep it short — long names overflow on phones.",
      },
    },
    {
      name: "portraitAlt",
      type: "text",
      required: true,
      maxLength: 120,
      admin: {
        description:
          "Describes the cut-out photo for screen readers and search engines. Not visible on the page.",
      },
    },
  ],
};
