import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ProductCard } from "@/src/features/menu/components/ProductCard";
import type { MenuProduct } from "@/src/domain/menu/menu.types";

export const dynamic = "force-dynamic";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function updateProductAction(formData: FormData): Promise<void> {
  "use server";
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session) redirect("/admin/login");

  const id = formData.get("id") as string;
  const name = (formData.get("name") as string).trim();
  const categoryId = formData.get("categoryId") as string;
  const priceRaw = (formData.get("price") as string).replace(",", ".");
  const priceInCents = Math.round(parseFloat(priceRaw) * 100);
  const description = (formData.get("description") as string).trim() || null;
  const imageUrl = (formData.get("imageUrl") as string).trim() || null;
  const imageAlt = (formData.get("imageAlt") as string).trim() || null;
  const imageFit = (formData.get("imageFit") as string) || "cover";
  const imagePosition = (formData.get("imagePosition") as string).trim() || "50% 50%";
  const imageScaleRaw = parseFloat(formData.get("imageScale") as string);
  const imageScale = isNaN(imageScaleRaw) ? null : imageScaleRaw;
  const available = formData.get("available") === "on" ? 1 : 0;
  const sortOrder = Number(formData.get("sortOrder") || 0);

  if (!name || !categoryId || isNaN(priceInCents)) {
    return;
  }

  const slug = slugify(name);

  const { getDb } = await import("@/db/index");
  const { products } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");

  const db = getDb();

  await db
    .update(products)
    .set({
      slug,
      categoryId,
      name,
      priceInCents,
      description,
      imageUrl,
      imageAlt,
      imageFit,
      imagePosition,
      imageScale,
      available,
      sortOrder,
    })
    .where(eq(products.id, id));

  redirect("/admin/products");
}

async function getData(id: string) {
  try {
    const { getDb } = await import("@/db/index");
    const { products, categories } = await import("@/db/schema");
    const { eq, asc } = await import("drizzle-orm");

    const db = getDb();

    const result = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (result.length === 0) {
      return { product: null, allCategories: [] };
    }

    const allCategories = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.sortOrder));

    return { product: result[0], allCategories };
  } catch {
    return null;
  }
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getData(id);

  if (!data) {
    return (
      <div className="mx-auto max-w-lg">
        <h1 className="font-display text-3xl text-[#fff0c2]">Editar Produto</h1>
        <div className="mt-8 rounded-xl border border-[#e7a316]/20 bg-[#171009] p-8 text-center">
          <p className="text-sm text-[#cdb886]">
            Banco de dados não disponível. Configure o D1 para editar produtos.
          </p>
        </div>
      </div>
    );
  }

  if (!data.product) {
    notFound();
  }

  const product = data.product;
  const priceDisplay = (product.priceInCents / 100).toFixed(2);

  const previewFit = product.imageFit ?? "cover";
  const previewPosition = product.imagePosition ?? "50% 50%";
  const previewScale = product.imageScale ?? 1;

  const previewProduct: MenuProduct = {
    id: product.id,
    slug: product.slug,
    categoryId: product.categoryId as MenuProduct["categoryId"],
    name: product.name,
    priceInCents: product.priceInCents,
    description: product.description ?? undefined,
    imageUrl: product.imageUrl ?? undefined,
    imageAlt: product.imageAlt ?? undefined,
    imageFit: previewFit === "contain" ? "contain" : "cover",
    imagePosition: previewPosition,
    imageScale: product.imageScale ?? undefined,
    available: product.available === 1,
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-display text-3xl text-[#fff0c2]">Editar Produto</h1>
      <p className="mt-2 text-sm text-[#9e8b62]">
        Editando: <span className="text-[#ffbc24]">{product.name}</span>
      </p>

      {product.imageUrl ? (
        <div className="mt-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
            Pré-visualização
          </p>
          {/* É o mesmo ProductCard do cardápio público: proporção, máscara,
              gradientes e imageFit/Position/Scale vêm de graça e não podem
              divergir do card real. Reflete o que está salvo, não o formulário. */}
          <ProductCard product={previewProduct} />
          <p className="mt-2 text-[11px] text-[#9e8b62]">
            {previewFit} · {previewPosition} · zoom {previewScale}x · reflete o
            que está salvo
          </p>
        </div>
      ) : null}

      <form action={updateProductAction} className="mt-8 space-y-5">
        <input type="hidden" name="id" value={product.id} />

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
            Nome do produto *
          </label>
          <input
            type="text"
            name="name"
            required
            defaultValue={product.name}
            className="w-full rounded-md border border-[#e7a316]/30 bg-[#090603] px-4 py-3 text-sm text-[#fff0c2] outline-none focus:border-[#ffbc24] focus:ring-1 focus:ring-[#ffbc24]/50"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
            Categoria *
          </label>
          <select
            name="categoryId"
            required
            defaultValue={product.categoryId}
            className="w-full rounded-md border border-[#e7a316]/30 bg-[#090603] px-4 py-3 text-sm text-[#fff0c2] outline-none focus:border-[#ffbc24] focus:ring-1 focus:ring-[#ffbc24]/50"
          >
            {data.allCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
            Preço (R$) *
          </label>
          <input
            type="text"
            name="price"
            required
            defaultValue={priceDisplay}
            className="w-full rounded-md border border-[#e7a316]/30 bg-[#090603] px-4 py-3 text-sm text-[#fff0c2] outline-none focus:border-[#ffbc24] focus:ring-1 focus:ring-[#ffbc24]/50"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
            Descrição
          </label>
          <textarea
            name="description"
            rows={3}
            defaultValue={product.description ?? ""}
            className="w-full rounded-md border border-[#e7a316]/30 bg-[#090603] px-4 py-3 text-sm text-[#fff0c2] outline-none focus:border-[#ffbc24] focus:ring-1 focus:ring-[#ffbc24]/50"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
            URL da imagem
          </label>
          <input
            type="text"
            name="imageUrl"
            defaultValue={product.imageUrl ?? ""}
            className="w-full rounded-md border border-[#e7a316]/30 bg-[#090603] px-4 py-3 text-sm text-[#fff0c2] outline-none focus:border-[#ffbc24] focus:ring-1 focus:ring-[#ffbc24]/50"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
            Alt da imagem
          </label>
          <input
            type="text"
            name="imageAlt"
            defaultValue={product.imageAlt ?? ""}
            className="w-full rounded-md border border-[#e7a316]/30 bg-[#090603] px-4 py-3 text-sm text-[#fff0c2] outline-none focus:border-[#ffbc24] focus:ring-1 focus:ring-[#ffbc24]/50"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
            Image Fit
          </label>
          <select
            name="imageFit"
            defaultValue={product.imageFit ?? "cover"}
            className="w-full rounded-md border border-[#e7a316]/30 bg-[#090603] px-4 py-3 text-sm text-[#fff0c2] outline-none focus:border-[#ffbc24] focus:ring-1 focus:ring-[#ffbc24]/50"
          >
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
            Posição da imagem
          </label>
          <input
            type="text"
            name="imagePosition"
            defaultValue={product.imagePosition ?? "50% 50%"}
            className="w-full rounded-md border border-[#e7a316]/30 bg-[#090603] px-4 py-3 text-sm text-[#fff0c2] outline-none focus:border-[#ffbc24] focus:ring-1 focus:ring-[#ffbc24]/50"
          />
          <p className="mt-1 text-[11px] text-[#9e8b62]">
            Formato: &quot;X% Y%&quot; (ex: &quot;50% 50%&quot; = centro, &quot;30% 20%&quot; = canto superior esquerdo)
          </p>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
            Escala / Zoom
          </label>
          <input
            type="number"
            name="imageScale"
            step="0.05"
            min="0.5"
            max="2"
            defaultValue={product.imageScale ?? ""}
            placeholder="1.0 (sem zoom)"
            className="w-full rounded-md border border-[#e7a316]/30 bg-[#090603] px-4 py-3 text-sm text-[#fff0c2] outline-none focus:border-[#ffbc24] focus:ring-1 focus:ring-[#ffbc24]/50"
          />
          <p className="mt-1 text-[11px] text-[#9e8b62]">
            1.0 = sem zoom, 1.5 = 50% maior, 0.8 = reduzido
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="available"
            defaultChecked={product.available === 1}
            id="available"
            className="size-4 rounded border-[#e7a316]/30 bg-[#090603] text-[#ffbc24] accent-[#ffbc24]"
          />
          <label htmlFor="available" className="text-sm text-[#cdb886]">
            Disponível no cardápio
          </label>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
            Ordem de exibição
          </label>
          <input
            type="number"
            name="sortOrder"
            defaultValue={product.sortOrder ?? 0}
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
            href="/admin/products"
            className="rounded-md border border-[#e7a316]/30 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#cdb886] transition hover:border-[#ffbc24]/70 hover:text-[#ffbc24]"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
