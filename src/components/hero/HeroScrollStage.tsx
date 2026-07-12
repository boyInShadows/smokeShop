"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  LazyMotion,
  domAnimation,
  m,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { HERO_FLAVORS } from "@/lib/data";
import HeroCopy from "./HeroCopy";
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
 */
export default function HeroScrollStage() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

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
  const copyOpacity = useTransform(scrollYProgress, [0, 0.25, 1], [1, 0, 0]);
  // The flavour beats take over the stage as the copy clears out, so the two
  // never compete for the same corner.
  const beatsOpacity = useTransform(scrollYProgress, [0, 0.18, 1], [0, 1, 1]);

  return (
    <LazyMotion features={domAnimation}>
      {/* The plate is a CSS background, so next/image can't preload it for us. */}
      <link rel="preload" as="image" href="/hero/smoke.webp" />

      <section ref={ref} className="relative h-[250vh]">
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
                      backgroundImage: `linear-gradient(to top, ${flavor.from}, ${flavor.to}), url(/hero/smoke.webp)`,
                    }
                  : {
                      opacity: flavorOpacity[i],
                      y: smokeY,
                      scale: smokeScale,
                      backgroundImage: `linear-gradient(to top, ${flavor.from}, ${flavor.to}), url(/hero/smoke.webp)`,
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

          {/* ── Product: above the blend group, no blend mode. Immune. ── */}
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center lg:justify-end lg:pe-[9%]">
            <m.div
              style={
                reduce
                  ? undefined
                  : { rotate: deviceRotate, y: deviceY, scale: deviceScale }
              }
              className="relative h-[46vh] w-[46vh] will-change-transform lg:h-[72vh] lg:w-[72vh]"
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

          {/* Copy + the flavour beat */}
          <div className="relative z-40 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6">
            <m.div
              style={reduce ? undefined : { opacity: copyOpacity }}
              className="w-full rounded-3xl bg-bg/40 p-4 backdrop-blur-[2px] lg:w-[55%] lg:bg-transparent lg:p-0 lg:backdrop-blur-none"
            >
              <HeroCopy />
            </m.div>

            <FlavorBeats
              opacities={flavorOpacity}
              groupOpacity={beatsOpacity}
              reduce={Boolean(reduce)}
            />
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}

/**
 * The flavour name, pinned low on the stage, cross-fading in step with the smoke.
 * Sits on the device side (inline-end = physical left in RTL) so it balances the
 * copy column rather than stacking under it.
 */
function FlavorBeats({
  opacities,
  groupOpacity,
  reduce,
}: {
  opacities: MotionValue<number>[];
  groupOpacity: MotionValue<number>;
  reduce: boolean;
}) {
  return (
    <m.div
      style={reduce ? { opacity: 0 } : { opacity: groupOpacity }}
      className="pointer-events-none absolute inset-x-4 bottom-10 sm:inset-x-6 lg:bottom-16"
    >
      <div className="relative h-24">
        {HERO_FLAVORS.map((flavor, i) => (
          <m.a
            key={flavor.name}
            href={flavor.href}
            style={reduce ? undefined : { opacity: opacities[i] }}
            className="pointer-events-auto absolute inset-0 flex flex-col items-center text-center lg:items-end lg:text-end"
          >
            <span className="text-xs font-bold tracking-wide text-muted">
              طعم
            </span>
            <span className="mt-1 text-3xl font-black leading-tight text-text sm:text-4xl lg:text-5xl">
              {flavor.name}
            </span>
            <span className="mt-1 text-sm text-muted">{flavor.note}</span>
          </m.a>
        ))}
      </div>
    </m.div>
  );
}
