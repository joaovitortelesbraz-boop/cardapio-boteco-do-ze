import Link from "next/link";
import { deleteCategoryAction } from "../actions";
import { ConfirmSubmitButton } from "../ConfirmSubmitButton";
import { CategoryIcon, resolveIconKey } from "@/src/features/menu/components/CategoryIcon";

export const dynamic = "force-dynamic";

async function getData() {
  try {
    const { getDb } = await import("@/db/index");
    const { categories, products } = await import("@/db/schema");
    const { asc, eq, count } = await import("drizzle-orm");

    const db = getDb();

    const rows = await db
      .select({
        id: categories.id,
        name: categories.name,
        shortDescription: categories.shortDescription,
        iconKey: categories.iconKey,
        sortOrder: categories.sortOrder,
        productCount: count(products.id),
      })
      .from(categories)
      .leftJoin(products, eq(categories.id, products.categoryId))
      .groupBy(categories.id)
      .orderBy(asc(categories.sortOrder));

    return rows;
  } catch {
    return null;
  }
}

export default async function CategoriesPage() {
  const rows = await getData();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-[#fff0c2]">Categorias</h1>
          <p className="mt-2 text-sm text-[#9e8b62]">
            {rows ? `${rows.length} categorias cadastradas.` : "Banco indisponível."}
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="rounded-md border border-[#ffcf62] bg-gradient-to-b from-[#ffbc24] to-[#c57908] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#100b07] transition hover:-translate-y-0.5 hover:brightness-110"
        >
          + Nova Categoria
        </Link>
      </div>

      {!rows ? (
        <div className="mt-8 rounded-xl border border-[#e7a316]/20 bg-[#171009] p-8 text-center">
          <p className="text-sm text-[#cdb886]">
            Banco de dados não disponível. Configure o D1 para gerenciar categorias.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-[#e7a316]/20">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#e7a316]/20 bg-[#171009]">
              <tr>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
                  Nome
                </th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
                  Descrição
                </th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
                  Produtos
                </th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e7a316]/10">
              {rows.map((row) => {
                const resolvedIcon = resolveIconKey(row.iconKey, row.id);
                return (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-[#171009]/50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <CategoryIcon
                          iconKey={resolvedIcon}
                          className="size-5 shrink-0 text-[#ffbc24]"
                        />
                        <div>
                          <p className="font-medium text-[#fff0c2]">{row.name}</p>
                          <p className="mt-0.5 text-xs text-[#9e8b62]">{row.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#cdb886]">
                      {row.shortDescription}
                    </td>
                    <td className="px-5 py-4 text-[#cdb886]">{row.productCount}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/categories/${row.id}`}
                          className="rounded-md border border-[#e7a316]/30 px-3 py-1.5 text-xs font-bold text-[#cdb886] transition hover:border-[#ffbc24]/70 hover:text-[#ffbc24]"
                        >
                          Editar
                        </Link>
                        <form action={deleteCategoryAction}>
                          <input type="hidden" name="id" value={row.id} />
                          <ConfirmSubmitButton
                            message={`Excluir a categoria "${row.name}"? Os produtos serão removidos.`}
                            className="rounded-md border border-red-500/30 px-3 py-1.5 text-xs font-bold text-red-400 transition hover:border-red-500/70 hover:bg-red-500/10"
                          >
                            Excluir
                          </ConfirmSubmitButton>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
