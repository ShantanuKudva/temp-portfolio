import { FOOTER_LINKS } from '@/lib/pitchContent';
import { Separator } from '@/components/ui/separator';

const COLS = [
  { h: 'Explore', links: FOOTER_LINKS.explore },
  { h: 'Connect', links: FOOTER_LINKS.connect },
  { h: 'Legal', links: FOOTER_LINKS.legal },
];

export default function PitchFooter() {
  return (
    <footer className="relative z-10 border-t border-[#B08D4C]/25 bg-[#140A0C] px-[7vw] pb-10 pt-[70px]">
      <div className="grid max-w-[1100px] grid-cols-2 gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <h4 className="text-[26px] font-extrabold text-white">Varsheni</h4>
          <p className="mt-3 max-w-[34ch] text-[14px] leading-relaxed text-[#EADFCF]/50">Tech UGC creator. Reviews of apps &amp; businesses that make your product make sense — in sixty seconds, zero fluff.</p>
        </div>
        {COLS.map((c) => (
          <div key={c.h}>
            <h5 className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[#B08D4C]">{c.h}</h5>
            {c.links.map((l) => (
              <a key={l.label} href={l.href} className="mb-3 block text-[14px] text-[#EADFCF]/70 hover:text-white">{l.label}</a>
            ))}
          </div>
        ))}
      </div>
      <Separator className="my-8 max-w-[1100px] bg-[#EADFCF]/12" />
      <div className="flex max-w-[1100px] flex-wrap justify-between gap-3 text-[12px] text-[#EADFCF]/40">
        <span>© 2026 Varsheni. All rights reserved.</span>
        <span className="font-mono">Made with clarity, not fluff.</span>
      </div>
    </footer>
  );
}
