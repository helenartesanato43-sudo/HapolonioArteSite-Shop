import { getAllTemplates } from "@/lib/data/templates";
import { TemplateEditorCard } from "@/components/admin/TemplateEditorCard";
import { NewTemplateForm } from "@/components/admin/NewTemplateForm";

export default async function AdminWhatsAppMessagePage() {
  const templates = await getAllTemplates();

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold uppercase tracking-wide text-navy">
        Mensagem do WhatsApp
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Esta é a mensagem enviada quando o cliente finaliza a compra pelo
        carrinho. Escreva do seu jeito e use os marcadores{" "}
        <code className="rounded bg-cream px-1.5 py-0.5 text-xs">{"{itens}"}</code>,{" "}
        <code className="rounded bg-cream px-1.5 py-0.5 text-xs">{"{total}"}</code> e{" "}
        <code className="rounded bg-cream px-1.5 py-0.5 text-xs">{"{loja}"}</code>{" "}
        — eles são trocados automaticamente pela lista de produtos, o valor
        total e o nome da sua loja. Você pode manter vários templates
        salvos e escolher qual fica “em uso” a qualquer momento.
      </p>

      <div className="mt-8 space-y-6">
        {templates.map((template) => (
          <TemplateEditorCard key={template.id} template={template} />
        ))}
        <NewTemplateForm />
      </div>
    </div>
  );
}
