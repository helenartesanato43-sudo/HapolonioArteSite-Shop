"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateCarouselInterval, type ActionState } from "@/lib/actions/banners";
import { Button } from "@/components/ui/button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="sm">
      {pending ? "Salvando..." : "Salvar"}
    </Button>
  );
}

export function CarouselIntervalForm({ defaultSeconds }: { defaultSeconds: number }) {
  const [state, formAction] = useActionState<ActionState | null, FormData>(
    updateCarouselInterval,
    null
  );

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <div>
        <label
          htmlFor="banner_interval_seconds"
          className="mb-1 block text-sm font-medium text-navy"
        >
          Tempo entre banners (segundos)
        </label>
        <input
          id="banner_interval_seconds"
          name="banner_interval_seconds"
          type="number"
          min={2}
          max={30}
          defaultValue={defaultSeconds}
          className="w-28 rounded-lg border border-clay/30 px-3 py-2 text-sm focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
        />
      </div>
      <SubmitButton />
      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-pix">Salvo!</p> : null}
    </form>
  );
}
