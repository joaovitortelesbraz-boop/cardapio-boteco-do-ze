import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

function generateId(): string {
  const num = Math.floor(Math.random() * 900) + 100;
  return `prd_${num}`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function createProductAction(formData: FormData): Promise<void> {
  "use server";
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session) redirect("/admin/login");

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

  const id = generateId();
  const slug = slugify(name);

  const { getDb } = await import("@/db/index");
  const { products } = await import("@/db/schema");

  const db = getDb();
  await db.insert(products).values({
    id,
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
  });

  redirect("/admin/products");
}

async function getCategories() {
  try {
    const { getDb } = await import("@/db/index");
    const { categories } = await import("@/db/schema");
    const { asc } = await import("drizzle-orm");

    const db = getDb();
    return await db.select().from(categories).orderBy(asc(categories.sortOrder));
  } catch {
    return null;
  }
}

export default async function NewProductPage() {
  const allCategories = await getCategories();

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-display text-3xl text-[#fff0c2]">Novo Produto</h1>
      <p className="mt-2 text-sm text-[#9e8b62]">
        Preencha os dados para adicionar um novo produto ao cardápio.
      </p>

      {!allCategories ? (
        <div className="mt-8 rounded-xl border border-[#e7a316]/20 bg-[#171009] p-8 text-center">
          <p className="text-sm text-[#cdb886]">
            Banco de dados não disponível. Configure o D1 para adicionar produtos.
          </p>
        </div>
      ) : (
        <form action={createProductAction} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
              Nome do produto *
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="ex: Heineken"
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
              className="w-full rounded-md border border-[#e7a316]/30 bg-[#090603] px-4 py-3 text-sm text-[#fff0c2] outline-none focus:border-[#ffbc24] focus:ring-1 focus:ring-[#ffbc24]/50"
            >
              <option value="">Selecione...</option>
              {allCategories.map((cat) => (
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
              placeholder="ex: 12.00"
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
              placeholder="Descrição opcional do produto"
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
              placeholder="ex: /images/cervejas/heineken.webp"
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
              placeholder="ex: Latão de Heineken"
              className="w-full rounded-md border border-[#e7a316]/30 bg-[#090603] px-4 py-3 text-sm text-[#fff0c2] outline-none focus:border-[#ffbc24] focus:ring-1 focus:ring-[#ffbc24]/50"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
              Image Fit
            </label>
            <select
              name="imageFit"
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
              defaultValue="50% 50%"
              placeholder="ex: 50% 50%"
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
              defaultChecked
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
              href="/admin/products"
              className="rounded-md border border-[#e7a316]/30 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#cdb886] transition hover:border-[#ffbc24]/70 hover:text-[#ffbc24]"
            >
              Cancelar
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
