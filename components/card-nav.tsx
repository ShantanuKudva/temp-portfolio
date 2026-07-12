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

type NavLink = { label: string; href: string; ariaLabel?: string };
type NavItem = { label: string; bg: string; links: NavLink[] };

const ITEMS: NavItem[] = [
  {
    label: "Work",
    bg: "var(--color-wine)",
    links: [
      { label: "Reels", href: "#reels", ariaLabel: "Watch the reels" },
      { label: "Reviews", href: "#work", ariaLabel: "See the reviews" },
    ],
  },
  {
    label: "About",
    bg: "var(--color-espresso)",
    links: [
      { label: "Her story", href: "#about", ariaLabel: "About Varsheni" },
      { label: "Values", href: "#about", ariaLabel: "Her values" },
    ],
  },
  {
    label: "Connect",
    bg: "var(--color-mocha)",
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
        className="overflow-hidden rounded-2xl border border-taupe/30 bg-creme text-espresso shadow-[0_8px_30px_rgba(0,0,0,0.28)]"
      >
        <div className="relative flex h-[60px] items-center justify-between px-3 pl-5">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-full flex-col items-center justify-center gap-[6px]"
          >
            <span
              className={cn(
                "h-[2px] w-[30px] bg-espresso transition-transform duration-300",
                open && "translate-y-[4px] rotate-45"
              )}
            />
            <span
              className={cn(
                "h-[2px] w-[30px] bg-espresso transition-transform duration-300",
                open && "-translate-y-[4px] -rotate-45"
              )}
            />
          </button>

          <a
            href="#top"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-xl italic font-semibold text-espresso"
          >
            Varsheni
          </a>

          <a
            href="#contact"
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
              className="flex min-h-[120px] flex-1 flex-col rounded-xl p-4 sm:min-h-0"
              style={{ backgroundColor: item.bg, color: "var(--color-creme)" }}
            >
              <div className="font-display text-2xl">{item.label}</div>
              <div className="mt-auto flex flex-col gap-1 pt-4">
                {item.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
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
