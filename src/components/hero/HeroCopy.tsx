import { toFaDigits } from "@/lib/format";
import { BoltIcon, ChevronIcon } from "../icons";

// Headline / CTA / stats for the hero. Split out of the old static Hero so the
// scroll stage can own the visuals and fade this out as the rotation takes over.
export default function HeroCopy() {
  return (
    <div className="text-center lg:text-start">
      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-4 py-1.5 text-xs text-secondary lg:backdrop-blur-sm">
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
          href="#offers"
          className="glow-primary w-full rounded-xl bg-primary px-7 py-3.5 text-center font-bold text-bg transition-all duration-200 hover:scale-[1.03] hover:bg-primary-strong active:scale-95 sm:w-auto"
        >
          مشاهدهٔ محصولات
        </a>
        <a
          href="#categories"
          className="group flex w-full items-center justify-center gap-1 rounded-xl border border-border bg-surface/50 px-7 py-3.5 text-center font-semibold text-text lg:backdrop-blur-sm transition-all duration-200 hover:border-secondary/60 hover:text-secondary active:scale-95 sm:w-auto"
        >
          دسته‌بندی‌ها
          <ChevronIcon className="h-4 w-4 transition-transform duration-300 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
        </a>
      </div>

      {/* Mini stats.
          Hidden below `sm`. On a 390px phone the hero has to fit a device, a
          headline, a paragraph, two CTAs and this row into one viewport — and this
          row was what tipped it over: it pushed the copy up into the device and its
          own bottom edge fell below the fold. It is reassurance, not information,
          and the TrustRow immediately underneath the hero says the same thing with
          more room. */}
      <dl className="mt-10 hidden max-w-md grid-cols-3 gap-4 text-center sm:grid lg:mx-0">
        {[
          { n: 120, s: "+", l: "محصول متنوع" },
          { n: 15, s: "+", l: "برند اورجینال" },
          { n: 24, s: "س", l: "پشتیبانی" },
        ].map((stat) => (
          <div
            key={stat.l}
            className="rounded-2xl border border-border bg-surface/40 py-3 lg:backdrop-blur-sm"
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
  );
}
