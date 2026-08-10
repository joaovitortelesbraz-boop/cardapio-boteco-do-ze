import type { MenuRepository } from "@/src/domain/menu/menu.types";
import { menuCategories, menuProducts } from "./menu.data";

export const localMenuRepository: MenuRepository = {
  async listCategories() {
    return menuCategories;
  },
  async listProducts() {
    return menuProducts.filter((product) => product.available);
  },
};
