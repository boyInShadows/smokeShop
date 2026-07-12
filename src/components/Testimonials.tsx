import { TESTIMONIALS } from "@/lib/data";
import { toFaDigits } from "@/lib/format";
import SectionHeading from "./SectionHeading";
import { StarIcon } from "./icons";

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
      <SectionHeading
        eyebrow="نظر مشتریان"
        title="تجربهٔ خرید مشتریان ما"
        desc="رضایت شما مهم‌ترین سرمایهٔ ماست."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <figure
            key={t.name}
            className="flex flex-col rounded-[var(--radius-card)] border border-border bg-surface p-6"
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
        ))}
      </div>

      {/* Aggregate strip */}
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
    </section>
  );
}
