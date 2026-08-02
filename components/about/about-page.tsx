"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import StrandsBase from "@/components/Strands";
import { Reveal } from "@/components/motion/reveal";
import { PageBottomBlur } from "@/components/effects/page-bottom-blur";
import { LogoWall } from "./logo-wall";
import { WhoIAm } from "./who-i-am";
import { WhatIBring } from "./what-i-bring";
import { AuroraRegion } from "./aurora-region";
import { AboutCta } from "./cta";
import { Seal } from "./seal";
import styles from "./about.module.css";
import type { AboutContent } from "@/lib/content/map/about";

// JS-interop components — flexible props (their .jsx infers strict types from defaults).
const Strands = StrandsBase as unknown as React.ComponentType<
  Record<string, unknown>
>;


const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// A scattered, twinkling ✦ — a restrained decorative "prop".
function Sparkle({
  className,
  size = 16,
  delay = 0,
}: {
  className?: string;
  size?: number;
  delay?: number;
}) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute font-script text-amber-dot ${styles.twinkle} ${className ?? ""}`}
      style={{ fontSize: size, animationDelay: `${delay}s` }}
    >
      ✦
    </span>
  );
}

export function AboutPage({ content }: { content: AboutContent }) {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <main
      className="relative flex-1 text-creme"
      style={{ background: "linear-gradient(165deg, #2a1c14 0%, #1a120d 45%)" }}
    >
      {/* ═══ Story + values (sticky-portrait split) ═══ */}
      <section
        id="story"
        ref={sectionRef}
        className="relative scroll-mt-24 md:grid md:grid-cols-[46%_54%]"
      >
        {/* ── LEFT: pinned parallax portrait, feathered into the velvet ── */}
        <div className="relative h-[64vh] overflow-hidden md:sticky md:top-0 md:h-screen">
          <motion.div
            className={`absolute inset-0 ${styles.photoMask}`}
            style={{ scale: 0.92 }}
          >
            <Image
              src="/varsheni-3.png"
              alt="Varsheni, bathed in warm light"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 46vw"
              className="object-cover object-[50%_28%]"
            />
          </motion.div>
          {/* Only a soft bottom vignette (for the name) — no hard edge overlay. */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
            style={{
              background: "linear-gradient(0deg, rgba(26,18,13,0.85), transparent)",
            }}
          />
          {/* Vertical side-label running up the far edge. */}
          <span
            className={`absolute left-4 top-1/2 -translate-y-1/2 font-sans text-[10px] uppercase tracking-[0.34em] text-creme/45 sm:left-6 ${styles.sideText}`}
          >
            {content.props.sideLabel}
          </span>
        </div>

        {/* ── RIGHT: scrolling velvet column ── */}
        <div className="relative overflow-hidden">
          {/* Strands ambience up top — the About signature, tinted taupe/mocha. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[460px] opacity-45">
            <Strands
              colors={["#b79e8c", "#6b4e42", "#8a5c4a"]}
              count={4}
              speed={0.32}
              glow={2.4}
              intensity={0.5}
              scale={1.5}
              amplitude={1.1}
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 40% at 85% 8%, rgba(217,160,91,0.18), transparent 60%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
            style={{ backgroundImage: GRAIN, backgroundSize: "160px 160px" }}
          />

          {/* Sparkle props. */}
          <Sparkle className="right-10 top-24" size={20} />
          <Sparkle className="left-8 top-[42%]" size={13} delay={1.4} />
          <Sparkle className="right-16 top-[68%]" size={16} delay={2.6} />

          <div className="relative z-10 flex flex-col gap-14 px-7 pb-24 pt-32 sm:px-14 sm:pb-28 md:min-h-screen md:justify-center md:py-32">
            {/* Availability pill (prop) */}
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-dot/40 bg-amber-dot/10 px-4 py-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-amber-dot">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-dot opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-dot" />
                </span>
                {content.hero.availability}
              </span>
            </Reveal>

            {/* Intro */}
            <div className="space-y-5">
              <Reveal>
                <p className="font-sans text-xs font-medium uppercase tracking-[0.34em] text-amber-dot">
                  <span>✦</span>&nbsp;&nbsp;{content.hero.eyebrow}
                </p>
              </Reveal>
              <Reveal delay={0.06}>
                <h1
                  className="font-display text-4xl leading-[1.08] sm:text-5xl lg:text-[3.4rem]"
                  style={{ textShadow: "0 0 40px rgba(217,160,91,0.12)" }}
                >
                  {content.hero.headline}
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <div className={`${styles.rule} w-32`} />
              </Reveal>
              <Reveal delay={0.14}>
                <p className="max-w-md font-sans text-[15px] leading-relaxed text-creme/70 sm:text-base">
                  {content.hero.intro}
                </p>
              </Reveal>
            </div>

            {/* Bio */}
            <div className="max-w-md space-y-5">
              {content.hero.bio.map((text, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <p className="font-sans text-[15px] leading-relaxed text-creme/75 sm:text-base">
                    {text}
                  </p>
                </Reveal>
              ))}
              <Reveal delay={0.14}>
                <p className="font-script text-3xl text-amber-dot">
                  {content.hero.signature}
                </p>
              </Reveal>
            </div>

            {/* Values — editorial numbered rows */}
            <div id="values" className="scroll-mt-24">
              <Reveal>
                <p className="mb-6 font-sans text-xs font-medium uppercase tracking-[0.3em] text-taupe">
                  {content.values.eyebrow}
                </p>
              </Reveal>
              <div className="flex flex-col gap-3">
                {content.values.items.map((v, i) => (
                  <Reveal
                    key={v.title}
                    delay={i * 0.05}
                    className="group flex gap-5 rounded-2xl bg-creme/[0.03] p-4 transition-colors hover:bg-creme/[0.06]"
                  >
                    <span className="font-display text-lg text-amber-dot/70 transition-colors group-hover:text-amber-dot">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="mb-1 font-display text-xl text-creme">
                        {v.title}
                      </h3>
                      <p className="max-w-sm font-sans text-[13.5px] leading-relaxed text-creme/60">
                        {v.body}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Pull-quote + framed second portrait + seal */}
            <div className="relative flex flex-col-reverse items-start gap-7 pt-4 sm:flex-row sm:items-center">
              <Reveal className="min-w-0 flex-1">
                <p className="font-display text-2xl leading-snug text-creme sm:text-[1.7rem]">
                  &ldquo;{content.quote.text}&rdquo;
                </p>
                <p className="mt-4 font-sans text-xs uppercase tracking-[0.24em] text-creme/50">
                  {content.quote.attribution}
                </p>
              </Reveal>
              <Reveal delay={0.1} className="relative w-32 shrink-0 sm:w-40">
                <div className="overflow-hidden rounded-2xl border border-creme/15 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.7)]">
                  <Image
                    src="/varsheni-4.png"
                    alt="Varsheni"
                    width={512}
                    height={512}
                    className="h-full w-full object-cover"
                  />
                </div>
                <Seal text={content.props.sealText} className="absolute -bottom-7 -left-7 h-20 w-20 opacity-90" />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Who I am + What I bring — shared Aurora backdrop ═══ */}
      <AuroraRegion>
        <WhoIAm content={content.whoIAm} />
        <WhatIBring content={content.bring} />
      </AuroraRegion>

      {/* ═══ On my radar — logo wall ═══ */}
      <LogoWall content={content.radar} />

      {/* ═══ Let's talk — Silk CTA ═══ */}
      <AboutCta content={content.cta} />


      {/* Bottom gradual blur — fades out as the footer arrives (stays crisp). */}
      <PageBottomBlur />
    </main>
  );
}
