"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  "use server";
  console.log("[ACTION] chamado");
}

export async function deleteCategoryAction(formData: FormData): Promise<void> {
  "use server";
  console.log("[ACTION] chamado");
}
