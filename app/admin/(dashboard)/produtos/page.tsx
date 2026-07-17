import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { getAllProductsForAdmin } from "@/lib/data/products";
import { formatCurrency } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteProduct } from "@/lib/actions/products";

export default async function AdminProductsPage() {
  const products = await getAllProductsForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wide text-navy">
            Produtos
          </h1>
          <p className="mt-1 text-sm text-muted">
            {products.length} produto(s) cadastrado(s).
          </p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="inline-flex items-center gap-2 rounded-full bg-clay px-5 py-2.5 text-sm font-medium text-white hover:bg-clay-dark"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Novo produto
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-card">
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
