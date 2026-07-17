import { BannerForm } from "@/components/admin/BannerForm";
import { createBanner } from "@/lib/actions/banners";

export default function NewBannerPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold uppercase tracking-wide text-navy">
        Novo banner
      </h1>
      <p className="mt-1 text-sm text-muted">
        Cadastre as duas versões da imagem — computador e celular.
      </p>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-card">
        <BannerForm action={createBanner} />
      </div>
    </div>
  );
}
