import Link from "next/link";

interface BreadcrumbProps {
  currentLabel: string;
}

export function Breadcrumb({ currentLabel }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs md:text-sm" style={{ color: "var(--color-text-muted)" }}>
      <ol className="flex items-center gap-2">
        <li>
          <Link href="/" className="transition-colors hover:opacity-70">
            Página Inicial
          </Link>
        </li>
        <li aria-hidden="true">&gt;</li>
        <li aria-current="page" style={{ color: "var(--color-heading)" }}>
          {currentLabel}
        </li>
      </ol>
    </nav>
  );
}
