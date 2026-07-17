import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { AddToCartControls } from "@/components/product/AddToCartControls";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getProductBySlug, getSimilarProducts } from "@/lib/data/products";
import { formatCurrency } from "@/lib/utils";

export const revalidate = 30;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Produto não encontrado" };
  }

  return {
    title: product.name,
    description: product.description || `${product.name} — peça artesanal de cerâmica.`,
    openGraph: {
      title: product.name,
      description: product.description || `${product.name} — peça artesanal de cerâmica.`,
      type: "website",
      locale: "pt_BR",
      images: product.image_url ? [{ url: product.image_url }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const similarProducts = await getSimilarProducts(product.category_id, product.id, 4);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
      <Breadcrumb currentLabel={product.name} />

      <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-cream">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          ) : null}
        </div>

        <div className="flex flex-col justify-center">
          {product.category ? (
            <span className="text-xs font-medium uppercase tracking-widest text-clay">
              {product.category.name}
            </span>
          ) : null}

          <h1
            className="mt-2 text-2xl font-bold md:text-3xl"
            style={{ color: "var(--color-heading)" }}
          >
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            {product.old_price ? (
              <span
                className="text-sm line-through"
                style={{ color: "var(--color-text-muted)" }}
              >
                {formatCurrency(product.old_price)}
              </span>
            ) : null}
            <span
              className="text-2xl font-bold"
              style={{ color: "var(--color-price)" }}
            >
              {formatCurrency(product.price)}{" "}
              <span className="text-sm font-medium opacity-80">no Pix</span>
            </span>
          </div>

          <div className="mt-8">
            <AddToCartControls product={product} />
          </div>
        </div>
      </div>

      {product.description ? (
        <div className="mx-auto mt-14 max-w-2xl text-center">
          <h2
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-heading)" }}
          >
            Sobre esta peça
          </h2>
          <div
            className="prose-description mt-4 text-sm leading-relaxed text-muted md:text-base"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      ) : null}

      {similarProducts.length > 0 ? (
        <div className="mt-20">
          <h2
            className="mb-8 text-center text-xl font-bold uppercase tracking-wide md:text-2xl"
            style={{ color: "var(--color-heading)" }}
          >
            Produtos semelhantes
          </h2>
          <ProductGrid products={similarProducts} />
        </div>
      ) : null}
    </main>
  );
}
