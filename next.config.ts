import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Reel posters and other uploads live in Vercel Blob. The wildcard
        // covers the store id, so rotating to a new Blob store needs no
        // config change.
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default withPayload(nextConfig);
