import type { MenuProduct } from "@/src/domain/menu/menu.types";
import { formatCurrency } from "@/src/shared/lib/format-currency";

interface ProductCardProps {
  product: MenuProduct;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-[1.5rem] border border-[#dfd3c1] bg-[#fffaf1] shadow-[0_12px_35px_rgb(72_52_29/0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgb(72_52_29/0.12)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#e7dece]">
        <img
          src={product.imageUrl}
          alt={product.imageAlt}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
        {product.badge ? (
          <p className="absolute left-4 top-4 rounded-full bg-[#fffaf1]/95 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#6f3327] shadow-sm backdrop-blur">
            {product.badge}
          </p>
        ) : null}
      </div>
      <div className="flex min-h-48 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-5">
          <h3 className="font-display text-2xl tracking-wide text-[#201b16]">
            {product.name}
          </h3>
          <p className="shrink-0 text-base font-black text-[#b94c35]">
            {formatCurrency(product.priceInCents)}
          </p>
        </div>
        <p className="mt-3 text-sm leading-6 text-[#716659]">{product.description}</p>
        <div className="mt-auto pt-5">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-[#7a6d5d]">
            <span className="size-1.5 rounded-full bg-[#e2a52b]" aria-hidden="true" />
            Disponível hoje
          </span>
        </div>
      </div>
    </article>
  );
}
