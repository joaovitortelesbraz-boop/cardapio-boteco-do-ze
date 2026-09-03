import { getDb } from "@/db/index";
import { categories, products } from "@/db/schema";
import { count, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const db = getDb();

    const [totalCategories] = await db
      .select({ value: count() })
      .from(categories);

    const [totalProducts] = await db
      .select({ value: count() })
      .from(products);

    const [availableProducts] = await db
      .select({ value: count() })
      .from(products)
      .where(eq(products.available, 1));

    const [unavailableProducts] = await db
      .select({ value: count() })
      .from(products)
      .where(eq(products.available, 0));

    return {
      categories: totalCategories.value,
      products: totalProducts.value,
      available: availableProducts.value,
      unavailable: unavailableProducts.value,
    };
  } catch {
    return null;
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = stats
    ? [
        {
          label: "Categorias",
          value: stats.categories,
          color: "text-[#ffbc24]",
        },
        {
          label: "Produtos",
          value: stats.products,
          color: "text-[#fff0c2]",
        },
        {
          label: "Disponíveis",
          value: stats.available,
          color: "text-[#45c96b]",
        },
        {
          label: "Indisponíveis",
          value: stats.unavailable,
          color: "text-[#a9443e]",
        },
      ]
    : [];

  return (
    <div>
      <h1 className="font-display text-3xl text-[#fff0c2]">Dashboard</h1>
      <p className="mt-2 text-sm text-[#9e8b62]">
        Visão geral do cardápio do Boteco do Zé.
      </p>

      {!stats ? (
        <div className="mt-8 rounded-xl border border-[#e7a316]/20 bg-[#171009] p-8 text-center">
          <p className="text-sm text-[#cdb886]">
            Banco de dados não disponível. Configure o D1 para usar o painel
            admin.
          </p>
          <p className="mt-3 text-xs text-[#9e8b62]">
            Veja as instruções de configuração no README.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[#e7a316]/20 bg-[#171009] p-6"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
                {stat.label}
              </p>
              <p className={`mt-2 font-display text-4xl ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
