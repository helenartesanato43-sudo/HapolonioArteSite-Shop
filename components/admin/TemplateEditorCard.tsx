"use client";

import { useRef, useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { MessageCircle, Copy } from "lucide-react";
import { MessageTemplate } from "@/types";
import {
  updateTemplate,
  setActiveTemplate,
  deleteTemplate,
  duplicateTemplate,
  type ActionState,
} from "@/lib/actions/templates";
import { renderMessageTemplate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { InsertChips } from "@/components/admin/InsertChips";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function insertAtCursor(snippet: string) {
    const el = textareaRef.current;
    if (!el) {
      setContent((current) => current + snippet);
      return;
    }
    const start = el.selectionStart ?? content.length;
    const end = el.selectionEnd ?? content.length;
    const next = content.slice(0, start) + snippet + content.slice(end);
    setContent(next);
    requestAnimationFrame(() => {
      el.focus();
      const cursor = start + snippet.length;
      el.setSelectionRange(cursor, cursor);
    });
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white shadow-card transition-colors ${
        template.is_active ? "border-clay" : "border-clay/15"
      }`}
    >
      <div
        className={`flex items-center justify-between gap-3 border-b px-5 py-3 ${
          template.is_active ? "border-clay/20 bg-clay/5" : "border-clay/10 bg-cream/40"
        }`}
      >
        <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted">
          <MessageCircle className="h-3.5 w-3.5 text-clay" aria-hidden="true" />
          Template
        </span>
        {template.is_active ? (
          <span className="whitespace-nowrap rounded-full bg-pix/10 px-3 py-1 text-xs font-medium text-pix">
            Em uso no carrinho
          </span>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-2">
        <form action={formAction} className="space-y-3">
          <input
            name="name"
            defaultValue={template.name}
            required
            className="w-full rounded-lg border border-clay/30 px-3 py-1.5 text-sm font-medium text-navy focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
          />

          <InsertChips onInsert={insertAtCursor} />

          <textarea
            ref={textareaRef}
            name="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={7}
            required
            className="w-full rounded-lg border border-clay/30 px-3 py-2 font-mono text-xs leading-relaxed focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
          />
          <p className="text-right text-[11px] text-muted">{content.length} caracteres</p>

          {state?.error ? <p className="text-xs text-red-600">{state.error}</p> : null}

          <div className="flex flex-wrap items-center gap-4">
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
              onClick={() => duplicateTemplate(template.id)}
              className="inline-flex items-center gap-1 text-xs font-medium text-navy/70 hover:text-navy"
            >
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              Duplicar
            </button>

            <button
              type="button"
              onClick={() => {
                const message = template.is_active
                  ? `"${template.name}" está em uso no carrinho agora. Remover mesmo assim?`
                  : `Remover o template "${template.name}"?`;
                if (window.confirm(message)) {
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
    </div>
  );
}
