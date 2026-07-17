import { getSiteSettings } from "@/lib/data/settings";
import { getActiveTemplate } from "@/lib/data/templates";
import { CartView } from "@/components/product/CartView";

export const metadata = {
  title: "Carrinho",
};

export default async function CartPage() {
  const [settings, template] = await Promise.all([
    getSiteSettings(),
    getActiveTemplate(),
  ]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-14">
      <h1
        className="text-2xl font-bold uppercase tracking-wide md:text-3xl"
        style={{ color: "var(--color-heading)" }}
      >
        Seu carrinho
      </h1>

      <div className="mt-8">
        <CartView
          whatsappCheckout={settings.whatsapp_checkout}
          messageTemplate={template}
          storeName={settings.site_name}
        />
      </div>
    </main>
  );
}
