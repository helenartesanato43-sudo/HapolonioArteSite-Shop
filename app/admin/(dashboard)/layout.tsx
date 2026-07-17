import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getSiteSettings } from "@/lib/data/settings";

export default async function AdminRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F5F2] md:flex-row">
      <AdminSidebar logoUrl={settings.logo_url} />
      <div className="min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-10">
          {children}
        </div>
      </div>
    </div>
  );
}
