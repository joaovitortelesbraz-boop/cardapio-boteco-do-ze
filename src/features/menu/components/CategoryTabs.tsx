import type { MenuCategory, MenuCategoryId } from "@/src/domain/menu/menu.types";

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
  const options: ReadonlyArray<{ id: MenuFilter; name: string }> = [
    { id: "all", name: "Tudo" },
    ...categories,
  ];

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
            onClick={() => onChange(option.id)}
            className={`min-h-11 shrink-0 rounded-full border px-5 text-sm font-bold transition ${
              isActive
                ? "border-[#17130f] bg-[#17130f] text-white shadow-lg shadow-black/10"
                : "border-[#d9cdbb] bg-[#fffaf1] text-[#5f5549] hover:border-[#9d8d79] hover:text-[#17130f]"
            }`}
          >
            {option.name}
          </button>
        );
      })}
    </div>
  );
}
