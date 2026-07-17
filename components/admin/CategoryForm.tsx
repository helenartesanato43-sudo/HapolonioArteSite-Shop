"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Category } from "@/types";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Button } from "@/components/ui/button";

type CategoryAction = (
  prevState: { error: string } | null,
  formData: FormData
) => Promise<{ error: string } | null>;

interface CategoryFormProps {
  action: CategoryAction;
  category?: Category;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Salvando..." : label}
    </Button>
  );
}

export function CategoryForm({ action, category }: CategoryFormProps) {
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-6">
      <ImageUploader
        bucket="categories"
        name="image_url"
        label="Imagem da categoria"
        defaultUrl={category?.image_url}
      />

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-navy">
          Nome da categoria
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={category?.name}
          className="w-full rounded-lg border border-clay/30 px-3 py-2 text-sm focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-navy">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={category?.description}
          className="w-full rounded-lg border border-clay/30 px-3 py-2 text-sm focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
        />
      </div>

      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <SubmitButton label={category ? "Salvar alterações" : "Cadastrar categoria"} />
    </form>
  );
}
