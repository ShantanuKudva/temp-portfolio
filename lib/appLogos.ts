// The SaaS / tech products she reviews. Real logos are downloaded to
// /public/assets/logos/<slug>.png (see scripts/fetch-logos.mjs) so the marquee
// renders actual brand marks, not text.
export interface AppLogo {
  name: string;
  domain: string;
  slug: string;
  category?: string; // PLACEHOLDER — set on the curated Reviewed subset
}

export const APP_LOGOS: AppLogo[] = [
  { name: 'ChatGPT',   domain: 'openai.com',  slug: 'chatgpt',  category: 'AI' },
  { name: 'Bolt.new',  domain: 'bolt.new',    slug: 'bolt',     category: 'Build' },
  { name: 'Gamma',     domain: 'gamma.app',   slug: 'gamma',    category: 'Decks' },
  { name: 'HeyGen',    domain: 'heygen.com',  slug: 'heygen',   category: 'Video' },
  { name: 'Granola',   domain: 'granola.ai',  slug: 'granola',  category: 'Notes' },
  { name: 'Julius AI', domain: 'julius.ai',   slug: 'julius',   category: 'Data' },
  { name: 'Napkin AI', domain: 'napkin.ai',   slug: 'napkin',   category: 'Visuals' },
  { name: 'Murf AI',   domain: 'murf.ai',     slug: 'murf',     category: 'Voice' },
  { name: 'Sarvam AI', domain: 'sarvam.ai',   slug: 'sarvam',   category: 'AI' },
  { name: 'Krutrim',   domain: 'olakrutrim.com', slug: 'krutrim', category: 'AI' },
  { name: 'Cluely',    domain: 'cluely.com',  slug: 'cluely',   category: 'Assistant' },
  { name: 'Wispr Flow',domain: 'wisprflow.ai',slug: 'wisprflow',category: 'Dictation' },
  { name: 'Emergent', domain: 'emergent.sh', slug: 'emergent' },
  { name: 'Dubverse', domain: 'dubverse.ai', slug: 'dubverse' },
  { name: 'Simplified', domain: 'simplified.com', slug: 'simplified' },
  { name: 'Durable', domain: 'durable.co', slug: 'durable' },
  { name: 'Pixis', domain: 'pixis.ai', slug: 'pixis' },
  { name: 'WizCommerce', domain: 'wizcommerce.com', slug: 'wizcommerce' },
  { name: 'Reelo', domain: 'reelo.io', slug: 'reelo' },
  { name: 'Dukaan', domain: 'mydukaan.io', slug: 'dukaan' },
  { name: 'Refrens', domain: 'refrens.com', slug: 'refrens' },
  { name: 'Rocketium', domain: 'rocketium.com', slug: 'rocketium' },
  { name: 'Fyno', domain: 'fyno.io', slug: 'fyno' },
  { name: 'WebEngage', domain: 'webengage.com', slug: 'webengage' },
  { name: 'Leadsquared', domain: 'leadsquared.com', slug: 'leadsquared' },
  { name: 'Classplus', domain: 'classplusapp.com', slug: 'classplus' },
  { name: 'DevRev', domain: 'devrev.ai', slug: 'devrev' },
  { name: 'Darwinbox', domain: 'darwinbox.com', slug: 'darwinbox' },
  { name: 'Keka', domain: 'keka.com', slug: 'keka' },
  { name: 'Shiprocket', domain: 'shiprocket.in', slug: 'shiprocket' },
  { name: 'Slice', domain: 'getslice.com', slug: 'slice' },
  { name: 'CRED', domain: 'cred.club', slug: 'cred' },
  { name: 'Jupiter Money', domain: 'jupiter.money', slug: 'jupiter' },
  { name: 'Fi Money', domain: 'fi.money', slug: 'fi' },
  { name: 'INDmoney', domain: 'indmoney.com', slug: 'indmoney' },
];

// The curated grid for the portfolio "Reviewed" section — the entries that carry
// a category. Uses the real downloaded /assets/logos/<slug>.png marks.
export const REVIEWED_BRANDS = APP_LOGOS.filter(
  (l): l is AppLogo & { category: string } => Boolean(l.category),
);
