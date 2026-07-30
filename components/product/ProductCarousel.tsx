"use client";

import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { Carousel } from "@/components/ui/Carousel";

interface ProductCarouselProps {
  products: Product[];
  mobileCount: number;
  desktopCount: number;
  intervalSeconds: number;
}

export function ProductCarousel({
  products,
  mobileCount,
  desktopCount,
  intervalSeconds,
}: ProductCarouselProps) {
  if (products.length === 0) return null;

  return (
    <Carousel
      items={products}
      mobileCount={mobileCount}
      desktopCount={desktopCount}
      intervalSeconds={intervalSeconds}
      gapPx={20}
      itemKey={(product) => product.id}
      renderItem={(product, index) => (
        <ProductCard product={product} priority={index < 4} />
      )}
    />
  );
}
