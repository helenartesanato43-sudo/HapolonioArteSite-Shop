import { publicSupabase } from "@/lib/supabase/public";
import { Banner } from "@/types";

export async function getBanners(): Promise<Banner[]> {
  const { data, error } = await publicSupabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Erro ao buscar banners:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getAllBannersForAdmin(): Promise<Banner[]> {
  const { data, error } = await publicSupabase
    .from("banners")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Erro ao buscar banners:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getBannerById(id: string): Promise<Banner | null> {
  const { data, error } = await publicSupabase
    .from("banners")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar banner:", error.message);
    return null;
  }

  return data;
}
