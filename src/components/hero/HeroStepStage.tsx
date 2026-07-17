"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HERO_FLAVORS } from "@/lib/data";
import HeroCopy from "./HeroCopy";
import StepPanel from "./StepPanel";

/**
 * "The Exhale" — the MOBILE snap-stepper.
 *
 * Desktop scrubs the whole exhale from scroll position (`HeroScrollStage`), which
 * re-composites the full `mix-blend-screen` stack every frame your finger drags —
 * fine on a desktop GPU, the source of the lag on a phone. Here the scroll is
 * QUANTISED instead: the hero is a stack of `100svh` beats with native CSS
 * scroll-snap, so one swipe = one beat. A beat change flips a single integer
 * (`beat`), and the smoke recolour + panel handover are plain CSS transitions
 * (~0.75s). Between beats nothing scrubs — the blend group sits static — so there
 * is no per-frame compositing to drop. At most two smoke plates cross-fade during
 * the 0.75s step; at rest, one.
 *
 * ── The pin ──────────────────────────────────────────────────────────────────
 * The sticky visual carries `-mb-[100svh]` so its own flow box nets to zero; the
 * four `100svh` anchor spacers below it then make the section exactly `400svh` and
 * provide the four snap points (`.hero-beat-anchor`, styled in globals.css). The
 * visual stays pinned across the first three beats and scrolls away on the fourth,
 * releasing into the sections below — all native scroll, no touch interception.
 *
 * ── Which beat is active ─────────────────────────────────────────────────────
 * An IntersectionObserver with a collapsed root (`-50% 0px -50%`) turns the
 * viewport centre into a 1px detection line; the one anchor spanning that line is
 * the active beat. It fires only on crossings, so there is NO per-frame scroll
 * listener running during a drag.
 *
 * Beat 0 = intro copy (over the first flavour's colour); beats 1–3 = the three
 * flavour panels. Reduced motion never reaches here (the selector routes it to the
 * static frame), so there is no reduced-motion branch to carry.
 */
export default function HeroStepStage() {
  const flavorCount = HERO_FLAVORS.length;
  const beatCount = flavorCount + 1; // intro + one per flavour
  const [beat, setBeat] = useState(0);
  const anchors = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const els = anchors.current.filter(Boolean) as HTMLDivElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setBeat(Number((e.target as HTMLElement).dataset.beat));
          }
        }
      },
      // Collapse the root to a centre line: the anchor crossing it is active.
      { root: null, rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Beat 0 shares the first flavour's colour; beats 1..3 map to their flavour.
  const activeFlavor = beat === 0 ? 0 : beat - 1;
  const EASE = "ease-[cubic-bezier(0.16,1,0.3,1)]";

  return (
    <>
      {/* LCP plate preload — mirror the --hero-smoke breakpoint in globals.css. */}
      <link
        rel="preload"
        as="image"
        href="/hero/smoke-sm.webp"
        media="(max-width: 640px)"
      />
      <link
        rel="preload"
        as="image"
        href="/hero/smoke.webp"
        media="(min-width: 641px)"
      />

      <section className="relative">
        {/* Pinned visual. `-mb-[100svh]` zeroes its flow height so the anchors
            below define the whole 400svh track. */}
        <div className="sticky top-0 -mb-[100svh] h-[100svh] w-full isolate overflow-hidden bg-[#08070d]">
          {/* ── Smoke plates: exactly one active, cross-fading over 0.75s ── */}
          {HERO_FLAVORS.map((flavor, i) => (
            <div
              key={flavor.name}
              aria-hidden
              style={{
                backgroundImage: `linear-gradient(to top, ${flavor.from}, ${flavor.to}), var(--hero-smoke)`,
              }}
              className={`absolute -inset-[8%] bg-cover bg-center [background-blend-mode:multiply] mix-blend-screen transition-opacity duration-[750ms] ${EASE} ${
                activeFlavor === i ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          {/* Device — held still, above the blend group, no blend mode. */}
          <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-center pt-[calc(var(--header-h)+1vh)]">
            <div className="relative h-[30vh] w-[30vh]">
              <Image
                src="/hero/vape.png"
                alt="پاد سیستم"
                fill
                loading="eager"
                fetchPriority="high"
                sizes="36vh"
                className="object-contain drop-shadow-[0_30px_70px_rgba(0,0,0,0.75)]"
              />
            </div>
          </div>

          {/* Vignette */}
          <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(0,0,0,0.6))]" />

          {/* Bottom-up legibility scrim */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[35] h-[62%] bg-gradient-to-t from-bg via-bg/75 to-transparent"
          />

          {/* ── Intro copy (beat 0), bottom-anchored ── */}
          <div className="absolute inset-x-0 bottom-0 z-40 mx-auto flex max-w-7xl items-end px-4 pb-10 sm:px-6">
            <div
              className={`w-full transition-opacity duration-[750ms] ${EASE} ${
                beat === 0 ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <HeroCopy />
            </div>
          </div>

          {/* ── Flavour panels (beats 1–3): centred in the lower stage band so the
                 whole panel, CTA included, sits above the fold and clears the
                 device up top. Each cross-fades in on its beat. ── */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[34%] z-40">
            {HERO_FLAVORS.map((flavor, i) => (
              <StepPanel
                key={flavor.name}
                flavor={flavor}
                active={beat === i + 1}
              />
            ))}
          </div>
        </div>

        {/* ── Snap anchors: the scroll length + the snap points. Empty, transparent,
               and click-through so the CTA underneath stays tappable. ── */}
        {Array.from({ length: beatCount }).map((_, i) => (
          <div
            key={i}
            aria-hidden
            data-beat={i}
            ref={(el) => {
              anchors.current[i] = el;
            }}
            className="hero-beat-anchor pointer-events-none h-[100svh]"
          />
        ))}
      </section>
    </>
  );
}
