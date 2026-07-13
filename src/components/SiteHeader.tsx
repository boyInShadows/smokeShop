"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";

/**
 * Fixed header: compliance ticker on top, navbar beneath.
 *
 * ── Why fixed, and not sticky ───────────────────────────────────────────────
 * While the ticker + navbar sat in normal flow they pushed the hero down by their
 * own height (~100px), so the hero's `100svh` sticky stage started 100px down the
 * page and its bottom 100px fell below the fold — the hero's own CTAs were cut off
 * until you scrolled past the header. Out of flow, the hero is exactly one viewport
 * at every scroll position. The hero pads its content by `--header-h` so nothing
 * hides underneath, and `globals.css` gives `section[id]` a matching
 * `scroll-margin-top` so anchor jumps don't land under it either.
 *
 * ── Why the ticker collapses on scroll ──────────────────────────────────────
 * A fixed header would otherwise pin the ticker on screen forever: ~40px stolen
 * from every viewport, on a phone, with a marquee animating in the corner of your
 * eye the entire visit. In flow it used to just scroll away. So it still does —
 * it collapses the moment you leave the top. You get the compliance line on
 * arrival (which is the point of it, for a regulated product) and the height back
 * while you browse.
 *
 * The ticker is passed in as a prop rather than imported, so it stays a SERVER
 * component — importing it here would drag it and its data into the client bundle
 * for no reason. Only the scroll flag needs to be client-side.
 */
export default function SiteHeader({ ticker }: { ticker: React.ReactNode }) {
  // Starts `false` on server and client alike, so there is nothing for hydration
  // to disagree about; the real value lands on the first scroll event.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        // `grid-template-rows` 1fr -> 0fr is the one way to transition a collapse
        // whose natural height you don't know. `max-height` needs a magic number
        // that silently clips the day someone adds a second line of ticker text.
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          scrolled ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"
        }`}
        aria-hidden={scrolled}
      >
        <div className="overflow-hidden">{ticker}</div>
      </div>

      <Navbar scrolled={scrolled} />
    </header>
  );
}
