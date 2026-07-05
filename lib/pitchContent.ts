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
