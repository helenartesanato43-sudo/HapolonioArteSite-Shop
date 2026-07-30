import { getSiteSettings } from "@/lib/data/settings";
import { CarouselSettingsForm } from "@/components/admin/CarouselSettingsForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function AdminCarouselsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-3xl">
      <AdminPageHeader
        title="Carrosséis"
        description="Controle quantos itens aparecem por vez e a velocidade da troca automática dos carrosséis de categorias, produtos e produtos semelhantes."
      />

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-card">
        <CarouselSettingsForm settings={settings} />
      </div>
    </div>
  );
}
