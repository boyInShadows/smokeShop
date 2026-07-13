import { TESTIMONIALS } from "@/lib/data";
import { toFaDigits } from "@/lib/format";
import SectionHeading from "./SectionHeading";
import Reveal from "./motion/Reveal";
import { StarIcon } from "./icons";

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl overflow-x-clip px-4 py-16 sm:px-6 lg:py-24">
      <SectionHeading
        eyebrow="نظر مشتریان"
        title="تجربهٔ خرید مشتریان ما"
        desc="رضایت شما مهم‌ترین سرمایهٔ ماست."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} dir="up" delay={i * 0.1} className="h-full">
          <figure
            className="flex h-full flex-col rounded-[var(--radius-card)] border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
          >
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-4 w-4 ${i < t.rating ? "text-primary" : "text-border"}`}
                />
              ))}
            </div>
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted">
              «{t.text}»
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 font-bold text-primary">
                {t.name.charAt(0)}
              </span>
              <div>
                <div className="text-sm font-bold text-text">{t.name}</div>
                <div className="text-xs text-muted">{t.city}</div>
              </div>
            </figcaption>
          </figure>
          </Reveal>
        ))}
      </div>

      {/* Aggregate strip */}
      <Reveal dir="up" delay={0.1}>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-[var(--radius-card)] border border-border bg-surface/40 px-6 py-5 text-center">
        <div className="text-sm text-muted">
          <span className="text-2xl font-black text-text">{toFaDigits("4.8")}</span>{" "}
          از {toFaDigits(5)} امتیاز
        </div>
        <div className="hidden h-8 w-px bg-border sm:block" />
        <div className="text-sm text-muted">
          بیش از <span className="text-lg font-black text-secondary">{toFaDigits("12,000")}</span> سفارش موفق
        </div>
        <div className="hidden h-8 w-px bg-border sm:block" />
        <div className="text-sm text-muted">
          <span className="text-lg font-black text-secondary">٪{toFaDigits(97)}</span> رضایت مشتری
        </div>
      </div>
      </Reveal>
    </section>
  );
}
