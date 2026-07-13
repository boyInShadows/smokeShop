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
 * Three rules that are easy to get wrong:
 *  - Smoothing is OFF under prefers-reduced-motion. The lerp is exactly the
 *    vestibular trigger that media query exists for. (LazyMotion stays — the
 *    individual animations handle reduced motion themselves.)
 *  - ...but that is done through Lenis's OPTIONS, never by branching the tree.
 *    See below.
 *  - `globals.css` must use `overflow-x: clip`, never `hidden` — `hidden` makes
 *    the root a scroll container and silently breaks every `sticky` below it.
 *
 * ── Why the reduced-motion branch is in the options, not the JSX ─────────────
 * This used to read `{reduce ? children : <ReactLenis>{children}</ReactLenis>}`,
 * which was wrong twice over:
 *
 *  1. `useReducedMotion()` is `false` on the server and `true` on the client's
 *     first render, so the two trees disagreed and hydration threw.
 *  2. Deferring the value past mount would only trade that for something worse:
 *     flipping between a Fragment and a `ReactLenis` changes the element type at
 *     that position, so React would unmount and remount THE ENTIRE APP — every
 *     component below it loses its state (the age gate reopens) and the scroll
 *     position resets. For reduced-motion users only. A miserable bug to chase.
 *
 * Driving it through `options` avoids the choice entirely: `<ReactLenis root>`
 * renders its children straight through a context provider and emits no wrapper
 * DOM of its own, so mounting it unconditionally is invisible to hydration — the
 * markup is byte-identical either way. Lenis re-inits when the options object
 * changes, so the preference still takes full effect, it just does so without
 * touching the React tree.
 *
 * `lerp: 1` means "arrive this frame" (no interpolation) and `smoothWheel: false`
 * hands the wheel back to the browser: together that is native scrolling. Touch
 * is already native (`syncTouch` defaults off), as are keyboard and anchor jumps.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <LazyMotion features={domAnimation} strict>
      <ReactLenis
        root
        options={{ lerp: reduce ? 1 : 0.1, smoothWheel: !reduce }}
      >
        {children}
      </ReactLenis>
    </LazyMotion>
  );
}
