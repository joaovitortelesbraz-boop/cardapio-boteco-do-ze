import { drizzle } from "drizzle-orm/d1";
import { eq, asc } from "drizzle-orm";
import type { MenuRepository } from "@/src/domain/menu/menu.types";
import { categories, products } from "@/db/schema";

export function createD1MenuRepository(db: ReturnType<typeof drizzle>): MenuRepository {
  return {
    async listCategories() {
      const rows = await db
        .select()
        .from(categories)
        .orderBy(asc(categories.sortOrder));

      return rows.map((row) => ({
        id: row.id as
          | "cervejas"
          | "sem-alcool"
          | "drinks"
          | "copao"
          | "doses"
          | "doces"
          | "cigarros"
          | "porcoes"
          | "jogos",
        name: row.name,
        shortDescription: row.shortDescription,
      }));
    },

    async listProducts() {
      const rows = await db
        .select()
        .from(products)
        .where(eq(products.available, 1))
        .orderBy(asc(products.sortOrder));

      return rows.map((row) => ({
        id: row.id,
        slug: row.slug,
        categoryId: row.categoryId as
          | "cervejas"
          | "sem-alcool"
          | "drinks"
          | "copao"
          | "doses"
          | "doces"
          | "cigarros"
          | "porcoes"
          | "jogos",
        name: row.name,
        priceInCents: row.priceInCents,
        description: row.description ?? undefined,
        imageUrl: row.imageUrl ?? undefined,
        imageAlt: row.imageAlt ?? undefined,
        imageFit: (row.imageFit as "cover" | "contain") ?? "cover",
        imagePosition: row.imagePosition ?? "50% 50%",
        imageScale: row.imageScale ?? undefined,
        available: row.available === 1,
      }));
    },
  };
}
