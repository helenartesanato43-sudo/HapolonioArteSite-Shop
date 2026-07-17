import { publicSupabase } from "@/lib/supabase/public";
import { Product } from "@/types";

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await publicSupabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar produtos:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const products = await getAllProducts();
  return products.slice(0, limit);
}

export async function getProductsByCategorySlug(
  categorySlug: string
): Promise<Product[]> {
  const { data: category } = await publicSupabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .maybeSingle();

  if (!category) return [];

  const { data, error } = await publicSupabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_active", true)
    .eq("category_id", category.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar produtos da categoria:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getSimilarProducts(
  categoryId: string | null,
  excludeProductId: string,
  limit = 4
): Promise<Product[]> {
  if (!categoryId) return [];

  const { data, error } = await publicSupabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_active", true)
    .eq("category_id", categoryId)
    .neq("id", excludeProductId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Erro ao buscar produtos similares:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await publicSupabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar produto:", error.message);
    return null;
  }

  return data;
}

export async function getAllProductsForAdmin(): Promise<Product[]> {
  const { data, error } = await publicSupabase
    .from("products")
    .select("*, category:categories(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar produtos:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await publicSupabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar produto:", error.message);
    return null;
  }

  return data;
}
