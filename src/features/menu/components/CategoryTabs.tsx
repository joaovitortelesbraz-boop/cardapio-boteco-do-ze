import type {
  MenuCategory,
  MenuCategoryId,
  MenuIconKey,
} from "@/src/domain/menu/menu.types";
import { CategoryIcon } from "./CategoryIcon";

export type MenuFilter = "all" | MenuCategoryId;

interface CategoryTabsProps {
  categories: readonly MenuCategory[];
  activeFilter: MenuFilter;
  onChange: (filter: MenuFilter) => void;
}

export function CategoryTabs({
  categories,
  activeFilter,
  onChange,
}: CategoryTabsProps) {
  const options: ReadonlyArray<{
    id: MenuFilter;
    name: string;
    iconKey?: MenuIconKey | null;
  }> = [{ id: "all", name: "Tudo" }, ...categories];

  return (
    <div
      className="hide-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0"
      role="group"
      aria-label="Filtrar produtos por categoria"
    >
      {options.map((option) => {
        const isActive = option.id === activeFilter;

        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isActive}
            aria-controls="menu-results"
            onClick={() => onChange(option.id)}
            className={`relative isolate min-h-11 shrink-0 overflow-hidden rounded-md border bg-[#171009] px-5 text-sm font-bold transition-[border-color,color,box-shadow] duration-200 ease-out motion-reduce:transition-none ${
              isActive
                ? "border-[#ffcf62] text-[#100b07] shadow-[0_7px_20px_rgb(231_163_22/0.18)]"
                : "border-[#e7a316]/30 text-[#cdb886] shadow-none hover:border-[#e7a316]/70 hover:text-[#fff0c2]"
            }`}
          >
            <span
              className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-[#ffbc24] to-[#b66a06] transition-opacity duration-200 ease-out motion-reduce:transition-none ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden="true"
            />
            <span className="relative z-10 inline-flex items-center gap-2">
              <CategoryIcon
                categoryId={option.id}
                iconKey={option.iconKey}
                className="size-[18px] shrink-0"
              />
              {option.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
