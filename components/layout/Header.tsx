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
        <div className="w-10 md:w-20" aria-hidden="true" />

        <Link
          href="/"
          className="relative h-12 w-36 md:h-16 md:w-48"
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

        <div className="flex w-10 justify-end md:w-20">
          <CartIcon />
        </div>
      </div>
    </header>
  );
}
