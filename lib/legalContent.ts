// Content for the four legal routes the footer links to. Each doc renders through
// a single <LegalPage> shell, so copy edits here need no component change. Dates
// are static strings (not computed — no Date.now in this codebase). This is a
// sensible starting template for a solo creator; have it reviewed before launch.

import { CONTACT } from './pitchContent';

export interface LegalSection {
  h: string;
  body: string[];
}

export interface LegalDoc {
  slug: string;
  title: string;
  updated: string;      // human date, e.g. "8 July 2026"
  intro: string;
  sections: LegalSection[];
}

export const LEGAL_DOCS: Record<string, LegalDoc> = {
  privacy: {
    slug: 'privacy',
    title: 'Privacy Policy',
    updated: '8 July 2026',
    intro:
      "This site is a personal portfolio for Varsheni, a tech UGC creator. It collects as little as possible — only what's needed to reply to you and to keep the site working. Here's exactly what that means.",
    sections: [
      {
        h: 'What I collect',
        body: [
          'If you email me or book a call, I receive what you send: your name, your email address, and whatever you write. Nothing more is required.',
          'Like most sites, basic, aggregate analytics may be collected — pages viewed, rough region, device type — to understand what people find useful. This is never tied to your name.',
        ],
      },
      {
        h: 'How I use it',
        body: [
          'To reply to you, prepare a quote, and deliver work you commission. That is the entire purpose.',
          'I do not sell, rent, or trade your information to anyone, ever.',
        ],
      },
      {
        h: 'Who else is involved',
        body: [
          'A few trusted services help run things: an email provider to receive your messages, Cal.com to schedule intro calls, and a privacy-respecting analytics tool. Each only sees what it needs to do its job.',
        ],
      },
      {
        h: 'Your choices',
        body: [
          'You can ask me what I hold about you, ask me to correct it, or ask me to delete it — and I will. Just email the address below.',
        ],
      },
      {
        h: 'Contact',
        body: [`Questions about your data? Email ${CONTACT.email}.`],
      },
    ],
  },

  terms: {
    slug: 'terms',
    title: 'Terms of Service',
    updated: '8 July 2026',
    intro:
      'These terms cover using this site and commissioning review reels from Varsheni. Booking work means you agree to them.',
    sections: [
      {
        h: 'The work',
        body: [
          'I create short-form vertical review reels of apps and products — scripted, shot, and cut for the feed. Scope, cadence, and price are agreed per project before anything begins.',
        ],
      },
      {
        h: 'Approvals & revisions',
        body: [
          'You approve the script before I shoot. One revision round on the finished reel is included; the up-front script sign-off keeps it tight and on message.',
        ],
      },
      {
        h: 'Honesty',
        body: [
          'Reviews reflect my genuine take. I will not claim a product does something it does not, and I keep the right to be straight with my audience. If that is a dealbreaker, we are not the right fit — and that is okay.',
        ],
      },
      {
        h: 'Usage rights',
        body: [
          'On delivery and full payment, you receive rights to run the reel on your own channels, ads, and site. I keep the right to feature the work in my portfolio and reel.',
        ],
      },
      {
        h: 'Payment & cancellation',
        body: [
          'Terms are set per project. If you cancel after work has started, completed stages are billable. If I cannot deliver, you are refunded for anything undelivered.',
        ],
      },
      {
        h: 'Contact',
        body: [`Questions about a project or these terms? Email ${CONTACT.email}.`],
      },
    ],
  },

  cookies: {
    slug: 'cookies',
    title: 'Cookie Policy',
    updated: '8 July 2026',
    intro:
      'Cookies are small files a site stores in your browser. This one keeps them to a minimum.',
    sections: [
      {
        h: 'Essential',
        body: [
          'A small number of cookies keep the site working — remembering your preferences and keeping pages responsive. The site cannot function without these.',
        ],
      },
      {
        h: 'Analytics',
        body: [
          'Privacy-respecting analytics may set a cookie to count visits without identifying you. It tells me which work resonates — never who you are.',
        ],
      },
      {
        h: 'Managing cookies',
        body: [
          'Every browser lets you view, block, or clear cookies in its settings. Blocking the essential ones may break parts of the site.',
        ],
      },
      {
        h: 'Contact',
        body: [`Questions about cookies? Email ${CONTACT.email}.`],
      },
    ],
  },

  disclosure: {
    slug: 'disclosure',
    title: 'Content & Disclosure',
    updated: '8 July 2026',
    intro:
      'Trust is the whole job. This page is how I keep it — a plain account of when something is paid, and what my honesty is worth.',
    sections: [
      {
        h: 'Paid vs. organic',
        body: [
          'When a brand pays me to review their product, I say so clearly — in the reel and its caption — using the platform’s paid-partnership label. When I cover something on my own, it is unpaid and my own pick.',
        ],
      },
      {
        h: 'Paid does not buy the verdict',
        body: [
          'A brand pays for my time and craft, not a scripted rave. If a paid product falls short, I say what I honestly think or I pass on the deal. My audience can tell the difference, and so can you.',
        ],
      },
      {
        h: 'Affiliates',
        body: [
          'If a link earns a small commission, it is marked as affiliate. It never changes what I recommend.',
        ],
      },
      {
        h: 'Editorial independence',
        body: [
          'The opinions here are mine. No brand gets final cut on what I actually think — that independence is the reason the reviews are worth watching.',
        ],
      },
      {
        h: 'Contact',
        body: [`Questions about a partnership or this policy? Email ${CONTACT.email}.`],
      },
    ],
  },
};
