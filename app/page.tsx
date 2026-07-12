import { Hero } from "@/components/hero/hero";
import { GradualBlur } from "@/components/effects/gradual-blur";

export default function Page() {
  return (
    <main className="flex-1">
      <Hero />
      <GradualBlur position="bottom" height="7rem" />
    </main>
  );
}
