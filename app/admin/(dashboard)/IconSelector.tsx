import { CategoryIcon, iconLabels } from "@/src/features/menu/components/CategoryIcon";
import type { MenuIconKey } from "@/src/domain/menu/menu.types";

const selectableIcons: MenuIconKey[] = [
  "beer",
  "soda",
  "cocktail",
  "cup",
  "glass",
  "bucket",
  "bottle",
  "plate",
  "candy",
  "cigar",
  "gamepad",
  "ice",
];

interface IconSelectorProps {
  name?: string;
  defaultValue?: string | null;
}

export function IconSelector({
  name = "iconKey",
  defaultValue,
}: IconSelectorProps) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
        Ícone
      </label>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {/* "Nenhum" também garante que o campo sempre exista no formData:
            um grupo de radios sem nada marcado simplesmente não é enviado. */}
        <label className="cursor-pointer">
          <input
            type="radio"
            name={name}
            value=""
            defaultChecked={!defaultValue}
            className="peer sr-only"
          />
          <span className="flex items-center gap-2 rounded-md border border-[#e7a316]/30 px-3 py-2.5 text-sm text-[#cdb886] transition hover:border-[#ffbc24]/50 hover:text-[#fff0c2] peer-checked:border-[#ffcf62] peer-checked:bg-[#ffbc24]/10 peer-checked:text-[#ffbc24]">
            <span className="grid size-5 shrink-0 place-items-center text-base leading-none">
              —
            </span>
            <span className="truncate">Nenhum</span>
          </span>
        </label>

        {selectableIcons.map((key) => (
          // O destaque sai do peer-checked (CSS), não de estado do servidor:
          // assim a seleção muda na hora em que o usuário clica.
          <label key={key} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={key}
              defaultChecked={defaultValue === key}
              className="peer sr-only"
            />
            <span className="flex items-center gap-2 rounded-md border border-[#e7a316]/30 px-3 py-2.5 text-sm text-[#cdb886] transition hover:border-[#ffbc24]/50 hover:text-[#fff0c2] peer-checked:border-[#ffcf62] peer-checked:bg-[#ffbc24]/10 peer-checked:text-[#ffbc24]">
              <CategoryIcon className="size-5 shrink-0" iconKey={key} />
              <span className="truncate">{iconLabels[key]}</span>
            </span>
          </label>
        ))}
      </div>
      <p className="mt-1.5 text-[11px] text-[#9e8b62]">
        Nenhum = ícone baseado no ID da categoria
      </p>
    </div>
  );
}
