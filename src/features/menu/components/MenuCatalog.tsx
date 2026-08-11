"use client";

import { useMemo, useRef, useState } from "react";
import type { TransitionEvent } from "react";
import type { MenuCategory, MenuProduct } from "@/src/domain/menu/menu.types";
import { Container } from "@/src/shared/components/Container";
import { CategoryTabs, type MenuFilter } from "./CategoryTabs";
import { MenuSection } from "./MenuSection";

interface MenuCatalogProps {
  categories: readonly MenuCategory[];
  products: readonly MenuProduct[];
}

type CatalogTransitionPhase =
  | "idle"
  | "exiting"
  | "entering"
  | "restoring";

export function MenuCatalog({ categories, products }: MenuCatalogProps) {
  const [activeFilter, setActiveFilter] = useState<MenuFilter>("all");
  const [renderedFilter, setRenderedFilter] = useState<MenuFilter>("all");
  const [transitionPhase, setTransitionPhase] =
    useState<CatalogTransitionPhase>("idle");
  const requestedFilterRef = useRef<MenuFilter>("all");

  const sections = useMemo(
    () =>
      categories
        .filter(
          (category) =>
            renderedFilter === "all" || category.id === renderedFilter,
        )
        .map((category) => ({
          category,
          products: products.filter(
            (product) => product.categoryId === category.id,
          ),
        })),
    [categories, products, renderedFilter],
  );

  const visibleCount = sections.reduce(
    (total, section) => total + section.products.length,
    0,
  );

  function handleFilterChange(nextFilter: MenuFilter) {
    if (nextFilter === activeFilter && transitionPhase === "idle") {
      return;
    }

    requestedFilterRef.current = nextFilter;
    setActiveFilter(nextFilter);

    if (nextFilter === renderedFilter) {
      if (transitionPhase === "exiting") {
        setTransitionPhase("restoring");
      }

      return;
    }

    setTransitionPhase("exiting");
  }

  function handleResultsTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (
      event.target !== event.currentTarget ||
      event.propertyName !== "opacity"
    ) {
      return;
    }

    if (transitionPhase === "exiting") {
      const nextFilter = requestedFilterRef.current;

      if (nextFilter === renderedFilter) {
        setTransitionPhase("restoring");
        return;
      }

      setRenderedFilter(nextFilter);
      setTransitionPhase("entering");
      return;
    }

    if (
      transitionPhase === "entering" ||
      transitionPhase === "restoring"
    ) {
      setTransitionPhase(
        requestedFilterRef.current === renderedFilter ? "idle" : "exiting",
      );
    }
  }

  return (
    <section
      id="cardapio"
      className="wood-texture pt-20 pb-14 sm:pt-24 sm:pb-16"
    >
      <Container>
        <div className="grid gap-7 border-b border-[#e7a316]/30 pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#e7a316]">
              Boteco do Zé
            </p>
            <h2 className="font-display text-5xl leading-none tracking-[-0.02em] text-[#fff0c2] [text-shadow:0_4px_0_#050403] sm:text-6xl">
              CARDÁPIO DIGITAL
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#bca87a]">
              Cervejas, drinks, doses, porções e diversão. Use os filtros para
              encontrar rapidamente o que procura.
            </p>
          </div>
          <p className="text-sm font-semibold text-[#9e8b62]">
            {visibleCount} {visibleCount === 1 ? "item" : "itens"}
          </p>
        </div>

        <div className="sticky top-[88px] z-30 -mx-5 border-b border-[#e7a316]/25 bg-[#090603]/94 px-5 py-4 backdrop-blur-md sm:mx-0 sm:px-0">
          <CategoryTabs
            categories={categories}
            activeFilter={activeFilter}
            onChange={handleFilterChange}
          />
        </div>

        <div
          id="menu-results"
          data-transition-phase={transitionPhase}
          className="menu-results-transition mt-10 space-y-14"
          aria-live="polite"
          onTransitionEnd={handleResultsTransitionEnd}
        >
          {sections.map((section) => (
            <MenuSection
              key={section.category.id}
              category={section.category}
              products={section.products}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
