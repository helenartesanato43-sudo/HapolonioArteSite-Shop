"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Image as ImageIcon,
  Settings,
  Palette,
  MessageCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/categorias", label: "Categorias", icon: FolderTree },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/mensagem-whatsapp", label: "Mensagem WhatsApp", icon: MessageCircle },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
  { href: "/admin/aparencia", label: "Aparência", icon: Palette },
];

function useIsActive() {
  const pathname = usePathname();
  return (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export function AdminSidebar({ logoUrl }: { logoUrl: string | null }) {
  const isActive = useIsActive();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const currentLabel = links.find((link) => isActive(link.href))?.label ?? "Painel";

  return (
    <>
      {/* ---- Mobile: barra superior + menu suspenso ---- */}
      <div className="sticky top-0 z-40 w-full bg-navy text-white shadow-md md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="relative h-8 w-20 shrink-0">
              <Image src={logoUrl || "/logo.png"} alt="Logo" fill className="object-contain" />
            </div>
            <div className="border-l border-white/15 pl-2.5">
              <p className="text-[10px] uppercase tracking-widest text-white/50">
                Painel Administrativo
              </p>
              <p className="text-sm font-semibold text-white">{currentLabel}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            {menuOpen ? (
              <X className="h-[18px] w-[18px]" aria-hidden="true" />
            ) : (
              <Menu className="h-[18px] w-[18px]" aria-hidden="true" />
            )}
          </button>
        </div>

        {menuOpen ? (
          <nav
            aria-label="Menu administrativo"
            className="border-t border-white/10 bg-navy px-3 pb-3 pt-2"
          >
            <ul className="space-y-1">
              {links.map((link) => {
                const active = isActive(link.href);
                const Icon = link.icon;

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-clay text-white"
                          : "text-white/75 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <form action={signOut} className="mt-2 border-t border-white/10 pt-2">
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-200 transition-colors hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sair da conta
              </button>
            </form>
          </nav>
        ) : null}
      </div>

      {/* ---- Desktop: barra lateral fixa ---- */}
      <aside className="hidden h-screen w-64 shrink-0 flex-col bg-navy text-white md:sticky md:top-0 md:flex">
        <div className="flex flex-col items-center gap-3 border-b border-white/10 px-6 py-8 text-center">
          <div className="relative h-12 w-32">
            <Image src={logoUrl || "/logo.png"} alt="Logo" fill className="object-contain" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
            Painel Administrativo
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {links.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-clay text-white shadow-sm"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg",
                    active ? "bg-white/20" : "bg-white/5"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <form action={signOut} className="border-t border-white/10 p-3">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-red-500/10 hover:text-red-200"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sair
          </button>
        </form>
      </aside>
    </>
  );
}
