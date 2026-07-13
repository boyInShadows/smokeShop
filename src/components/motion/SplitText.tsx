"use client";

import { m, useReducedMotion } from "motion/react";

/**
 * Headline that assembles WORD BY WORD, each word springing into place with a
 * slight overshoot — the "buzz".
 *
 * ⚠️ WORDS, NOT LETTERS — and this is not a stylistic choice.
 *
 * Persian is a cursive script: letters JOIN to their neighbours and change shape
 * depending on position (initial / medial / final / isolated). Wrapping each
 * character in its own element breaks the shaping engine, so "نعناع" renders as
 * five disconnected isolated glyphs instead of one connected word. It looks
 * broken, and no amount of CSS fixes it.
 *
 * A word is the smallest unit you can safely animate in Persian. Splitting on
 * spaces keeps every word an intact shaping run, so the letters stay joined.
 * (Latin has no such constraint, but mixing two strategies in one RTL document
 * is not worth the complexity.)
 *
 * ⚠️ THE MARKUP IS THE SAME IN BOTH PATHS. This used to early-return a single
 * plain `<span>` under `prefers-reduced-motion`, which meant the component
 * rendered a completely different DOM depending on a media query — and a media
 * query does not exist on the server, so `useReducedMotion()` was `false` during
 * SSR and `true` on the client's first render. The two trees disagreed and
 * hydration threw. Deferring the value past mount would not have helped either:
 * Motion consumes `initial` once, at mount, so the words would still have flown
 * in for someone who asked for no motion.
 *
 * So: always render the words, and express reduced motion in `transition` only —
 * it is re-read every render and never reaches the HTML. Under reduce the whole
 * line fades as one (no stagger, no spring) and the lift/tilt snap to their end
 * values in zero time, while the word is still invisible at `opacity: 0`.
 */
export default function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.05,
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  // One fade for the whole line: every word shares the same timing (no stagger),
  // and the lift/tilt are snapped rather than animated.
  const SNAP = { duration: 0 };
  const still = {
    opacity: { duration: 0.3 },
    y: SNAP,
    rotate: SNAP,
  };

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <m.span
          key={`${word}-${i}`}
          // `inline-block` is what makes a word transformable at all — inline
          // elements ignore transform. The gap between words must come from a
          // logical margin, NOT a space character: whitespace at the edge of an
          // inline-block is collapsed away, so the words would run together.
          className="inline-block me-[0.25em]"
          initial={{ opacity: 0, y: "0.5em", rotate: -4 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={
            reduce
              ? still
              : {
                  type: "spring",
                  stiffness: 380,
                  damping: 18, // under-damped on purpose: overshoots, then settles
                  delay: delay + i * stagger,
                }
          }
        >
          {word}
        </m.span>
      ))}
    </Tag>
  );
}
