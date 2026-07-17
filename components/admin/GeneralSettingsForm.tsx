"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { SiteSettings } from "@/types";
import { updateGeneralSettings, type ActionState } from "@/lib/actions/settings";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Button } from "@/components/ui/button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Salvando..." : "Salvar informações"}
    </Button>
  );
}

export function GeneralSettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction] = useActionState<ActionState | null, FormData>(
    updateGeneralSettings,
    null
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <ImageUploader
          bucket="site"
          name="logo_url"
          label="Logo do site"
          defaultUrl={settings.logo_url}
          aspectClassName="aspect-video"
        />
        <ImageUploader
          bucket="site"
          name="favicon_url"
          label="Favicon (ícone da aba do navegador)"
          defaultUrl={settings.favicon_url}
          aspectClassName="aspect-square"
        />
      </div>

      <div>
        <label htmlFor="site_name" className="mb-1 block text-sm font-medium text-navy">
          Nome do site
        </label>
        <input
          id="site_name"
          name="site_name"
          required
          defaultValue={settings.site_name}
          className="w-full rounded-lg border border-clay/30 px-3 py-2 text-sm focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="whatsapp_contact_1" className="mb-1 block text-sm font-medium text-navy">
            WhatsApp de contato 1
          </label>
          <input
            id="whatsapp_contact_1"
            name="whatsapp_contact_1"
            defaultValue={settings.whatsapp_contact_1}
            placeholder="73998567329"
            className="w-full rounded-lg border border-clay/30 px-3 py-2 text-sm focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
          />
        </div>
        <div>
          <label htmlFor="whatsapp_contact_2" className="mb-1 block text-sm font-medium text-navy">
            WhatsApp de contato 2
          </label>
          <input
            id="whatsapp_contact_2"
            name="whatsapp_contact_2"
            defaultValue={settings.whatsapp_contact_2}
            placeholder="73999830011"
            className="w-full rounded-lg border border-clay/30 px-3 py-2 text-sm focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
          />
        </div>
      </div>

      <div>
        <label htmlFor="whatsapp_checkout" className="mb-1 block text-sm font-medium text-navy">
          WhatsApp de vendas (recebe os pedidos do carrinho)
        </label>
        <input
          id="whatsapp_checkout"
          name="whatsapp_checkout"
          required
          defaultValue={settings.whatsapp_checkout}
          placeholder="73999078408"
          className="w-full rounded-lg border border-clay/30 px-3 py-2 text-sm focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
        />
      </div>

      <div>
        <label htmlFor="instagram_url" className="mb-1 block text-sm font-medium text-navy">
          Link do Instagram
        </label>
        <input
          id="instagram_url"
          name="instagram_url"
          type="url"
          defaultValue={settings.instagram_url}
          className="w-full rounded-lg border border-clay/30 px-3 py-2 text-sm focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
        />
      </div>

      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state?.success ? (
        <p className="text-sm text-pix">Informações atualizadas com sucesso.</p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
