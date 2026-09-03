import type { ReactNode, SVGProps } from "react";
import type { MenuIconKey } from "@/src/domain/menu/menu.types";

/** Ícones de categoria + o "all" da aba Tudo, que não é uma categoria. */
export type IconKey = MenuIconKey | "all";

export const iconLabels: Record<IconKey, string> = {
  all: "Todos",
  beer: "Cerveja",
  soda: "Sem álcool",
  cocktail: "Drinks",
  cup: "Copão",
  glass: "Doses",
  candy: "Doce",
  cigar: "Cigarro",
  plate: "Porção",
  gamepad: "Jogo",
  bucket: "Balde",
  bottle: "Garrafa",
  ice: "Gelo",
};

const iconGlyphs: Record<IconKey, ReactNode> = {
  all: (
    <>
      <rect x="4.5" y="4.5" width="5.5" height="5.5" rx="1.2" />
      <rect x="14" y="4.5" width="5.5" height="5.5" rx="1.2" />
      <rect x="4.5" y="14" width="5.5" height="5.5" rx="1.2" />
      <rect x="14" y="14" width="5.5" height="5.5" rx="1.2" />
    </>
  ),
  beer: (
    <>
      <path d="M7 8h8v9.5a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8Z" />
      <path d="M15 10h1.5a2.5 2.5 0 0 1 0 5H15" />
      <path d="M7.5 8A2.5 2.5 0 0 1 12 6.5 2.5 2.5 0 0 1 15 8" />
      <path d="M10 11v5.5M12.5 11v5.5" />
    </>
  ),
  soda: (
    <>
      <path d="M7 8h10l-1 11H8L7 8Z" />
      <path d="m14 8 1.5-4H19" />
      <path d="M9 12h6" />
    </>
  ),
  cocktail: (
    <>
      <path d="M4.5 5.5h15L12 13 4.5 5.5Z" />
      <path d="M12 13v6M8.5 19h7" />
      <circle cx="16.5" cy="7" r="1.5" />
    </>
  ),
  cup: (
    <>
      <path d="M7.2 5.5h9.6l-1.4 14.3a1.6 1.6 0 0 1-1.6 1.4h-3.6a1.6 1.6 0 0 1-1.6-1.4L7.2 5.5Z" />
      <path d="M7.7 10.3h8.6" />
      <path d="M13.9 5.5 16.6 2.3" />
      <path d="M10 12.7h2.3V15H10z" />
      <path d="M12.7 15.8h1.9v1.9h-1.9z" />
    </>
  ),
  glass: (
    <>
      <path d="M7.5 5h9l-1.2 14H8.7L7.5 5Z" />
      <path d="M8 9h8" />
    </>
  ),
  candy: (
    <>
      <rect x="8" y="8" width="8" height="8" rx="2" />
      <path d="m8 9-3-2-2 3 3 2-3 2 2 3 3-2M16 9l3-2 2 3-3 2 3 2-2 3-3-2" />
    </>
  ),
  cigar: (
    <>
      <path d="M4 14h14v4H4zM14 14v4" />
      <path d="M18 11c1-1 1-2 0-3M20 11c1.5-1.5 1.5-3.5 0-5" />
    </>
  ),
  plate: (
    <>
      <path d="M5 16h14M7 16a5 5 0 0 1 10 0" />
      <path d="M12 8V6M10.5 6h3M4 19h16" />
    </>
  ),
  gamepad: (
    <>
      <path d="m12 4 8 16H4L12 4Z" />
      <circle cx="12" cy="10" r="1.35" />
      <circle cx="9.5" cy="15.2" r="1.35" />
      <circle cx="14.5" cy="15.2" r="1.35" />
    </>
  ),
  bucket: (
    <>
      <path d="M6 7h12l-1 12H7L6 7Z" />
      <path d="M8 7V5a4 4 0 0 1 8 0v2" />
      <path d="M12 11v4" />
    </>
  ),
  bottle: (
    <>
      <path d="M10 4h4v3l2 2v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V9l2-2V4Z" />
      <path d="M9 13h6" />
    </>
  ),
  ice: (
    <>
      <path d="M12 2v16M6 6l6 6 6-6M6 12l6 6 6-6" />
    </>
  ),
};

// Categorias antigas não têm icon_key gravado: o id resolve o ícone.
// "all" entra aqui porque a aba Tudo também passa por resolveIconKey.
const legacyIdToIconKey: Record<string, IconKey> = {
  all: "all",
  cervejas: "beer",
  "sem-alcool": "soda",
  drinks: "cocktail",
  copao: "cup",
  doses: "glass",
  doces: "candy",
  cigarros: "cigar",
  porcoes: "plate",
  jogos: "gamepad",
};

interface CategoryIconProps
  extends Omit<SVGProps<SVGSVGElement>, "children"> {
  categoryId?: string;
  iconKey?: IconKey | null;
}

export function resolveIconKey(
  iconKey?: string | null,
  categoryId?: string,
): IconKey {
  if (iconKey && iconKey in iconGlyphs) return iconKey as IconKey;
  if (categoryId && categoryId in legacyIdToIconKey)
    return legacyIdToIconKey[categoryId];
  return "plate";
}

export function CategoryIcon({
  categoryId,
  iconKey: iconKeyProp,
  className = "",
  ...props
}: CategoryIconProps) {
  const resolved = resolveIconKey(iconKeyProp, categoryId);
  return (
    <svg
      {...props}
      data-icon-key={resolved}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {iconGlyphs[resolved]}
    </svg>
  );
}
