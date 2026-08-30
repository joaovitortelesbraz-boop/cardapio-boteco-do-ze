export type MenuCategoryId =
  | "cervejas"
  | "sem-alcool"
  | "drinks"
  | "copao"
  | "doses"
  | "doces"
  | "cigarros"
  | "porcoes"
  | "jogos";

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
  priceInCents: number;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  imageIsPlaceholder?: boolean;
  imageFit?: "cover" | "contain";
  imagePosition?: string;
  imageScale?: number;
  featured?: boolean;
  badge?: string;
  available: boolean;
}

export interface MenuRepository {
  listCategories(): Promise<readonly MenuCategory[]>;
  listProducts(): Promise<readonly MenuProduct[]>;
}
