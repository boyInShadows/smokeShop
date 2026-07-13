import { BRANDS } from "@/lib/data";
import { toFaDigits } from "@/lib/format";
import SectionHeading from "./SectionHeading";
import Reveal from "./motion/Reveal";
import { ChevronIcon } from "./icons";

// Multi-brand showcase as a scale-varied bento: featured brands span two columns
// on desktop so the grid reads with hierarchy rather than as a uniform template.
export default function BrandsGrid() {
  return (
    <section id="brands" className="mx-auto max-w-7xl overflow-x-clip px-4 py-16 sm:px-6 lg:py-24">
      <SectionHeading
        eyebrow="برندهای منتخب"
        title="از معتبرترین برندهای دنیا"
        desc="ما فقط محصولات اورجینال و تضمین‌شده از برندهای شناخته‌شدهٔ صنعت ویپ را عرضه می‌کنیم."
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {BRANDS.map((brand, i) => (
          <Reveal
            key={brand.name}
            // Alternate the sweep direction so the grid assembles from both
            // edges inward rather than marching in one direction.
            dir={i % 2 === 0 ? "right" : "left"}
            delay={i * 0.07}
            className={brand.featured ? "sm:col-span-1 lg:col-span-2" : ""}
          >
          <a
            href="#bestsellers"
            className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/50 active:scale-[0.98]"
          >
            <div
              className="pointer-events-none absolute -end-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition group-hover:bg-primary/25"
              aria-hidden
            />
            <div className="flex items-start justify-between">
              <bdi className="text-xl font-black tracking-tight sm:text-2xl">
                {brand.name}
              </bdi>
              <span className="rounded-full border border-border bg-bg/60 px-2.5 py-1 text-[11px] text-muted">
                {toFaDigits(brand.productCount)} محصول
              </span>
            </div>
            <p className="mt-4 text-sm text-muted">{brand.tagline}</p>
            <span className="mt-5 flex items-center gap-1 text-sm font-semibold text-secondary opacity-0 transition group-hover:opacity-100">
              مشاهدهٔ محصولات
              <ChevronIcon className="h-4 w-4 transition-transform duration-300 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
            </span>
          </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
