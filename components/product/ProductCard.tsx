import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { DiscountBadge } from "./DiscountBadge";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const isSoldOut = product.is_unique && product.stock_quantity <= 0;
  const discount =
    product.old_price && product.old_price > product.price
      ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
      : null;

  return (
    <Link
      href={`/produto/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-card"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-cream">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : null}
        {discount ? <DiscountBadge percentage={discount} /> : null}
        {isSoldOut ? (
          <span className="absolute inset-x-0 bottom-0 bg-navy/90 py-1.5 text-center text-xs font-semibold uppercase tracking-wide text-white">
            Peça vendida
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-1 pt-4">
        <h3
          className="text-sm font-medium line-clamp-2 md:text-base"
          style={{ color: "var(--color-heading)" }}
        >
          {product.name}
        </h3>
        {product.old_price ? (
          <span
            className="text-xs line-through"
            style={{ color: "var(--color-text-muted)" }}
          >
            {formatCurrency(product.old_price)}
          </span>
        ) : null}
        <span
          className="text-base font-bold md:text-lg"
          style={{ color: "var(--color-price)" }}
        >
          {formatCurrency(product.price)}{" "}
          <span className="text-xs font-medium opacity-80">no Pix</span>
        </span>
      </div>
    </Link>
  );
}
