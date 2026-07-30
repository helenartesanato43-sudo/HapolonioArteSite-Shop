"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";
import { Category } from "@/types";

interface CategoryShowcaseProps {
  categories: Category[];
  mobileCount: number;
  desktopCount: number;
  intervalSeconds: number;
}

function CategoryItem({ category, index }: { category: Category; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
    >
      <Link
        href={`/categoria/${category.slug}`}
        className="group flex flex-col items-center gap-3"
      >
        <motion.div
          whileHover={{ scale: 1.06, y: -3 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-cream shadow-sm ring-1 ring-clay/15 sm:h-40 sm:w-40 md:h-48 md:w-48"
        >
          {category.image_url ? (
            <Image
              src={category.image_url}
              alt={category.name}
              fill
              sizes="192px"
              className="object-cover"
            />
          ) : (
            <Package className="h-10 w-10 text-clay" aria-hidden="true" />
          )}
        </motion.div>
        <span
          className="max-w-[8rem] text-center text-xs font-medium uppercase tracking-wide transition-colors group-hover:opacity-80 sm:text-sm"
          style={{ color: "var(--color-heading)" }}
        >
          {category.name}
        </span>
      </Link>
    </motion.div>
  );
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
  categories,
  itemsPerView,
  intervalSeconds,
}: {
  categories: Category[];
  itemsPerView: number;
  intervalSeconds: number;
}) {
  const pages = chunk(categories, Math.max(1, itemsPerView));
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
    return (
      <div className="flex flex-wrap justify-center gap-8 sm:gap-10 md:gap-14">
        {categories.map((category, i) => (
          <CategoryItem key={category.id} category={category} index={i} />
        ))}
      </div>
    );
  }

  function goTo(direction: 1 | -1) {
    setIndex((current) => (current + direction + totalPages) % totalPages);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => goTo(-1)}
        aria-label="Categorias anteriores"
        className="absolute left-0 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 text-navy shadow-card ring-1 ring-clay/15 transition-transform hover:scale-105 sm:flex"
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
              className="flex shrink-0 justify-center gap-8 px-1 sm:gap-10 md:gap-14"
              style={{ width: `${100 / totalPages}%` }}
            >
              {page.map((category, i) => (
                <CategoryItem key={category.id} category={category} index={i} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => goTo(1)}
        aria-label="Próximas categorias"
        className="absolute right-0 top-1/2 z-10 hidden translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 text-navy shadow-card ring-1 ring-clay/15 transition-transform hover:scale-105 sm:flex"
      >
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </button>

      <div className="mt-4 flex justify-center gap-1.5">
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

export function CategoryShowcase({
  categories,
  mobileCount,
  desktopCount,
  intervalSeconds,
}: CategoryShowcaseProps) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-16 md:px-8 md:pt-20">
      <div className="block md:hidden">
        <CarouselTrack
          categories={categories}
          itemsPerView={mobileCount}
          intervalSeconds={intervalSeconds}
        />
      </div>
      <div className="hidden md:block">
        <CarouselTrack
          categories={categories}
          itemsPerView={desktopCount}
          intervalSeconds={intervalSeconds}
        />
      </div>
    </section>
  );
}
