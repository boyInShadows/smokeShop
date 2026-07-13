"use client";

import { useRef } from "react";
import { m, useReducedMotion } from "motion/react";
import { BESTSELLERS } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import ProductCard from "./ProductCard";
import { ChevronIcon } from "./icons";

// Horizontal-scroll bestsellers rail. Scroll amount is signed relative to the
// container, so it works correctly in RTL (scrollLeft is negative in RTL DOMs).
export default function BestsellersRail() {
  const railRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const scrollByCards = (direction: "start" | "end") => {
    const el = railRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    // In RTL, moving toward the inline-start means increasing scrollLeft.
    el.scrollBy({
      left: direction === "start" ? amount : -amount,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <section id="bestsellers" className="overflow-x-clip border-y border-border bg-surface/20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading
            eyebrow="پرفروش‌ترین‌ها"
            title="محبوب‌ترین محصولات این هفته"
            desc="پرتقاضاترین ویپ‌ها و پادهای فروشگاه، انتخاب مشتریان ما."
          />
          <div className="mb-8 hidden shrink-0 gap-2 sm:mb-10 sm:flex">
            <button
              onClick={() => scrollByCards("end")}
              className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-surface text-text transition hover:border-secondary hover:text-secondary active:scale-95"
              aria-label="محصولات قبلی"
            >
              <ChevronIcon className="h-5 w-5 -scale-x-100" />
            </button>
            <button
              onClick={() => scrollByCards("start")}
              className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-surface text-text transition hover:border-secondary hover:text-secondary active:scale-95"
              aria-label="محصولات بعدی"
            >
              <ChevronIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={railRef}
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
        >
          {BESTSELLERS.map((product, i) => (
            <m.div
              key={product.name}
              className="w-56 shrink-0 snap-start sm:w-64"
              // `initial` is unconditional on purpose — it is what Motion writes
              // into the SERVER's HTML, and `reduce` is false there but true on
              // the client's first render. Branching it hydrates against markup
              // that disagrees. Reduced motion lives in `transition` instead,
              // which never reaches the HTML. Same contract as motion/Reveal.tsx.
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: reduce ? 0.3 : 0.55,
                delay: reduce ? 0 : i * 0.07,
                ease: [0.16, 1, 0.3, 1],
                ...(reduce && { y: { duration: 0 } }), // snap, don't travel
              }}
            >
              <ProductCard product={product} />
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
