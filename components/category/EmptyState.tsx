export function EmptyState() {
  return (
    <div
      className="rounded-2xl border border-clay/20 px-6 py-16 text-center"
      style={{ backgroundColor: "var(--color-empty-bg)" }}
    >
      <p className="text-sm font-medium md:text-base" style={{ color: "var(--color-heading)" }}>
        Nenhum produto foi encontrado.
      </p>
    </div>
  );
}
