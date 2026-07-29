"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const SORT_OPTIONS = [
  { value: "newest", label: "Mais recentes" },
  { value: "oldest", label: "Mais antigos" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "name_asc", label: "Nome (A-Z)" },
  { value: "category_asc", label: "Categoria (A-Z)" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export function SortDropdown({ current }: { current: SortValue }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(value: SortValue) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setOpen(false);
  }

  const currentLabel = SORT_OPTIONS.find((option) => option.value === current)?.label;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-2 whitespace-nowrap rounded-full border border-navy px-4 py-2 text-sm font-medium text-navy transition-colors hover:bg-navy hover:text-white"
      >
        <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
        Classificar
        <span className="hidden text-xs opacity-70 sm:inline">· {currentLabel}</span>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl bg-white py-1.5 shadow-card ring-1 ring-clay/10"
        >
          {SORT_OPTIONS.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={option.value === current}
                onClick={() => handleSelect(option.value)}
                className="flex w-full items-center justify-between gap-2 px-4 py-2 text-left text-sm text-navy transition-colors hover:bg-cream"
              >
                {option.label}
                {option.value === current ? (
                  <Check className="h-4 w-4 text-clay" aria-hidden="true" />
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
