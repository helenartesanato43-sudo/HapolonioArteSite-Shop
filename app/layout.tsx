import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { Fraunces, Jost, Montserrat } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/data/settings";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jost",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: {
      default: `${settings.site_name} | Peças artesanais de cerâmica`,
      template: `%s | ${settings.site_name}`,
    },
    description:
      "Peças de cerâmica artesanal moldadas à mão: penduricalhos, canecas, móbiles e miniaturas de animais, feitas com barro e tradição.",
    openGraph: {
      title: `${settings.site_name} | Peças artesanais de cerâmica`,
      description:
        "Peças de cerâmica artesanal moldadas à mão, com barro e tradição.",
      type: "website",
      locale: "pt_BR",
    },
    icons: settings.favicon_url
      ? { icon: settings.favicon_url }
      : undefined,
  };
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const settings = await getSiteSettings();

  const themeStyle = {
    "--color-price": settings.price_color,
    "--color-heading": settings.heading_color,
    "--color-accent": settings.accent_color,
    "--color-text-muted": settings.text_color,
    "--color-empty-bg": settings.empty_state_bg_color,
  } as CSSProperties;

  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${jost.variable} ${montserrat.variable}`}
      style={themeStyle}
    >
      <body>{children}</body>
    </html>
  );
}
