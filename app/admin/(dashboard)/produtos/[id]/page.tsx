import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getCategories } from "@/lib/data/categories";
import { getProductById } from "@/lib/data/products";
import { updateProduct } from "@/lib/actions/products";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  const action = updateProduct.bind(null, product.id);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold uppercase tracking-wide text-navy">
        Editar produto
      </h1>
      <p className="mt-1 text-sm text-muted">{product.name}</p>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-card">
        <ProductForm categories={categories} action={action} product={product} />
      </div>
    </div>
  );
}
