import { ProductForm } from "@/components/admin/ProductForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getCategories } from "@/lib/data/categories";
import { createProduct } from "@/lib/actions/products";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title="Novo produto"
        description="Preencha as informações abaixo para cadastrar uma nova peça."
      />

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-card">
        <ProductForm categories={categories} action={createProduct} />
      </div>
    </div>
  );
}
