import { Marquee } from '@/components/ui/marquee';
import { APP_LOGOS, type AppLogo } from '@/lib/appLogos';

// The apps & tools she reviews — a single scrolling track of the top logos.
// Real brand marks (downloaded to /public/assets/logos) in clean tiles with the
// name as a lockup. Pauses on hover. Swap which 10 by reordering lib/appLogos.
const LOGOS = APP_LOGOS.slice(0, 10);

function Item({ logo }: { logo: AppLogo }) {
  return (
    <div className="flex items-center gap-3.5 whitespace-nowrap px-2">
      {/* real brand favicon, bare (no tile); plain img keeps it a static asset */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/assets/logos/${logo.slug}.png`}
        alt={logo.name}
        width={48}
        height={48}
        loading="lazy"
        className="h-12 w-12 shrink-0 rounded-[22%] object-contain"
      />
      <span className="text-2xl font-semibold text-[#EADFCF]/90">{logo.name}</span>
    </div>
  );
}

export default function AppLogos() {
  return (
    <div className="relative flex w-full items-center">
      <Marquee pauseOnHover className="[--duration:34s] [--gap:4rem]">
        {LOGOS.map((logo) => <Item key={logo.slug} logo={logo} />)}
      </Marquee>
      {/* fade the edges so logos enter/leave softly */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-[#160C0E] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-[#160C0E] to-transparent" />
    </div>
  );
}
