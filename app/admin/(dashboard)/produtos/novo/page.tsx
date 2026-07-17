import { ProductForm } from "@/components/admin/ProductForm";
import { getCategories } from "@/lib/data/categories";
import { createProduct } from "@/lib/actions/products";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold uppercase tracking-wide text-navy">
        Novo produto
      </h1>
      <p className="mt-1 text-sm text-muted">
        Preencha as informações abaixo para cadastrar uma nova peça.
      </p>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-card">
        <ProductForm categories={categories} action={createProduct} />
      </div>
    </div>
  );
}
