"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import LightRaysBase from "@/components/LightRays";
import { Reveal } from "@/components/motion/reveal";

// JS-interop component — flexible props (its .jsx infers strict types from defaults).
const LightRays = LightRaysBase as unknown as React.ComponentType<
  Record<string, unknown>
>;

const EASE = [0.16, 1, 0.3, 1] as const;

const BRING = [
  {
    n: "01",
    title: "Honest reviews",
    body: "No paid praise. If it isn't worth your tap, I say so — on camera, in plain words. That honesty is exactly why the recommendation lands.",
  },
  {
    n: "02",
    title: "Real, hands-on testing",
    body: "Days of living with the product before a single line of script gets written.",
  },
  {
    n: "03",
    title: "Brand-safe & clear",
    body: "Disclosure-first, always on-brand, never clickbait.",
  },
  {
    n: "04",
    title: "Thumb-stopping craft",
    body: "Short-form built to be watched to the very last second.",
  },
  {
    n: "05",
    title: "Apps & businesses",
    body: "From the app you open every morning to the small brand worth knowing.",
  },
];

function Card({
  item,
  featured = false,
  delay = 0,
  dimmed,
  hovered,
  onHover,
  className = "",
}: {
  item: (typeof BRING)[number];
  featured?: boolean;
  delay?: number;
  dimmed: boolean;
  hovered: boolean;
  onHover: (v: boolean) => void;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: reduce ? 0.3 : 0.7, ease: EASE, delay }}
      className={`group relative flex overflow-hidden rounded-3xl border bg-gradient-to-br from-[#3b2a24]/90 via-[#2a1c14]/85 to-[#140d09]/92 backdrop-blur-md transition-[filter,opacity,border-color] duration-300 ${
        hovered ? "border-amber-dot/50" : "border-creme/12"
      } ${dimmed ? "opacity-45 blur-[3px]" : "opacity-100 blur-0"} ${
        featured ? "min-h-[18rem] p-9 sm:p-11" : "min-h-[13rem] p-7 sm:p-8"
      } ${className}`}
    >
      {/* LightRays — fade in on hover, fade out before unmount (no flash). */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="rays"
            className="absolute inset-0"
            style={{ zIndex: 1, isolation: "isolate" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            aria-hidden
          >
            <LightRays
              raysOrigin="top-center"
              raysColor="#e7b878"
              raysSpeed={1.3}
              lightSpread={0.7}
              rayLength={1.5}
              followMouse
              mouseInfluence={0.2}
              noiseAmount={0.08}
              distortion={0.03}
              saturation={1}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Giant faint number watermark. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-3 bottom-0 select-none font-display leading-[0.8] text-creme/[0.06]"
        style={{ fontSize: featured ? "13rem" : "8.5rem" }}
      >
        {item.n}
      </span>
      {/* Top sheen. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-creme/25 to-transparent"
      />

      <div className="relative z-10 flex flex-col">
        <div className="mb-4 flex items-center gap-3">
          <span className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-amber-dot">
            {item.n} / 05
          </span>
          <span className="h-px w-9 bg-amber-dot/50" />
        </div>
        <h3
          className={`mb-2.5 font-display ${featured ? "text-3xl sm:text-[2.6rem] sm:leading-tight" : "text-2xl sm:text-[1.7rem]"}`}
        >
          {item.title}
        </h3>
        <p
          className={`font-sans leading-relaxed text-creme/70 ${featured ? "max-w-md text-base" : "max-w-xs text-[14.5px]"}`}
        >
          {item.body}
        </p>
      </div>
    </motion.div>
  );
}

/**
 * "What I bring to the table" — value-props as a bento of chocolate glass cards.
 * Hovering a card ignites LightRays inside it and blurs the rest into focus.
 * Aurora backdrop comes from the shared AuroraRegion wrapper.
 */
export function WhatIBring() {
  const [hovered, setHovered] = useState<number | null>(null);
  const set = (i: number) => (v: boolean) =>
    setHovered((cur) => (v ? i : cur === i ? null : cur));

  return (
    <section id="bring" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        {/* Section intro: the pitch beside her face. */}
        <div className="mb-12 grid items-center gap-8 sm:gap-12 md:grid-cols-[1.35fr_1fr]">
          <div>
            <Reveal>
              <p className="mb-3 font-sans text-xs font-medium uppercase tracking-[0.3em] text-amber-dot">
                <span>✦</span>&nbsp;&nbsp;What I bring to the table
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="max-w-xl font-display text-3xl leading-tight sm:text-5xl">
                Five reasons the review is worth trusting.
              </h2>
            </Reveal>
          </div>

          {/* Portrait — edges feathered into the velvet (no hard frame). */}
          <Reveal delay={0.12} className="md:justify-self-end">
            <div
              className="relative aspect-[4/5] w-full max-w-[20rem]"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, #000 16%, #000 84%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 10%, #000 88%, transparent 100%)",
                WebkitMaskComposite: "source-in",
                maskImage:
                  "linear-gradient(to right, transparent 0%, #000 16%, #000 84%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 10%, #000 88%, transparent 100%)",
                maskComposite: "intersect",
              }}
            >
              <Image
                src="/varsheni-4.png"
                alt="Varsheni"
                fill
                sizes="(max-width: 768px) 90vw, 20rem"
                className="object-cover object-[50%_22%]"
              />
              {/* Chocolate floor + amber warmth for cohesion with the cards. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 45%, rgba(20,13,9,0.6) 100%), radial-gradient(90% 60% at 50% 12%, rgba(217,160,91,0.14), transparent 65%)",
                }}
              />
            </div>
          </Reveal>
        </div>

        {/* Bento: a wide featured card + a 2×2 of the rest. */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {BRING.map((item, i) => (
            <Card
              key={item.n}
              item={item}
              featured={i === 0}
              delay={i * 0.06}
              hovered={hovered === i}
              dimmed={hovered !== null && hovered !== i}
              onHover={set(i)}
              className={i === 0 ? "md:col-span-2" : ""}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
