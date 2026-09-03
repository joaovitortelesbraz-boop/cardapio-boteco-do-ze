"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getDb } from "@/db/index";
import { products, categories } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  const session = (await cookies()).get("admin_session");
  if (!session) redirect("/admin/login");

  const id = formData.get("id") as string;
  const db = getDb();
  await db.delete(products).where(eq(products.id, id));
  redirect("/admin/products");
}

export async function deleteCategoryAction(formData: FormData): Promise<void> {
  const session = (await cookies()).get("admin_session");
  if (!session) redirect("/admin/login");

  const id = formData.get("id") as string;
  const db = getDb();
  await db.delete(categories).where(eq(categories.id, id));
  redirect("/admin/categories");
}
