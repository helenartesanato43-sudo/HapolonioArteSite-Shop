import { AdminOverview } from "@/components/admin/AdminOverview";
import { getAllProductsForAdmin } from "@/lib/data/products";
import { getCategories } from "@/lib/data/categories";

export default async function AdminDashboardPage() {
  const [products, categories] = await Promise.all([
    getAllProductsForAdmin(),
    getCategories(),
  ]);

  return <AdminOverview initialProducts={products} initialCategories={categories} />;
}
