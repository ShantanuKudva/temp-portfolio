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
    // Lets Claude edit content over MCP with the same access control and
    // validation as the admin UI. `users` is deliberately excluded so account
    // management stays a human, GUI-only operation.
    mcpPlugin({
      collections: {
        reels: { enabled: { find: true, create: true, update: true, delete: true } },
        "rate-card-packages": {
          enabled: { find: true, create: true, update: true, delete: true },
        },
        media: { enabled: { find: true, create: true, update: true, delete: true } },
        videos: { enabled: { find: true, create: true, update: true, delete: true } },
      },
      overrideApiKeyCollection: overrideMcpApiKeys,
    }),
  ],
});
