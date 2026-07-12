export type RadarLogo = { name: string; slug: string };

/**
 * The apps & businesses Varsheni is interested in reviewing — "on her radar".
 * The v1 curated set: Indian AI/SaaS products (Sarvam, Krutrim, CRED, Jupiter,
 * Fi, INDmoney, Shiprocket…) plus AI tools (ChatGPT, HeyGen, Gamma…). Real brand
 * marks live in /public/assets/logos/<slug>.png (from v1); the wall tints them
 * to crème so they read as one monochrome set over the chocolate.
 */
export const RADAR_LOGOS: RadarLogo[] = [
  { name: "ChatGPT", slug: "chatgpt" },
  { name: "Sarvam AI", slug: "sarvam" },
  { name: "Krutrim", slug: "krutrim" },
  { name: "Cluely", slug: "cluely" },
  { name: "Wispr Flow", slug: "wisprflow" },
  { name: "Bolt.new", slug: "bolt" },
  { name: "Gamma", slug: "gamma" },
  { name: "HeyGen", slug: "heygen" },
  { name: "Granola", slug: "granola" },
  { name: "Julius AI", slug: "julius" },
  { name: "Napkin AI", slug: "napkin" },
  { name: "Murf AI", slug: "murf" },
  { name: "Emergent", slug: "emergent" },
  { name: "Dubverse", slug: "dubverse" },
  { name: "Simplified", slug: "simplified" },
  { name: "Durable", slug: "durable" },
  { name: "Pixis", slug: "pixis" },
  { name: "WizCommerce", slug: "wizcommerce" },
  { name: "Reelo", slug: "reelo" },
  { name: "Dukaan", slug: "dukaan" },
  { name: "Refrens", slug: "refrens" },
  { name: "Rocketium", slug: "rocketium" },
  { name: "Fyno", slug: "fyno" },
  { name: "WebEngage", slug: "webengage" },
  { name: "Leadsquared", slug: "leadsquared" },
  { name: "Classplus", slug: "classplus" },
  { name: "DevRev", slug: "devrev" },
  { name: "Darwinbox", slug: "darwinbox" },
  { name: "Keka", slug: "keka" },
  { name: "Shiprocket", slug: "shiprocket" },
  { name: "Slice", slug: "slice" },
  { name: "CRED", slug: "cred" },
  { name: "Jupiter Money", slug: "jupiter" },
  { name: "Fi Money", slug: "fi" },
  { name: "INDmoney", slug: "indmoney" },
];
