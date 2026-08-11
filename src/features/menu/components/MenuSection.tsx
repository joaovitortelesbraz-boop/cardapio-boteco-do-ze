import type { MenuCategory, MenuProduct } from "@/src/domain/menu/menu.types";
import { CategoryIcon } from "./CategoryIcon";
import { ProductCard } from "./ProductCard";

interface MenuSectionProps {
  category: MenuCategory;
  products: readonly MenuProduct[];
}

export function MenuSection({ category, products }: MenuSectionProps) {
  return (
    <section aria-labelledby={`category-${category.id}`}>
      <div className="mb-5 flex items-end justify-between gap-5 border-b border-[#e7a316]/20 pb-4">
        <div className="flex items-center gap-4">
          <span
            className="grid size-12 shrink-0 place-items-center rounded-lg border border-[#e7a316]/30 bg-[#171009] text-[#e7a316] shadow-inner"
            aria-hidden="true"
          >
            <CategoryIcon categoryId={category.id} className="size-6" />
          </span>
          <div>
            <h3
              id={`category-${category.id}`}
              className="font-display text-2xl tracking-wide text-[#fff0c2] sm:text-3xl"
            >
              {category.name}
            </h3>
            <p className="mt-1 text-sm text-[#9e8b62]">
              {category.shortDescription}
            </p>
          </div>
        </div>
        <p className="hidden text-xs font-bold uppercase tracking-[0.14em] text-[#806f4e] sm:block">
          {products.length} {products.length === 1 ? "opção" : "opções"}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
