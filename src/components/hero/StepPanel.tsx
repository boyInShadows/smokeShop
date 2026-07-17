"use client";

import type { HeroFlavor } from "@/lib/data";
import { formatToman, toFaDigits } from "@/lib/format";
import { ChevronIcon } from "../icons";

/**
 * One flavour's product introduction, for the MOBILE SNAP-STEPPER.
 *
 * The desktop hero uses `FlavorPanel`, which *scrubs* each row from a scroll
 * MotionValue (`useRow(progress)`). The stepper has no scroll progress — it has a
 * discrete `active` beat — so this is the same content driven the cheap way: the
 * WHOLE panel fades + lifts in as one block on a CSS transition when its beat
 * becomes active, and clears when it doesn't. No Motion values, no per-frame work.
 *
 * Content is not duplicated: every string/price comes from `flavor` (in data.ts)
 * and the shared `formatToman`/`toFaDigits` helpers — only the layout markup lives
 * here, deliberately kept apart from FlavorPanel so the desktop scrub stays exactly
 * as it is. Block motion (not per-row stagger) is also lighter, which is the point
 * on mobile.
 *
 * `backdrop-blur` is intentionally absent (it is desktop-only in the chips): on a
 * phone a backdrop-filter re-samples the backdrop every frame it animates.
 */
export default function StepPanel({
  flavor,
  active,
}: {
  flavor: HeroFlavor;
  active: boolean;
}) {
  return (
    <div
      aria-hidden={!active}
      // Fills its parent region and centres — the parent (in HeroStepStage) is the
      // lower stage band, so the whole panel including the CTA sits above the fold.
      // 750ms ease-out-expo = the "0.75s animation on scroll" the beat plays; off
      // beat it sits at opacity 0, lifted, and ignores input.
      className={`absolute inset-0 mx-auto flex max-w-7xl items-center px-4 sm:px-6 transition-[opacity,transform] duration-[750ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        active
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <div className="w-full">
        {/* Eyebrow — the only place the flavour's neon touches type. */}
        <div className="flex items-center gap-2">
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
        </div>

        <h2 className="mt-3 text-4xl font-black leading-[1.2] sm:text-5xl">
          {flavor.name}
        </h2>

        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-base">
          {flavor.desc}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          <li className="rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs font-semibold text-text">
            <bdi>{flavor.device}</bdi>
          </li>
          {flavor.specs.map((spec) => (
            <li
              key={spec}
              className="rounded-full border border-border bg-surface/40 px-3 py-1.5 text-xs text-muted"
            >
              {spec}
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-wrap items-center gap-4">
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
        </div>
      </div>
    </div>
  );
}
