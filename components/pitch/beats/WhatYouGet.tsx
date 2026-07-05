import BeatShell from '../BeatShell';
import { CHIPS } from '@/lib/pitchContent';
import { Badge } from '@/components/ui/badge';

export default function WhatYouGet() {
  return (
    <BeatShell>
      <p className="mb-6 font-mono text-[13px] uppercase tracking-[0.32em] text-[#B08D4C]">What you get</p>
      <p className="text-white font-extrabold leading-[1.05] tracking-[-0.02em] text-[clamp(34px,5.6vw,64px)]">
        One 60-second review.
        <br />
        <span className="text-[#EADFCF]/[0.42]">Yours to run anywhere.</span>
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        {CHIPS.map((c) => (
          <Badge
            key={c.text}
            variant="outline"
            className="h-auto rounded-full border-[#B08D4C]/35 bg-white/[0.03] px-4 py-2 text-[14px] font-normal text-[#EADFCF]/75"
          >
            {c.pre && <b className="mr-1.5 font-bold text-white">{c.pre}</b>}
            {c.text}
          </Badge>
        ))}
      </div>
      <p className="mt-8 max-w-[52ch] text-[15px] leading-relaxed text-[#EADFCF]/55">Bigger campaign? Series, multi-platform cuts and long-form are on the table — say the word.</p>
    </BeatShell>
  );
}
