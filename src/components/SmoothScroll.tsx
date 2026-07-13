"use client";

import { ReactLenis } from "lenis/react";
import { LazyMotion, domAnimation, useReducedMotion } from "motion/react";

/**
 * App-wide motion + scroll provider.
 *
 * `LazyMotion` + `domAnimation` is what lets every `m.*` component in the tree
 * work: importing bare `motion.*` anywhere costs a flat 34 KB that the bundler
 * cannot tree-shake, while `m` + this feature bundle is ~19.6 KB total. It has
 * to live above everything that uses `m`.
 *
 * Lenis: modern Lenis drives the browser's *native* scroll rather than
 * transform-hijacking a wrapper, so `position: sticky`, anchor links and
 * keyboard scrolling all keep working — this is not scrolljacking.
 *
 * Two rules that are easy to get wrong:
 *  - Lenis is OFF under prefers-reduced-motion. The lerp is exactly the
 *    vestibular trigger that media query exists for. (LazyMotion stays — the
 *    individual animations handle reduced motion themselves.)
 *  - `globals.css` must use `overflow-x: clip`, never `hidden` — `hidden` makes
 *    the root a scroll container and silently breaks every `sticky` below it.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <LazyMotion features={domAnimation} strict>
      {reduce ? (
        children
      ) : (
        <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
          {children}
        </ReactLenis>
      )}
    </LazyMotion>
  );
}
