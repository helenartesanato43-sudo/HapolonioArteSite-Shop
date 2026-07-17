import { notFound } from "next/navigation";
import Link from "next/link";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { getCategoryById } from "@/lib/data/categories";
import { getAllProductsForAdmin } from "@/lib/data/products";
import { updateCategory } from "@/lib/actions/categories";
import { formatCurrency } from "@/lib/utils";

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;
  const [category, allProducts] = await Promise.all([
    getCategoryById(id),
    getAllProductsForAdmin(),
  ]);

  if (!category) {
    notFound();
  }

  const products = allProducts.filter((p) => p.category_id === category.id);
  const action = updateCategory.bind(null, category.id);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold uppercase tracking-wide text-navy">
        Editar categoria
      </h1>
      <p className="mt-1 text-sm text-muted">{category.name}</p>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-card">
        <CategoryForm action={action} category={category} />
      </div>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-card">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-navy">
          Produtos nesta categoria ({products.length})
        </h2>

        {products.length === 0 ? (
          <p className="text-sm text-muted">Nenhum produto nesta categoria ainda.</p>
        ) : (
          <ul className="divide-y divide-clay/10">
            {products.map((product) => (
              <li key={product.id} className="flex items-center justify-between py-3">
                <span className="text-sm text-navy">{product.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-pix">
                    {formatCurrency(product.price)}
                  </span>
                  <Link
                    href={`/admin/produtos/${product.id}`}
                    className="text-xs font-medium text-clay hover:text-clay-dark"
                  >
                    Editar
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
