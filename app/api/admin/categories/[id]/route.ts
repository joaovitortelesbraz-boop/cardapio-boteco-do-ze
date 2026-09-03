import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/src/shared/lib/admin-auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { name, shortDescription, sortOrder } = body;

  const db = getDb();

  const existing = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);

  if (existing.length === 0) {
    return NextResponse.json(
      { error: "Categoria não encontrada" },
      { status: 404 },
    );
  }

  await db
    .update(categories)
    .set({
      name: name ?? existing[0].name,
      shortDescription: shortDescription ?? existing[0].shortDescription,
      sortOrder: sortOrder ?? existing[0].sortOrder,
    })
    .where(eq(categories.id, id));

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
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);

  if (existing.length === 0) {
    return NextResponse.json(
      { error: "Categoria não encontrada" },
      { status: 404 },
    );
  }

  await db.delete(categories).where(eq(categories.id, id));

  return NextResponse.json({ success: true });
}
