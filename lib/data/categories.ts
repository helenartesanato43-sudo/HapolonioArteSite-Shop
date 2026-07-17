import { publicSupabase } from "@/lib/supabase/public";
import { Category } from "@/types";

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await publicSupabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Erro ao buscar categorias:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const { data, error } = await publicSupabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar categoria:", error.message);
    return null;
  }

  return data;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const { data, error } = await publicSupabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar categoria:", error.message);
    return null;
  }

  return data;
}
