"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { Category } from "@/types";

export function CategoryShowcase({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-16 md:px-8 md:pt-20">
      <div className="flex flex-wrap justify-center gap-8 sm:gap-10 md:gap-14">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
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
        ))}
      </div>
    </section>
  );
}
