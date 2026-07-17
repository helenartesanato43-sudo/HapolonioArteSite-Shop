"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Banner } from "@/types";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Button } from "@/components/ui/button";

type BannerAction = (
  prevState: { error: string | null } | null,
  formData: FormData
) => Promise<{ error: string | null } | null>;

interface BannerFormProps {
  action: BannerAction;
  banner?: Banner;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Salvando..." : label}
    </Button>
  );
}

export function BannerForm({ action, banner }: BannerFormProps) {
  const [state, formAction] = useActionState(action, null);
  const [opacity, setOpacity] = useState(
    banner ? Math.round((banner.overlay_opacity ?? 0) * 100) : 40
  );

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-navy">
          Nome do banner
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="Ex.: Promoção de Natal"
          defaultValue={banner?.name}
          className="w-full rounded-lg border border-clay/30 px-3 py-2 text-sm focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
        />
        <p className="mt-1 text-xs text-muted">
          Usado só aqui no painel, para você identificar cada banner na lista.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <ImageUploader
            bucket="banners"
            name="desktop_image_url"
            label="Formato computador"
            defaultUrl={banner?.desktop_image_url}
            aspectClassName="aspect-video"
          />
          <p className="mt-2 text-xs text-muted">
            Proporção recomendada: <strong>21:8</strong> (ex.: 1600 × 600px)
          </p>
        </div>

        <div>
          <ImageUploader
            bucket="banners"
            name="mobile_image_url"
            label="Formato celular"
            defaultUrl={banner?.mobile_image_url}
            aspectClassName="aspect-[4/5]"
          />
          <p className="mt-2 text-xs text-muted">
            Proporção recomendada: <strong>4:5</strong> (ex.: 900 × 1125px)
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-clay/20 bg-cream/30 p-4">
        <RichTextEditor
          name="caption_html"
          label="Frase no banner (opcional)"
          defaultValue={banner?.caption_html ?? ""}
        />
        <p className="mt-2 text-xs text-muted">
          Aparece por cima da imagem, centralizada, na fonte Montserrat.
          Deixe em branco para não mostrar nenhuma frase.
        </p>

        <div className="mt-4">
          <label htmlFor="overlay_opacity" className="mb-1 block text-sm font-medium text-navy">
            Escurecer a imagem por trás do texto: {opacity}%
          </label>
          <input
            id="overlay_opacity"
            name="overlay_opacity"
            type="range"
            min={0}
            max={80}
            step={5}
            value={opacity}
            onChange={(event) => setOpacity(Number(event.target.value))}
            className="w-full accent-clay"
          />
          <p className="mt-1 text-xs text-muted">
            Só é usado se você escrever uma frase acima — ajuda a manter o
            texto legível sobre a foto.
          </p>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-navy">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={banner?.is_active ?? true}
          className="h-4 w-4 rounded border-clay/40 text-clay focus:ring-clay"
        />
        Banner ativo no carrossel da home
      </label>

      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <SubmitButton label={banner ? "Salvar alterações" : "Cadastrar banner"} />
    </form>
  );
}
