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

/**
 * Ícones que uma categoria pode usar. Vive no domínio (e não no componente)
 * porque as rotas de API e os server actions precisam validar o valor sem
 * arrastar JSX junto.
 */
export const MENU_ICON_KEYS = [
  "beer",
  "soda",
  "cocktail",
  "cup",
  "glass",
  "candy",
  "cigar",
  "plate",
  "gamepad",
  "bucket",
  "bottle",
  "ice",
] as const;

export type MenuIconKey = (typeof MENU_ICON_KEYS)[number];

export function isMenuIconKey(value: unknown): value is MenuIconKey {
  return (
    typeof value === "string" &&
    (MENU_ICON_KEYS as readonly string[]).includes(value)
  );
}

/** Normaliza o que veio de formulário/API: só passa ícone conhecido. */
export function normalizeIconKey(value: unknown): MenuIconKey | null {
  return isMenuIconKey(value) ? value : null;
}

export interface MenuCategory {
  id: MenuCategoryId;
  name: string;
  shortDescription: string;
  iconKey?: MenuIconKey | null;
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
