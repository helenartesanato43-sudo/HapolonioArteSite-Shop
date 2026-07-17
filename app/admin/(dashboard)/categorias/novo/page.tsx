import { CategoryForm } from "@/components/admin/CategoryForm";
import { createCategory } from "@/lib/actions/categories";

export default function NewCategoryPage() {
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold uppercase tracking-wide text-navy">
        Nova categoria
      </h1>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-card">
        <CategoryForm action={createCategory} />
      </div>
    </div>
  );
}
