import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { getAllProductsForAdmin } from "@/lib/data/products";
import { formatCurrency } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { deleteProduct } from "@/lib/actions/products";

export default async function AdminProductsPage() {
  const products = await getAllProductsForAdmin();

  return (
    <div>
      <AdminPageHeader
        title="Produtos"
        description={`${products.length} produto(s) cadastrado(s).`}
        action={{ href: "/admin/produtos/novo", label: "Novo produto", icon: Plus }}
      />

      {/* ---- Mobile: cards compactos ---- */}
      <div className="mt-6 space-y-3 md:hidden">
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-card">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-cream">
              {product.image_url ? (
                <Image src={product.image_url} alt={product.name} fill className="object-cover" />
              ) : null}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-navy">{product.name}</p>
              <p className="mt-0.5 truncate text-xs text-muted">
                {product.category?.name ?? "Sem categoria"}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-pix">{formatCurrency(product.price)}</span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    product.is_active ? "bg-pix/10 text-pix" : "bg-navy/10 text-navy/70"
                  }`}
                >
                  {product.is_active ? "Visível" : "Oculto"}
                </span>
                <span className="text-[10px] text-muted">
                  {product.is_unique
                    ? product.stock_quantity > 0
                      ? "Peça única"
                      : "Vendida"
                    : `${product.stock_quantity} un.`}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2">
              <Link
                href={`/admin/produtos/${product.id}`}
                className="text-xs font-medium text-clay hover:text-clay-dark"
              >
                Editar
              </Link>
              <DeleteButton
                action={deleteProduct.bind(null, product.id)}
                confirmMessage={`Remover "${product.name}"?`}
              />
            </div>
          </div>
        ))}

        {products.length === 0 ? (
          <p className="rounded-xl bg-white p-6 text-center text-sm text-muted shadow-card">
            Nenhum produto cadastrado ainda.
          </p>
        ) : null}
      </div>

      {/* ---- Desktop: tabela ---- */}
      <div className="mt-8 hidden overflow-hidden rounded-2xl bg-white shadow-card md:block">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-cream/60 text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-5 py-3">Produto</th>
              <th className="px-5 py-3">Categoria</th>
              <th className="px-5 py-3">Preço</th>
              <th className="px-5 py-3">Estoque</th>
              <th className="px-5 py-3">Visibilidade</th>
              <th className="px-5 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-clay/10">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="flex items-center gap-3 px-5 py-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cream">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <span className="font-medium text-navy">{product.name}</span>
                </td>
                <td className="px-5 py-3 text-muted">
                  {product.category?.name ?? "—"}
                </td>
                <td className="px-5 py-3 font-medium text-navy">
                  {formatCurrency(product.price)}
                </td>
                <td className="px-5 py-3 text-muted">
                  {product.is_unique
                    ? product.stock_quantity > 0
                      ? "Peça única disponível"
                      : "Peça única vendida"
                    : `${product.stock_quantity} un.`}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                      product.is_active
                        ? "bg-pix/10 text-pix"
                        : "bg-navy/10 text-navy/70"
                    }`}
                  >
                    {product.is_active ? "Visível" : "Oculto"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/produtos/${product.id}`}
                      className="text-xs font-medium text-clay hover:text-clay-dark"
                    >
                      Editar
                    </Link>
                    <DeleteButton
                      action={deleteProduct.bind(null, product.id)}
                      confirmMessage={`Remover "${product.name}"?`}
                    />
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-muted">
                  Nenhum produto cadastrado ainda.
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
