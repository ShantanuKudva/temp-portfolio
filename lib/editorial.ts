// Pure scroll-motion helpers for the editorial portfolio. No DOM — DOM wiring
// lives in the components; keeping the math here makes it unit-testable and
// keeps every rAF callback trivial.

export const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);

// Hermite smoothstep. 0 at/below e0, 1 at/above e1, eased in between.
export function smoothstep(e0: number, e1: number, x: number): number {
  if (e0 === e1) return x < e0 ? 0 : 1;
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}

// Small vertical parallax offset (px) for an element whose viewport-relative top
// is `top`. Zero at viewport centre; positive above centre, negative below.
// `strength` ~0.06–0.14 of the viewport height.
export function parallaxY(top: number, vh: number, strength: number): number {
  const centered = (top - vh / 2) / vh; // -0.5..+0.5 as it crosses the viewport
  return -centered * vh * strength;
}
