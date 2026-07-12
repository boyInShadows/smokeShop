"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";

/**
 * Smooth scroll. Modern Lenis drives the browser's *native* scroll rather than
 * transform-hijacking a wrapper, so `position: sticky`, anchor links and
 * keyboard scrolling all keep working — this is not scrolljacking.
 *
 * Two rules that are easy to get wrong:
 *  - OFF under prefers-reduced-motion. The lerp is exactly the vestibular
 *    trigger that media query exists for, so we mount plain native scroll.
 *  - `globals.css` must use `overflow-x: clip`, never `hidden` — `hidden` makes
 *    the root a scroll container and silently breaks every `sticky` below it.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
