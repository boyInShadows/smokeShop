"use client";

import { useEffect, useRef, useState } from "react";
import { m, useReducedMotion } from "motion/react";
import { OFFERS } from "@/lib/data";
import { toFaDigits } from "@/lib/format";
import ProductCard from "./ProductCard";
import SplitText from "./motion/SplitText";
import { ChevronIcon, BoltIcon } from "./icons";

/** ms until the next local midnight — the campaign deadline. */
function msUntilMidnight() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  return end.getTime() - now.getTime();
}

function pad(n: number) {
  return toFaDigits(String(Math.floor(n)).padStart(2, "0"));
}

/**
 * Countdown to the end of the campaign.
 *
 * Renders a stable placeholder on the server and only starts telling the truth
 * after mount. A clock read during render is non-deterministic — the server and
 * the client would disagree and React would throw a hydration mismatch.
 */
function Countdown() {
  // `null` until mounted. Reading the clock during render would be
  // non-deterministic: the server and the client would disagree on the value and
  // React would throw a hydration mismatch. So we render a stable placeholder and
  // only start telling the truth on the client.
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setLeft(msUntilMidnight());
    tick(); // paint the real time immediately, don't wait a full second
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const h = left === null ? 0 : left / 3_600_000;
  const m_ = left === null ? 0 : (left % 3_600_000) / 60_000;
  const s = left === null ? 0 : (left % 60_000) / 1000;

  return (
    <div
      className="flex items-center gap-1.5"
      // The clock changes every second; announcing it would be hostile.
      aria-label="زمان باقی‌مانده تا پایان پیشنهاد"
      suppressHydrationWarning
    >
      {[h, m_, s].map((unit, i) => (
        <span key={i} className="contents">
          {i > 0 && <span className="text-muted">:</span>}
          <span className="min-w-9 rounded-lg border border-border bg-bg/70 px-2 py-1 text-center text-sm font-black tabular-nums text-text">
            {left === null ? "۰۰" : pad(unit)}
          </span>
        </span>
      ))}
    </div>
  );
}

export default function OffersRail() {
  const railRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Signed relative to the container: in an RTL document scrollLeft runs
  // negative, so moving toward the inline-start means INCREASING scrollLeft.
  const scrollByCards = (direction: "start" | "end") => {
    const el = railRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "start" ? amount : -amount,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <section
      id="offers"
      className="relative overflow-hidden border-y border-border bg-surface/20"
    >
      {/* Warm ember wash — this is the only "hot" section on the page. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(70% 60% at 85% 0%, #ff3d9a33, transparent 70%), radial-gradient(60% 50% at 10% 100%, #ffa53d22, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-primary">
              <BoltIcon className="h-4 w-4" />
              پیشنهادات شگفت‌انگیز
            </span>
            <SplitText
              as="h2"
              text="فقط تا پایان امروز"
              className="mt-2 text-2xl font-black sm:text-3xl lg:text-4xl"
            />
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
              تخفیف‌های محدود روی پرفروش‌ترین‌ها. با پایان شمارش، قیمت‌ها به حالت
              عادی برمی‌گردند.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Countdown />
            <div className="hidden gap-2 sm:flex">
              <button
                onClick={() => scrollByCards("end")}
                className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-surface text-text transition hover:border-primary hover:text-primary active:scale-95"
                aria-label="پیشنهادهای قبلی"
              >
                <ChevronIcon className="h-5 w-5 -scale-x-100" />
              </button>
              <button
                onClick={() => scrollByCards("start")}
                className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-surface text-text transition hover:border-primary hover:text-primary active:scale-95"
                aria-label="پیشنهادهای بعدی"
              >
                <ChevronIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={railRef}
          className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
        >
          {OFFERS.map((product, i) => (
            <m.div
              key={product.name}
              className="w-60 shrink-0 snap-start sm:w-72"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: reduce ? 0.3 : 0.55,
                delay: reduce ? 0 : i * 0.08,
                ease: [0.16, 1, 0.3, 1],
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
