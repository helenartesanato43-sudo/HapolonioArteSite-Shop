import Image from "next/image";
import Link from "next/link";
import { CartIcon } from "./CartIcon";
import { getSiteSettings } from "@/lib/data/settings";

export async function Header() {
  const settings = await getSiteSettings();

  return (
    <header
      className="sticky top-0 z-50 w-full shadow-md"
      style={{ backgroundColor: settings.accent_color }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 md:px-8">
        <div className="w-8 md:w-16" aria-hidden="true" />

        <Link
          href="/"
          className="relative h-8 w-24 md:h-9 md:w-28"
          aria-label={`Página inicial - ${settings.site_name}`}
        >
          <Image
            src={settings.logo_url || "/logo.png"}
            alt={settings.site_name}
            fill
            priority
            className="object-contain"
          />
        </Link>

        <div className="flex w-8 justify-end md:w-16">
          <CartIcon />
        </div>
      </div>
    </header>
  );
}
