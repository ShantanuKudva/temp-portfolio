"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIntro } from "@/components/hero/intro-store";
import { useCurtain } from "@/components/transition/curtain-store";
import { NavCardBg } from "@/components/nav-card-bg";
import GlassSurface from "@/components/GlassSurface";

type NavLink = { label: string; href: string; ariaLabel?: string };
type Effect = "colorbends" | "strands" | "aurora";
type NavItem = {
  label: string;
  effect: Effect;
  colors: string[]; // palette (ColorBends / Strands / Aurora colorStops)
  grad: string; // the card's colour gradient
  links: NavLink[];
};

const ITEMS: NavItem[] = [
  {
    label: "Work",
    effect: "colorbends",
    colors: ["#9a1a2c", "#5b0f1a", "#38070f"],
    grad: "linear-gradient(150deg, #5b0f1a 0%, #380710 100%)",
    links: [
      { label: "Reels", href: "#reels", ariaLabel: "Watch the reels" },
      { label: "Reviews", href: "#work", ariaLabel: "See the reviews" },
    ],
  },
  {
    label: "About",
    effect: "strands",
    colors: ["#b79e8c", "#6b4e42", "#3b2a24"],
    grad: "linear-gradient(150deg, #3b2a24 0%, #221812 100%)",
    links: [
      { label: "Her story", href: "#about", ariaLabel: "About Varsheni" },
      { label: "Values", href: "#about", ariaLabel: "Her values" },
    ],
  },
  {
    label: "Connect",
    effect: "aurora",
    // Bright warm stops so the aurora actually glows over the dark base.
    colors: ["#f3e6cf", "#d9a05b", "#a8674a"],
    grad: "linear-gradient(150deg, #3f2d25 0%, #201410 100%)",
    links: [
      { label: "Inquire", href: "#contact", ariaLabel: "Work with me" },
      { label: "Instagram", href: "#", ariaLabel: "Instagram" },
      { label: "YouTube", href: "#", ariaLabel: "YouTube" },
    ],
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function CardNav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [entered, setEntered] = useState(false);
  const lastY = useRef(0);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  const heroIn = useIntro((s) => s.heroIn);
  const introAnimate = useIntro((s) => s.animate);
  const entrance = introAnimate && !reduce;
  const startTransition = useCurtain((s) => s.start);

  // Route through the curtain transition instead of navigating directly.
  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    startTransition(href);
  };

  // After the drop-in completes, switch to a snappy transition for scroll-hide.
  useEffect(() => {
    if (heroIn && entrance && !entered) {
      const t = setTimeout(() => setEntered(true), 1400);
      return () => clearTimeout(t);
    }
  }, [heroIn, entrance, entered]);

  // Hide on scroll down, reveal on scroll up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const goingDown = y > lastY.current;
    if (goingDown && y > 90) {
      setHidden(true);
      setOpen(false);
    } else {
      setHidden(false);
    }
    lastY.current = y;
  });

  return (
    <motion.div
      initial={entrance ? { y: "-160%" } : false}
      style={{ x: "-50%" }}
      animate={{ y: (entrance && !heroIn) || hidden ? "-160%" : "0%" }}
      transition={
        entrance && !entered
          ? { duration: 0.6, ease: EASE, delay: 0.15 }
          : { duration: reduce || !introAnimate ? 0 : 0.45, ease: EASE }
      }
      className="fixed left-1/2 top-5 z-[99] w-[92%] max-w-3xl"
    >
      <motion.nav
        initial={false}
        animate={{ height: open ? "auto" : 60 }}
        transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EASE }}
        className={cn(
          "relative overflow-hidden rounded-4xl border shadow-[0_8px_30px_rgba(0,0,0,0.28)] transition-colors duration-300",
          // Matte glass (crème text) when closed; solid crème (espresso text) when open.
          open
            ? "border-taupe/30 bg-creme text-espresso"
            : "border-creme/20 bg-transparent text-creme",
        )}
      >
        {/* Refractive glass surface behind the bar when closed. */}
        {!open && (
          <GlassSurface
            width="100%"
            height="100%"
            borderRadius={32}
            backgroundOpacity={0.06}
            blur={11}
            displace={0.6}
            distortionScale={-110}
            saturation={1.4}
            brightness={58}
            opacity={0.9}
            style={{ position: "absolute", inset: 0 }}
          />
        )}
        <div className="relative z-10 flex h-15 items-center justify-between px-3 pl-5">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-full flex-col items-center justify-center gap-[6px]"
          >
            <span
              className={cn(
                "h-[2px] w-[30px] transition-all duration-300",
                open ? "translate-y-[4px] rotate-45 bg-espresso" : "bg-creme"
              )}
            />
            <span
              className={cn(
                "h-[2px] w-[30px] transition-all duration-300",
                open ? "-translate-y-[4px] -rotate-45 bg-espresso" : "bg-creme"
              )}
            />
          </button>

          <a
            href="#top"
            onClick={go("#top")}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-xl italic font-semibold"
          >
            Varsheni
          </a>

          <a
            href="#contact"
            onClick={go("#contact")}
            className="flex h-[calc(100%-12px)] items-center rounded-xl bg-wine px-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-creme transition-colors hover:bg-espresso"
          >
            Inquire ↗
          </a>
        </div>

        <div
          className="flex flex-col gap-2 p-2 sm:h-[200px] sm:flex-row sm:items-stretch"
          aria-hidden={!open}
        >
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={false}
              animate={open ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 0.4, ease: EASE, delay: open ? i * 0.06 : 0 }
              }
              className="relative flex min-h-[120px] flex-1 flex-col overflow-hidden rounded-3xl p-4 sm:min-h-0"
              style={{ color: "var(--color-creme)" }}
            >
              <NavCardBg
                effect={item.effect}
                colors={item.colors}
                grad={item.grad}
                active={open}
              />
              <div className="relative z-10 font-display text-2xl">
                {item.label}
              </div>
              <div className="relative z-10 mt-auto flex flex-col gap-1 pt-4">
                {item.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    onClick={go(l.href)}
                    aria-label={l.ariaLabel ?? l.label}
                    className="inline-flex items-center gap-1.5 text-sm text-creme/85 transition-opacity hover:opacity-70"
                  >
                    <ArrowUpRight className="size-4" aria-hidden />
                    {l.label}
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.nav>
    </motion.div>
  );
}
