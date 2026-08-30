import type { ReactNode, SVGProps } from "react";
import type { MenuCategoryId } from "@/src/domain/menu/menu.types";

export type CategoryIconId = "all" | MenuCategoryId;

const categoryGlyphs = {
  all: (
    <>
      <rect x="4.5" y="4.5" width="5.5" height="5.5" rx="1.2" />
      <rect x="14" y="4.5" width="5.5" height="5.5" rx="1.2" />
      <rect x="4.5" y="14" width="5.5" height="5.5" rx="1.2" />
      <rect x="14" y="14" width="5.5" height="5.5" rx="1.2" />
    </>
  ),
  cervejas: (
    <>
      <path d="M7 8h8v9.5a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8Z" />
      <path d="M15 10h1.5a2.5 2.5 0 0 1 0 5H15" />
      <path d="M7.5 8A2.5 2.5 0 0 1 12 6.5 2.5 2.5 0 0 1 15 8" />
      <path d="M10 11v5.5M12.5 11v5.5" />
    </>
  ),
  "sem-alcool": (
    <>
      <path d="M7 8h10l-1 11H8L7 8Z" />
      <path d="m14 8 1.5-4H19" />
      <path d="M9 12h6" />
    </>
  ),
  drinks: (
    <>
      <path d="M4.5 5.5h15L12 13 4.5 5.5Z" />
      <path d="M12 13v6M8.5 19h7" />
      <circle cx="16.5" cy="7" r="1.5" />
    </>
  ),
  copao: (
    <>
      <path d="M7.2 5.5h9.6l-1.4 14.3a1.6 1.6 0 0 1-1.6 1.4h-3.6a1.6 1.6 0 0 1-1.6-1.4L7.2 5.5Z" />
      <path d="M7.7 10.3h8.6" />
      <path d="M13.9 5.5 16.6 2.3" />
      <path d="M10 12.7h2.3V15H10z" />
      <path d="M12.7 15.8h1.9v1.9h-1.9z" />
    </>
  ),
  doses: (
    <>
      <path d="M7.5 5h9l-1.2 14H8.7L7.5 5Z" />
      <path d="M8 9h8" />
    </>
  ),
  doces: (
    <>
      <rect x="8" y="8" width="8" height="8" rx="2" />
      <path d="m8 9-3-2-2 3 3 2-3 2 2 3 3-2M16 9l3-2 2 3-3 2 3 2-2 3-3-2" />
    </>
  ),
  cigarros: (
    <>
      <path d="M4 14h14v4H4zM14 14v4" />
      <path d="M18 11c1-1 1-2 0-3M20 11c1.5-1.5 1.5-3.5 0-5" />
    </>
  ),
  porcoes: (
    <>
      <path d="M5 16h14M7 16a5 5 0 0 1 10 0" />
      <path d="M12 8V6M10.5 6h3M4 19h16" />
    </>
  ),
  jogos: (
    <>
      <path d="m12 4 8 16H4L12 4Z" />
      <circle cx="12" cy="10" r="1.35" />
      <circle cx="9.5" cy="15.2" r="1.35" />
      <circle cx="14.5" cy="15.2" r="1.35" />
    </>
  ),
} satisfies Record<CategoryIconId, ReactNode>;

interface CategoryIconProps
  extends Omit<SVGProps<SVGSVGElement>, "children"> {
  categoryId: CategoryIconId;
}

export function CategoryIcon({
  categoryId,
  className = "",
  ...props
}: CategoryIconProps) {
  return (
    <svg
      {...props}
      data-category-icon={categoryId}
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
      {categoryGlyphs[categoryId]}
    </svg>
  );
}
