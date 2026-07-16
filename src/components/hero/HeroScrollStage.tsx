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
import { useIsDesktop } from "@/lib/useIsDesktop";
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
 *
 * ── Mobile gets the same static frame, for a different reason ─────────────────
 * That static frame is also exactly what phones need. On a phone Lenis is already
 * off (native scroll), but the scrub itself is the cost: every native-scroll frame
 * the mobile GPU has to read back and re-blend a stack of full-viewport layers
 * (three `mix-blend-screen` smoke plates, a fourth screen-blended velocity flare,
 * an `feTurbulence` grain, a vignette, backdrop-blurred chips), none of which take
 * the compositor fast-path. That drops frames and reads as "the scroll is laggy /
 * won't move". So below 1024px we resolve the hero to the same composed static
 * frame: nothing scrubs, the isolated blend group paints ONCE and just scrolls as
 * static content. Desktop keeps the full animation. `useIsDesktop` is the same
 * `useSyncExternalStore` shape as `useSafeReducedMotion`, for the same
 * hydration-safety reason — and rendering the static branch on the server keeps the
 * heavy Motion tree out of mobile hydration entirely.
 */
export default function HeroScrollStage() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useSafeReducedMotion();
  const isDesktop = useIsDesktop();

  // One flag drives every static/animated branch below. Reduced motion and a
  // sub-desktop viewport both resolve to the exact same composed static frame.
  const staticHero = reduce || !isDesktop;

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

  // Velocity flare: scroll fast and the PLUME brightens, stop and it settles.
  // Effects that never rest read cheap; effects that fire and decay read premium.
  // Clamped hard — unclamped velocity is a motion-sickness generator.
  //
  // ⚠️ This used to be a `radial-gradient(closest-side, …)` on a full-screen div.
  // `closest-side` on a full-screen box is *by definition* a circle centred in the
  // viewport, so at speed a white disc appeared over the middle of the hero. It
  // read as a lens artifact rather than as smoke, because its shape had nothing to
  // do with the smoke — a hard geometric circle floating over an organic plume.
  // The flare is now the PLATE ITSELF, screen-blended: the flare is shaped like the
  // plume, moves with it, and brightens it. Which is what an exhale actually does.
  const velocity = useVelocity(scrollYProgress);
  // Capped at 0.24, not higher: the flare is a second copy of the plate, so it
  // thickens the smoke as well as brightening it. Past ~0.3 the denser plume
  // starts eating the contrast of the flavour headline sitting on top of it,
  // exactly when the panel is mid-handover and already semi-transparent.
  const flareRaw = useTransform(velocity, (v: number) =>
    Math.min(Math.abs(v) * 0.25, 0.24)
  );
  // Spring here is deliberate and safe: it smooths ONE derived value that drives
  // a GPU property. It is not on scrollYProgress, so nothing else loses its
  // compositor path.
  const flare = useSpring(flareRaw, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });
  // Sits a touch wider than the plume it is lifting, so it reads as a bloom
  // around the smoke rather than a second copy of it sitting exactly on top.
  const flareScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.13]);

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
        className={`relative ${staticHero ? "h-[100svh]" : "h-[250vh]"}`}
      >
        {/* `100svh`, not `100vh`: on mobile `vh` is the LARGE viewport (chrome
            retracted), so a `100vh` stage is taller than what you can actually see
            until the address bar hides — which is exactly what pushed the hero's
            CTAs below the fold. `svh` is the small viewport, so the stage fits from
            the first frame and does not resize as the browser chrome moves. */}
        <div className="sticky top-0 h-[100svh] w-full isolate overflow-hidden bg-[#08070d]">
          {/* ── Blend group: the smoke, and only the smoke, takes the colour ── */}
          {HERO_FLAVORS.map((flavor, i) => (
            <m.div
              key={flavor.name}
              aria-hidden
              style={
                staticHero
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
              // `will-change: transform` only on the animated path. On the static
              // frame nothing transforms, so promoting these full-screen layers to
              // their own compositor layers just burns GPU memory on the phone.
              className={`absolute -inset-[8%] bg-cover bg-center [background-blend-mode:multiply] mix-blend-screen ${
                staticHero ? "" : "will-change-transform"
              }`}
            />
          ))}

          {/* Velocity flare — the plume itself brightens on fast scroll, then settles.
              Untinted: the raw greyscale plate, screen-blended, so it lifts whatever
              colour the smoke currently is instead of washing it toward white. Not
              rendered on the static frame (reduced motion or mobile) — one less
              full-screen blend, and the biggest per-frame win on the phone. */}
          {!staticHero && (
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
          )}

          {/* ── Product: above the blend group, no blend mode. Immune. ──
                 On mobile the device takes the top band and the copy takes the
                 bottom, so the two never sit on top of each other. The top padding
                 clears the fixed header. On desktop they sit side by side (device
                 inline-end = physical left in RTL). */}
          <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-center pt-[calc(var(--header-h)+1vh)] lg:items-center lg:justify-end lg:pe-[9%] lg:pt-0">
            <m.div
              style={
                staticHero
                  ? undefined
                  : { rotate: deviceRotate, y: deviceY, scale: deviceScale }
              }
              className={`relative h-[30vh] w-[30vh] lg:h-[72vh] lg:w-[72vh] ${
                staticHero ? "" : "will-change-transform"
              }`}
            >
              <Image
                src="/hero/vape.png"
                alt="پاد سیستم"
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 1024px) 72vh, 36vh"
                className="object-contain drop-shadow-[0_30px_70px_rgba(0,0,0,0.75)]"
              />
            </m.div>
          </div>

          {/* Vignette */}
          <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(0,0,0,0.6))]" />

          <Grain />

          {/* Mobile legibility scrim.
              This replaces a translucent rounded CARD that used to sit behind the
              copy. The card was sized by HeroCopy — which stays in the layout at
              `opacity: 0` while the flavour panels are absolutely positioned INSIDE
              it — so it was permanently 66% of the screen tall no matter what was
              actually showing: dead blurred space above and below the panel text,
              and its top edge sliced straight across the device.
              A bottom-up gradient has no height to get wrong and no edge to cut with:
              it fades out before it reaches the device, and there is nothing to look
              empty when the panel is short. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[35] h-[62%] bg-gradient-to-t from-bg via-bg/75 to-transparent lg:hidden"
          />

          {/* ── The copy column. The intro copy hands the stage over to the
                 flavour panels, which occupy the same space in turn. ── */}
          <div className="relative z-40 mx-auto flex h-full max-w-7xl items-end px-4 pb-10 sm:px-6 lg:items-center lg:pb-0">
            <div className="relative w-full lg:w-[55%]">
              <m.div style={staticHero ? undefined : { opacity: copyOpacity }}>
                <HeroCopy />
              </m.div>

              {/* The panels only exist when there is a scroll to scrub them.
                  On the static frame (reduced motion or mobile) the copy keeps the
                  stage to itself — see the header note. Not mounting them is safe:
                  their hooks live inside FlavorPanel, so nothing here changes hook
                  order in THIS component. */}
              {!staticHero &&
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

