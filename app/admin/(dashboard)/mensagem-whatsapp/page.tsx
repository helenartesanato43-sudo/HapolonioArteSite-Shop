import { MessageCircle, Lightbulb } from "lucide-react";
import { getAllTemplates } from "@/lib/data/templates";
import { TemplateEditorCard } from "@/components/admin/TemplateEditorCard";
import { NewTemplateForm } from "@/components/admin/NewTemplateForm";

export default async function AdminWhatsAppMessagePage() {
  const templates = await getAllTemplates();

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-wide text-navy">
            <MessageCircle className="h-6 w-6 text-clay" aria-hidden="true" />
            Mensagem do WhatsApp
          </h1>
          <p className="mt-1 text-sm text-muted">
            {templates.length} template(s) salvo(s).
          </p>
        </div>
      </div>

      <div className="mt-5 flex gap-3 rounded-2xl bg-cream/50 p-4">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-clay" aria-hidden="true" />
        <p className="text-sm text-muted">
          Esta é a mensagem enviada quando o cliente finaliza a compra pelo
          carrinho. Escreva do seu jeito e use os atalhos{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-xs text-navy">{"{loja}"}</code>,{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-xs text-navy">{"{itens}"}</code> e{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-xs text-navy">{"{total}"}</code>{" "}
          — clique neles (ou nos emojis) para inserir direto no texto. Eles são
          trocados automaticamente pela lista de produtos, o valor total e o
          nome da sua loja. Você pode manter vários templates salvos e
          escolher qual fica &ldquo;em uso&rdquo; a qualquer momento.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {templates.map((template) => (
          <TemplateEditorCard key={template.id} template={template} />
        ))}
        <NewTemplateForm />
      </div>
    </div>
  );
}
