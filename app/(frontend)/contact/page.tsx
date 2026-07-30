import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/contact-page";
import { getPackages } from "@/lib/content/rate-card";
import { getContact, getMailTemplates } from "@/lib/content/site-settings";

// Content is CMS-driven and must reflect admin edits immediately.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Connect — Varsheni",
  description: "Work with Varsheni — brand deals, honest reviews, and collaborations.",
};

export default async function Page() {
  const [packages, contact, mailTemplates] = await Promise.all([
    getPackages(),
    getContact(),
    getMailTemplates(),
  ]);
  return (
    <ContactPage packages={packages} contact={contact} mailTemplates={mailTemplates} />
  );
}
