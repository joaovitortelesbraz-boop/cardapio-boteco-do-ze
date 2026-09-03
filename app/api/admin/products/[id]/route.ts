import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/src/shared/lib/admin-auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const db = getDb();

  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  if (result.length === 0) {
    return NextResponse.json(
      { error: "Produto não encontrado" },
      { status: 404 },
    );
  }

  return NextResponse.json(result[0]);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const db = getDb();

  const existing = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  if (existing.length === 0) {
    return NextResponse.json(
      { error: "Produto não encontrado" },
      { status: 404 },
    );
  }

  const current = existing[0];

  await db
    .update(products)
    .set({
      slug: body.slug ?? current.slug,
      categoryId: body.categoryId ?? current.categoryId,
      name: body.name ?? current.name,
      priceInCents: body.priceInCents ?? current.priceInCents,
      description: body.description !== undefined ? body.description : current.description,
      imageUrl: body.imageUrl !== undefined ? body.imageUrl : current.imageUrl,
      imageAlt: body.imageAlt !== undefined ? body.imageAlt : current.imageAlt,
      imageFit: body.imageFit ?? current.imageFit,
      imagePosition: body.imagePosition ?? current.imagePosition,
      imageScale: body.imageScale !== undefined ? body.imageScale : current.imageScale,
      available: body.available !== undefined ? (body.available ? 1 : 0) : current.available,
      sortOrder: body.sortOrder ?? current.sortOrder,
    })
    .where(eq(products.id, id));

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const db = getDb();

  const existing = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  if (existing.length === 0) {
    return NextResponse.json(
      { error: "Produto não encontrado" },
      { status: 404 },
    );
  }

  await db.delete(products).where(eq(products.id, id));

  return NextResponse.json({ success: true });
}
