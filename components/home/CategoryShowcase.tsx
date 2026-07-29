"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";
import { Category } from "@/types";

const CAROUSEL_THRESHOLD = 4;

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

function CategoryCarousel({ categories }: { categories: Category[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollByAmount(direction: 1 | -1) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scrollByAmount(-1)}
        aria-label="Categorias anteriores"
        className="absolute left-0 top-16 z-10 hidden -translate-x-1/2 items-center justify-center rounded-full bg-white p-2 text-navy shadow-card ring-1 ring-clay/15 transition-transform hover:scale-105 sm:top-20 sm:flex md:top-24"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </button>

      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth px-1 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-10 md:gap-14 [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((category, index) => (
          <div key={category.id} className="shrink-0 snap-start">
            <CategoryItem category={category} index={index} />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollByAmount(1)}
        aria-label="Próximas categorias"
        className="absolute right-0 top-16 z-10 hidden translate-x-1/2 items-center justify-center rounded-full bg-white p-2 text-navy shadow-card ring-1 ring-clay/15 transition-transform hover:scale-105 sm:top-20 sm:flex md:top-24"
      >
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}

export function CategoryShowcase({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-16 md:px-8 md:pt-20">
      {categories.length > CAROUSEL_THRESHOLD ? (
        <CategoryCarousel categories={categories} />
      ) : (
        <div className="flex flex-wrap justify-center gap-8 sm:gap-10 md:gap-14">
          {categories.map((category, index) => (
            <CategoryItem key={category.id} category={category} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
