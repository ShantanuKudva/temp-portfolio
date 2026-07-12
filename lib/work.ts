export type ReelKind = "app" | "business";

export type Reel = {
  id: string;
  title: string; // the hook / review headline
  subject: string; // the app or business reviewed
  kind: ReelKind;
  poster: string; // /work/posters/<id>.jpg — placeholder still for now
  src: string; // /work/reels/<id>.mp4 — placeholder clip for now
  href?: string; // optional external IG/YT link (unused in shell)
};

// TODO(real): swap placeholder titles/subjects/media for Varsheni's real reels.
// A small curated set (~3) — subjects/icons drawn from public/assets/logos.
const POSTER = (id: string) => `/work/posters/${id}.jpg`;
const SAMPLE = "/work/reels/sample.mp4"; // TODO(real): per-reel clips

export const REELS: Reel[] = [
  {
    id: "granola",
    title: "The note-taker that finally stuck",
    subject: "Granola",
    kind: "app",
    poster: POSTER("granola"),
    src: SAMPLE,
  },
  {
    id: "cred",
    title: "Is the hype worth your credit score?",
    subject: "CRED",
    kind: "app",
    poster: POSTER("cred"),
    src: SAMPLE,
  },
  {
    id: "dukaan",
    title: "A storefront in an afternoon",
    subject: "Dukaan",
    kind: "business",
    poster: POSTER("dukaan"),
    src: SAMPLE,
  },
];
