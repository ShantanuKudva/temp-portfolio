'use client';
import { useEffect, useRef, type ReactNode } from 'react';

// The landing→portfolio handoff. After the landing's phone push-through to black,
// the portfolio must CROSSFADE in place — not slide up into view.
//
// We can't use a GSAP pin here: pinning reparents the DOM node into a .pin-spacer,
// and this subtree is full of live React components (carousel, every Reveal) that
// re-render — React and GSAP then fight over the moved nodes and the whole tree
// crashes (insertBefore NotFoundError), taking the 3D canvas down with it.
//
// Instead we HOLD the portfolio at the top of the viewport with a `translateY`
// (a transform never reparents the DOM, so React stays happy) while its opacity
// ramps 0→1, then release it to normal scroll. Visually identical to a pin — the
// content sits still and fades up out of the black — but safe.
const START_VH = 0.75; // portfolio top must rise to this fraction of the viewport before it holds+fades

export default function PortfolioReveal({ children }: { children: ReactNode }) {
  const sentinel = useRef<HTMLDivElement>(null); // untransformed probe → the portfolio's *natural* top
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = sentinel.current;
    const c = content.current;
    if (!s || !c) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const top = s.getBoundingClientRect().top;
      const start = window.innerHeight * START_VH;
      if (top >= start) {
        // Still below the hold zone: invisible, left in natural flow.
        c.style.opacity = '0';
        c.style.transform = '';
      } else if (top > 0) {
        // In the hold zone: pin it to the viewport top (translateY(-top)) and fade in.
        // The entry snap happens at opacity 0, so it's invisible; the exit at top=0
        // lands transform=0/opacity=1, seamless with the released state below.
        c.style.opacity = (1 - top / start).toFixed(3);
        c.style.transform = `translateY(${(-top).toFixed(1)}px)`;
      } else {
        // Released: fully opaque, back in normal flow, scrolls like any page.
        c.style.opacity = '1';
        c.style.transform = '';
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div>
      <div ref={sentinel} aria-hidden style={{ height: 0 }} />
      {/* position+z-index put this ABOVE the landing curtain (z-5). The transform
          used for the hold already makes this a stacking context, so a child z-index
          alone can't escape it — the z-index has to live here. */}
      <div ref={content} style={{ position: 'relative', zIndex: 10, opacity: 0, willChange: 'opacity, transform' }}>
        {children}
      </div>
    </div>
  );
}
