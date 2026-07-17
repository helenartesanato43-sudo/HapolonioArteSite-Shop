"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Category, Product } from "@/types";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Button } from "@/components/ui/button";

type ProductAction = (
  prevState: { error: string } | null,
  formData: FormData
) => Promise<{ error: string } | null>;

interface ProductFormProps {
  categories: Category[];
  action: ProductAction;
  product?: Product;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Salvando..." : label}
    </Button>
  );
}

export function ProductForm({ categories, action, product }: ProductFormProps) {
  const [state, formAction] = useActionState(action, null);
  const [isUnique, setIsUnique] = useState(product?.is_unique ?? false);

  return (
    <form action={formAction} className="space-y-6">
      <ImageUploader
        bucket="products"
        name="image_url"
        label="Foto do produto"
        defaultUrl={product?.image_url}
      />

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-navy">
          Nome do produto
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={product?.name}
          className="w-full rounded-lg border border-clay/30 px-3 py-2 text-sm focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
        />
      </div>

      <RichTextEditor
        name="description"
        label="Descrição"
        defaultValue={product?.description}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="mb-1 block text-sm font-medium text-navy">
            Preço Pix (R$)
          </label>
          <input
            id="price"
            name="price"
            required
            inputMode="decimal"
            placeholder="79,90"
            defaultValue={product?.price?.toFixed(2).replace(".", ",")}
            className="w-full rounded-lg border border-clay/30 px-3 py-2 text-sm focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
          />
        </div>
        <div>
          <label htmlFor="old_price" className="mb-1 block text-sm font-medium text-navy">
            Preço antigo (opcional)
          </label>
          <input
            id="old_price"
            name="old_price"
            inputMode="decimal"
            placeholder="99,90"
            defaultValue={product?.old_price?.toFixed(2).replace(".", ",") ?? ""}
            className="w-full rounded-lg border border-clay/30 px-3 py-2 text-sm focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
          />
        </div>
      </div>

      <div>
        <label htmlFor="category_id" className="mb-1 block text-sm font-medium text-navy">
          Categoria
        </label>
        <select
          id="category_id"
          name="category_id"
          required
          defaultValue={product?.category_id ?? ""}
          className="w-full rounded-lg border border-clay/30 bg-white px-3 py-2 text-sm focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
        >
          <option value="" disabled>
            Selecione uma categoria
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-clay/20 bg-cream/40 p-4">
        <label className="flex items-center gap-2 text-sm font-medium text-navy">
          <input
            type="checkbox"
            name="is_unique"
            defaultChecked={product?.is_unique}
            onChange={(event) => setIsUnique(event.target.checked)}
            className="h-4 w-4 rounded border-clay/40 text-clay focus:ring-clay"
          />
          Esta é uma peça única (apenas 1 unidade disponível)
        </label>

        {!isUnique ? (
          <div className="mt-4">
            <label htmlFor="stock_quantity" className="mb-1 block text-sm font-medium text-navy">
              Quantidade em estoque
            </label>
            <input
              id="stock_quantity"
              name="stock_quantity"
              type="number"
              min={0}
              defaultValue={product?.stock_quantity ?? 1}
              className="w-32 rounded-lg border border-clay/30 px-3 py-2 text-sm focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
            />
          </div>
        ) : (
          <p className="mt-2 text-xs text-muted">
            Como é peça única, o cliente só poderá comprar 1 unidade e o produto
            some da loja assim que for vendido.
          </p>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-navy">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={product?.is_active ?? true}
          className="h-4 w-4 rounded border-clay/40 text-clay focus:ring-clay"
        />
        Produto visível na loja
      </label>

      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <SubmitButton label={product ? "Salvar alterações" : "Cadastrar produto"} />
    </form>
  );
}
