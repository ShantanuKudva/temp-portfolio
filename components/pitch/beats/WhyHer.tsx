import BeatShell from '../BeatShell';
import { PILLARS } from '@/lib/pitchContent';
import { Card, CardContent } from '@/components/ui/card';

export default function WhyHer() {
  return (
    <BeatShell>
      <p className="mb-8 font-mono text-[13px] uppercase tracking-[0.32em] text-[#B08D4C]">Why her, not the other 10,000</p>
      <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
        {PILLARS.map((p) => (
          <Card key={p.n} className="border-none bg-white/[0.03] py-7 ring-1 ring-[#B08D4C]/25">
            <CardContent className="flex flex-col gap-3">
              <span className="font-mono text-[13px] text-[#B08D4C]">{p.n}</span>
              <h3 className="text-[26px] font-bold text-white">{p.title}</h3>
              <p className="text-[15px] leading-relaxed text-[#EADFCF]/60">{p.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </BeatShell>
  );
}
