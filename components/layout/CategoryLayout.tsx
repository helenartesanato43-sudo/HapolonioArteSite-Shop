import { ReactNode } from "react";
import { Breadcrumb } from "./Breadcrumb";

interface CategoryLayoutProps {
  title: string;
  children: ReactNode;
}

export function CategoryLayout({ title, children }: CategoryLayoutProps) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <Breadcrumb currentLabel={title} />

      <h1
        className="mt-4 text-2xl font-bold uppercase tracking-wide md:text-3xl"
        style={{ color: "var(--color-heading)" }}
      >
        {title}
      </h1>

      <div className="mt-10">{children}</div>
    </main>
  );
}
