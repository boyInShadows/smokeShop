import { CheckIcon } from "./icons";
import Reveal from "./motion/Reveal";
import SplitText from "./motion/SplitText";

const POINTS = [
  "تضمین اصالت کالا روی تمام محصولات",
  "بسته‌بندی ایمن و محرمانه",
  "مشاورهٔ تخصصی پیش از خرید",
  "پشتیبانی واقعی، بدون ربات",
];

// Brand story / why-us band. v1 uses a clean two-column reveal; the sticky-scroll
// product storytelling is deferred to the animation phase.
export default function StoryBand() {
  return (
    <section id="story" className="mx-auto max-w-7xl overflow-x-clip px-4 py-16 sm:px-6 lg:py-24">
      <div className="grid items-center gap-10 rounded-[var(--radius-card)] border border-border bg-surface/40 p-6 sm:p-10 lg:grid-cols-2 lg:gap-14 lg:p-14">
        {/* Visual — sweeps in from the far side, so the two halves meet. */}
        <Reveal dir="right" className="order-last lg:order-first">
          <div className="smoke-bg relative flex h-56 items-center justify-center rounded-2xl border border-border bg-surface-2 lg:h-80">
            <div className="absolute h-40 w-40 rounded-full bg-secondary/20 blur-3xl" />
            <span className="relative bg-gradient-to-l from-primary to-secondary bg-clip-text text-5xl font-black text-transparent lg:text-7xl">
              <bdi>WAPE</bdi>
            </span>
          </div>
        </Reveal>

        {/* Copy */}
        <div>
          <Reveal dir="left">
            <span className="text-sm font-bold text-secondary">
              چرا ویپ اسموک؟
            </span>
          </Reveal>

          <SplitText
            as="h2"
            text="تجربهٔ خریدی مطمئن و حرفه‌ای"
            className="mt-2 text-2xl font-black sm:text-3xl lg:text-4xl"
          />

          <Reveal dir="left" delay={0.12}>
            <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
              ما با تمرکز بر کیفیت و اصالت، تجربه‌ای متفاوت از خرید آنلاین محصولات
              ویپ ارائه می‌دهیم؛ از انتخاب محصول تا تحویل درب منزل، در کنار شما
              هستیم.
            </p>
          </Reveal>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {POINTS.map((point, i) => (
              <Reveal key={point} dir="up" delay={0.18 + i * 0.07}>
                <li className="group flex items-center gap-2 text-sm">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary transition-transform duration-300 group-hover:scale-110">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  {point}
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal dir="up" delay={0.45}>
            <a
              href="#bestsellers"
              className="glow-primary mt-8 inline-block rounded-xl bg-primary px-7 py-3 font-bold text-bg transition-all duration-200 hover:bg-primary-strong hover:scale-[1.03] active:scale-95"
            >
              شروع خرید
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
