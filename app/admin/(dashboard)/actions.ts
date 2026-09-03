"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { requireAdmin } from "@/src/shared/lib/admin-auth";

// redirect() sinaliza o desvio lançando NEXT_REDIRECT. Nenhuma chamada abaixo
// pode ficar dentro de try/catch: um catch genérico engole esse sinal e vira
// 500 — foi o que aconteceu no loginAction.

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  // O middleware não cobre server actions, então a sessão é validada aqui.
  if (!(await requireAdmin())) {
    redirect("/admin/login");
  }

  const id = (formData.get("id") as string | null)?.trim();

  if (!id) {
    redirect("/admin/products");
  }

  const { getDb } = await import("@/db/index");
  const { products } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");

  const db = getDb();
  await db.delete(products).where(eq(products.id, id));

  redirect("/admin/products");
}

export async function deleteCategoryAction(formData: FormData): Promise<void> {
  if (!(await requireAdmin())) {
    redirect("/admin/login");
  }

  const id = (formData.get("id") as string | null)?.trim();

  if (!id) {
    redirect("/admin/categories");
  }

  const { getDb } = await import("@/db/index");
  const { categories, products } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");

  const db = getDb();

  // products.categoryId referencia categories.id sem ON DELETE CASCADE, então
  // os produtos saem primeiro — é o que o confirm da tela promete ao usuário.
  await db.delete(products).where(eq(products.categoryId, id));
  await db.delete(categories).where(eq(categories.id, id));

  redirect("/admin/categories");
}
