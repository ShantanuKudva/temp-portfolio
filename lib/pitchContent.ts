// Single edit point for all pitch copy + assets. Everything marked PLACEHOLDER
// swaps to real content with no component change.

export interface Reel {
  brand: string;                 // badge label, e.g. "Linear"
  gradient: [string, string, string]; // placeholder screen gradient (until video)
  caption: string;               // big on-screen line
  sub: string;                   // small mono line
  videoSrc?: string;             // PLACEHOLDER: drop /assets/reels/*.mp4 later
}

export const REELS: Reel[] = [
  { brand: 'Linear', gradient: ['#123', '#2F4A3A', '#0a1a12'], caption: 'this is how\nfast should feel.', sub: '60 sec · zero fluff' },
  { brand: 'Notion', gradient: ['#3a1420', '#7B1E2B', '#2A1A1C'], caption: 'everything,\nin one place.', sub: 'the verdict in 6 seconds' },
  { brand: 'Claude', gradient: ['#241b0a', '#B08D4C', '#1c1409'], caption: "okay, this\none's different.", sub: 'why it actually clicks' },
];

// The horizontal "reel wall" — a fuller catalogue than the 3 the phone plays.
// Each is a placeholder card (gradient) until a real vertical clip is dropped in
// as `videoSrc` (/assets/reels/*.mp4), at which point it plays on hover.
export const CATALOGUE: Reel[] = [
  { brand: 'Linear',     gradient: ['#123', '#2F4A3A', '#0a1a12'], caption: 'this is how\nfast should feel.', sub: '60 sec review' },
  { brand: 'Notion',     gradient: ['#3a1420', '#7B1E2B', '#2A1A1C'], caption: 'everything,\nin one place.', sub: 'the verdict in 6s' },
  { brand: 'Claude',     gradient: ['#241b0a', '#B08D4C', '#1c1409'], caption: "okay, this\none's different.", sub: 'why it clicks' },
  { brand: 'Figma',      gradient: ['#2a0f2e', '#8A3FFC', '#150a1a'], caption: 'design, but\nit ships.', sub: 'the 60s tour' },
  { brand: 'Perplexity', gradient: ['#0a2a2e', '#20808D', '#08171a'], caption: 'answers, not\nten blue links.', sub: 'first impression' },
  { brand: 'Spotify',    gradient: ['#0d2416', '#1DB954', '#07140c'], caption: 'the feature\nnobody noticed.', sub: 'hidden gem' },
];

export const PILLARS = [
  { n: '01', title: 'Clarity', body: 'Complex product, one clean idea an audience actually remembers after they scroll.' },
  { n: '02', title: 'Speed',   body: "The hook, the point, the verdict — before anyone's thumb decides to move on." },
  { n: '03', title: 'Taste',   body: 'It looks as good as your product. Never cheap, never clickbait, never off-brand.' },
] as const;

export const STATS = [
  { value: '60s',   label: 'per review' },
  { value: '7-day', label: 'turnaround' },
  { value: '100%',  label: 'original' },
] as const;

export const MEET = {
  name: 'Varsheni',
  role: 'Tech UGC · App & product reviews',
  bio: "I review apps and businesses the way people actually use them — no jargon, no 12-minute deep dives. Just the hook, the point, and the one reason it's worth your thumb stopping.",
} as const;

// Personal "about" block for the portfolio page. Derived from her positioning
// (safe placeholders — swap for real bio facts when they exist).
export const ABOUT = {
  eyebrow: "Who's behind the lens",
  lead: 'Hi, I’m Varsheni.',
  body: "I got tired of watching genuinely good products get explained badly — so I started explaining them the way a friend would. Short, honest, and only the part that actually matters. No sponsored-read energy, no filler, no pretending everything is a 10.",
  kicker: 'If it doesn’t earn the thumb-stop, it doesn’t ship.',
} as const;

export const ABOUT_FACTS = [
  { k: 'Focus',      v: 'Apps, SaaS & tech products' },
  { k: 'Format',     v: 'Vertical short-form reviews' },
  { k: 'Voice',      v: 'Plain-spoken, never clickbait' },
  { k: 'Turnaround', v: 'Seven days, start to post' },
] as const;

export const CHIPS = [
  { pre: '1×', text: 'vertical review reel' },
  { pre: '7-day', text: 'turnaround' },
  { pre: '', text: 'posted to her audience' },
  { pre: 'full', text: 'usage rights' },
] as const;

export const HEADS = {
  portal:  'I make tech make sense.',
  problem: "You built something great. But nobody understands it in the six seconds they'll give you. That's exactly what I fix.",
  reel1:   'Sixty seconds.\nZero fluff.',
  reel2:   'Your product,\nmade obvious.',
  ask:     "Let's make your\ntech click.",
} as const;

export const PORTRAIT_SRC = '';                 // PLACEHOLDER: '/assets/varsheni.jpg' when it exists
export const CONTACT = { email: 'hello@varsheni.co', handle: '@varsheni' }; // PLACEHOLDER
export const CAL_LINK = 'varsheni/15min';       // PLACEHOLDER Cal.com link
export const MEDIA_KIT_URL = '#';               // PLACEHOLDER

export const FOOTER_LINKS = {
  explore: [
    { label: 'Reviews', href: '#' },
    { label: 'About', href: '#' },
    { label: 'Work with me', href: '#' },
    { label: 'Media kit', href: MEDIA_KIT_URL },
  ],
  connect: [
    { label: 'Instagram', href: '#' },
    { label: 'YouTube', href: '#' },
    { label: 'TikTok', href: '#' },
    { label: 'Email', href: `mailto:${CONTACT.email}` },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Content & Disclosure', href: '/disclosure' },
  ],
} as const;

// ── Editorial redesign content (2026-07-06) ────────────────────────────────
// All PLACEHOLDER where marked — swaps to real copy with no component change.

export const PROCESS_STEPS = [
  { n: '01', title: 'Brief',  body: 'You send the product and the one thing you wish people understood. We find the hook worth sixty seconds.' },
  { n: '02', title: 'Script', body: 'A tight script — the hook, the point, the verdict. Written the way a friend talks, not a sponsored read.' },
  { n: '03', title: 'Shoot',  body: 'Shot and cut for the feed: vertical, captioned, thumb-stopping from the very first frame.' },
  { n: '04', title: 'Ship',   body: 'Posted to her audience within seven days — with full usage rights to run it anywhere you like.' },
] as const;

export const CASE_STUDY = {
  eyebrow: 'The brief · Linear',
  brand: 'Linear',
  brief: 'Linear is fast — but "fast" is invisible in a screenshot. They needed people to feel it, not read about it.',
  quote: "So we didn't say fast. We showed the half-second between click and done.",
  metrics: [
    { value: '1.3M', label: 'views' },
    { value: '24k',  label: 'saves' },
    { value: '3.1k', label: 'comments' },
  ],
  note: 'Placeholder numbers — real case metrics on request.',
} as const;

export const PRICING_TIERS = [
  { name: 'Single',   tag: 'One review',    price: '$—', unit: '/ reel',  featured: false,
    features: ['1× 60-second vertical reel', '7-day turnaround', 'One revision round', 'Full usage rights'] },
  { name: 'Bundle',   tag: 'Three reviews', price: '$—', unit: '/ three', featured: true, ribbon: 'Most booked',
    features: ['3× reels, your cadence', 'Priority turnaround', 'Bundle saving', 'Full usage rights'] },
  { name: 'Retainer', tag: 'Monthly',       price: '$—', unit: '/ month', featured: false,
    features: ['4 reels every month', 'First pick of drops', 'Ongoing, cancel anytime', 'Full usage rights'] },
] as const;

export const FAQ = [
  { q: 'Who writes the script?', a: 'She does, from your brief — and you approve it before anything gets shot.' },
  { q: 'How many revisions?',    a: 'One round is included. Approving the script up front keeps it tight and on-message.' },
  { q: 'Do I own the reel?',     a: 'Yes — full usage rights to run it on your channels, ads, and site, for good.' },
  { q: 'Will you post it too?',  a: 'Yes, to her audience. That reach is part of the deal, not an add-on.' },
  { q: 'How fast is it?',        a: 'Seven days from brief to posted — faster on a bundle or retainer.' },
] as const;
