"use client";

import { m, useTransform, type MotionValue } from "motion/react";
import type { HeroFlavor } from "@/lib/data";
import { formatToman, toFaDigits } from "@/lib/format";
import { ChevronIcon } from "../icons";

/**
 * One flavour's product introduction. Rises in as its colour lands on the smoke,
 * holds while that flavour owns the stage, then clears out as the next takes over.
 *
 * Motion is *scrubbed*, not triggered: every value is a pure function of scroll
 * position, so scrolling back up plays it in reverse. Only `opacity` and
 * `transform` are animated — both compositor-thread.
 */

// Each row enters slightly after the one above it. Keep this small: with 5 rows
// the last one starts 4x this late, and it still has to finish arriving before
// the beat's `out` window opens — otherwise the panel leaves while it's landing.
const ROW_STAGGER = 0.01;

/**
 * Build a row's scrubbed opacity + lift from the flavour's window.
 *
 * The input range ALWAYS spans the full 0->1 domain. A range that stops short
 * does not reliably clamp — the value climbs back up past its last stop, which
 * is what once left the ice layer bleeding cyan into the amber beat.
 */
function useRow(
  progress: MotionValue<number>,
  win: HeroFlavor["window"],
  delay: number
) {
  const inStart = win.in[0] + delay;
  const inEnd = win.in[1] + delay;

  // Rows enter staggered but leave together — a block exit reads as one gesture.
  const stops = win.out
    ? [0, inStart, inEnd, win.out[0], win.out[1], 1]
    : [0, inStart, inEnd, 1];
  const fade = win.out ? [0, 0, 1, 1, 0, 0] : [0, 0, 1, 1];
  const lift = win.out ? [30, 30, 0, 0, -24, -24] : [30, 30, 0, 0];

  return {
    opacity: useTransform(progress, stops, fade),
    y: useTransform(progress, stops, lift),
  };
}

export default function FlavorPanel({
  flavor,
  progress,
  reduce,
  active,
}: {
  flavor: HeroFlavor;
  progress: MotionValue<number>;
  reduce: boolean;
  /** Shown statically under reduced motion (the first flavour only). */
  active: boolean;
}) {
  // Five rows, fixed order — these are hooks, so the count must never vary.
  const eyebrow = useRow(progress, flavor.window, 0);
  const title = useRow(progress, flavor.window, ROW_STAGGER);
  const desc = useRow(progress, flavor.window, ROW_STAGGER * 2);
  const specs = useRow(progress, flavor.window, ROW_STAGGER * 3);
  const buy = useRow(progress, flavor.window, ROW_STAGGER * 4);

  const still = (visible: boolean) => ({ opacity: visible ? 1 : 0 });

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center">
      <div className="w-full">
        {/* Eyebrow — the only place the flavour's neon touches type. */}
        <m.div
          style={reduce ? still(active) : eyebrow}
          className="flex items-center gap-2"
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: flavor.to }}
          />
          <span
            className="text-xs font-bold tracking-wide"
            style={{ color: flavor.to }}
          >
            طعم · {flavor.note}
          </span>
        </m.div>

        <m.h2
          style={reduce ? still(active) : title}
          className="mt-3 text-4xl font-black leading-[1.2] sm:text-5xl lg:text-6xl"
        >
          {flavor.name}
        </m.h2>

        <m.p
          style={reduce ? still(active) : desc}
          className="mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-base"
        >
          {flavor.desc}
        </m.p>

        <m.ul
          style={reduce ? still(active) : specs}
          className="mt-5 flex flex-wrap gap-2"
        >
          <li className="rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs font-semibold text-text backdrop-blur-sm">
            <bdi>{flavor.device}</bdi>
          </li>
          {flavor.specs.map((spec) => (
            <li
              key={spec}
              className="rounded-full border border-border bg-surface/40 px-3 py-1.5 text-xs text-muted backdrop-blur-sm"
            >
              {spec}
            </li>
          ))}
        </m.ul>

        <m.div
          style={reduce ? still(active) : buy}
          className="mt-7 flex flex-wrap items-center gap-4"
        >
          <a
            href={flavor.href}
            className="pointer-events-auto flex items-center gap-1.5 rounded-xl px-6 py-3 font-bold text-bg transition hover:brightness-110"
            style={{
              backgroundColor: flavor.to,
              boxShadow: `0 8px 40px -8px ${flavor.to}80`,
            }}
          >
            {flavor.cta}
            <ChevronIcon className="h-4 w-4 rtl:-scale-x-100" />
          </a>

          <div className="leading-tight">
            {flavor.oldPrice && (
              <span className="block text-xs text-muted line-through">
                {formatToman(flavor.oldPrice)}
              </span>
            )}
            <span className="block font-black text-text">
              {formatToman(flavor.price)}
            </span>
          </div>

          {flavor.oldPrice && (
            <span
              className="rounded-full px-2.5 py-1 text-[11px] font-bold text-bg"
              style={{ backgroundColor: flavor.to }}
            >
              {toFaDigits(
                Math.round(
                  ((flavor.oldPrice - flavor.price) / flavor.oldPrice) * 100
                )
              )}
              ٪ تخفیف
            </span>
          )}
        </m.div>
      </div>
    </div>
  );
}
