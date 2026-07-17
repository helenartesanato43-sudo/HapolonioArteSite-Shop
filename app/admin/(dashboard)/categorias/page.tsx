import Link from "next/link";
import Image from "next/image";
import { Plus as PlusIcon } from "lucide-react";
import { getCategories } from "@/lib/data/categories";
import { getAllProductsForAdmin } from "@/lib/data/products";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteCategory } from "@/lib/actions/categories";

export default async function AdminCategoriesPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getAllProductsForAdmin(),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wide text-navy">
            Categorias
          </h1>
          <p className="mt-1 text-sm text-muted">
            {categories.length} categoria(s) cadastrada(s).
          </p>
        </div>
        <Link
          href="/admin/categorias/novo"
          className="inline-flex items-center gap-2 rounded-full bg-clay px-5 py-2.5 text-sm font-medium text-white hover:bg-clay-dark"
        >
          <PlusIcon className="h-4 w-4" aria-hidden="true" />
          Nova categoria
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {categories.map((category) => {
          const count = products.filter((p) => p.category_id === category.id).length;

          return (
            <div key={category.id} className="rounded-2xl bg-white p-5 shadow-card">
              <div className="flex gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream">
                  {category.image_url ? (
                    <Image
                      src={category.image_url}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-navy">{category.name}</h2>
                  <p className="mt-1 line-clamp-2 text-xs text-muted">
                    {category.description || "Sem descrição."}
                  </p>
                  <p className="mt-2 text-xs font-medium text-clay">
                    {count} produto(s)
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-4 border-t border-clay/10 pt-3">
                <Link
                  href={`/admin/categorias/${category.id}`}
                  className="text-xs font-medium text-clay hover:text-clay-dark"
                >
                  Editar
                </Link>
                <DeleteButton
                  action={deleteCategory.bind(null, category.id)}
                  confirmMessage={`Remover a categoria "${category.name}"? Os produtos vinculados ficarão sem categoria.`}
                />
              </div>
            </div>
          );
        })}

        {categories.length === 0 ? (
          <p className="text-sm text-muted">Nenhuma categoria cadastrada ainda.</p>
        ) : null}
      </div>
    </div>
  );
}
