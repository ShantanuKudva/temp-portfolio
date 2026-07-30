export type ReelKind = "app" | "business";

export type Reel = {
  id: string;
  title: string; // the hook / review headline
  subject: string; // the app or business reviewed
  kind: ReelKind;
  category: string; // gallery grouping
  poster: string; // Vercel Blob URL for the still
  src: string; // Vercel Blob URL for the clip
  href?: string; // optional external IG/YT link
};

export type ReelCategory = { label: string; reels: Reel[] };
