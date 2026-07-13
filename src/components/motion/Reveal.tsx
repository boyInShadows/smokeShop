"use client";

import { m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export type RevealDir = "up" | "down" | "left" | "right" | "none";

/**
 * Scroll-in reveal. Fires once when the element enters the viewport, then stays.
 *
 * Only `transform` and `opacity` are animated — both compositor-thread. Children
 * are passed through from the server, so wrapping a server component in this
 * costs one small client boundary, not a client-side subtree.
 *
 * Under `prefers-reduced-motion` the movement is dropped and only the fade
 * remains — a fade is acceptable feedback; a hard cut just looks broken.
 *
 * ⚠️ HOW that drop happens matters. `initial` is IDENTICAL in both paths, and the
 * reduced-motion case is expressed entirely in `transition`. Two reasons, and
 * both were real bugs:
 *
 *  1. `initial` is what Motion renders into the SERVER's HTML. `useReducedMotion()`
 *     is `false` on the server and `true` on the client's first render, so varying
 *     `initial` by it means the client hydrates against markup that disagrees with
 *     it — a guaranteed mismatch error on every reduced-motion visit.
 *  2. Deferring the value until after mount does NOT fix that, it just hides it:
 *     Motion reads `initial` exactly once, at mount, so by the time the real
 *     preference lands the "from" state is already captured and the element still
 *     travels its full 36px. The preference would be honoured too late to matter.
 *
 * `transition` is re-read on every render and never reaches the HTML, so it is the
 * safe place to branch. Snapping x/y to their end value in zero time removes the
 * travel — and the snap happens while the element is still at `opacity: 0`, so
 * nothing is visibly displaced.
 *
 * NOTE ON DIRECTION + RTL: these are PHYSICAL directions. `transform` has no
 * logical equivalent — `x: -32` moves left in an RTL document too. That's on
 * purpose here (a visual sweep, not a reading-order thing), but never assume a
 * translate will mirror itself.
 */
const OFFSET: Record<RevealDir, { x?: number; y?: number }> = {
  up: { y: 28 },
  down: { y: -28 },
  left: { x: -36 },
  right: { x: 36 },
  none: {},
};

export default function Reveal({
  children,
  dir = "up",
  delay = 0,
  amount = 0.25,
  className,
}: {
  children: ReactNode;
  dir?: RevealDir;
  delay?: number;
  /** How much of the element must be visible before it fires (0–1). */
  amount?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  // Snap, don't animate. A per-value transition overrides the top-level one, so
  // the transform lands instantly while opacity still fades over 0.3s.
  const SNAP = { duration: 0 };

  return (
    <m.div
      className={className}
      initial={{ opacity: 0, ...OFFSET[dir] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: reduce ? 0.3 : 0.6,
        delay: reduce ? 0 : delay,
        ease: [0.16, 1, 0.3, 1], // ease-out-expo: fast out, long settle
        ...(reduce && { x: SNAP, y: SNAP }),
      }}
    >
      {children}
    </m.div>
  );
}
