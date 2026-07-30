import path from "path";
import { fileURLToPath } from "url";
import { getPayload } from "payload";
import config from "@payload-config";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(dirname, "../public");

// `slug` matches the poster filename in public/work/posters/<slug>.jpg.
const REELS = [
  { slug: "cred", title: "Is the hype worth your credit score?", subject: "CRED", kind: "app", category: "Money & fintech" },
  { slug: "jupiter", title: "Banking that doesn't make you think", subject: "Jupiter", kind: "app", category: "Money & fintech" },
  { slug: "granola", title: "The note-taker that finally stuck", subject: "Granola", kind: "app", category: "AI & creator tools" },
  { slug: "murf", title: "Voiceovers without a booth", subject: "Murf", kind: "app", category: "AI & creator tools" },
  { slug: "dukaan", title: "A storefront in an afternoon", subject: "Dukaan", kind: "business", category: "Commerce & brands" },
  { slug: "reelo", title: "Loyalty that small shops can run", subject: "Reelo", kind: "business", category: "Commerce & brands" },
  { slug: "classplus", title: "Running a coaching class from your phone", subject: "Classplus", kind: "app", category: "Ed-tech" },
  { slug: "vedantu", title: "Does live tutoring actually hold up?", subject: "Vedantu", kind: "app", category: "Ed-tech" },
  { slug: "healthifyme", title: "The calorie tracker that stops nagging", subject: "HealthifyMe", kind: "app", category: "Health & fitness" },
  { slug: "cultfit", title: "Booking a workout you'll actually show up to", subject: "Cult.fit", kind: "business", category: "Health & fitness" },
  { slug: "nobroker", title: "Renting a flat without the broker cut", subject: "NoBroker", kind: "business", category: "Real estate" },
  { slug: "housing", title: "How honest are the listing photos?", subject: "Housing", kind: "business", category: "Real estate" },
  { slug: "devrev", title: "Support and product in one place", subject: "DevRev", kind: "business", category: "SaaS & B2B" },
  { slug: "keka", title: "The HR tool your team won't dread", subject: "Keka", kind: "business", category: "SaaS & B2B" },
] as const;

const PACKAGES = [
  {
    name: "Single Review",
    blurb: "One product, one honest verdict.",
    deliverables: ["1 reel (30–60s)", "3 story frames", "Usage rights (30 days)", "1 revision"],
    priceFrom: "from ₹25,000",
  },
  {
    name: "Campaign Package",
    blurb: "A multi-touch push across a launch.",
    deliverables: ["3 reels", "Story series", "Usage rights (90 days)", "2 revisions"],
    priceFrom: "from ₹75,000",
  },
  {
    name: "Custom / Retainer",
    blurb: "Ongoing collaboration, bespoke scope.",
    deliverables: ["Monthly deliverables", "Priority slots", "Extended rights", "Strategy input"],
    priceFrom: "from ₹1,50,000/mo",
  },
];

const MAIL_TEMPLATES = [
  {
    key: "collab",
    label: "Brand collaboration",
    subject: "Brand collaboration with Varsheni",
    body: "Hi Varsheni,\n\nWe're [brand] and we'd love to work with you on [product / campaign]. A quick sense of what we have in mind:\n\n- \n- \n\nTimeline: \nBudget range: \n\nLooking forward to hearing from you!",
  },
  {
    key: "review",
    label: "Product review",
    subject: "Review request: [product]",
    body: "Hi Varsheni,\n\nWe'd love an honest review of [product] — a [category] app/product we think your audience would find useful.\n\nWhat it does: \nWhat we'd love you to cover: \n\nHappy to send access or a sample. Thanks!",
  },
  {
    key: "retainer",
    label: "Ongoing partnership",
    subject: "Ongoing collaboration with Varsheni",
    body: "Hi Varsheni,\n\nWe're exploring a longer-term partnership (monthly content / retainer). Rough thinking:\n\nDeliverables: \nCadence: \nBudget: \n\nWould love to set up a call.",
  },
  {
    key: "hi",
    label: "Just saying hi",
    subject: "Hello, Varsheni!",
    body: "Hi Varsheni,\n\nNo pitch — just wanted to say I love your work. [your note here]\n\nCheers!",
  },
];

const seed = async () => {
  const payload = await getPayload({ config });

  const existingPackages = await payload.find({ collection: "rate-card-packages", limit: 1 });
  if (existingPackages.totalDocs > 0) {
    payload.logger.info("Packages already exist — skipping package seed.");
  } else {
    let order = 0;
    for (const pkg of PACKAGES) {
      await payload.create({
        collection: "rate-card-packages",
        data: {
          name: pkg.name,
          blurb: pkg.blurb,
          priceFrom: pkg.priceFrom,
          deliverables: pkg.deliverables.map((item) => ({ item })),
          order: order++,
        },
      });
    }
    payload.logger.info(`Seeded ${PACKAGES.length} packages.`);
  }

  await payload.updateGlobal({
    slug: "site-settings",
    data: {
      email: "hello@varsheni.com",
      calLink: "varsheni/intro",
      instagram: "https://instagram.com/",
      youtube: "https://youtube.com/",
      rateCardPdf: "/rate-card.pdf",
      responseTime: "Usually replies within 48h",
      mailTemplates: MAIL_TEMPLATES,
    },
  });
  payload.logger.info("Seeded site settings.");

  await payload.updateGlobal({
    slug: "about",
    data: {
      hero: {
        availability: "Available for brand deals",
        eyebrow: "About",
        headline: "Honest reviews, for people done being let down.",
        intro:
          "Hi, I'm Varsheni — a tech UGC creator who reviews the apps and businesses worth your attention.",
        bio: [
          {
            text: "I started reviewing apps because glossy ads said everything and told you nothing. So I began doing the boring, honest part — actually living with a product before I ever recommend it.",
          },
          {
            text: "Today I help brands reach an audience that trusts what I say, because I only say it when I mean it. If it earns a spot on your home screen, I'll tell you why — and if it doesn't, I'll tell you that too.",
          },
        ],
        signature: "— honest, always.",
      },
      whoIAm: {
        eyebrow: "Who I am",
        heading: "Where I come from, and what shaped the eye.",
        paragraphs: [
          {
            text: "Raised in southern India, I grew up equal parts curious and skeptical — the kind of kid who took gadgets apart to see how they worked, then argued about whether they were any good. That mix never left me.",
          },
          {
            text: "Reviewing tech is just that instinct, grown up: an honest eye, a soft spot for products made with care, and zero patience for the ones that waste your time.",
          },
        ],
        education: [
          { item: "Bachelor's degree — [field], [university]" },
          { item: "[Any relevant course / diploma]" },
        ],
        qualifications: [
          { item: "Years of hands-on tech & app reviewing" },
          { item: "Comfortable on-camera, script to edit" },
          { item: "Disclosure-first, brand-safe creator" },
        ],
        languages: [
          { item: "Hindi" },
          { item: "English" },
          { item: "Kannada" },
          { item: "Tamil" },
        ],
      },
      values: {
        eyebrow: "What I stand for",
        items: [
          {
            title: "Honest to a fault",
            body: "If it's not worth your tap, I'll say so. No paid praise, no polishing over the cracks.",
          },
          {
            title: "I actually test it",
            body: "Every app and business gets used the way you would — days, not a five-minute demo.",
          },
          {
            title: "Made for real people",
            body: "No jargon walls. Clear, warm reviews that respect your time and your money.",
          },
          {
            title: "Apps & businesses",
            body: "From the tool you open every morning to the small brand worth knowing.",
          },
        ],
      },
      bring: {
        eyebrow: "What I bring to the table",
        heading: "Five reasons the review is worth trusting.",
        items: [
          {
            title: "Honest reviews",
            body: "No paid praise. If it isn't worth your tap, I say so — on camera, in plain words. That honesty is exactly why the recommendation lands.",
          },
          {
            title: "Real, hands-on testing",
            body: "Days of living with the product before a single line of script gets written.",
          },
          {
            title: "Brand-safe & clear",
            body: "Disclosure-first, always on-brand, never clickbait.",
          },
          {
            title: "Thumb-stopping craft",
            body: "Short-form built to be watched to the very last second.",
          },
          {
            title: "Apps & businesses",
            body: "From the app you open every morning to the small brand worth knowing.",
          },
        ],
      },
      quote: {
        text: "The best review saves you from a purchase you'd regret — and points you to the one you'll love.",
        attribution: "Est. 2026 — Made in India",
      },
      radar: {
        eyebrow: "On my radar",
        heading: "The apps & businesses I'm itching to review next.",
      },
      cta: {
        script: "let's talk",
        heading: "Have an app or business worth an honest look?",
        primaryLabel: "Work with me ↗",
        secondaryLabel: "See the work",
      },
      props: {
        sideLabel: "Apps · Businesses · Honest reviews",
        sealText: "✦ Honest reviews ✦ Work with me ✦ Apps · Businesses ",
      },
    },
  });
  payload.logger.info("Seeded about page.");

  await payload.updateGlobal({
    slug: "work",
    data: {
      hero: {
        eyebrow: "The Work",
        script: "press play",
        headline: "Reviews worth your tap.",
        intro:
          "Every reel is an app or a business I actually lived with — used the way you would, then said plainly whether it earns a place on your home screen.",
        availability: "Available for brand deals",
      },
      gallery: {
        eyebrow: "The gallery",
        heading: "Reviews, grouped by what they are.",
        emptyState: "New reels are on the way — check back soon.",
      },
      caseStudy: {
        eyebrow: "Case study",
        heading: "The first deep-dive lands here.",
        intro:
          "No case studies yet — I'm just getting started. When a collaboration wraps, I'll break the whole thing down here, start to finish.",
        badge: "First one in the works",
        coverTitle: "What a breakdown will cover",
        items: [
          {
            label: "The brief",
            body: "The goal, the audience, and how we kept it brand-safe and disclosure-first.",
          },
          {
            label: "The approach",
            body: "What I tested, how long I lived with it, and the angle the reel took.",
          },
          {
            label: "The results",
            body: "What actually happened — in the brand's own words, no inflated numbers.",
          },
        ],
      },
      process: {
        eyebrow: "How the reels get made",
        heading: "From brief to your feed — the honest way.",
        steps: [
          {
            title: "The brief",
            body: "We align on goals, audience and disclosure up front — no surprises, brand-safe from the first message.",
          },
          {
            title: "I live with it",
            body: "Days of real, everyday use — not a five-minute demo. The verdict only lands because it's earned.",
          },
          {
            title: "Script & shoot",
            body: "A plain-words take, written thumb-first and shot to be watched to the very last second.",
          },
          {
            title: "Edit & deliver",
            body: "Cut, captioned and colour-matched, delivered with usage rights and revisions built in.",
          },
        ],
      },
      cta: {
        script: "seen enough?",
        heading: "Let's make something honest.",
        primaryLabel: "Work with me ↗",
        secondaryLabel: "Read her story →",
      },
    },
  });
  payload.logger.info("Seeded work page.");

  // Reels come last: they are the only part that uploads to Vercel Blob, so a
  // Blob misconfiguration cannot block the text content above.
  const existing = await payload.find({ collection: "reels", limit: 1 });
  if (existing.totalDocs > 0) {
    payload.logger.info("Reels already exist — skipping reel seed.");
  } else {
    // One shared placeholder clip today — every reel points at it until
    // Varsheni uploads per-reel video in the admin.
    const video = await payload.create({
      collection: "videos",
      data: {},
      filePath: path.join(publicDir, "work/reels/sample.mp4"),
    });
    payload.logger.info("Uploaded placeholder video.");

    let order = 0;
    for (const { slug, ...reel } of REELS) {
      const poster = await payload.create({
        collection: "media",
        data: { alt: `${reel.subject} reel poster` },
        filePath: path.join(publicDir, `work/posters/${slug}.jpg`),
      });

      await payload.create({
        collection: "reels",
        data: { ...reel, video: video.id, poster: poster.id, order: order++ },
      });
    }
    payload.logger.info(`Seeded ${REELS.length} reels with posters.`);
  }

  process.exit(0);
};

await seed();
