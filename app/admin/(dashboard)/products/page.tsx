import Link from "next/link";
import Image from "next/image";
import { deleteProductAction } from "../actions";
import { ConfirmSubmitButton } from "../ConfirmSubmitButton";

export const dynamic = "force-dynamic";

function formatCurrency(priceInCents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(priceInCents / 100);
}

async function getData(categoryId?: string) {
  try {
    const { getDb } = await import("@/db/index");
    const { products, categories } = await import("@/db/schema");
    const { asc, eq } = await import("drizzle-orm");

    const db = getDb();

    const allCategories = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.sortOrder));

    const rows = categoryId
      ? await db
          .select({
            id: products.id,
            slug: products.slug,
            categoryId: products.categoryId,
            categoryName: categories.name,
            name: products.name,
            priceInCents: products.priceInCents,
            imageUrl: products.imageUrl,
            available: products.available,
            sortOrder: products.sortOrder,
          })
          .from(products)
          .leftJoin(categories, eq(products.categoryId, categories.id))
          .where(eq(products.categoryId, categoryId))
          .orderBy(asc(products.sortOrder))
      : await db
          .select({
            id: products.id,
            slug: products.slug,
            categoryId: products.categoryId,
            categoryName: categories.name,
            name: products.name,
            priceInCents: products.priceInCents,
            imageUrl: products.imageUrl,
            available: products.available,
            sortOrder: products.sortOrder,
          })
          .from(products)
          .leftJoin(categories, eq(products.categoryId, categories.id))
          .orderBy(asc(products.sortOrder));

    return { allCategories, rows };
  } catch {
    return null;
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string }>;
}) {
  const params = await searchParams;
  const data = await getData(params.categoryId);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-[#fff0c2]">Produtos</h1>
          <p className="mt-2 text-sm text-[#9e8b62]">
            {data ? `${data.rows.length} produtos cadastrados.` : "Banco indisponível."}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-md border border-[#ffcf62] bg-gradient-to-b from-[#ffbc24] to-[#c57908] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#100b07] transition hover:-translate-y-0.5 hover:brightness-110"
        >
          + Novo Produto
        </Link>
      </div>

      {!data ? (
        <div className="mt-8 rounded-xl border border-[#e7a316]/20 bg-[#171009] p-8 text-center">
          <p className="text-sm text-[#cdb886]">
            Banco de dados não disponível. Configure o D1 para gerenciar produtos.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/admin/products"
              className={`rounded-md border px-4 py-2 text-xs font-bold transition ${
                !params.categoryId
                  ? "border-[#ffcf62] bg-[#ffbc24]/10 text-[#ffbc24]"
                  : "border-[#e7a316]/30 text-[#cdb886] hover:border-[#ffbc24]/70 hover:text-[#ffbc24]"
              }`}
            >
              Todos
            </Link>
            {data.allCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/admin/products?categoryId=${cat.id}`}
                className={`rounded-md border px-4 py-2 text-xs font-bold transition ${
                  params.categoryId === cat.id
                    ? "border-[#ffcf62] bg-[#ffbc24]/10 text-[#ffbc24]"
                    : "border-[#e7a316]/30 text-[#cdb886] hover:border-[#ffbc24]/70 hover:text-[#ffbc24]"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-[#e7a316]/20">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#e7a316]/20 bg-[#171009]">
                <tr>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
                    Produto
                  </th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
                    Categoria
                  </th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
                    Preço
                  </th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
                    Status
                  </th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7a316]/10">
                {data.rows.map((row) => (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-[#171009]/50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {row.imageUrl ? (
                          <div className="relative size-10 shrink-0 overflow-hidden rounded-md border border-[#e7a316]/20 bg-[#0b0704]">
                            <Image
                              src={row.imageUrl}
                              alt={row.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                        ) : (
                          <div className="size-10 shrink-0 rounded-md border border-[#e7a316]/20 bg-[#0b0704]" />
                        )}
                        <div>
                          <p className="font-medium text-[#fff0c2]">{row.name}</p>
                          <p className="mt-0.5 text-xs text-[#9e8b62]">{row.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#cdb886]">
                      {row.categoryName}
                    </td>
                    <td className="px-5 py-4 font-medium text-[#ffbc24]">
                      {formatCurrency(row.priceInCents)}
                    </td>
                    <td className="px-5 py-4">
                      {row.available ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#45c96b]/30 bg-[#45c96b]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#45c96b]">
                          <span className="size-1.5 rounded-full bg-[#45c96b]" />
                          Disponível
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#a9443e]/30 bg-[#a9443e]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#a9443e]">
                          <span className="size-1.5 rounded-full bg-[#a9443e]" />
                          Indisponível
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${row.id}`}
                          className="rounded-md border border-[#e7a316]/30 px-3 py-1.5 text-xs font-bold text-[#cdb886] transition hover:border-[#ffbc24]/70 hover:text-[#ffbc24]"
                        >
                          Editar
                        </Link>
                        <form action={deleteProductAction}>
                          <input type="hidden" name="id" value={row.id} />
                          <ConfirmSubmitButton
                            message={`Excluir o produto "${row.name}"?`}
                            className="rounded-md border border-red-500/30 px-3 py-1.5 text-xs font-bold text-red-400 transition hover:border-red-500/70 hover:bg-red-500/10"
                          >
                            Excluir
                          </ConfirmSubmitButton>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
