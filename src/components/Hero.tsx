import { toFaDigits } from "@/lib/format";
import { BoltIcon, ChevronIcon } from "./icons";

// Dark premium hero: oversized Persian headline + single magenta CTA, with a
// floating "device" mock and CSS ambient smoke. v1 is static — the real 3D /
// GSAP showpiece is a later phase.
export default function Hero() {
  return (
    <section className="smoke-bg relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:pb-24 lg:pt-20">
        {/* Copy */}
        <div className="text-center lg:text-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-4 py-1.5 text-xs text-secondary">
            <BoltIcon className="h-3.5 w-3.5" />
            جدیدترین برندهای اورجینال ۲۰۲۵
          </span>

          <h1 className="mt-6 text-4xl font-black leading-[1.25] sm:text-5xl lg:text-6xl">
            تجربه‌ای متفاوت از
            <br />
            دنیای{" "}
            <span className="bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent">
              ویپ و پاد
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted lg:mx-0">
            مجموعه‌ای کامل از ویپ‌های یکبار مصرف، پاد سیستم‌ها و جویس‌های اورجینال
            با ضمانت اصالت کالا و ارسال سریع به سراسر ایران.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <a
              href="#bestsellers"
              className="glow-primary w-full rounded-xl bg-primary px-7 py-3.5 text-center font-bold text-bg transition hover:bg-primary-strong sm:w-auto"
            >
              مشاهدهٔ محصولات
            </a>
            <a
              href="#brands"
              className="flex w-full items-center justify-center gap-1 rounded-xl border border-border bg-surface/50 px-7 py-3.5 text-center font-semibold text-text transition hover:border-secondary/60 hover:text-secondary sm:w-auto"
            >
              برندها
              <ChevronIcon className="h-4 w-4 rtl:-scale-x-100" />
            </a>
          </div>

          {/* Mini stats */}
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 text-center lg:mx-0">
            {[
              { n: 120, s: "+", l: "محصول متنوع" },
              { n: 15, s: "+", l: "برند اورجینال" },
              { n: 24, s: "س", l: "پشتیبانی" },
            ].map((stat) => (
              <div
                key={stat.l}
                className="rounded-2xl border border-border bg-surface/40 py-3"
              >
                <dt className="text-2xl font-black text-text">
                  {toFaDigits(stat.n)}
                  <span className="text-primary">{stat.s}</span>
                </dt>
                <dd className="mt-1 text-xs text-muted">{stat.l}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Floating device mock */}
        <div className="relative mx-auto flex h-72 w-full max-w-sm items-center justify-center sm:h-96">
          <div className="absolute h-56 w-56 rounded-full bg-primary/25 blur-3xl sm:h-72 sm:w-72" />
          <div className="absolute end-8 top-6 h-40 w-40 rounded-full bg-secondary/20 blur-3xl" />
          <div className="glow-secondary relative flex h-64 w-32 flex-col items-center justify-between rounded-[2rem] border border-border bg-gradient-to-b from-surface-2 to-surface p-4 sm:h-80 sm:w-40">
            <span className="h-1.5 w-10 rounded-full bg-border" />
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 sm:h-20 sm:w-20">
              <BoltIcon className="h-8 w-8 text-secondary" />
            </div>
            <span className="text-center text-xs text-muted">
              <bdi>WAPE</bdi> · نسل جدید
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
