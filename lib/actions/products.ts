"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export type ActionState = { error: string } | null;

function parseNumber(value: FormDataEntryValue | null): number {
  if (!value) return 0;
  const normalized = String(value).replace(/\./g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function readProductForm(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const price = parseNumber(formData.get("price"));
  const oldPriceRaw = formData.get("old_price");
  const oldPrice = oldPriceRaw && String(oldPriceRaw).trim() !== ""
    ? parseNumber(oldPriceRaw)
    : null;
  const categoryId = String(formData.get("category_id") || "") || null;
  const imageUrl = String(formData.get("image_url") || "").trim() || null;
  const isUnique = formData.get("is_unique") === "on";
  const stockQuantity = isUnique ? 1 : Math.max(0, parseInt(String(formData.get("stock_quantity") || "0"), 10) || 0);
  const isActive = formData.get("is_active") === "on";

  return {
    name,
    description,
    price,
    oldPrice,
    categoryId,
    imageUrl,
    isUnique,
    stockQuantity,
    isActive,
  };
}

export async function createProduct(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const data = readProductForm(formData);

  if (!data.name) {
    return { error: "O nome do produto é obrigatório." };
  }
  if (!data.categoryId) {
    return { error: "Selecione uma categoria." };
  }
  if (data.price <= 0) {
    return { error: "Informe um valor válido para o produto." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("products").insert({
    name: data.name,
    slug: `${slugify(data.name)}-${Date.now().toString(36)}`,
    description: data.description,
    price: data.price,
    old_price: data.oldPrice,
    category_id: data.categoryId,
    image_url: data.imageUrl,
    is_unique: data.isUnique,
    stock_quantity: data.stockQuantity,
    is_active: data.isActive,
  });

  if (error) {
    return { error: `Não foi possível salvar o produto: ${error.message}` };
  }

  revalidatePath("/");
  revalidatePath("/admin/produtos");
  redirect("/admin/produtos");
}

export async function updateProduct(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const data = readProductForm(formData);

  if (!data.name) {
    return { error: "O nome do produto é obrigatório." };
  }
  if (!data.categoryId) {
    return { error: "Selecione uma categoria." };
  }
  if (data.price <= 0) {
    return { error: "Informe um valor válido para o produto." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({
      name: data.name,
      description: data.description,
      price: data.price,
      old_price: data.oldPrice,
      category_id: data.categoryId,
      image_url: data.imageUrl,
      is_unique: data.isUnique,
      stock_quantity: data.stockQuantity,
      is_active: data.isActive,
    })
    .eq("id", id);

  if (error) {
    return { error: `Não foi possível atualizar o produto: ${error.message}` };
  }

  revalidatePath("/");
  revalidatePath("/admin/produtos");
  redirect("/admin/produtos");
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/produtos");
}
