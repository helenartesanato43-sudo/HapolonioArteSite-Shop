"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  FolderTree,
  Image as ImageIcon,
  Settings,
  EyeOff,
  AlertTriangle,
  Wallet,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, cn } from "@/lib/utils";
import { Category, Product } from "@/types";

interface AdminOverviewProps {
  initialProducts: Product[];
  initialCategories: Category[];
}

const POLL_INTERVAL_MS = 8000;

export function AdminOverview({ initialProducts, initialCategories }: AdminOverviewProps) {
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [connected, setConnected] = useState(false);
  const isFetching = useRef(false);

  const refetch = useCallback(async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    try {
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
    } finally {
      isFetching.current = false;
    }
  }, []);

  useEffect(() => {
    // Busca imediatamente ao montar (evita mostrar dados de SSR desatualizados)
    // e mantém um polling curto como garantia mesmo se o Realtime do Supabase
    // não estiver habilitado no projeto — assim a tela nunca fica travada no
    // estado antigo depois de um produto ou categoria ser criado/apagado.
    refetch();
    const pollId = setInterval(refetch, POLL_INTERVAL_MS);

    const supabase = createClient();
    const channel = supabase
      .channel("admin-overview-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, refetch)
      .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, refetch)
      .subscribe((status) => setConnected(status === "SUBSCRIBED"));

    return () => {
      clearInterval(pollId);
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
    {
      label: "Produtos visíveis",
      value: activeProducts.length,
      href: "/admin/produtos",
      icon: Package,
      tone: "bg-clay/10 text-clay",
    },
    {
      label: "Produtos ocultos",
      value: hiddenProducts.length,
      href: "/admin/produtos",
      icon: EyeOff,
      tone: "bg-navy/10 text-navy",
    },
    {
      label: "Categorias",
      value: categories.length,
      href: "/admin/categorias",
      icon: FolderTree,
      tone: "bg-pix/10 text-pix",
    },
    {
      label: "Sem estoque",
      value: outOfStock.length,
      href: "/admin/produtos",
      icon: AlertTriangle,
      tone: "bg-red-50 text-red-600",
    },
  ];

  const quickActions = [
    { href: "/admin/produtos/novo", label: "Cadastrar novo produto", icon: Package },
    { href: "/admin/banners", label: "Atualizar banners da home", icon: ImageIcon },
    { href: "/admin/configuracoes", label: "Editar contatos e informações", icon: Settings },
    { href: "/admin/categorias/novo", label: "Cadastrar nova categoria", icon: FolderTree },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-navy px-6 py-5 text-white shadow-card sm:px-8 sm:py-6">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wide sm:text-2xl">
            Visão geral
          </h1>
          <p className="mt-1 text-sm text-white/70">
            Bem-vindo(a) ao painel da Hapolonio Arte.
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              connected ? "bg-pix animate-pulse" : "bg-white/40"
            )}
            aria-hidden="true"
          />
          {connected ? "Em tempo real" : "Sincronizando..."}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group rounded-2xl bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span className={cn("inline-flex rounded-xl p-2.5", card.tone)}>
              <card.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="mt-4 text-2xl font-bold text-navy sm:text-3xl">{card.value}</p>
            <p className="mt-1 text-xs font-medium text-muted">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="rounded-2xl bg-white p-6 shadow-card lg:col-span-2">
          <span className="inline-flex rounded-xl bg-pix/10 p-2.5 text-pix">
            <Wallet className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted">
            Valor estimado em estoque
          </p>
          <p className="mt-1 text-3xl font-bold text-navy">
            {formatCurrency(estimatedInventoryValue)}
          </p>
          <p className="mt-2 text-xs text-muted">
            Soma de preço × quantidade dos produtos visíveis.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card lg:col-span-3">
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
                  <span className="flex-1 truncate text-sm text-navy">{product.name}</span>
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
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-navy">
        Ações rápidas
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group flex items-center gap-3 rounded-xl border border-clay/20 bg-white p-5 text-sm font-medium text-navy shadow-sm transition-colors hover:border-clay hover:bg-cream/40"
          >
            <span className="inline-flex rounded-lg bg-clay/10 p-2 text-clay">
              <action.icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="flex-1">{action.label}</span>
            <ArrowRight
              className="h-4 w-4 text-clay opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
