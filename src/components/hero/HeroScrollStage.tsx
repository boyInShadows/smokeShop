"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import HeroCopy from "./HeroCopy";

// Scroll-scrubbed hero. The world spins, the product is held: the backplate
// rotates a full 360 and lands exactly where it started, while the pod
// counter-moves — settles upright, floats, takes a slow push-in.
// Spec: HERO_SCROLL_MOTION.md
export default function HeroScrollStage() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Smooth the raw scroll input once, at the source — not per-transform.
  // This is the difference between buttery and trackpad stutter.
  const p = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  });

  // Backplate — linear 0 -> 360, lands exactly where it started.
  const bgRotate = useTransform(p, [0, 1], [0, 360]);
  const bgScale = useTransform(p, [0, 0.5, 1], [1, 1.12, 1]);

  // Bloom — peaks at mid-rotation, washing the plate into pure colour right
  // when the fruit is upside down and the composition reads worst.
  const bloomOpacity = useTransform(p, [0, 0.5, 1], [0.1, 0.75, 0.1]);
  const bloomScale = useTransform(p, [0, 0.5, 1], [0.78, 1.33, 0.78]);

  // Product — counter-motion against the spin.
  const vapeRotate = useTransform(p, [0, 1], [14, -6]);
  const vapeY = useTransform(p, [0, 1], ["0%", "-5.5%"]);
  const vapeScale = useTransform(p, [0, 1], [1, 1.06]);

  // Copy clears out early so the rotation owns the midpoint.
  const copyOpacity = useTransform(p, [0, 0.3], [1, 0]);

  return (
    <section ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-bg">
        {/* Backplate. Square, side >= viewport diagonal -> no corner gaps at any angle. */}
        <motion.div
          style={
            reduce
              ? { x: "-50%", y: "-50%" }
              : { x: "-50%", y: "-50%", rotate: bgRotate, scale: bgScale }
          }
          className="absolute left-1/2 top-1/2 h-[150vmax] w-[150vmax] will-change-transform"
        >
          <Image
            src="/hero/backplate.webp"
            alt=""
            fill
            loading="eager"
            fetchPriority="high"
            sizes="150vmax"
            className="object-cover"
          />
        </motion.div>

        {/* Bloom */}
        <motion.div
          style={
            reduce
              ? { x: "-50%", y: "-50%", opacity: 0.1, scale: 0.78 }
              : {
                  x: "-50%",
                  y: "-50%",
                  opacity: bloomOpacity,
                  scale: bloomScale,
                }
          }
          className="pointer-events-none absolute left-1/2 top-1/2 h-[90vmax] w-[90vmax] rounded-full mix-blend-screen will-change-transform"
        >
          <div className="h-full w-full rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.7),rgba(255,61,154,0.4)_42%,transparent_70%)]" />
        </motion.div>

        {/* Vignette — sits under the product so it never dims the device. */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(0,0,0,0.55))]" />

        {/* Product. Wrapper does the placing, the motion layer does the moving —
            Framer overwrites `transform`, so the two must not share an element. */}
        <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center lg:justify-end lg:pe-[8%]">
          <motion.div
            style={
              reduce
                ? undefined
                : { rotate: vapeRotate, y: vapeY, scale: vapeScale }
            }
            className="relative h-[52vh] w-[52vh] will-change-transform lg:h-[74vh] lg:w-[74vh]"
          >
            <Image
              src="/hero/vape.png"
              alt="پاد سیستم"
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 74vh, 52vh"
              className="object-contain drop-shadow-[0_25px_60px_rgba(0,0,0,0.6)]"
            />
          </motion.div>
        </div>

        {/* Scrim under the copy — the backplate is far too busy to read text over.
            Fades out with the copy so it never dulls the plate mid-rotation. */}
        <motion.div
          style={reduce ? undefined : { opacity: copyOpacity }}
          className="pointer-events-none absolute inset-0 z-[6] bg-[linear-gradient(to_left,rgba(18,16,26,0.93),rgba(18,16,26,0.78)_30%,transparent_65%)]"
        />

        {/* Copy */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6">
          <motion.div
            style={reduce ? undefined : { opacity: copyOpacity }}
            className="w-full rounded-3xl bg-bg/45 p-4 backdrop-blur-[2px] lg:w-[55%] lg:bg-transparent lg:p-0 lg:backdrop-blur-none"
          >
            <HeroCopy />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
