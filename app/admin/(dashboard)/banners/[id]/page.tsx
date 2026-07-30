import { notFound } from "next/navigation";
import { BannerForm } from "@/components/admin/BannerForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getBannerById } from "@/lib/data/banners";
import { updateBanner } from "@/lib/actions/banners";

interface EditBannerPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBannerPage({ params }: EditBannerPageProps) {
  const { id } = await params;
  const banner = await getBannerById(id);

  if (!banner) {
    notFound();
  }

  const action = updateBanner.bind(null, banner.id);

  return (
    <div className="max-w-2xl">
      <AdminPageHeader title="Editar banner" description={banner.name} />

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-card">
        <BannerForm action={action} banner={banner} />
      </div>
    </div>
  );
}
