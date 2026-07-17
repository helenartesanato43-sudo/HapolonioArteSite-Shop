"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionState = { error: string | null; success?: boolean };

export async function updateGeneralSettings(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const site_name = String(formData.get("site_name") || "").trim();
  const whatsapp_contact_1 = String(formData.get("whatsapp_contact_1") || "").trim();
  const whatsapp_contact_2 = String(formData.get("whatsapp_contact_2") || "").trim();
  const whatsapp_checkout = String(formData.get("whatsapp_checkout") || "").trim();
  const instagram_url = String(formData.get("instagram_url") || "").trim();
  const logo_url = String(formData.get("logo_url") || "").trim() || null;
  const favicon_url = String(formData.get("favicon_url") || "").trim() || null;

  if (!site_name || !whatsapp_checkout) {
    return { error: "Nome do site e WhatsApp de vendas são obrigatórios." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      site_name,
      whatsapp_contact_1,
      whatsapp_contact_2,
      whatsapp_checkout,
      instagram_url,
      logo_url,
      favicon_url,
    })
    .eq("id", 1);

  if (error) {
    return { error: `Não foi possível salvar: ${error.message}` };
  }

  revalidatePath("/", "layout");
  return { error: null, success: true };
}

export async function updateThemeSettings(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const price_color = String(formData.get("price_color") || "").trim();
  const heading_color = String(formData.get("heading_color") || "").trim();
  const accent_color = String(formData.get("accent_color") || "").trim();
  const text_color = String(formData.get("text_color") || "").trim();
  const empty_state_bg_color = String(formData.get("empty_state_bg_color") || "").trim();

  const hexPattern = /^#[0-9a-fA-F]{6}$/;
  const values = { price_color, heading_color, accent_color, text_color, empty_state_bg_color };
  for (const [key, value] of Object.entries(values)) {
    if (!hexPattern.test(value)) {
      return { error: `Cor inválida em "${key}". Use o formato #RRGGBB.` };
    }
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update(values)
    .eq("id", 1);

  if (error) {
    return { error: `Não foi possível salvar as cores: ${error.message}` };
  }

  revalidatePath("/", "layout");
  return { error: null, success: true };
}

