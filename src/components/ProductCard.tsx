import type { Product } from "@/lib/data";
import { formatToman, toFaDigits } from "@/lib/format";
import { StarIcon, CartIcon } from "./icons";

export default function ProductCard({ product }: { product: Product }) {
  const fullStars = Math.round(product.rating);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface transition duration-300 hover:-translate-y-1 hover:border-secondary/50">
      {/* Visual / thumbnail placeholder */}
      <div className="smoke-bg relative flex h-40 items-center justify-center bg-surface-2">
        {product.badge && (
          <span className="absolute start-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-bg">
            {product.badge}
          </span>
        )}
        {product.discountPct && (
          <span className="absolute end-3 top-3 rounded-full bg-secondary/15 px-2.5 py-1 text-[11px] font-bold text-secondary">
            {toFaDigits(product.discountPct)}٪ تخفیف
          </span>
        )}
        <div className="grid h-20 w-14 place-items-center rounded-2xl border border-border bg-gradient-to-b from-surface to-bg text-secondary">
          <CartIcon className="h-6 w-6 opacity-40" />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <bdi className="text-xs font-semibold text-secondary">{product.brand}</bdi>
        <h3 className="mt-1 line-clamp-1 font-bold">{product.name}</h3>
        <p className="mt-1 line-clamp-1 text-xs text-muted">
          <bdi>{product.flavor}</bdi>
        </p>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                className={`h-3.5 w-3.5 ${i < fullStars ? "text-primary" : "text-border"}`}
              />
            ))}
          </div>
          <span className="text-xs text-muted">{toFaDigits(product.rating)}</span>
        </div>

        {/* Price + CTA (price always visible — no hidden pricing) */}
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
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary transition hover:bg-primary hover:text-bg"
            aria-label={`افزودن ${product.name} به سبد خرید`}
          >
            <CartIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
}
