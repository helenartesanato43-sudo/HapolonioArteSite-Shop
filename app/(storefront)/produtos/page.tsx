import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ProductGrid } from "@/components/product/ProductGrid";
import { EmptyState } from "@/components/category/EmptyState";
import { SortDropdown, type SortValue } from "@/components/product/SortDropdown";
import { getAllProducts } from "@/lib/data/products";
import { Product } from "@/types";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Todos os produtos",
  description: "Confira todas as peças artesanais disponíveis na Hapolonio Arte.",
};

interface ProdutosPageProps {
  searchParams: Promise<{ sort?: string }>;
}

function sortProducts(products: Product[], sort: SortValue): Product[] {
  const sorted = [...products];

  switch (sort) {
    case "oldest":
      return sorted.sort(
        (a, b) => new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime()
      );
    case "price_asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price_desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "name_asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    case "category_asc":
      return sorted.sort((a, b) =>
        (a.category?.name ?? "").localeCompare(b.category?.name ?? "", "pt-BR")
      );
    case "newest":
    default:
      return sorted.sort(
        (a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
      );
  }
}

export default async function ProdutosPage({ searchParams }: ProdutosPageProps) {
  const { sort } = await searchParams;
  const sortValue: SortValue = (sort as SortValue) || "newest";

  const products = await getAllProducts();
  const sortedProducts = sortProducts(products, sortValue);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <Breadcrumb currentLabel="Todos os produtos" />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <h1
          className="text-2xl font-bold uppercase tracking-wide md:text-3xl"
          style={{ color: "var(--color-heading)" }}
        >
          Todos os produtos
        </h1>

        <SortDropdown current={sortValue} />
      </div>

      <div className="mt-10">
        {sortedProducts.length > 0 ? (
          <ProductGrid products={sortedProducts} />
        ) : (
          <EmptyState />
        )}
      </div>
    </main>
  );
}
