import { CategoryForm } from "@/components/admin/CategoryForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { createCategory } from "@/lib/actions/categories";

export default function NewCategoryPage() {
  return (
    <div className="max-w-xl">
      <AdminPageHeader title="Nova categoria" />

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-card">
        <CategoryForm action={createCategory} />
      </div>
    </div>
  );
}
