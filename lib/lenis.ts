import type Lenis from "lenis";

/**
 * Shared handle to the app's single Lenis instance (created in SmoothScroll).
 * Lets the page-transition curtain drive smooth-scroll-aware jumps to in-page
 * anchors without prop-drilling the instance.
 */
export const lenisRef: { current: Lenis | null } = { current: null };
