"use client";

import { RADAR_LOGOS, type RadarLogo } from "@/lib/radar-logos";
import { Reveal } from "@/components/motion/reveal";
import styles from "./about.module.css";

function Mark({ logo }: { logo: RadarLogo }) {
  return (
    <span
      className="mx-5 inline-flex shrink-0 items-center gap-3 opacity-55 transition-opacity duration-300 hover:opacity-100 sm:mx-8"
      title={logo.name}
    >
      {/* Real brand mark (rounded app-icon style — these favicons carry baked
          backgrounds, so a flat crème tint would just square them out). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/assets/logos/${logo.slug}.png`}
        alt={logo.name}
        width={32}
        height={32}
        loading="lazy"
        className="h-7 w-7 shrink-0 rounded-[24%] object-contain sm:h-8 sm:w-8"
      />
      <span className="hidden font-sans text-sm tracking-wide text-creme/75 sm:inline">
        {logo.name}
      </span>
    </span>
  );
}

function Row({ logos, reverse }: { logos: RadarLogo[]; reverse?: boolean }) {
  return (
    <div className={styles.marqueeMask}>
      <div
        className={`${styles.marquee} ${reverse ? styles.marqueeReverse : ""}`}
      >
        {/* rendered twice so the loop is seamless */}
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
            {logos.map((l) => (
              <Mark key={`${copy}-${l.name}`} logo={l} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * "On my radar" — a monochrome crème logo wall of the apps & brands Varsheni is
 * interested in reviewing. Two marquee rows drifting opposite ways over the
 * velvet. Placeholder set (reused from v1) until real reviewed brands land.
 */
export function LogoWall() {
  const half = Math.ceil(RADAR_LOGOS.length / 2);
  const top = RADAR_LOGOS.slice(0, half);
  const bottom = RADAR_LOGOS.slice(half);

  return (
    <section
      id="radar"
      className="relative scroll-mt-24 overflow-hidden py-20 sm:py-24"
    >
      <div className="mx-auto mb-12 max-w-6xl px-6 sm:px-10">
        <Reveal>
          <p className="mb-3 font-sans text-xs font-medium uppercase tracking-[0.3em] text-amber-dot">
            <span>✦</span>&nbsp;&nbsp;On my radar
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="max-w-xl font-display text-3xl leading-tight sm:text-4xl">
            The apps &amp; businesses I&apos;m itching to review next.
          </h2>
        </Reveal>
      </div>
      <div className="flex flex-col gap-7">
        <Row logos={top} />
        <Row logos={bottom} reverse />
      </div>
    </section>
  );
}
