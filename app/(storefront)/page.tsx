import { BannerCarousel } from "@/components/home/BannerCarousel";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { SectionTitle } from "@/components/home/SectionTitle";
import { ProductGrid } from "@/components/product/ProductGrid";
import { EmptyState } from "@/components/category/EmptyState";
import { getAllProducts } from "@/lib/data/products";
import { getCategories } from "@/lib/data/categories";
import { getSiteSettings } from "@/lib/data/settings";
import { getBanners } from "@/lib/data/banners";

export const revalidate = 30;

export default async function HomePage() {
  const [products, categories, settings, banners] = await Promise.all([
    getAllProducts(),
    getCategories(),
    getSiteSettings(),
    getBanners(),
  ]);

  const featuredProducts = products.slice(0, 8);

  const firstCategoryHref = categories[0]
    ? `/categoria/${categories[0].slug}`
    : "/";

  return (
    <main>
      <BannerCarousel banners={banners} intervalSeconds={settings.banner_interval_seconds} />

      <CategoryShowcase categories={categories} />

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <SectionTitle
          title="Peças Artesanais"
          href={firstCategoryHref}
          linkLabel="Ver todos"
        />
        {featuredProducts.length > 0 ? (
          <ProductGrid products={featuredProducts} />
        ) : (
          <EmptyState />
        )}
      </section>
    </main>
  );
}
