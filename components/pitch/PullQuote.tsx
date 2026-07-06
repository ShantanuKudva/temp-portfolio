import type { ReactNode } from 'react';

// Oversized italic-serif pull-quote with a gold quotation mark. Fraunces carries
// the editorial voice; the mark is decorative (aria-hidden).
export default function PullQuote({
  children, cite, className = '',
}: {
  children: ReactNode;
  cite?: string;
  className?: string;
}) {
  return (
    <figure className={`relative ${className}`}>
      <span aria-hidden className="absolute -left-1 -top-7 select-none font-serif italic leading-none text-[#B08D4C]/40 text-[clamp(60px,9vw,120px)]">“</span>
      <blockquote className="relative text-balance font-serif italic leading-[1.08] tracking-[-0.01em] text-white text-[clamp(28px,4.4vw,52px)]">
        {children}
      </blockquote>
      {cite && <figcaption className="mt-5 font-mono text-[12px] uppercase tracking-[0.24em] text-[#B08D4C]">{cite}</figcaption>}
    </figure>
  );
}
