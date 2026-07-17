"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ActionState = { error: string | null; success?: boolean };

function readBannerForm(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const desktopUrl = String(formData.get("desktop_image_url") || "").trim();
  const mobileUrl = String(formData.get("mobile_image_url") || "").trim();
  const isActive = formData.get("is_active") === "on";
  const captionRaw = String(formData.get("caption_html") || "").trim();
  const captionHtml = captionRaw.length > 0 ? captionRaw : null;
  const overlayOpacity = captionHtml
    ? Math.min(1, Math.max(0, Number(formData.get("overlay_opacity") || 0) / 100))
    : 0;

  return { name, desktopUrl, mobileUrl, isActive, captionHtml, overlayOpacity };
}

export async function createBanner(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const { name, desktopUrl, mobileUrl, isActive, captionHtml, overlayOpacity } = readBannerForm(formData);

  if (!name) {
    return { error: "Dê um nome para o banner." };
  }
  if (!desktopUrl) {
    return { error: "Envie a imagem no formato para computador." };
  }
  if (!mobileUrl) {
    return { error: "Envie a imagem no formato para celular." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("banners").insert({
    name,
    desktop_image_url: desktopUrl,
    mobile_image_url: mobileUrl,
    is_active: isActive,
    caption_html: captionHtml,
    overlay_opacity: overlayOpacity,
    sort_order: Date.now(),
  });

  if (error) {
    return { error: `Não foi possível salvar o banner: ${error.message}` };
  }

  revalidatePath("/");
  revalidatePath("/admin/banners");
  redirect("/admin/banners");
}

export async function updateBanner(
  id: string,
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const { name, desktopUrl, mobileUrl, isActive, captionHtml, overlayOpacity } = readBannerForm(formData);

  if (!name) {
    return { error: "Dê um nome para o banner." };
  }
  if (!desktopUrl) {
    return { error: "Envie a imagem no formato para computador." };
  }
  if (!mobileUrl) {
    return { error: "Envie a imagem no formato para celular." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("banners")
    .update({
      name,
      desktop_image_url: desktopUrl,
      mobile_image_url: mobileUrl,
      is_active: isActive,
      caption_html: captionHtml,
      overlay_opacity: overlayOpacity,
    })
    .eq("id", id);

  if (error) {
    return { error: `Não foi possível atualizar o banner: ${error.message}` };
  }

  revalidatePath("/");
  revalidatePath("/admin/banners");
  redirect("/admin/banners");
}

export async function deleteBanner(id: string) {
  const supabase = await createClient();
  await supabase.from("banners").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/banners");
}

export async function updateCarouselInterval(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const seconds = parseInt(String(formData.get("banner_interval_seconds") || "5"), 10);

  if (!Number.isFinite(seconds) || seconds < 2 || seconds > 30) {
    return { error: "Escolha um tempo entre 2 e 30 segundos." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({ banner_interval_seconds: seconds })
    .eq("id", 1);

  if (error) {
    return { error: `Não foi possível salvar: ${error.message}` };
  }

  revalidatePath("/", "layout");
  return { error: null, success: true };
}
