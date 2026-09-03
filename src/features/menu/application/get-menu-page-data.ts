import type { MenuRepository } from "@/src/domain/menu/menu.types";
import { localMenuRepository } from "@/src/data/menu/local-menu.repository";

export async function getMenuPageData(
  repository: MenuRepository = localMenuRepository,
) {
  const [categories, products] = await Promise.all([
    repository.listCategories(),
    repository.listProducts(),
  ]);

  return { categories, products };
}

export async function getMenuPageDataWithD1() {
  try {
    const { getDb } = await import("@/db/index");
    const { createD1MenuRepository } = await import(
      "@/src/data/menu/d1-menu.repository"
    );
    const db = getDb();
    const repository = createD1MenuRepository(db);
    return getMenuPageData(repository);
  } catch {
    return getMenuPageData();
  }
}
