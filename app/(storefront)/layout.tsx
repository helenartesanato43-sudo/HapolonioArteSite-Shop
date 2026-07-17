import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { CartProvider } from "@/lib/cart-context";

export default function StorefrontLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <CartProvider>
      <Header />
      {children}
      <Footer />
      <BackToTop />
    </CartProvider>
  );
}
