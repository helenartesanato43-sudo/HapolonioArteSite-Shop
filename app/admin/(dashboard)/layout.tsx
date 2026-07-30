import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getSiteSettings } from "@/lib/data/settings";

// O painel administrativo precisa sempre refletir o estado mais recente do
// banco (produtos, categorias etc.), então nenhuma rota aqui deve reutilizar
// dados em cache — isso também evita categorias já excluídas continuarem
// aparecendo em formulários por causa do cache de fetch do Next.js.
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function AdminRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col bg-cream/50 md:flex-row">
      <AdminSidebar logoUrl={settings.logo_url} />
      <div className="min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">
          {children}
        </div>
      </div>
    </div>
  );
}
