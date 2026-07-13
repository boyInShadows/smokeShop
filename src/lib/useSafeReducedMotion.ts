"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * `prefers-reduced-motion`, made safe to branch RENDERED OUTPUT on.
 *
 * Motion's own `useReducedMotion()` reads `matchMedia` synchronously, so it is
 * already `true` on the client's very first render — while on the server it is
 * always `false`, because there is no media query during SSR. Any component that
 * renders different markup for the two values therefore hydrates against HTML
 * that disagrees with it, and React throws a mismatch. That was one real console
 * error on every reduced-motion visit.
 *
 * `useSyncExternalStore` is the primitive built for exactly this: React uses
 * `getServerSnapshot` both when server-rendering AND for the client's hydration
 * render, so the two agree by construction. Once hydration is done it switches to
 * `getSnapshot`, notices the preference, and re-renders. No effect, no `setState`
 * during mount (React 19 lints that as a cascading render), and it keeps tracking
 * the setting live if the user toggles it in the OS.
 *
 * ⚠️ ONLY use this where the branch feeds something React re-reads on every
 * render — `style`, `className`, children. It is the WRONG tool for Motion's
 * `initial`, which is consumed once at mount and never looked at again: the
 * hydration render still says `false`, so the "from" state is captured with the
 * motion offset baked in and the element animates in anyway. The preference gets
 * honoured, just too late to matter.
 *
 * Components in that situation (`Reveal`, `SplitText`) instead keep their markup
 * completely unconditional and vary only `transition`, which IS re-read — see the
 * notes in those files. Nothing to defer, nothing to mismatch.
 */
function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;

// The server has no media query, so it cannot know. `false` (motion allowed) is
// the only honest answer — and being the *hydration* snapshot too, it is what
// makes the first client render match the HTML.
const getServerSnapshot = () => false;

export function useSafeReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
