"use client";

import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";
import { useIsDesktop } from "@/lib/useIsDesktop";
import HeroScrollStage from "./HeroScrollStage";
import HeroStepStage from "./HeroStepStage";

/**
 * Picks the right hero for the surface:
 *
 *   mobile + motion  → HeroStepStage   (snap-stepper — no per-frame scrub)
 *   desktop          → HeroScrollStage (the full 250vh scroll scrub)
 *   reduced motion   → HeroScrollStage (which resolves to its static frame)
 *
 * Both signals are `useSyncExternalStore` hooks that return `false` on the server,
 * so SSR renders the stepper and there is no hydration mismatch. Desktop mounts
 * the scrub client-side after hydration — the same accepted post-hydration swap we
 * already rely on, and it keeps the heavy scroll machinery off mobile entirely.
 *
 * The stepper deliberately owns ONLY mobile-with-motion; routing reduced motion to
 * HeroScrollStage reuses its already-built, verified static composed frame instead
 * of carrying a second static path here.
 */
export default function HeroSection() {
  const isDesktop = useIsDesktop();
  const reduce = useSafeReducedMotion();

  if (!reduce && !isDesktop) return <HeroStepStage />;
  return <HeroScrollStage />;
}
