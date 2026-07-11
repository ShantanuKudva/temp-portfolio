import { Button } from "@/components/ui/button";

// v2 — clean slate. The 3D landing has been retired; this is the starting point
// for the next build. Uses the retained shadcn/ui + Tailwind design system so the
// foundation is ready to build on.
export default function Page() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
      <span className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
        Varsheni · v2
      </span>
      <h1 className="max-w-[16ch] text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
        Clean slate.
      </h1>
      <p className="max-w-[46ch] text-pretty text-base leading-relaxed text-muted-foreground">
        The starting point for v2. Same toolchain — Next.js, Tailwind, and the
        shadcn/ui component library — with the 3D landing removed.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="lg">Get started</Button>
        <Button size="lg" variant="outline">
          Learn more
        </Button>
      </div>
    </main>
  );
}
