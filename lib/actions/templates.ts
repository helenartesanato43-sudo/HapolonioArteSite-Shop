"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionState = { error: string | null; success?: boolean };

export async function createTemplate(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const name = String(formData.get("name") || "").trim();
  const content = String(formData.get("content") || "").trim();

  if (!name || !content) {
    return { error: "Preencha o nome e o conteúdo do template." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("message_templates").insert({ name, content });

  if (error) {
    return { error: `Não foi possível salvar: ${error.message}` };
  }

  revalidatePath("/admin/configuracoes");
  return { error: null, success: true };
}

export async function updateTemplate(
  id: string,
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const name = String(formData.get("name") || "").trim();
  const content = String(formData.get("content") || "").trim();

  if (!name || !content) {
    return { error: "Preencha o nome e o conteúdo do template." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("message_templates")
    .update({ name, content })
    .eq("id", id);

  if (error) {
    return { error: `Não foi possível salvar: ${error.message}` };
  }

  revalidatePath("/admin/configuracoes");
  revalidatePath("/carrinho");
  return { error: null, success: true };
}

export async function setActiveTemplate(id: string) {
  const supabase = await createClient();
  await supabase.from("message_templates").update({ is_active: true }).eq("id", id);
  revalidatePath("/admin/configuracoes");
  revalidatePath("/carrinho");
}

export async function deleteTemplate(id: string) {
  const supabase = await createClient();
  await supabase.from("message_templates").delete().eq("id", id);
  revalidatePath("/admin/configuracoes");
}
