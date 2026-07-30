import { getSiteSettings } from "@/lib/data/settings";
import { GeneralSettingsForm } from "@/components/admin/GeneralSettingsForm";
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
    </div>
  );
}
