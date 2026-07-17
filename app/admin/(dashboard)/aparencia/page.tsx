import { getSiteSettings } from "@/lib/data/settings";
import { ThemeSettingsForm } from "@/components/admin/ThemeSettingsForm";

export default async function AdminAppearancePage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold uppercase tracking-wide text-navy">
        Aparência
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        Ajuste as cores usadas em todo o site. Cada card abaixo mostra um
        exemplo ao vivo de onde a cor aparece — as mudanças valem para a loja
        inteira assim que forem salvas.
      </p>

      <div className="mt-8">
        <ThemeSettingsForm settings={settings} />
      </div>
    </div>
  );
}
