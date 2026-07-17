"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatCurrency, buildWhatsAppLink, renderMessageTemplate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CartViewProps {
  whatsappCheckout: string;
  messageTemplate: string;
  storeName: string;
}

export function CartView({ whatsappCheckout, messageTemplate, storeName }: CartViewProps) {
  const { items, totalPrice, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-clay/20 bg-cream/40 px-6 py-16 text-center">
        <p className="text-sm font-medium text-navy">Seu carrinho está vazio.</p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm font-medium text-clay hover:text-clay-dark"
        >
          Ver peças artesanais
        </Link>
      </div>
    );
  }

  function handleCheckout() {
    const lines = items
      .map(
        (item, index) =>
          `${index + 1}. ${item.name} — Qtd: ${item.quantity} — ${formatCurrency(
            item.price * item.quantity
          )}`
      )
      .join("\n");

    const message = renderMessageTemplate(messageTemplate, {
      itens: lines,
      total: formatCurrency(totalPrice),
      loja: storeName,
    });

    const link = buildWhatsAppLink(whatsappCheckout, message);
    window.location.href = link;
  }

  return (
    <div>
      <ul className="divide-y divide-clay/10 rounded-2xl bg-white shadow-card">
        {items.map((item) => (
          <li key={item.productId} className="flex items-center gap-4 p-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream">
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
              ) : null}
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium text-navy">{item.name}</p>
              <p className="mt-1 text-sm font-bold" style={{ color: "var(--color-price)" }}>
                {formatCurrency(item.price)}
              </p>

              {item.isUnique ? (
                <p className="mt-1 text-xs text-clay">Peça única</p>
              ) : (
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    aria-label="Diminuir quantidade"
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-clay/30 text-navy hover:bg-clay/10"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-5 text-center text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.stockQuantity}
                    aria-label="Aumentar quantidade"
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-clay/30 text-navy hover:bg-clay/10 disabled:opacity-40"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col items-end gap-3">
              <span className="text-sm font-semibold text-navy">
                {formatCurrency(item.price * item.quantity)}
              </span>
              <button
                type="button"
                onClick={() => removeItem(item.productId)}
                aria-label={`Remover ${item.name} do carrinho`}
                className="text-muted hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-card">
        <span className="text-sm font-medium text-navy">Total</span>
        <span className="text-xl font-bold" style={{ color: "var(--color-price)" }}>
          {formatCurrency(totalPrice)}
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={clearCart}
          className="text-sm font-medium text-muted hover:text-red-600"
        >
          Esvaziar carrinho
        </button>

        <Button type="button" onClick={handleCheckout} className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Finalizar compra pelo WhatsApp
        </Button>
      </div>
    </div>
  );
}
