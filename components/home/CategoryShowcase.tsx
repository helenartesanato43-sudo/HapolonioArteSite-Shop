"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { Category } from "@/types";
import { Carousel } from "@/components/ui/Carousel";

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
          className="relative aspect-square w-full max-w-[12rem] overflow-hidden rounded-full bg-cream shadow-sm ring-1 ring-clay/15"
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
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-10 w-10 text-clay" aria-hidden="true" />
            </div>
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

export function CategoryShowcase({
  categories,
  mobileCount,
  desktopCount,
  intervalSeconds,
}: CategoryShowcaseProps) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-16 md:px-8 md:pt-20">
      <Carousel
        items={categories}
        mobileCount={mobileCount}
        desktopCount={desktopCount}
        intervalSeconds={intervalSeconds}
        gapPx={24}
        itemKey={(category) => category.id}
        renderItem={(category, index) => <CategoryItem category={category} index={index} />}
      />
    </section>
  );
}
