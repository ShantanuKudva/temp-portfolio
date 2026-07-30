import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Videos } from "./collections/Videos";
import { Reels } from "./collections/Reels";
import { RateCardPackages } from "./collections/RateCardPackages";
import { About } from "./globals/About";
import { SiteSettings } from "./globals/SiteSettings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections: [Users, Media, Videos, Reels, RateCardPackages],
  globals: [About, SiteSettings],
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
      collections: { media: true, videos: true },
      clientUploads: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
});
