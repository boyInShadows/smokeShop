"use client";

import { useEffect } from "react";
import { LazyMotion, domAnimation } from "motion/react";

/**
 * App-wide motion + scroll provider.
 *
 * `LazyMotion` + `domAnimation` is what lets every `m.*` component in the tree
 * work: importing bare `motion.*` anywhere costs a flat 34 KB that the bundler
 * cannot tree-shake, while `m` + this feature bundle is ~19.6 KB total. It has
 * to live above everything that uses `m`.
 *
 * ── Lenis is DESKTOP-ONLY, and loaded dynamically ────────────────────────────
 * Phones do not get it, for two reasons. It earns nothing there — iOS and Android
 * already have excellent native momentum scrolling, which Lenis would replace with
 * a JS lerp — and mobile is exactly where we cannot afford it: the landing page
 * was 209 KB of gzipped JS against a 150 KB budget, with total blocking time at
 * 539 ms against 200 ms. `import("lenis")` keeps it in its own chunk that a phone
 * never downloads, parses, or executes, and skips a permanent rAF loop.
 *
 * It is also skipped entirely under `prefers-reduced-motion`: the lerp IS the
 * vestibular trigger that media query exists for. Native scrolling is the correct
 * reduced-motion behaviour, not a Lenis configured to feel native.
 *
 * ── Why an effect, and not <ReactLenis> wrapping the children ────────────────
 * A wrapper would have to appear and disappear with the breakpoint, and swapping
 * a component in/out at that position changes the element TYPE there — React
 * unmounts and remounts the entire app below it, so the age gate reopens and the
 * scroll position is lost. Driving Lenis imperatively from an effect leaves the
 * children at a fixed position in the tree, so there is nothing to remount and
 * nothing for hydration to disagree about. (Lenis drives the browser's *native*
 * scroll rather than transform-hijacking a wrapper, so `position: sticky`, anchor
 * links, keyboard scrolling and Motion's `useScroll` all keep working regardless.)
 *
 * `globals.css` must use `overflow-x: clip`, never `hidden` — `hidden` makes the
 * root a scroll container and silently breaks every `sticky` below it.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let frame = 0;
    let disposed = false;

    const start = async () => {
      if (lenis || !desktop.matches || reduce.matches) return;

      const { default: Lenis } = await import("lenis");
      // The import is async: the breakpoint or the preference may have changed
      // (or the component unmounted) while it was in flight. Re-check.
      if (disposed || lenis || !desktop.matches || reduce.matches) return;

      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      const loop = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      lenis?.destroy();
      lenis = null;
    };

    // Re-evaluated whenever the user resizes across the breakpoint or toggles the
    // motion preference — not just once at mount.
    const sync = () => {
      if (desktop.matches && !reduce.matches) void start();
      else stop();
    };

    sync();
    desktop.addEventListener("change", sync);
    reduce.addEventListener("change", sync);

    return () => {
      disposed = true;
      desktop.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
      stop();
    };
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
