import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function updateCategoryAction(formData: FormData): Promise<void> {
  "use server";
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session) redirect("/admin/login");

  const id = formData.get("id") as string;
  const name = (formData.get("name") as string).trim();
  const shortDescription = (formData.get("shortDescription") as string).trim();
  const sortOrder = Number(formData.get("sortOrder") || 0);

  const { getDb } = await import("@/db/index");
  const { categories } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");

  const db = getDb();
  await db
    .update(categories)
    .set({ name, shortDescription, sortOrder })
    .where(eq(categories.id, id));

  redirect("/admin/categories");
}

async function getData(id: string) {
  try {
    const { getDb } = await import("@/db/index");
    const { categories } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");

    const db = getDb();
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch {
    return undefined;
  }
}

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getData(id);

  if (category === undefined) {
    return (
      <div className="mx-auto max-w-lg">
        <h1 className="font-display text-3xl text-[#fff0c2]">
          Editar Categoria
        </h1>
        <div className="mt-8 rounded-xl border border-[#e7a316]/20 bg-[#171009] p-8 text-center">
          <p className="text-sm text-[#cdb886]">
            Banco de dados não disponível. Configure o D1 para editar categorias.
          </p>
        </div>
      </div>
    );
  }

  if (!category) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-display text-3xl text-[#fff0c2]">
        Editar Categoria
      </h1>
      <p className="mt-2 text-sm text-[#9e8b62]">
        Editando: <span className="text-[#ffbc24]">{category.name}</span>
      </p>

      <form action={updateCategoryAction} className="mt-8 space-y-5">
        <input type="hidden" name="id" value={category.id} />

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
            ID
          </label>
          <input
            type="text"
            value={category.id}
            disabled
            className="w-full rounded-md border border-[#e7a316]/15 bg-[#0d0907] px-4 py-3 text-sm text-[#9e8b62]"
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
            defaultValue={category.name}
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
            defaultValue={category.shortDescription}
            className="w-full rounded-md border border-[#e7a316]/30 bg-[#090603] px-4 py-3 text-sm text-[#fff0c2] outline-none focus:border-[#ffbc24] focus:ring-1 focus:ring-[#ffbc24]/50"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
            Ordem de exibição
          </label>
          <input
            type="number"
            name="sortOrder"
            defaultValue={category.sortOrder ?? 0}
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
