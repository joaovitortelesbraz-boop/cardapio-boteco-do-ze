import { drizzle } from "drizzle-orm/d1";
import { categories, products } from "./schema";
import {
  menuCategories,
  menuProducts,
} from "../src/data/menu/menu.data";

interface Env {
  DB: D1Database;
}

const handler = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/seed") {
      const db = drizzle(env.DB);

      const categoryData = menuCategories.map((cat, index) => ({
        id: cat.id,
        name: cat.name,
        shortDescription: cat.shortDescription,
        sortOrder: index,
      }));

      await db.delete(products).run();
      await db.delete(categories).run();

      await db.insert(categories).values(categoryData).run();

      const productData = menuProducts.map((prod, index) => ({
        id: prod.id,
        slug: prod.slug,
        categoryId: prod.categoryId,
        name: prod.name,
        priceInCents: prod.priceInCents,
        description: prod.description ?? null,
        imageUrl: prod.imageUrl ?? null,
        imageAlt: prod.imageAlt ?? null,
        imageFit: prod.imageFit ?? "cover",
        imagePosition: prod.imagePosition ?? "50% 50%",
        imageScale: prod.imageScale ?? null,
        available: prod.available ? 1 : 0,
        sortOrder: index,
      }));

      await db.insert(products).values(productData).run();

      return new Response(
        `Seed concluído: ${categoryData.length} categorias, ${productData.length} produtos.`,
        { status: 200 },
      );
    }

    return new Response("Use POST /seed para popular o banco.", { status: 404 });
  },
};

export default handler;
