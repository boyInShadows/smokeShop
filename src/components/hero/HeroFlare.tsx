"use client";

import { m, useSpring, useTransform, useVelocity, type MotionValue } from "motion/react";

/**
 * Velocity flare — the plume itself brightens on a fast scroll, then settles.
 *
 * Untinted: the raw greyscale plate, screen-blended, so it lifts whatever colour
 * the smoke currently is instead of washing it toward white.
 *
 * ── Why this is its own component, mounted DESKTOP-ONLY ───────────────────────
 * It is a *fourth* full-viewport `mix-blend-screen` layer, and it is driven by a
 * `useVelocity`→`useSpring` rAF that ticks the whole time you scroll. On a phone
 * that is exactly the cost we are cutting — a mobile GPU cannot afford a fourth
 * screen-blend layer per frame, and the spring rAF is pure main-thread tax. By
 * living in a child that the stage renders only when `heavy` (desktop), the hooks
 * *and* the layer *and* the rAF simply do not exist on mobile. Keeping the hooks
 * in the stage and gating only the JSX would still run the spring rAF on phones.
 */
export default function HeroFlare({
  progress,
  smokeY,
}: {
  progress: MotionValue<number>;
  smokeY: MotionValue<string>;
}) {
  const velocity = useVelocity(progress);
  // Capped at 0.24: the flare is a second copy of the plate, so it thickens the
  // smoke as well as brightening it. Past ~0.3 the denser plume eats the contrast
  // of the flavour headline sitting on top of it.
  const flareRaw = useTransform(velocity, (v: number) =>
    Math.min(Math.abs(v) * 0.25, 0.24)
  );
  // A spring on ONE derived value that drives a GPU property is safe — it is not
  // on `progress`, so nothing else loses its compositor path.
  const flare = useSpring(flareRaw, { stiffness: 120, damping: 30, mass: 0.3 });
  // Sits a touch wider than the plume it lifts, so it reads as a bloom around the
  // smoke rather than a second copy sitting exactly on top.
  const flareScale = useTransform(progress, [0, 1], [1.04, 1.13]);

  return (
    <m.div
      aria-hidden
      style={{
        opacity: flare,
        y: smokeY,
        scale: flareScale,
        backgroundImage: "var(--hero-smoke)",
      }}
      className="pointer-events-none absolute -inset-[8%] z-[6] bg-cover bg-center mix-blend-screen will-change-transform"
    />
  );
}
