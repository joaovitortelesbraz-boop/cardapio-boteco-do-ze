import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { categories, products } from "@/db/schema";
import { asc, eq, count } from "drizzle-orm";
import { requireAdmin } from "@/src/shared/lib/admin-auth";
import { normalizeIconKey } from "@/src/domain/menu/menu.types";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, name, shortDescription, iconKey, sortOrder } = body;

  if (!id || !name || !shortDescription) {
    return NextResponse.json(
      { error: "Campos obrigatórios: id, name, shortDescription" },
      { status: 400 },
    );
  }

  const db = getDb();

  try {
    await db.insert(categories).values({
      id,
      name,
      shortDescription,
      iconKey: normalizeIconKey(iconKey),
      sortOrder: sortOrder ?? 0,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("UNIQUE") || message.includes("unique")) {
      return NextResponse.json(
        { error: "Já existe uma categoria com este ID" },
        { status: 409 },
      );
    }
    throw error;
  }
}
