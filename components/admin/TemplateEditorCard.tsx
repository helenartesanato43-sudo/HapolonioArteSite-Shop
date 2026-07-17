"use client";

import { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { MessageTemplate } from "@/types";
import { updateTemplate, setActiveTemplate, deleteTemplate, type ActionState } from "@/lib/actions/templates";
import { renderMessageTemplate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const SAMPLE_VALUES = {
  itens: "1. Vaso de Cerâmica Rústico — Qtd: 1 — R$ 89,90\n2. Caneca Artesanal Terracota — Qtd: 2 — R$ 59,80",
  total: "R$ 149,70",
  loja: "Hapolonio Arte",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Salvando..." : "Salvar template"}
    </Button>
  );
}

export function TemplateEditorCard({ template }: { template: MessageTemplate }) {
  const action = updateTemplate.bind(null, template.id);
  const [state, formAction] = useActionState<ActionState | null, FormData>(action, null);
  const [content, setContent] = useState(template.content);

  return (
    <div
      className={`grid grid-cols-1 gap-5 rounded-xl border p-4 lg:grid-cols-2 ${
        template.is_active ? "border-clay bg-cream/30" : "border-clay/20 bg-white"
      }`}
    >
      <form action={formAction} className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <input
            name="name"
            defaultValue={template.name}
            required
            className="flex-1 rounded-lg border border-clay/30 px-3 py-1.5 text-sm font-medium text-navy focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
          />
          {template.is_active ? (
            <span className="whitespace-nowrap rounded-full bg-pix/10 px-3 py-1 text-xs font-medium text-pix">
              Em uso
            </span>
          ) : null}
        </div>

        <textarea
          name="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={7}
          required
          className="w-full rounded-lg border border-clay/30 px-3 py-2 font-mono text-xs leading-relaxed focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
        />

        {state?.error ? <p className="text-xs text-red-600">{state.error}</p> : null}

        <div className="flex flex-wrap items-center gap-3">
          <SubmitButton />

          {!template.is_active ? (
            <button
              type="button"
              onClick={() => setActiveTemplate(template.id)}
              className="text-xs font-medium text-clay hover:text-clay-dark"
            >
              Usar este template
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Remover o template "${template.name}"?`)) {
                deleteTemplate(template.id);
              }
            }}
            className="text-xs font-medium text-red-600 hover:text-red-700"
          >
            Remover
          </button>
        </div>
      </form>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
          Prévia com dados de exemplo
        </p>
        <div className="h-full rounded-xl bg-[#DCF8C6] p-4">
          <div className="whitespace-pre-wrap rounded-lg bg-white px-3 py-2 text-xs leading-relaxed text-navy shadow-sm">
            {renderMessageTemplate(content, SAMPLE_VALUES)}
          </div>
        </div>
      </div>
    </div>
  );
}
