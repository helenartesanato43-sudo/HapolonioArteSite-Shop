import { BannerForm } from "@/components/admin/BannerForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { createBanner } from "@/lib/actions/banners";

export default function NewBannerPage() {
  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title="Novo banner"
        description="Cadastre as duas versões da imagem — computador e celular."
      />

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-card">
        <BannerForm action={createBanner} />
      </div>
    </div>
  );
}
