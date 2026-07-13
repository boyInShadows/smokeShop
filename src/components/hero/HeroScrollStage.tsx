"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  m,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";
import { HERO_FLAVORS } from "@/lib/data";
import HeroCopy from "./HeroCopy";
import FlavorPanel from "./FlavorPanel";
import Grain from "./Grain";

/**
 * "The Exhale" — the scroll is the exhale, and the smoke's colour is the flavour.
 *
 * The device is HELD. It does not spin, and the world does not spin around it.
 * Only the smoke changes: it grades through the flavour palettes as you scroll,
 * so the colour shift is merchandising, not decoration.
 *
 * ── The layering contract (do not "simplify" this) ────────────────────────────
 * Each smoke layer paints itself in two steps, entirely inside its own element:
 *
 *   background-image:      linear-gradient(flavour), url(smoke.webp)
 *   background-blend-mode: multiply   gradient x smoke  -> coloured smoke on black
 *   mix-blend-mode:        screen     black -> transparent against the stage
 *
 * `screen` makes black mathematically transparent, which is why the plate needs
 * no alpha channel and no mask — and it is how smoke actually behaves optically
 * (additive light, not an occluder).
 *
 * The product is rendered ABOVE this blend group and carries NO blend mode, so
 * it is *structurally* incapable of being recoloured. That is a guarantee, not
 * a mask that happens to hold. A luminance mask would leak onto the device's
 * specular highlights and read as a bug.
 *
 * The stage needs `isolate` or the screen blend leaks past it into the page.
 *
 * ── Why opacity cross-fade, not animated CSS variables ───────────────────────
 * Animating an *inherited* custom property forces a style recalc across the
 * whole subtree, and Tailwind v4's entire theme is custom properties. Opacity
 * is compositor-accelerated instead, and `useScroll` keeps its GPU path only
 * while it drives transform/opacity/filter/clipPath. Which is also why there is
 * no `useSpring` on scrollYProgress here: springing it "sacrifices GPU
 * optimization for smoothing" (Motion docs). Smoothness comes from Lenis.
 *
 * ── Reduced motion: a deliberate static frame, not a frozen animation ────────
 * The whole hero IS a scroll animation, so with motion off it has to resolve to
 * one composed frame rather than just stop moving. Freezing it in place was
 * visibly broken: the intro copy and the first flavour panel were BOTH left at
 * full opacity, and the panels are `absolute inset-0` over the box the copy sits
 * in — two headlines stacked on each other. (In the animated path they hand over:
 * the copy is gone by p=0.06 and the first panel opens at 0.07.)
 *
 * So under reduce: the smoke holds the first flavour's colour, the device sits
 * still, the intro copy stays, and the flavour panels are NOT RENDERED AT ALL.
 * The flavours are still merchandised further down the page. The pin also drops
 * from 250vh to one screen — a 250vh pin over a frame that never changes is 2.5
 * screens of scrolling for nothing.
 *
 * `useSafeReducedMotion` (not Motion's raw hook) because these branches feed
 * `style`/`className`, which are server-rendered: the raw value differs between
 * server and first client render and would throw a hydration mismatch.
 */
export default function HeroScrollStage() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useSafeReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Three beats: each flavour holds, then cross-fades into the next. Written out
  // rather than mapped because these are hooks — one per flavour, in fixed order.
  //
  // Every range spans the FULL 0->1 domain on purpose. Ranges that stop short
  // (e.g. [0, 0.3, 0.42]) leave the value undefined past their last stop, and it
  // does not reliably clamp — the ice layer was climbing back to 0.83 by p=0.9
  // and bleeding cyan into the amber beat. Screen blending is additive, so that
  // showed up as *green* smoke. Anchor both ends and there is nothing to get wrong.
  const iceOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.42, 1],
    [1, 1, 0, 0]
  );
  const berryOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.42, 0.62, 0.74, 1],
    [0, 0, 1, 1, 0, 0]
  );
  const mangoOpacity = useTransform(
    scrollYProgress,
    [0, 0.62, 0.74, 1],
    [0, 0, 1, 1]
  );
  const flavorOpacity = [iceOpacity, berryOpacity, mangoOpacity];

  // The plume drifts up and swells slightly across the whole hero.
  const smokeY = useTransform(scrollYProgress, [0, 1], ["4%", "-6%"]);
  const smokeScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  // The device is *held*: a slow settle and push-in, nothing more.
  const deviceRotate = useTransform(scrollYProgress, [0, 1], [3, -3]);
  const deviceY = useTransform(scrollYProgress, [0, 1], ["0%", "-4%"]);
  const deviceScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  // Bloom reacts to scroll SPEED and decays back to nothing at rest. Effects
  // that never rest read cheap; effects that fire and decay read premium.
  // Clamped hard — unclamped velocity is a motion-sickness generator.
  const velocity = useVelocity(scrollYProgress);
  const bloomRaw = useTransform(velocity, (v: number) =>
    Math.min(Math.abs(v) * 0.4, 0.55)
  );
  // Spring here is deliberate and safe: it smooths ONE derived value that drives
  // a GPU property. It is not on scrollYProgress, so nothing else loses its
  // compositor path.
  const bloom = useSpring(bloomRaw, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  // Same rule as the flavour ranges: anchor the far end, or it climbs back up.
  // The intro copy clears out just before the first flavour panel arrives (its
  // window opens at 0.07), so the two never overlap in the same column.
  const copyOpacity = useTransform(scrollYProgress, [0, 0.06, 1], [1, 0, 0]);

  return (
    <>
      {/* LazyMotion lives in SmoothScroll, above the whole app. */}
      {/* The plate is a CSS background, so next/image can't preload it for us —
          and it is the LCP element, so it must not wait for the CSS to parse.
          `media` must mirror the --hero-smoke breakpoint in globals.css exactly,
          or a phone preloads the 215 KB desktop plate and then downloads the
          mobile one anyway: worse than no preload at all. */}
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

      <section
        ref={ref}
        className={`relative ${reduce ? "h-screen" : "h-[250vh]"}`}
      >
        <div className="sticky top-0 h-screen w-full isolate overflow-hidden bg-[#08070d]">
          {/* ── Blend group: the smoke, and only the smoke, takes the colour ── */}
          {HERO_FLAVORS.map((flavor, i) => (
            <m.div
              key={flavor.name}
              aria-hidden
              style={
                reduce
                  ? {
                      opacity: i === 0 ? 1 : 0,
                      backgroundImage: `linear-gradient(to top, ${flavor.from}, ${flavor.to}), var(--hero-smoke)`,
                    }
                  : {
                      opacity: flavorOpacity[i],
                      y: smokeY,
                      scale: smokeScale,
                      backgroundImage: `linear-gradient(to top, ${flavor.from}, ${flavor.to}), var(--hero-smoke)`,
                    }
              }
              className="absolute -inset-[8%] bg-cover bg-center [background-blend-mode:multiply] mix-blend-screen will-change-transform"
            />
          ))}

          {/* Velocity bloom — scroll fast and the plume flares, stop and it settles. */}
          <m.div
            aria-hidden
            style={reduce ? { opacity: 0 } : { opacity: bloom }}
            className="pointer-events-none absolute inset-0 z-[6] mix-blend-screen bg-[radial-gradient(closest-side,rgba(255,255,255,0.55),rgba(255,255,255,0.12)_45%,transparent_72%)]"
          />

          {/* ── Product: above the blend group, no blend mode. Immune. ──
                 On mobile the device takes the top half and the panels take the
                 bottom, so the two never sit on top of each other. On desktop
                 they sit side by side (device inline-end = physical left in RTL). */}
          <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-center pt-[8vh] lg:items-center lg:justify-end lg:pe-[9%] lg:pt-0">
            <m.div
              style={
                reduce
                  ? undefined
                  : { rotate: deviceRotate, y: deviceY, scale: deviceScale }
              }
              className="relative h-[38vh] w-[38vh] will-change-transform lg:h-[72vh] lg:w-[72vh]"
            >
              <Image
                src="/hero/vape.png"
                alt="پاد سیستم"
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 1024px) 72vh, 46vh"
                className="object-contain drop-shadow-[0_30px_70px_rgba(0,0,0,0.75)]"
              />
            </m.div>
          </div>

          {/* Vignette */}
          <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(0,0,0,0.6))]" />

          <Grain />

          {/* ── The copy column. The intro copy hands the stage over to the
                 flavour panels, which occupy the same space in turn. ── */}
          <div className="relative z-40 mx-auto flex h-full max-w-7xl items-end px-4 pb-10 sm:px-6 lg:items-center lg:pb-0">
            <div className="relative w-full rounded-3xl bg-bg/45 p-4 backdrop-blur-[2px] lg:w-[55%] lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
              <m.div style={reduce ? undefined : { opacity: copyOpacity }}>
                <HeroCopy />
              </m.div>

              {/* The panels only exist when there is a scroll to scrub them.
                  Under reduced motion the copy keeps the stage to itself — see
                  the header note. Not mounting them is safe: their hooks live
                  inside FlavorPanel, so nothing here changes hook order. */}
              {!reduce &&
                HERO_FLAVORS.map((flavor) => (
                  <FlavorPanel
                    key={flavor.name}
                    flavor={flavor}
                    progress={scrollYProgress}
                  />
                ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

