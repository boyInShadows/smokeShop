"use client";

import { useSyncExternalStore } from "react";

// 1024px — the same line the rest of the hero already draws. Lenis engages here,
// and the hero switches to its side-by-side `lg:` layout here, so "phone/tablet"
// vs "desktop" is one consistent breakpoint across the whole feature.
const QUERY = "(min-width: 1024px)";

/**
 * "Is this a desktop viewport?", made safe to branch RENDERED OUTPUT on.
 *
 * Same shape as `useSafeReducedMotion` — and for the same reason. Reading
 * `matchMedia` during render gives one answer on the client's first paint and a
 * different one on the server (there is no media query during SSR), so any
 * component that renders different markup for the two hydrates against HTML it
 * disagrees with and React throws a mismatch.
 *
 * `useSyncExternalStore` uses `getServerSnapshot` for BOTH the server render AND
 * the client's hydration render, so the two agree by construction; only after
 * hydration does it switch to `getSnapshot`, read the real viewport, and re-render.
 * No effect, no `setState`-in-effect (React 19 lints that), and it tracks live
 * resizes across the breakpoint for free.
 *
 * ── Why `false` on the server ────────────────────────────────────────────────
 * The hero's cheap, static path is the one we want the server to emit: a phone
 * should get the static frame from the very first byte, and it is also the correct
 * hydration snapshot so nothing mismatches. Desktop then mounts the heavy scrubbed
 * hero client-side, after hydration — which as a bonus keeps the hero's whole
 * Motion tree out of mobile hydration entirely.
 */
function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;

// The server has no viewport. `false` (treat as non-desktop → static hero) is the
// only honest answer, and being the *hydration* snapshot too, it is what makes the
// first client render match the server's HTML.
const getServerSnapshot = () => false;

export function useIsDesktop(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
