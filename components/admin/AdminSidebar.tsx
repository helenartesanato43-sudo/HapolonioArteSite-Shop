"use client";

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

  return (
    <>
      {/* ---- Mobile: barra superior compacta, tudo visível, rolagem horizontal ---- */}
      <div className="sticky top-0 z-40 flex w-full flex-col bg-navy text-white md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-20 shrink-0">
              <Image src={logoUrl || "/logo.png"} alt="Logo" fill className="object-contain" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wide text-white">
              Painel Administrativo
            </span>
          </div>

          <form action={signOut}>
            <button
              type="submit"
              aria-label="Sair"
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </div>

        <nav
          aria-label="Menu administrativo"
          className="flex gap-1.5 overflow-x-auto px-3 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {links.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "bg-clay text-white"
                    : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ---- Desktop: barra lateral fixa ---- */}
      <aside className="hidden h-full w-64 shrink-0 flex-col bg-navy text-white md:flex">
        <div className="flex flex-col items-center px-6 py-8 text-center">
          <div className="relative h-12 w-32">
            <Image src={logoUrl || "/logo.png"} alt="Logo" fill className="object-contain" />
          </div>
          <p className="mt-4 text-base font-bold uppercase tracking-widest text-white">
            Painel Administrativo
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {links.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-clay text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <form action={signOut} className="border-t border-white/10 p-3">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sair
          </button>
        </form>
      </aside>
    </>
  );
}
