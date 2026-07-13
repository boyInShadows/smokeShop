"use client";

import { useCallback, useSyncExternalStore } from "react";
import { DEFAULT_THEME, THEME_KEY, isThemeId, type ThemeId } from "./themes";

/**
 * Read + write the active palette.
 *
 * The source of truth is the `data-theme` attribute on <html>, NOT React state.
 * It is set before first paint by the inline script in `layout.tsx`, which is what
 * stops a themed visitor from seeing a flash of the default palette. React only
 * observes it.
 *
 * ⚠️ Observed via `useSyncExternalStore`, for the same reason `useSafeReducedMotion`
 * exists: the stored theme lives in `localStorage`, which the server cannot read.
 * Branching rendered output on it directly would mean the server renders "dusk is
 * active" and the client's first render says "ember is active" — a hydration
 * mismatch. `getServerSnapshot` backs BOTH the SSR render and the hydration render,
 * so the two agree by construction; React then reads the real value and re-renders.
 *
 * Nothing visual depends on that one-frame delay: the *colours* are already correct
 * before paint (CSS variables, set by the script), and the only thing this hook
 * feeds is the dropdown's tick mark — which lives inside a menu that starts closed.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): ThemeId {
  const value = document.documentElement.dataset.theme;
  return isThemeId(value) ? value : DEFAULT_THEME;
}

// The server has no <html> to read and no localStorage. The default is the only
// honest answer — and being the hydration snapshot too, it is what keeps the first
// client render in agreement with the HTML.
const getServerSnapshot = (): ThemeId => DEFAULT_THEME;

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((id: ThemeId) => {
    // Write to the DOM, not to React state: every themed utility on the page is
    // already pointing at `var(--color-…)`, so flipping the attribute re-paints
    // the whole site with no re-render at all. The MutationObserver above then
    // tells React about it, purely so the tick mark can follow.
    document.documentElement.dataset.theme = id;
    try {
      localStorage.setItem(THEME_KEY, id);
    } catch {
      // Private mode / storage disabled. The theme still applies for this visit;
      // it just will not be remembered. Not worth surfacing to the user.
    }
  }, []);

  return { theme, setTheme };
}
