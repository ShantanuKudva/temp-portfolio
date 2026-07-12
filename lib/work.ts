export type ReelKind = "app" | "business";

export type Reel = {
  id: string;
  title: string; // the hook / review headline
  subject: string; // the app or business reviewed
  kind: ReelKind;
  poster: string; // /work/posters/<id>.jpg — placeholder still for now
  src: string; // /work/reels/<id>.mp4 — placeholder clip for now
  featured?: boolean; // exactly one true → the featured reel
  href?: string; // optional external IG/YT link (unused in shell)
};

// TODO(real): swap placeholder titles/subjects/media for Varsheni's real reels.
// Subjects are drawn from public/assets/logos so the shell reads as real.
const POSTER = (id: string) => `/work/posters/${id}.jpg`;
const SAMPLE = "/work/reels/sample.mp4"; // TODO(real): per-reel clips

export const REELS: Reel[] = [
  { id: "granola", title: "The note-taker that finally stuck", subject: "Granola", kind: "app", poster: POSTER("granola"), src: SAMPLE, featured: true },
  { id: "cred", title: "Is the hype worth your credit score?", subject: "CRED", kind: "app", poster: POSTER("cred"), src: SAMPLE },
  { id: "slice", title: "The card that rethinks spending", subject: "Slice", kind: "app", poster: POSTER("slice"), src: SAMPLE },
  { id: "jupiter", title: "Banking that doesn't make you think", subject: "Jupiter", kind: "app", poster: POSTER("jupiter"), src: SAMPLE },
  { id: "sarvam", title: "An Indian model that actually gets Hindi", subject: "Sarvam", kind: "app", poster: POSTER("sarvam"), src: SAMPLE },
  { id: "napkin", title: "Turning messy notes into clean visuals", subject: "Napkin", kind: "app", poster: POSTER("napkin"), src: SAMPLE },
  { id: "gamma", title: "Decks without the deck-building", subject: "Gamma", kind: "app", poster: POSTER("gamma"), src: SAMPLE },
  { id: "dukaan", title: "A storefront in an afternoon", subject: "Dukaan", kind: "business", poster: POSTER("dukaan"), src: SAMPLE },
  { id: "shiprocket", title: "The logistics layer small brands lean on", subject: "Shiprocket", kind: "business", poster: POSTER("shiprocket"), src: SAMPLE },
  { id: "wisprflow", title: "Talking to my laptop, for real this time", subject: "Wispr Flow", kind: "app", poster: POSTER("wisprflow"), src: SAMPLE },
  { id: "reelo", title: "Loyalty that small shops can run", subject: "Reelo", kind: "business", poster: POSTER("reelo"), src: SAMPLE },
  { id: "murf", title: "Voiceovers without a booth", subject: "Murf", kind: "app", poster: POSTER("murf"), src: SAMPLE },
];

export const FEATURED: Reel = REELS.find((r) => r.featured) ?? REELS[0];

const wall = REELS.filter((r) => !r.featured);
const mid = Math.ceil(wall.length / 2);
export const WALL_ROWS: [Reel[], Reel[]] = [wall.slice(0, mid), wall.slice(mid)];
