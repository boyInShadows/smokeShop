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

  const from = reduce ? { opacity: 0 } : { opacity: 0, ...OFFSET[dir] };

  return (
    <m.div
      className={className}
      initial={from}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: reduce ? 0.3 : 0.6,
        delay: reduce ? 0 : delay,
        ease: [0.16, 1, 0.3, 1], // ease-out-expo: fast out, long settle
      }}
    >
      {children}
    </m.div>
  );
}
