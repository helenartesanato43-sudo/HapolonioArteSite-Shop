import { getSiteSettings } from "@/lib/data/settings";
import { ThemeSettingsForm } from "@/components/admin/ThemeSettingsForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function AdminAppearancePage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-4xl">
      <AdminPageHeader
        title="Aparência"
        description="Ajuste as cores usadas em todo o site. Cada card abaixo mostra um exemplo ao vivo de onde a cor aparece — as mudanças valem para a loja inteira assim que forem salvas."
      />

      <div className="mt-8">
        <ThemeSettingsForm settings={settings} />
      </div>
    </div>
  );
}
