import type { Metadata } from "next";
import { WorkPage } from "@/components/work/work-page";

export const metadata: Metadata = {
  title: "Work — Varsheni",
  description: "Reels and honest reviews of the apps and businesses worth your tap.",
};

export default function Page() {
  return <WorkPage />;
}
