"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useCurtain } from "./curtain-store";

/**
 * An anchor that routes through the velvet curtain transition instead of a hard
 * navigation. Shared by the nav and every in-page CTA so all route changes wipe
 * with the same curtain.
 */
export function CurtainLink({
  href,
  children,
  className,
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  const start = useCurtain((s) => s.start);

  return (
    <a
      href={href}
      aria-label={ariaLabel}
      onClick={(e) => {
        e.preventDefault();
        start(href);
      }}
      className={cn(className)}
    >
      {children}
    </a>
  );
}
