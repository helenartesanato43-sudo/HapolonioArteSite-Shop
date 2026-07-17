import { publicSupabase } from "@/lib/supabase/public";
import { SiteSettings } from "@/types";

export const defaultSiteSettings: SiteSettings = {
  id: 1,
  site_name: "Hapolonio Arte",
  logo_url: "/logo.png",
  favicon_url: null,
  whatsapp_contact_1: "73998567329",
  whatsapp_contact_2: "73999830011",
  whatsapp_checkout: "73999078408",
  instagram_url: "https://www.instagram.com/hapolonio.arte/",
  banner_interval_seconds: 5,
  price_color: "#10C44C",
  heading_color: "#3F4B63",
  accent_color: "#B88556",
  text_color: "#7C7C7C",
  empty_state_bg_color: "#FFF6DD",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await publicSupabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("Erro ao buscar configurações:", error.message);
    return defaultSiteSettings;
  }

  return {
    ...defaultSiteSettings,
    ...data,
    logo_url: data.logo_url ?? defaultSiteSettings.logo_url,
  };
}
