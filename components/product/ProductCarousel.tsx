"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { ProductGrid } from "./ProductGrid";

interface ProductCarouselProps {
  products: Product[];
  mobileCount: number;
  desktopCount: number;
  intervalSeconds: number;
}

function chunk<T>(items: T[], size: number): T[][] {
  if (size <= 0) return [items];
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }
  return pages;
}

function CarouselTrack({
  products,
  itemsPerView,
  intervalSeconds,
}: {
  products: Product[];
  itemsPerView: number;
  intervalSeconds: number;
}) {
  const pages = chunk(products, Math.max(1, itemsPerView));
  const totalPages = pages.length;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [totalPages]);

  useEffect(() => {
    if (totalPages <= 1) return;
    const ms = Math.max(2, intervalSeconds) * 1000;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % totalPages);
    }, ms);
    return () => clearInterval(timer);
  }, [totalPages, intervalSeconds]);

  if (totalPages <= 1) {
    return <ProductGrid products={products} />;
  }

  function goTo(direction: 1 | -1) {
    setIndex((current) => (current + direction + totalPages) % totalPages);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => goTo(-1)}
        aria-label="Produtos anteriores"
        className="absolute left-0 top-1/3 z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 text-navy shadow-card ring-1 ring-clay/15 transition-transform hover:scale-105 sm:flex"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </button>

      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            width: `${totalPages * 100}%`,
            transform: `translateX(-${(index * 100) / totalPages}%)`,
          }}
        >
          {pages.map((page, pageIndex) => (
            <div
              key={pageIndex}
              className="grid shrink-0 gap-x-6 gap-y-10 px-1"
              style={{
                width: `${100 / totalPages}%`,
                gridTemplateColumns: `repeat(${itemsPerView}, minmax(0, 1fr))`,
              }}
            >
              {page.map((product, i) => (
                <ProductCard key={product.id} product={product} priority={pageIndex === 0 && i < 4} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => goTo(1)}
        aria-label="Próximos produtos"
        className="absolute right-0 top-1/3 z-10 hidden translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 text-navy shadow-card ring-1 ring-clay/15 transition-transform hover:scale-105 sm:flex"
      >
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </button>

      <div className="mt-6 flex justify-center gap-1.5">
        {pages.map((_, pageIndex) => (
          <span
            key={pageIndex}
            className={`h-1.5 rounded-full transition-all ${
              pageIndex === index ? "w-5 bg-clay" : "w-1.5 bg-clay/25"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}

export function ProductCarousel({
  products,
  mobileCount,
  desktopCount,
  intervalSeconds,
}: ProductCarouselProps) {
  if (products.length === 0) return null;

  return (
    <>
      <div className="block md:hidden">
        <CarouselTrack products={products} itemsPerView={mobileCount} intervalSeconds={intervalSeconds} />
      </div>
      <div className="hidden md:block">
        <CarouselTrack products={products} itemsPerView={desktopCount} intervalSeconds={intervalSeconds} />
      </div>
    </>
  );
}
