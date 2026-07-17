import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CategoryLayout } from "@/components/layout/CategoryLayout";
import { ProductGrid } from "@/components/product/ProductGrid";
import { EmptyState } from "@/components/category/EmptyState";
import { getCategoryBySlug } from "@/lib/data/categories";
import { getProductsByCategorySlug } from "@/lib/data/products";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 30;

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Categoria não encontrada" };
  }

  return {
    title: category.name,
    description:
      category.description ||
      `Confira as peças artesanais de ${category.name} da Hapolonio Arte.`,
    openGraph: {
      title: category.name,
      description:
        category.description ||
        `Confira as peças artesanais de ${category.name} da Hapolonio Arte.`,
      type: "website",
      locale: "pt_BR",
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategorySlug(category.slug);

  return (
    <CategoryLayout title={category.name}>
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <EmptyState />
      )}
    </CategoryLayout>
  );
}
