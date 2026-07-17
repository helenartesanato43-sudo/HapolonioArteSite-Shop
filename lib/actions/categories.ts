"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export type ActionState = { error: string } | null;

function readCategoryForm(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const imageUrl = String(formData.get("image_url") || "").trim() || null;

  return { name, description, imageUrl };
}

export async function createCategory(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { name, description, imageUrl } = readCategoryForm(formData);

  if (!name) {
    return { error: "O nome da categoria é obrigatório." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert({
    name,
    slug: slugify(name),
    description,
    image_url: imageUrl,
  });

  if (error) {
    return { error: `Não foi possível salvar a categoria: ${error.message}` };
  }

  revalidatePath("/");
  revalidatePath("/admin/categorias");
  redirect("/admin/categorias");
}

export async function updateCategory(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { name, description, imageUrl } = readCategoryForm(formData);

  if (!name) {
    return { error: "O nome da categoria é obrigatório." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({
      name,
      slug: slugify(name),
      description,
      image_url: imageUrl,
    })
    .eq("id", id);

  if (error) {
    return { error: `Não foi possível atualizar a categoria: ${error.message}` };
  }

  revalidatePath("/");
  revalidatePath("/admin/categorias");
  redirect("/admin/categorias");
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/categorias");
}
