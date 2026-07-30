import { getSiteSettings } from "@/lib/data/settings";
import { GeneralSettingsForm } from "@/components/admin/GeneralSettingsForm";
import { CarouselSettingsForm } from "@/components/admin/CarouselSettingsForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title="Configurações"
        description="Informações de contato, logo, favicon e dados gerais do site."
      />

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-card">
        <GeneralSettingsForm settings={settings} />
      </div>

      <h2 className="mt-10 text-lg font-bold uppercase tracking-wide text-navy">
        Carrosséis da página inicial
      </h2>
      <p className="mt-1 text-sm text-muted">
        Controle quantos itens aparecem por vez e a velocidade da troca
        automática dos carrosséis de categorias e produtos.
      </p>

      <div className="mt-4 rounded-2xl bg-white p-6 shadow-card">
        <CarouselSettingsForm settings={settings} />
      </div>
    </div>
  );
}
