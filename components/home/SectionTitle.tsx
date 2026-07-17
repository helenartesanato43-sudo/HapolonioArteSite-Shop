import Link from "next/link";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
}

export function SectionTitle({
  title,
  subtitle,
  href,
  linkLabel = "Ver todos",
}: SectionTitleProps) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <h2
          className="text-xl font-bold uppercase tracking-wide md:text-2xl"
          style={{ color: "var(--color-heading)" }}
        >
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 max-w-xl text-sm" style={{ color: "var(--color-text-muted)" }}>
            {subtitle}
          </p>
        ) : null}
      </div>

      {href ? (
        <Link
          href={href}
          className="whitespace-nowrap text-sm font-medium text-clay transition-colors hover:text-clay-dark"
        >
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}
