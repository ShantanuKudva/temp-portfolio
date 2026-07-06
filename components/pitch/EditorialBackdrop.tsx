// Bottom layer of the portfolio: opaque warm-dark ground + two maroon radial
// glows + a faint film-grain wash. Rendered at -z-10 INSIDE the portfolio's z-10
// stacking context, so it covers the fixed 3D canvas (z-0) and landing curtain
// (z-5) while every section paints above it. Absolute (not fixed) — the parent
// carries will-change:transform, which would trap a fixed child; absolute over
// the full portfolio height looks identical for a static texture. Non-interactive.
const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E";

export default function EditorialBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#160C0E]">
      <div className="absolute -left-[12%] top-[6%] h-[46vw] w-[46vw] rounded-full bg-[#7B1E2B]/20 blur-[130px]" />
      <div className="absolute -right-[14%] top-[52%] h-[40vw] w-[40vw] rounded-full bg-[#571620]/25 blur-[140px]" />
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-soft-light"
        style={{ backgroundImage: `url("${GRAIN}")`, backgroundSize: '140px 140px' }}
      />
    </div>
  );
}
