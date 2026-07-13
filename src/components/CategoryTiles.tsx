import { CATEGORIES, CATEGORY_BANNERS, type Category } from "@/lib/data";
import { toFaDigits } from "@/lib/format";
import { ChevronIcon } from "./icons";
import Reveal from "./motion/Reveal";
import SplitText from "./motion/SplitText";

/**
 * Category bento — six compact tiles, then three wide banners.
 *
 * The reference layout is a light-theme grid of photo tiles. We keep its
 * *structure* and throw away its styling: each tile is a dark surface with the
 * category's gradient washing in from the corner, intensifying on hover. The
 * neon lives in the wash, never on the type (see DESIGN_SYSTEM.md).
 *
 * Hover/press are pure CSS transforms — no JS, no client boundary, and they run
 * on the compositor.
 */
function Tile({
  cat,
  wide = false,
}: {
  cat: Category;
  wide?: boolean;
}) {
  return (
    <a
      href={cat.href}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface p-5 transition-transform duration-300 ease-out hover:-translate-y-1 active:scale-[0.98]"
    >
      {/* The wash. Sits behind the content, brightens on hover. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-45 transition-opacity duration-300 group-hover:opacity-80"
        style={{
          backgroundImage: `radial-gradient(120% 100% at 100% 0%, ${cat.to}, transparent 62%), linear-gradient(200deg, ${cat.from}, transparent 70%)`,
        }}
      />
      {/* A soft bloom that only shows on hover — depth without a shadow. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -end-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-60"
        style={{ backgroundColor: cat.to }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <h3
            className={`font-black leading-tight ${
              wide ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
            }`}
          >
            {cat.title}
          </h3>
          <p className="mt-1 text-xs text-muted sm:text-sm">{cat.sub}</p>
        </div>
        <span className="shrink-0 rounded-full border border-border bg-bg/60 px-2.5 py-1 text-[11px] text-muted backdrop-blur-sm">
          {toFaDigits(cat.count)} کالا
        </span>
      </div>

      <span className="relative mt-8 inline-flex items-center gap-1 text-sm font-bold text-text">
        مشاهده
        {/* The arrow nudges along the reading direction on hover. In RTL that is
            leftward, so the icon is mirrored and the translate is negative. */}
        <ChevronIcon className="h-4 w-4 transition-transform duration-300 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
      </span>
    </a>
  );
}

export default function CategoryTiles() {
  return (
    <section
      id="categories"
      // `overflow-x: clip` because the directional Reveals translate elements
      // sideways on entry; without it they poke past the viewport and create a
      // horizontal scroll. `clip` (not `hidden`) — hidden would make this a
      // scroll container and break `position: sticky` inside it.
      className="mx-auto max-w-7xl overflow-x-clip px-4 py-16 sm:px-6 lg:py-24"
    >
      <div className="mb-8 max-w-2xl sm:mb-10">
        <Reveal dir="right">
          <span className="text-sm font-bold text-secondary">
            دسته‌بندی محصولات
          </span>
        </Reveal>
        <SplitText
          as="h2"
          text="هر چیزی که لازم داری، یک‌جا"
          className="mt-2 text-2xl font-black sm:text-3xl lg:text-4xl"
        />
        <Reveal dir="up" delay={0.15}>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            از ویپ یکبار مصرف تا پاد سیستم‌های حرفه‌ای و جویس‌های اورجینال.
          </p>
        </Reveal>
      </div>

      {/* Six compact tiles */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map((cat, i) => (
          <Reveal
            key={cat.title}
            dir="up"
            delay={i * 0.06}
            className="h-40 sm:h-48"
          >
            <Tile cat={cat} />
          </Reveal>
        ))}
      </div>

      {/* Three wide banners */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {CATEGORY_BANNERS.map((cat, i) => (
          <Reveal
            key={cat.title}
            dir={i === 0 ? "right" : i === 2 ? "left" : "up"}
            delay={i * 0.08}
            className="h-44"
          >
            <Tile cat={cat} wide />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
