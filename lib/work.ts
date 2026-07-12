export type ReelKind = "app" | "business";

export type Reel = {
  id: string;
  title: string; // the hook / review headline
  subject: string; // the app or business reviewed
  kind: ReelKind;
  category: string; // gallery grouping
  poster: string; // /work/posters/<id>.jpg — placeholder still for now
  src: string; // /work/reels/<id>.mp4 — placeholder clip for now
  href?: string; // optional external IG/YT link (unused in shell)
};

// TODO(real): swap placeholder titles/subjects/media for Varsheni's real reels.
// Subjects/icons drawn from public/assets/logos so the shell reads as real;
// subjects without a logo use a generated monogram poster.
const POSTER = (id: string) => `/work/posters/${id}.jpg`;
const SAMPLE = "/work/reels/sample.mp4"; // TODO(real): per-reel clips

export const REELS: Reel[] = [
  // Money & fintech
  { id: "cred", title: "Is the hype worth your credit score?", subject: "CRED", kind: "app", category: "Money & fintech", poster: POSTER("cred"), src: SAMPLE },
  { id: "jupiter", title: "Banking that doesn't make you think", subject: "Jupiter", kind: "app", category: "Money & fintech", poster: POSTER("jupiter"), src: SAMPLE },
  // AI & creator tools
  { id: "granola", title: "The note-taker that finally stuck", subject: "Granola", kind: "app", category: "AI & creator tools", poster: POSTER("granola"), src: SAMPLE },
  { id: "murf", title: "Voiceovers without a booth", subject: "Murf", kind: "app", category: "AI & creator tools", poster: POSTER("murf"), src: SAMPLE },
  // Commerce & brands
  { id: "dukaan", title: "A storefront in an afternoon", subject: "Dukaan", kind: "business", category: "Commerce & brands", poster: POSTER("dukaan"), src: SAMPLE },
  { id: "reelo", title: "Loyalty that small shops can run", subject: "Reelo", kind: "business", category: "Commerce & brands", poster: POSTER("reelo"), src: SAMPLE },
  // Ed-tech
  { id: "classplus", title: "Running a coaching class from your phone", subject: "Classplus", kind: "app", category: "Ed-tech", poster: POSTER("classplus"), src: SAMPLE },
  { id: "vedantu", title: "Does live tutoring actually hold up?", subject: "Vedantu", kind: "app", category: "Ed-tech", poster: POSTER("vedantu"), src: SAMPLE },
  // Health & fitness
  { id: "healthifyme", title: "The calorie tracker that stops nagging", subject: "HealthifyMe", kind: "app", category: "Health & fitness", poster: POSTER("healthifyme"), src: SAMPLE },
  { id: "cultfit", title: "Booking a workout you'll actually show up to", subject: "Cult.fit", kind: "business", category: "Health & fitness", poster: POSTER("cultfit"), src: SAMPLE },
  // Real estate
  { id: "nobroker", title: "Renting a flat without the broker cut", subject: "NoBroker", kind: "business", category: "Real estate", poster: POSTER("nobroker"), src: SAMPLE },
  { id: "housing", title: "How honest are the listing photos?", subject: "Housing", kind: "business", category: "Real estate", poster: POSTER("housing"), src: SAMPLE },
  // SaaS & B2B
  { id: "devrev", title: "Support and product in one place", subject: "DevRev", kind: "business", category: "SaaS & B2B", poster: POSTER("devrev"), src: SAMPLE },
  { id: "keka", title: "The HR tool your team won't dread", subject: "Keka", kind: "business", category: "SaaS & B2B", poster: POSTER("keka"), src: SAMPLE },
];

// Ordered categories for the gallery. Each surfaces its reels in declared order.
const CATEGORY_ORDER = [
  "Money & fintech",
  "AI & creator tools",
  "Commerce & brands",
  "Ed-tech",
  "Health & fitness",
  "Real estate",
  "SaaS & B2B",
];

export type ReelCategory = { label: string; reels: Reel[] };

export const REEL_CATEGORIES: ReelCategory[] = CATEGORY_ORDER.map((label) => ({
  label,
  reels: REELS.filter((r) => r.category === label),
})).filter((c) => c.reels.length > 0);
