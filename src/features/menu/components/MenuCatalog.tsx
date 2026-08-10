"use client";

import { useMemo, useState } from "react";
import type { MenuCategory, MenuProduct } from "@/src/domain/menu/menu.types";
import { Container } from "@/src/shared/components/Container";
import { CategoryTabs, type MenuFilter } from "./CategoryTabs";
import { ProductCard } from "./ProductCard";

interface MenuCatalogProps {
  categories: readonly MenuCategory[];
  products: readonly MenuProduct[];
}

export function MenuCatalog({ categories, products }: MenuCatalogProps) {
  const [activeFilter, setActiveFilter] = useState<MenuFilter>("all");

  const visibleProducts = useMemo(
    () =>
      activeFilter === "all"
        ? products
        : products.filter((product) => product.categoryId === activeFilter),
    [activeFilter, products],
  );

  const activeCategory = categories.find(
    (category) => category.id === activeFilter,
  );

  return (
    <section id="cardapio" className="paper-texture py-20 sm:py-24">
      <Container>
        <div className="grid gap-7 border-b border-[#d9cdbb] pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#b94c35]">
              Escolha o seu
            </p>
            <h2 className="font-display text-5xl leading-none tracking-[-0.02em] text-[#201b16] sm:text-6xl">
              NOSSO CARDÁPIO
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#716659]">
              Receitas diretas ao ponto, com ingredientes bem escolhidos e porções que respeitam a fome.
            </p>
          </div>
          <p className="text-sm font-semibold text-[#857767]">
            {visibleProducts.length} {visibleProducts.length === 1 ? "item" : "itens"}
          </p>
        </div>

        <div className="sticky top-[72px] z-30 -mx-5 border-b border-[#e1d7c8] bg-[#f6f0e6]/94 px-5 py-4 backdrop-blur-md sm:mx-0 sm:px-0">
          <CategoryTabs
            categories={categories}
            activeFilter={activeFilter}
            onChange={setActiveFilter}
          />
        </div>

        <div className="mt-9 flex items-baseline justify-between gap-4">
          <div>
            <p className="font-display text-3xl tracking-wide">
              {activeCategory?.name ?? "Todos os sabores"}
            </p>
            <p className="mt-1 text-sm text-[#857767]">
              {activeCategory?.shortDescription ?? "Um pouco de cada canto do balcão"}
            </p>
          </div>
        </div>

        <div
          id="menu-products"
          className="mt-7 grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
          aria-live="polite"
        >
          {visibleProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 3} />
          ))}
        </div>

        <div className="mt-12 rounded-[1.5rem] border border-dashed border-[#c9b99f] bg-[#eee4d4]/65 p-6 text-center sm:p-8">
          <p className="font-semibold text-[#4e453a]">
            Valores e disponibilidade podem mudar sem aviso prévio.
          </p>
          <p className="mt-2 text-sm text-[#7b6e5e]">
            Nesta primeira versão, o cardápio é apenas para consulta — pedidos são feitos no salão.
          </p>
        </div>
      </Container>
    </section>
  );
}
