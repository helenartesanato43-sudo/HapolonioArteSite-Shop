"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Check } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";

export function AddToCartControls({ product }: { product: Product }) {
  const { items, addItem, updateQuantity } = useCart();
  const [justReserved, setJustReserved] = useState(false);

  const isSoldOut = product.stock_quantity <= 0;

  const existingItem = items.find((item) => item.productId === product.id);
  const maxQuantity = product.is_unique ? 1 : product.stock_quantity;
  const currentQuantity = existingItem?.quantity ?? 0;

  function handleReserve() {
    if (isSoldOut) return;
    addItem(product);
    setJustReserved(true);
  }

  function handleIncrease() {
    if (!existingItem) return;
    updateQuantity(product.id, Math.min(existingItem.quantity + 1, maxQuantity));
  }

  function handleDecrease() {
    if (!existingItem) return;
    updateQuantity(product.id, existingItem.quantity - 1);
  }

  if (isSoldOut) {
    return (
      <div className="rounded-xl bg-navy/5 px-4 py-3 text-sm font-medium text-navy">
        Esta peça única já foi vendida.
      </div>
    );
  }

  const showReserved = justReserved || !!existingItem;

  return (
    <div className="flex flex-col gap-4">
      {product.is_unique ? (
        <p className="text-xs font-medium text-clay">
          Peça única disponível — apenas 1 unidade.
        </p>
      ) : (
        <p className="text-xs text-muted">
          {product.stock_quantity} unidade(s) em estoque.
        </p>
      )}

      {existingItem && currentQuantity > 0 && !product.is_unique ? (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDecrease}
            aria-label="Diminuir quantidade"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-clay/30 text-navy transition-colors hover:bg-clay/10"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-6 text-center text-sm font-medium text-navy">
            {currentQuantity}
          </span>
          <button
            type="button"
            onClick={handleIncrease}
            disabled={currentQuantity >= maxQuantity}
            aria-label="Aumentar quantidade"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-clay/30 text-navy transition-colors hover:bg-clay/10 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {showReserved ? (
          <>
            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-pix">
              <Check className="h-4 w-4" /> Peça reservada.
            </span>
            <Link
              href="/carrinho"
              className="inline-flex items-center justify-center rounded-full border-2 border-clay px-5 py-2 text-sm font-semibold text-clay transition-colors hover:bg-clay hover:text-white"
            >
              Ver Carrinho
            </Link>
          </>
        ) : (
          <Button
            type="button"
            onClick={handleReserve}
            className="font-bold uppercase tracking-wide"
          >
            Reservar peça!
          </Button>
        )}
      </div>
    </div>
  );
}
