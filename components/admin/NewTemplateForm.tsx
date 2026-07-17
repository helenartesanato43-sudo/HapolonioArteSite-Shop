"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createTemplate, type ActionState } from "@/lib/actions/templates";
import { Button } from "@/components/ui/button";

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

  return (
    <form
      action={formAction}
      key={state?.success ? Math.random() : "new-template"}
      className="rounded-xl border border-dashed border-clay/30 p-4"
    >
      <p className="mb-3 text-sm font-medium text-navy">Criar novo template</p>
      <div className="space-y-3">
        <input
          name="name"
          placeholder="Nome do template (ex.: Promoção)"
          required
          className="w-full rounded-lg border border-clay/30 px-3 py-1.5 text-sm focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
        />
        <textarea
          name="content"
          rows={4}
          required
          placeholder={"Olá! Quero finalizar esta compra na {loja}:\n\n{itens}\n\nTotal: {total}"}
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
