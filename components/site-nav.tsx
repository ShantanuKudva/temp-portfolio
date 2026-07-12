import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Reels", href: "#reels" },
];

export function SiteNav({ className }: { className?: string }) {
  return (
    <nav
      className={cn(
        "relative z-40 flex items-center justify-between px-6 py-6 sm:px-12 sm:py-7",
        className
      )}
    >
      <a
        href="#top"
        className="font-display text-xl italic font-semibold text-creme"
      >
        Varsheni
      </a>
      <div className="flex items-center gap-6 sm:gap-8 text-[11px] uppercase tracking-[0.16em] text-creme/90">
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="hidden opacity-80 transition-opacity hover:opacity-100 sm:inline"
          >
            {l.label}
          </a>
        ))}
        <a
          href="#contact"
          className="rounded-full border border-taupe/40 px-4 py-2 transition-colors hover:bg-creme hover:text-espresso"
        >
          Inquire ↗
        </a>
      </div>
    </nav>
  );
}
