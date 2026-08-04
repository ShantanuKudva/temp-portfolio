import { z } from "zod";
import type { PayloadRequest } from "payload";

/**
 * `uploadFromUrl` — the one thing the generated MCP tools cannot do.
 *
 * Their `filePath` is resolved on the server, so a path from the editor's own
 * machine ("C:\Users\...\reel.mp4") is looked up on the Vercel function, found
 * missing, and fails with "No files were uploaded". This fetches the bytes
 * server-side instead and hands Payload an in-memory file, so the upload lands
 * in Blob exactly as a drag-and-drop in the admin would.
 */

const TARGETS = {
  media: { label: "image", accept: /^image\//, hint: "posters and photos" },
  videos: { label: "video", accept: /^video\/mp4$/, hint: "reel videos (MP4)" },
  documents: { label: "PDF", accept: /^application\/pdf$/, hint: "the rate card" },
} as const;

type Target = keyof typeof TARGETS;

// Matches the Payload-wide upload ceiling in payload.config.ts.
const MAX_BYTES = 52_428_800;

const text = (body: string) => ({ content: [{ text: body, type: "text" as const }] });

const nameFromUrl = (url: string, fallbackExt: string): string => {
  try {
    const last = new URL(url).pathname.split("/").filter(Boolean).pop();
    if (last && /\.[a-z0-9]{2,5}$/i.test(last)) return decodeURIComponent(last);
  } catch {
    /* fall through to the generated name */
  }
  return `upload-${Date.now()}.${fallbackExt}`;
};

export const uploadFromUrlTool = {
  name: "uploadFromUrl",
  description:
    "Upload a file to this site from a publicly reachable URL, and return the new document's id. " +
    "Use this instead of filePath, which only works for files already on the server. " +
    "Targets: 'media' for posters and photos, 'videos' for reel MP4s, 'documents' for the rate-card PDF. " +
    "The returned id can then be set on a reel's poster/video, or on an About page photo.",
  parameters: {
    url: z.string().describe("Direct, publicly reachable URL of the file to fetch."),
    collection: z
      .enum(["media", "videos", "documents"])
      .describe("Where the file belongs: media (images), videos (MP4), documents (PDF)."),
    alt: z
      .string()
      .optional()
      .describe("Images only: short description for screen readers."),
    filename: z
      .string()
      .optional()
      .describe("Optional filename. Defaults to the name in the URL."),
  },
  handler: async (args: Record<string, unknown>, req: PayloadRequest) => {
    const url = String(args.url ?? "");
    const collection = String(args.collection ?? "") as Target;
    const target = TARGETS[collection];

    if (!target) {
      return text(`Unknown collection "${collection}". Use media, videos or documents.`);
    }
    if (!/^https?:\/\//i.test(url)) {
      return text("The url must start with http:// or https://.");
    }

    let res: Response;
    try {
      res = await fetch(url, { redirect: "follow" });
    } catch (err) {
      return text(
        `Could not reach that URL: ${err instanceof Error ? err.message : String(err)}. ` +
          "It must be publicly reachable — a Google Drive or Dropbox share page is not a " +
          "direct file link, so use the direct-download form.",
      );
    }

    if (!res.ok) {
      return text(
        `That URL returned ${res.status}. If it is a share link, it probably needs to be ` +
          "set to 'anyone with the link' and given as a direct-download URL.",
      );
    }

    const mimetype = (res.headers.get("content-type") ?? "").split(";")[0].trim();
    if (!target.accept.test(mimetype)) {
      return text(
        `That URL served "${mimetype || "an unknown type"}", but ${collection} accepts ` +
          `${target.label} files (${target.hint}). If the link returns an HTML preview page ` +
          "rather than the file itself, use the direct-download URL.",
      );
    }

    const data = Buffer.from(await res.arrayBuffer());
    if (data.byteLength > MAX_BYTES) {
      return text(
        `That file is ${(data.byteLength / 1_048_576).toFixed(1)}MB, over the 50MB limit. ` +
          "Compress it and try again.",
      );
    }

    const ext = mimetype.split("/")[1]?.replace("+xml", "") ?? "bin";
    const name = String(args.filename ?? "") || nameFromUrl(url, ext);

    // The MCP endpoint resolves the key's owner into its own access settings and
    // does not assign req.user, so a custom tool sees an anonymous request. Run
    // under normal access control when a user is present; otherwise the request
    // is already authorised — the endpoint rejected invalid keys before calling
    // this, and the key's own permissions decide whether this tool runs at all.
    const user = req.user ?? undefined;

    let doc;
    try {
      doc = await req.payload.create({
        collection,
        data: collection === "media" && args.alt ? { alt: String(args.alt) } : {},
        file: { data, mimetype, name, size: data.byteLength },
        req,
        overrideAccess: !user,
        user,
      });
    } catch (err) {
      return text(
        `Upload failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    const id = (doc as { id: number | string }).id;
    const stored = (doc as { url?: string }).url ?? "(pending)";
    return text(
      `Uploaded ${name} (${(data.byteLength / 1_048_576).toFixed(2)}MB) to ${collection}.\n` +
        `id: ${id}\nurl: ${stored}\n\n` +
        `Set this id on the field that needs it — for a reel that is "poster" or "video".`,
    );
  },
};
