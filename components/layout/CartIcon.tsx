"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export function CartIcon() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/carrinho"
      aria-label={`Carrinho de compras, ${itemCount} ${itemCount === 1 ? "item" : "itens"}`}
      className="relative inline-flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      <ShoppingBag className="h-4 w-4" aria-hidden="true" />
      {itemCount > 0 ? (
        <span
          className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-pix text-[10px] font-bold text-white"
          aria-hidden="true"
        >
          {itemCount}
        </span>
      ) : null}
    </Link>
  );
}
