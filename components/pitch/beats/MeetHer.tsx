import BeatShell from '../BeatShell';
import { MEET, STATS, PORTRAIT_SRC } from '@/lib/pitchContent';

export default function MeetHer() {
  return (
    <BeatShell>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[340px_1fr] md:items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-[#B08D4C]/50 shadow-2xl"
             style={{ background: PORTRAIT_SRC ? undefined : 'linear-gradient(160deg,#3a2226,#7B1E2B 55%,#2A1A1C)' }}>
          {PORTRAIT_SRC
            ? <img src={PORTRAIT_SRC} alt="Varsheni" className="h-full w-full object-cover" />
            : <span className="absolute inset-0 grid place-items-center font-mono text-[12px] tracking-[0.3em] text-white/40">HER PHOTO</span>}
        </div>
        <div>
          <p className="mb-2 font-mono text-[13px] uppercase tracking-[0.32em] text-[#B08D4C]">Meet the creator</p>
          <h2 className="text-white font-extrabold tracking-[-0.02em] text-[clamp(30px,4vw,52px)]">{MEET.name}</h2>
          <p className="my-4 text-[14px] uppercase tracking-[0.14em] text-[#B08D4C]">{MEET.role}</p>
          <p className="max-w-[42ch] text-[17px] leading-relaxed text-[#EADFCF]/70">{MEET.bio}</p>
          <div className="mt-7 flex gap-8">
            {STATS.map((s) => (
              <div key={s.label}>
                <b className="block text-[26px] font-extrabold text-white">{s.value}</b>
                <span className="text-[12px] uppercase tracking-[0.1em] text-[#EADFCF]/50">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BeatShell>
  );
}
