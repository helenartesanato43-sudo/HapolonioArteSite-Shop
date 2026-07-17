"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { SiteSettings } from "@/types";
import { updateThemeSettings, type ActionState } from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? "Salvando..." : "Salvar todas as cores"}
    </Button>
  );
}

type FieldName =
  | "price_color"
  | "heading_color"
  | "accent_color"
  | "text_color"
  | "empty_state_bg_color";

const fields: { name: FieldName; label: string; hint: string }[] = [
  { name: "price_color", label: "Cor do preço Pix", hint: "Valor em destaque nos cards de produto e na página do produto" },
  { name: "heading_color", label: "Cor dos títulos", hint: "Nomes de produto, títulos de seção e categorias" },
  { name: "accent_color", label: "Cor principal", hint: "Fundo do cabeçalho e do rodapé do site" },
  { name: "text_color", label: "Cor do texto secundário", hint: "Preço riscado e textos auxiliares" },
  { name: "empty_state_bg_color", label: "Fundo do estado vazio", hint: "Caixa de 'nenhum produto encontrado'" },
];

function PreviewFor({ name, color }: { name: FieldName; color: string }) {
  if (name === "price_color") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-1">
        <span className="text-xs text-muted line-through">R$ 99,90</span>
        <span className="text-lg font-bold" style={{ color }}>
          R$ 79,90 <span className="text-xs font-medium opacity-80">no Pix</span>
        </span>
      </div>
    );
  }
  if (name === "heading_color") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
        <span className="text-base font-bold uppercase tracking-wide" style={{ color }}>
          Vaso de Cerâmica
        </span>
        <span className="text-xs text-muted">assim ficam os títulos</span>
      </div>
    );
  }
  if (name === "accent_color") {
    return (
      <div className="flex h-full w-full flex-col overflow-hidden rounded-lg">
        <div
          className="flex flex-1 items-center justify-center text-[10px] font-semibold uppercase tracking-widest text-white"
          style={{ backgroundColor: color }}
        >
          Header
        </div>
        <div className="flex flex-1 items-center justify-center bg-white text-[10px] text-muted">
          Conteúdo da página
        </div>
        <div
          className="flex flex-1 items-center justify-center text-[10px] font-semibold uppercase tracking-widest text-white"
          style={{ backgroundColor: color }}
        >
          Rodapé
        </div>
      </div>
    );
  }
  if (name === "text_color") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-1">
        <span className="text-sm line-through" style={{ color }}>
          R$ 99,90
        </span>
        <span className="text-xs" style={{ color }}>
          Preço riscado e textos auxiliares
        </span>
      </div>
    );
  }
  return (
    <div
      className="flex h-full w-full items-center justify-center rounded-lg border border-clay/20 text-xs font-medium text-navy"
      style={{ backgroundColor: color }}
    >
      Nenhum produto encontrado
    </div>
  );
}

export function ThemeSettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction] = useActionState<ActionState | null, FormData>(
    updateThemeSettings,
    null
  );

  const [values, setValues] = useState<Record<FieldName, string>>({
    price_color: settings.price_color,
    heading_color: settings.heading_color,
    accent_color: settings.accent_color,
    text_color: settings.text_color,
    empty_state_bg_color: settings.empty_state_bg_color,
  });

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.name}
            className="overflow-hidden rounded-2xl border border-clay/15 bg-white shadow-sm"
          >
            <div className="flex h-24 items-center justify-center bg-cream/40 px-4">
              <PreviewFor name={field.name} color={values[field.name]} />
            </div>

            <div className="space-y-3 border-t border-clay/10 p-4">
              <div>
                <label htmlFor={field.name} className="block text-sm font-semibold text-navy">
                  {field.label}
                </label>
                <p className="mt-0.5 text-xs text-muted">{field.hint}</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={values[field.name]}
                  aria-label={`Seletor de cor: ${field.label}`}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, [field.name]: event.target.value }))
                  }
                  className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border border-clay/30 bg-white p-1"
                />
                <input
                  id={field.name}
                  name={field.name}
                  value={values[field.name]}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, [field.name]: event.target.value }))
                  }
                  pattern="^#[0-9a-fA-F]{6}$"
                  className="w-full rounded-lg border border-clay/30 px-3 py-2 text-sm uppercase focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-start gap-3 rounded-2xl bg-cream/40 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {state?.error ? (
            <p className="text-sm text-red-600">{state.error}</p>
          ) : state?.success ? (
            <p className="text-sm text-pix">Cores atualizadas com sucesso.</p>
          ) : (
            <p className="text-sm text-muted">
              As prévias acima mostram exatamente onde cada cor aparece no site.
            </p>
          )}
        </div>
        <SubmitButton />
      </div>
    </form>
  );
}
