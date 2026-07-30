"use client";

import { useRef, useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Plus } from "lucide-react";
import { createTemplate, type ActionState } from "@/lib/actions/templates";
import { Button } from "@/components/ui/button";
import { InsertChips } from "@/components/admin/InsertChips";

const PLACEHOLDER_CONTENT =
  "Olá! Quero finalizar esta compra na {loja}:\n\n{itens}\n\nTotal: {total}";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Criando..." : "Criar template"}
    </Button>
  );
}

export function NewTemplateForm() {
  const [state, formAction] = useActionState<ActionState | null, FormData>(
    createTemplate,
    null
  );
  const [content, setContent] = useState("");
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
    <form
      action={formAction}
      key={state?.success ? Math.random() : "new-template"}
      className="rounded-2xl border border-dashed border-clay/30 bg-cream/20 p-5"
    >
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy">
        <Plus className="h-4 w-4 text-clay" aria-hidden="true" />
        Criar novo template
      </p>
      <div className="space-y-3">
        <input
          name="name"
          placeholder="Nome do template (ex.: Promoção)"
          required
          className="w-full rounded-lg border border-clay/30 px-3 py-1.5 text-sm focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
        />

        <InsertChips onInsert={insertAtCursor} />

        <textarea
          ref={textareaRef}
          name="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={4}
          required
          placeholder={PLACEHOLDER_CONTENT}
          className="w-full rounded-lg border border-clay/30 px-3 py-2 font-mono text-xs leading-relaxed focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
        />
      </div>

      {state?.error ? <p className="mt-2 text-xs text-red-600">{state.error}</p> : null}

      <div className="mt-3">
        <SubmitButton />
      </div>
    </form>
  );
}
