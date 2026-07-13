import Image from "next/image";
import type { Product } from "@/lib/data";
import { formatToman, toFaDigits } from "@/lib/format";
import { StarIcon, CartIcon } from "./icons";

/**
 * Product card.
 *
 * The product shots are photographed on PURE BLACK, so the thumbnail stage is
 * black too and the image dissolves into it — no cutout, no alpha channel, and
 * the neon rim-light does the separating. Same principle as the hero smoke: let
 * black do the work.
 *
 * Hover/press are CSS transforms only (compositor-thread), so this stays a
 * server component — no client boundary for a card that does nothing but sit
 * there until you touch it.
 */
export default function ProductCard({ product }: { product: Product }) {
  const fullStars = Math.round(product.rating);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-secondary/50 hover:shadow-[0_20px_50px_-20px_rgba(34,211,238,0.35)]">
      {/* Product stage. PURE black, not the near-black surface: the shots are
          rendered on #000, so matching it exactly is what makes the image
          dissolve into the stage instead of showing as a darker rectangle. */}
      <div className="relative h-44 overflow-hidden bg-black">
        {/* A wash that blooms up behind the device on hover. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(60%_100%_at_50%_100%,rgba(34,211,238,0.28),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 640px) 288px, 240px"
          className="object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-[1.07]"
        />

        {product.badge && (
          <span className="absolute start-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-bg">
            {product.badge}
          </span>
        )}
        {product.discountPct && (
          <span className="absolute end-3 top-3 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold text-bg">
            {toFaDigits(product.discountPct)}٪
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <bdi className="text-xs font-semibold text-secondary">
          {product.brand}
        </bdi>
        <h3 className="mt-1 line-clamp-1 font-bold">{product.name}</h3>
        <p className="mt-1 line-clamp-1 text-xs text-muted">
          <bdi>{product.flavor}</bdi>
        </p>

        <div className="mt-2 flex items-center gap-1">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < fullStars ? "text-primary" : "text-border"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted">{toFaDigits(product.rating)}</span>
        </div>

        {/* Price + CTA. Price is always visible — no hidden pricing. */}
        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div className="min-w-0">
            {product.oldPrice && (
              <span className="block text-xs text-muted line-through">
                {formatToman(product.oldPrice)}
              </span>
            )}
            <span className="block font-black text-text">
              {formatToman(product.price)}
            </span>
          </div>
          <button
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary transition-all duration-200 hover:bg-primary hover:text-bg active:scale-90"
            aria-label={`افزودن ${product.name} به سبد خرید`}
          >
            <CartIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
}
