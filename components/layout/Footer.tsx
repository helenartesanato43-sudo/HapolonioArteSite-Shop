import Image from "next/image";
import Link from "next/link";
import { Instagram, MessageCircle, Lock } from "lucide-react";
import { getSiteSettings } from "@/lib/data/settings";
import { buildWhatsAppLink } from "@/lib/utils";

export async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer style={{ backgroundColor: settings.accent_color }} className="text-white">
      <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="border-t border-white/20 pt-12">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <div className="relative h-12 w-40">
                <Image
                  src={settings.logo_url || "/logo.png"}
                  alt={settings.site_name}
                  fill
                  className="object-contain object-left"
                />
              </div>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/80">
                Peças de cerâmica moldadas à mão, uma a uma, com barro,
                tradição e alma. Artesanato que carrega histórias para dentro
                da sua casa.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-widest">
                FALE CONOSCO
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href={buildWhatsAppLink(
                      settings.whatsapp_contact_1,
                      "Olá! Vim pelo site da Hapolonio Arte."
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    WhatsApp: {settings.whatsapp_contact_1}
                  </a>
                </li>
                <li>
                  <a
                    href={buildWhatsAppLink(
                      settings.whatsapp_contact_2,
                      "Olá! Vim pelo site da Hapolonio Arte."
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    WhatsApp: {settings.whatsapp_contact_2}
                  </a>
                </li>
                <li>
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
                    aria-label="Siga-nos no Instagram"
                  >
                    <Instagram className="h-4 w-4" aria-hidden="true" />
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <p className="mt-14 text-center text-xs text-white/60">
            © {new Date().getFullYear()} {settings.site_name}. Todos os
            direitos reservados.
          </p>

          <p className="mt-2 text-center text-[11px] text-white/40">
            Website developed by{" "}
            <Link href="/desenvolvedor" className="font-bold text-white/50 hover:text-white/70">
              ReyZ
            </Link>
          </p>
        </div>

        <Link
          href="/admin/login"
          aria-label="Painel administrativo"
          title="Painel administrativo"
          className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-white/30 transition-colors hover:text-white/70 md:bottom-6 md:right-8"
        >
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </footer>
  );
}
