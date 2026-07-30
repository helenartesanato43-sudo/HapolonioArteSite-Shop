import { BannerCarousel } from "@/components/home/BannerCarousel";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { SectionTitle } from "@/components/home/SectionTitle";
import { ProductCarousel } from "@/components/product/ProductCarousel";
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

  const featuredProducts = products.slice(0, 12);

  return (
    <main>
      <BannerCarousel banners={banners} intervalSeconds={settings.banner_interval_seconds} />

      <CategoryShowcase
        categories={categories}
        mobileCount={settings.category_carousel_mobile_count}
        desktopCount={settings.category_carousel_desktop_count}
        intervalSeconds={settings.category_carousel_interval_seconds}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <SectionTitle
          title="Peças Artesanais"
          href="/produtos"
          linkLabel="Ver todos"
        />
        {featuredProducts.length > 0 ? (
          <ProductCarousel
            products={featuredProducts}
            mobileCount={settings.product_carousel_mobile_count}
            desktopCount={settings.product_carousel_desktop_count}
            intervalSeconds={settings.product_carousel_interval_seconds}
          />
        ) : (
          <EmptyState />
        )}
      </section>
    </main>
  );
}
