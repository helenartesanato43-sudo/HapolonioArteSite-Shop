"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { CartItem, Product } from "@/types";

const STORAGE_KEY = "hapolonio-arte:cart";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  addItem: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // localStorage indisponível — carrinho simplesmente começa vazio
    } finally {
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // silenciosamente ignora falhas de armazenamento
    }
  }, [items, hasLoaded]);

  const addItem = useCallback((product: Product) => {
    setItems((current) => {
      const existing = current.find((item) => item.productId === product.id);

      const maxQuantity = product.is_unique ? 1 : product.stock_quantity;

      if (existing) {
        const nextQuantity = Math.min(existing.quantity + 1, maxQuantity || 1);
        return current.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: nextQuantity }
            : item
        );
      }

      return [
        ...current,
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          imageUrl: product.image_url,
          isUnique: product.is_unique,
          stockQuantity: product.stock_quantity,
          quantity: 1,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((current) =>
      current
        .map((item) => {
          if (item.productId !== productId) return item;
          const max = item.isUnique ? 1 : item.stockQuantity || 999;
          const clamped = Math.max(1, Math.min(quantity, max));
          return { ...item, quantity: clamped };
        })
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return {
      items,
      itemCount,
      totalPrice,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    };
  }, [items, addItem, updateQuantity, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
