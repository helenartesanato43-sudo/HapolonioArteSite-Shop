import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface AdminPageHeaderAction {
  href: string;
  label: string;
  icon?: LucideIcon;
}

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: AdminPageHeaderAction;
}

export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-wide text-navy">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      </div>

      {action ? (
        <Link
          href={action.href}
          className="inline-flex items-center gap-2 rounded-full bg-clay px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-clay-dark"
        >
          {action.icon ? <action.icon className="h-4 w-4" aria-hidden="true" /> : null}
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
