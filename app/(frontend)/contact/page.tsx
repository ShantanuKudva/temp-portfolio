import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/contact-page";

export const metadata: Metadata = {
  title: "Connect — Varsheni",
  description: "Work with Varsheni — brand deals, honest reviews, and collaborations.",
};

export default function Page() {
  return <ContactPage />;
}
