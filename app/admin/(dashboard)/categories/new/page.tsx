import Link from "next/link";
import { redirect } from "next/navigation";
import { IconSelector } from "../../IconSelector";
import { normalizeIconKey } from "@/src/domain/menu/menu.types";

export const dynamic = "force-dynamic";

async function createCategoryAction(formData: FormData): Promise<void> {
  "use server";
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session) redirect("/admin/login");

  const id = (formData.get("id") as string).trim();
  const name = (formData.get("name") as string).trim();
  const shortDescription = (formData.get("shortDescription") as string).trim();
  // normalizeIconKey descarta qualquer valor fora da lista e trata o caso de
  // o campo nem existir no formData (radio sem seleção).
  const iconKey = normalizeIconKey(
    ((formData.get("iconKey") as string | null) ?? "").trim(),
  );
  const sortOrder = Number(formData.get("sortOrder") || 0);

  if (!id || !name || !shortDescription) {
    return;
  }

  const { getDb } = await import("@/db/index");
  const { categories } = await import("@/db/schema");

  const db = getDb();
  await db.insert(categories).values({ id, name, shortDescription, iconKey, sortOrder });
  redirect("/admin/categories");
}

export default async function NewCategoryPage() {
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-display text-3xl text-[#fff0c2]">Nova Categoria</h1>
      <p className="mt-2 text-sm text-[#9e8b62]">
        Preencha os dados para criar uma nova categoria.
      </p>

      <form action={createCategoryAction} className="mt-8 space-y-5">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
            ID (slug) *
          </label>
          <input
            type="text"
            name="id"
            required
            placeholder="ex: cervejas"
            className="w-full rounded-md border border-[#e7a316]/30 bg-[#090603] px-4 py-3 text-sm text-[#fff0c2] outline-none focus:border-[#ffbc24] focus:ring-1 focus:ring-[#ffbc24]/50"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
            Nome *
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="ex: Cervejas"
            className="w-full rounded-md border border-[#e7a316]/30 bg-[#090603] px-4 py-3 text-sm text-[#fff0c2] outline-none focus:border-[#ffbc24] focus:ring-1 focus:ring-[#ffbc24]/50"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
            Descrição curta *
          </label>
          <input
            type="text"
            name="shortDescription"
            required
            placeholder="ex: Garrafa, long neck e chopp"
            className="w-full rounded-md border border-[#e7a316]/30 bg-[#090603] px-4 py-3 text-sm text-[#fff0c2] outline-none focus:border-[#ffbc24] focus:ring-1 focus:ring-[#ffbc24]/50"
          />
        </div>

        <IconSelector />

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
            Ordem de exibição
          </label>
          <input
            type="number"
            name="sortOrder"
            defaultValue={0}
            className="w-full rounded-md border border-[#e7a316]/30 bg-[#090603] px-4 py-3 text-sm text-[#fff0c2] outline-none focus:border-[#ffbc24] focus:ring-1 focus:ring-[#ffbc24]/50"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="rounded-md border border-[#ffcf62] bg-gradient-to-b from-[#ffbc24] to-[#c57908] px-6 py-2.5 text-xs font-black uppercase tracking-wider text-[#100b07] transition hover:-translate-y-0.5 hover:brightness-110"
          >
            Salvar
          </button>
          <Link
            href="/admin/categories"
            className="rounded-md border border-[#e7a316]/30 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#cdb886] transition hover:border-[#ffbc24]/70 hover:text-[#ffbc24]"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
