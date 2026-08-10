export type MenuCategoryId = "petiscos" | "porcoes" | "lanches" | "bebidas";

export interface MenuCategory {
  id: MenuCategoryId;
  name: string;
  shortDescription: string;
}

export interface MenuProduct {
  id: string;
  slug: string;
  categoryId: MenuCategoryId;
  name: string;
  description: string;
  priceInCents: number;
  imageUrl: string;
  imageAlt: string;
  featured?: boolean;
  badge?: string;
  available: boolean;
}

export interface MenuRepository {
  listCategories(): Promise<readonly MenuCategory[]>;
  listProducts(): Promise<readonly MenuProduct[]>;
}
