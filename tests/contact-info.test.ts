import { CONTACT, MAIL_TEMPLATES, PACKAGES } from "@/lib/contact-info";

test("PACKAGES has three tiers, each with a 'from ₹' price and deliverables", () => {
  expect(PACKAGES).toHaveLength(3);
  for (const p of PACKAGES) {
    expect(p.name.length).toBeGreaterThan(0);
    expect(p.priceFrom).toMatch(/from ₹/);
    expect(p.deliverables.length).toBeGreaterThan(0);
  }
  // keys are unique (used as React keys)
  expect(new Set(PACKAGES.map((p) => p.key)).size).toBe(3);
});

test("MAIL_TEMPLATES each have a label, subject, and body", () => {
  expect(MAIL_TEMPLATES.length).toBeGreaterThan(0);
  for (const t of MAIL_TEMPLATES) {
    expect(t.label.length).toBeGreaterThan(0);
    expect(t.subject.length).toBeGreaterThan(0);
    expect(t.body.length).toBeGreaterThan(0);
  }
  expect(new Set(MAIL_TEMPLATES.map((t) => t.key)).size).toBe(MAIL_TEMPLATES.length);
});

test("CONTACT exposes an email, cal link, and both socials", () => {
  expect(CONTACT.email).toContain("@");
  expect(CONTACT.calLink.length).toBeGreaterThan(0);
  expect(CONTACT.instagram).toMatch(/^https?:\/\//);
  expect(CONTACT.youtube).toMatch(/^https?:\/\//);
  expect(CONTACT.responseTime.length).toBeGreaterThan(0);
});
