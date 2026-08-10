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
