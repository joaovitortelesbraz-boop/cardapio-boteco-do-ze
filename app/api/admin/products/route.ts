import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { products, categories } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { requireAdmin } from "@/src/shared/lib/admin-auth";

export async function GET(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");

  const baseQuery = {
    id: products.id,
    slug: products.slug,
    categoryId: products.categoryId,
    categoryName: categories.name,
    name: products.name,
    priceInCents: products.priceInCents,
    description: products.description,
    imageUrl: products.imageUrl,
    imageAlt: products.imageAlt,
    imageFit: products.imageFit,
    imagePosition: products.imagePosition,
    imageScale: products.imageScale,
    available: products.available,
    sortOrder: products.sortOrder,
  };

  const rows = categoryId
    ? await db
        .select(baseQuery)
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(eq(products.categoryId, categoryId))
        .orderBy(asc(products.sortOrder))
    : await db
        .select(baseQuery)
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .orderBy(asc(products.sortOrder));

  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
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
  } = body;

  if (!id || !slug || !categoryId || !name || priceInCents === undefined) {
    return NextResponse.json(
      {
        error:
          "Campos obrigatórios: id, slug, categoryId, name, priceInCents",
      },
      { status: 400 },
    );
  }

  const db = getDb();

  try {
    await db.insert(products).values({
      id,
      slug,
      categoryId,
      name,
      priceInCents,
      description: description ?? null,
      imageUrl: imageUrl ?? null,
      imageAlt: imageAlt ?? null,
      imageFit: imageFit ?? "cover",
      imagePosition: imagePosition ?? "50% 50%",
      imageScale: imageScale ?? null,
      available: available !== false ? 1 : 0,
      sortOrder: sortOrder ?? 0,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("UNIQUE") || message.includes("unique")) {
      return NextResponse.json(
        { error: "Já existe um produto com este ID ou slug" },
        { status: 409 },
      );
    }
    if (message.includes("FOREIGN") || message.includes("foreign")) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 400 },
      );
    }
    throw error;
  }
}
