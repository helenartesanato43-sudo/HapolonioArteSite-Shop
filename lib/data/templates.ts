import { publicSupabase } from "@/lib/supabase/public";
import { MessageTemplate } from "@/types";

const FALLBACK_TEMPLATE = "Olá! Quero finalizar esta compra na {loja}:\n\n{itens}\n\nTotal: {total}";

export async function getActiveTemplate(): Promise<string> {
  const { data, error } = await publicSupabase
    .from("message_templates")
    .select("content")
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    return FALLBACK_TEMPLATE;
  }

  return data.content;
}

export async function getAllTemplates(): Promise<MessageTemplate[]> {
  const { data, error } = await publicSupabase
    .from("message_templates")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Erro ao buscar templates:", error.message);
    return [];
  }

  return data ?? [];
}
