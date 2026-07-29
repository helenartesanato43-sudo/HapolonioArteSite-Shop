"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  FolderTree,
  Image as ImageIcon,
  Settings,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { Category, Product } from "@/types";

interface AdminOverviewProps {
  initialProducts: Product[];
  initialCategories: Category[];
}

export function AdminOverview({ initialProducts, initialCategories }: AdminOverviewProps) {
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [connected, setConnected] = useState(false);

  const refetch = useCallback(async () => {
    const supabase = createClient();
    const [productsResult, categoriesResult] = await Promise.all([
      supabase
        .from("products")
        .select("*, category:categories(*)")
        .order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("name", { ascending: true }),
    ]);

    if (productsResult.data) setProducts(productsResult.data as Product[]);
    if (categoriesResult.data) setCategories(categoriesResult.data as Category[]);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("admin-overview-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, refetch)
      .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, refetch)
      .subscribe((status) => setConnected(status === "SUBSCRIBED"));

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const activeProducts = products.filter((p) => p.is_active);
  const hiddenProducts = products.filter((p) => !p.is_active);
  const outOfStock = products.filter((p) => p.is_active && p.stock_quantity <= 0);
  const estimatedInventoryValue = activeProducts.reduce(
    (sum, p) => sum + p.price * Math.max(p.stock_quantity, 0),
    0
  );
  const recentProducts = products.slice(0, 5);

  const cards = [
    { label: "Produtos visíveis", value: activeProducts.length, href: "/admin/produtos", icon: Package },
    { label: "Produtos ocultos", value: hiddenProducts.length, href: "/admin/produtos", icon: EyeOff },
    { label: "Categorias", value: categories.length, href: "/admin/categorias", icon: FolderTree },
    { label: "Sem estoque", value: outOfStock.length, href: "/admin/produtos", icon: AlertTriangle },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold uppercase tracking-wide text-navy">
          Visão geral
        </h1>
        <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-muted shadow-card">
          <span
            className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-500" : "bg-clay/40"}`}
            aria-hidden="true"
          />
          {connected ? "Em tempo real" : "Conectando..."}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted">
        Bem-vindo(a) ao painel da Hapolonio Arte. Os números abaixo se atualizam
        automaticamente conforme produtos e categorias são cadastrados ou alterados.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl bg-white p-5 shadow-card transition-transform hover:-translate-y-0.5"
          >
            <card.icon className="h-5 w-5 text-clay" aria-hidden="true" />
            <p className="mt-3 text-2xl font-bold text-navy">{card.value}</p>
            <p className="mt-1 text-xs text-muted">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-card">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          Valor estimado em estoque
        </p>
        <p className="mt-2 text-2xl font-bold text-navy">
          {formatCurrency(estimatedInventoryValue)}
        </p>
        <p className="mt-1 text-xs text-muted">
          Soma de preço × quantidade dos produtos visíveis.
        </p>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-card">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-navy">
          Últimos produtos cadastrados
        </h2>
        {recentProducts.length === 0 ? (
          <p className="text-sm text-muted">Nenhum produto cadastrado ainda.</p>
        ) : (
          <ul className="divide-y divide-clay/10">
            {recentProducts.map((product) => (
              <li key={product.id} className="flex items-center gap-3 py-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-cream">
                  {product.image_url ? (
                    <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                  ) : null}
                </div>
                <span className="flex-1 text-sm text-navy">{product.name}</span>
                <span className="text-sm font-medium text-pix">
                  {formatCurrency(product.price)}
                </span>
                <Link
                  href={`/admin/produtos/${product.id}`}
                  className="text-xs font-medium text-clay hover:text-clay-dark"
                >
                  Editar
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/admin/produtos/novo"
          className="flex items-center gap-3 rounded-xl border border-clay/20 bg-white p-5 text-sm font-medium text-navy transition-colors hover:border-clay"
        >
          <Package className="h-5 w-5 text-clay" aria-hidden="true" />
          Cadastrar novo produto
        </Link>
        <Link
          href="/admin/banners"
          className="flex items-center gap-3 rounded-xl border border-clay/20 bg-white p-5 text-sm font-medium text-navy transition-colors hover:border-clay"
        >
          <ImageIcon className="h-5 w-5 text-clay" aria-hidden="true" />
          Atualizar banners da home
        </Link>
        <Link
          href="/admin/configuracoes"
          className="flex items-center gap-3 rounded-xl border border-clay/20 bg-white p-5 text-sm font-medium text-navy transition-colors hover:border-clay"
        >
          <Settings className="h-5 w-5 text-clay" aria-hidden="true" />
          Editar contatos e informações
        </Link>
        <Link
          href="/admin/categorias/novo"
          className="flex items-center gap-3 rounded-xl border border-clay/20 bg-white p-5 text-sm font-medium text-navy transition-colors hover:border-clay"
        >
          <FolderTree className="h-5 w-5 text-clay" aria-hidden="true" />
          Cadastrar nova categoria
        </Link>
      </div>
    </div>
  );
}
