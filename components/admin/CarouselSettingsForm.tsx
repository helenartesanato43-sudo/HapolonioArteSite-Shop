"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Smartphone, Monitor, Timer } from "lucide-react";
import { updateCarouselSettings, type ActionState } from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";
import { SiteSettings } from "@/types";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Salvando..." : "Salvar carrosséis"}
    </Button>
  );
}

function NumberField({
  name,
  label,
  icon: Icon,
  defaultValue,
}: {
  name: string;
  label: string;
  icon: typeof Smartphone;
  defaultValue: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 flex items-center gap-1.5 text-xs font-medium text-navy">
        <Icon className="h-3.5 w-3.5 text-clay" aria-hidden="true" />
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="number"
        min={1}
        max={20}
        required
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-clay/30 px-3 py-2 text-sm focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
      />
    </div>
  );
}

export function CarouselSettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction] = useActionState<ActionState | null, FormData>(
    updateCarouselSettings,
    null
  );

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-navy">
          Carrossel de categorias
        </h3>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <NumberField
            name="category_carousel_mobile_count"
            label="Ícones no celular"
            icon={Smartphone}
            defaultValue={settings.category_carousel_mobile_count}
          />
          <NumberField
            name="category_carousel_desktop_count"
            label="Ícones no computador"
            icon={Monitor}
            defaultValue={settings.category_carousel_desktop_count}
          />
          <NumberField
            name="category_carousel_interval_seconds"
            label="Troca automática (segundos)"
            icon={Timer}
            defaultValue={settings.category_carousel_interval_seconds}
          />
        </div>
      </div>

      <div className="border-t border-clay/10 pt-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-navy">
          Carrossel de produtos (Peças Artesanais)
        </h3>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <NumberField
            name="product_carousel_mobile_count"
            label="Produtos no celular"
            icon={Smartphone}
            defaultValue={settings.product_carousel_mobile_count}
          />
          <NumberField
            name="product_carousel_desktop_count"
            label="Produtos no computador"
            icon={Monitor}
            defaultValue={settings.product_carousel_desktop_count}
          />
          <NumberField
            name="product_carousel_interval_seconds"
            label="Troca automática (segundos)"
            icon={Timer}
            defaultValue={settings.product_carousel_interval_seconds}
          />
        </div>
      </div>

      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-pix">Configurações salvas!</p> : null}

      <SubmitButton />
    </form>
  );
}
