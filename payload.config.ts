import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { mcpPlugin } from "@payloadcms/plugin-mcp";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Videos } from "./collections/Videos";
import { Documents } from "./collections/Documents";
import { Reels } from "./collections/Reels";
import { RateCardPackages } from "./collections/RateCardPackages";
import { About } from "./globals/About";
import { Work } from "./globals/Work";
import { Connect } from "./globals/Connect";
import { Home } from "./globals/Home";
import { SiteSettings } from "./globals/SiteSettings";
import { overrideMcpApiKeys } from "./lib/payload-mcp-polish";
import { uploadFromUrlTool } from "./lib/mcp-upload-tool";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections: [Users, Media, Videos, Documents, Reels, RateCardPackages],
  globals: [Home, Work, About, Connect, SiteSettings],
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL },
  }),
  upload: {
    limits: { fileSize: 52428800 },
  },
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: true,
      // `disablePayloadAccessControl` serves files straight from the Blob CDN
      // instead of streaming them through a serverless function. Both
      // collections are already public-read, so this changes no access
      // posture — it just keeps 10MB reel videos off the function path.
      collections: {
        media: { disablePayloadAccessControl: true },
        videos: { disablePayloadAccessControl: true },
        documents: { disablePayloadAccessControl: true },
      },
      clientUploads: true,
      // Uploads keep whatever filename the editor's file had, so without a
      // suffix two reels with a poster named "poster.jpg" would overwrite each
      // other. A random suffix makes every stored object unique.
      addRandomSuffix: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
    // Lets Claude edit over MCP with the same access control and validation as
    // the admin UI. Every entity is reachable, `users` included — so a key also
    // grants account management, not just content edits. Keys belong to a user
    // and are revocable from the admin.
    mcpPlugin({
      collections: {
        users: {
          description: "People who can sign in to the admin panel.",
          enabled: { find: true, create: true, update: true, delete: true },
        },
        reels: {
          description: "The videos in the Work page gallery.",
          enabled: { find: true, create: true, update: true, delete: true },
        },
        "rate-card-packages": {
          description: "The pricing tiles on the Connect page.",
          enabled: { find: true, create: true, update: true, delete: true },
        },
        media: {
          description: "Images, including reel posters.",
          enabled: { find: true, create: true, update: true, delete: true },
        },
        videos: {
          description: "Reel video files.",
          enabled: { find: true, create: true, update: true, delete: true },
        },
        documents: {
          description: "PDFs, including the downloadable rate card.",
          enabled: { find: true, create: true, update: true, delete: true },
        },
      },
      // Globals hold every page's copy. Singletons, so find + update only.
      globals: {
        home: {
          description: "Landing page: the neon name and the portrait's alt text.",
          enabled: { find: true, update: true },
        },
        work: {
          description:
            "Work page copy: hero, gallery headings, case study, process steps, closing CTA.",
          enabled: { find: true, update: true },
        },
        about: {
          description:
            "About page copy: hero and bio, 'who I am', values, 'what I bring', radar, pull quote, closing CTA.",
          enabled: { find: true, update: true },
        },
        connect: {
          description:
            "Connect page copy: hero, rate-card and booking headings, closing marquee.",
          enabled: { find: true, update: true },
        },
        "site-settings": {
          description:
            "Contact details: email, Cal.com link, socials, rate-card PDF, response time, mailto starters.",
          enabled: { find: true, update: true },
        },
      },
      // The generated upload tools resolve filePath on the server, which a
      // remote editor cannot use. This adds a fetch-by-URL upload instead.
      mcp: { tools: [uploadFromUrlTool] },
      overrideApiKeyCollection: overrideMcpApiKeys,
    }),
  ],
});
