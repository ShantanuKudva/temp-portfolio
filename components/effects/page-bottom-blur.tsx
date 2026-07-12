"use client";

import { useEffect, useState } from "react";
import { GradualBlur } from "./gradual-blur";
import { lenisRef } from "@/lib/lenis";

/**
 * The page-level bottom GradualBlur, but scroll-aware: it fades out as the
 * bottom of the page (the maker-credit footer) arrives, so the footer renders
 * crisp instead of under the frosted band. Keeps the dissolve everywhere else.
 */
export function PageBottomBlur({
  height = "5.5rem",
  strength = 3.2,
  threshold = 150,
}: {
  height?: string;
  strength?: number;
  threshold?: number;
}) {
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      const remaining =
        document.documentElement.scrollHeight -
        (window.scrollY + window.innerHeight);
      setAtBottom(remaining < threshold);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const lenis = lenisRef.current;
    lenis?.on?.("scroll", onScroll);
    raf = requestAnimationFrame(check);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      lenis?.off?.("scroll", onScroll);
    };
  }, [threshold]);

  return (
    <div
      style={{
        opacity: atBottom ? 0 : 1,
        transition: "opacity 0.3s ease",
      }}
    >
      <GradualBlur
        position="bottom"
        target="page"
        height={height}
        strength={strength}
      />
    </div>
  );
}
