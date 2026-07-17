import Link from "next/link";
import Image from "next/image";
import { Plus, Monitor, Smartphone } from "lucide-react";
import { getAllBannersForAdmin } from "@/lib/data/banners";
import { getSiteSettings } from "@/lib/data/settings";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { CarouselIntervalForm } from "@/components/admin/CarouselIntervalForm";
import { deleteBanner } from "@/lib/actions/banners";

export default async function AdminBannersPage() {
  const [banners, settings] = await Promise.all([
    getAllBannersForAdmin(),
    getSiteSettings(),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wide text-navy">
            Banners
          </h1>
          <p className="mt-1 text-sm text-muted">
            {banners.length} banner(s) cadastrado(s). Eles giram em um
            carrossel com transição suave na home.
          </p>
        </div>
        <Link
          href="/admin/banners/novo"
          className="inline-flex items-center gap-2 rounded-full bg-clay px-5 py-2.5 text-sm font-medium text-white hover:bg-clay-dark"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Novo banner
        </Link>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-card">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-navy">
          Velocidade do carrossel
        </h2>
        <CarouselIntervalForm defaultSeconds={settings.banner_interval_seconds} />
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-card">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-cream/60 text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-5 py-3">Banner</th>
              <th className="px-5 py-3">Computador</th>
              <th className="px-5 py-3">Celular</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-clay/10">
            {banners.map((banner) => (
              <tr key={banner.id}>
                <td className="px-5 py-3 font-medium text-navy">{banner.name}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                    <div className="relative h-10 w-16 overflow-hidden rounded-md bg-cream">
                      <Image
                        src={banner.desktop_image_url}
                        alt={`${banner.name} — computador`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                    <div className="relative h-10 w-8 overflow-hidden rounded-md bg-cream">
                      <Image
                        src={banner.mobile_image_url}
                        alt={`${banner.name} — celular`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                      banner.is_active
                        ? "bg-pix/10 text-pix"
                        : "bg-navy/10 text-navy/70"
                    }`}
                  >
                    {banner.is_active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/banners/${banner.id}`}
                      className="text-xs font-medium text-clay hover:text-clay-dark"
                    >
                      Editar
                    </Link>
                    <DeleteButton
                      action={deleteBanner.bind(null, banner.id)}
                      confirmMessage={`Remover o banner "${banner.name}"?`}
                    />
                  </div>
                </td>
              </tr>
            ))}

            {banners.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-muted">
                  Nenhum banner cadastrado ainda.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
