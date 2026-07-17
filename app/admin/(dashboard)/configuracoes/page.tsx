import { getSiteSettings } from "@/lib/data/settings";
import { GeneralSettingsForm } from "@/components/admin/GeneralSettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold uppercase tracking-wide text-navy">
        Configurações
      </h1>
      <p className="mt-1 text-sm text-muted">
        Informações de contato, logo, favicon e dados gerais do site.
      </p>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-card">
        <GeneralSettingsForm settings={settings} />
      </div>
    </div>
  );
}
