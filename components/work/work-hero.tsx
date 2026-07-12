"use client";

import { Reveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import styles from "./work.module.css";

/**
 * Work page hero — availability pill, eyebrow, Playfair headline with the shared
 * hairline rule, and a Montserrat sub-line (same language as About's intro).
 */
export function WorkHero() {
  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-36 sm:px-10 sm:pt-40">
      {/* Scattered sparkle props. */}
      <span
        aria-hidden
        className={`pointer-events-none absolute right-[14%] top-40 font-script text-amber-dot ${styles.twinkle}`}
        style={{ fontSize: 20 }}
      >
        ✦
      </span>
      <span
        aria-hidden
        className={`pointer-events-none absolute left-[8%] top-56 font-script text-amber-dot ${styles.twinkle}`}
        style={{ fontSize: 13, animationDelay: "1.6s" }}
      >
        ✦
      </span>

      <div className="mx-auto max-w-6xl">
        <Parallax speed={28}>
          <div className="space-y-6">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-dot/40 bg-amber-dot/10 px-4 py-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-amber-dot">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-dot opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-dot" />
                </span>
                Available for brand deals
              </span>
            </Reveal>

            <Reveal delay={0.05}>
              <p className="font-sans text-xs font-medium uppercase tracking-[0.34em] text-amber-dot">
                <span>✦</span>&nbsp;&nbsp;The Work
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <h1
                className="max-w-3xl font-display text-4xl leading-[1.06] sm:text-6xl lg:text-[4rem]"
                style={{ textShadow: "0 0 40px rgba(217,160,91,0.12)" }}
              >
                Reviews worth your tap.
              </h1>
            </Reveal>

            <Reveal delay={0.14}>
              <div className={`${styles.rule} w-32`} />
            </Reveal>

            <Reveal delay={0.18}>
              <p className="max-w-xl font-sans text-[15px] leading-relaxed text-creme/70 sm:text-base">
                Every reel here is an app or a business I actually lived with —
                used it the way you would, then said plainly whether it earns a
                place on your home screen.
              </p>
            </Reveal>
          </div>
        </Parallax>
      </div>
    </section>
  );
}
