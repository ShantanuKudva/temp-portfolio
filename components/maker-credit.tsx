/**
 * Global maker credit — a plain "made by" line with an email, sitting directly
 * on each page's background (no banner/card) at the very bottom. Rendered above
 * the pinned gradual-blur via z-index so it stays crisp.
 */
export function MakerCredit() {
  return (
    <footer className="relative z-[60] px-6 pb-14 pt-12 text-center">
      <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-creme/45">
        <span className="text-amber-dot">✦</span>&nbsp;&nbsp;Made by Shantanu
        Kudva&nbsp;&nbsp;·&nbsp;&nbsp;
        <a
          href="mailto:kudvashantanu2002@gmail.com"
          className="tracking-normal normal-case text-creme/55 transition-colors hover:text-amber-dot"
        >
          kudvashantanu2002@gmail.com
        </a>
      </p>
    </footer>
  );
}
