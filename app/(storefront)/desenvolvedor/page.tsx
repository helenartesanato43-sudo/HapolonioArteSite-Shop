import type { Metadata } from "next";
import { Code2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Desenvolvedor",
};

export default function DeveloperPage() {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center md:px-8">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream text-clay">
        <Code2 className="h-6 w-6" aria-hidden="true" />
      </span>
      <h1
        className="mt-6 text-2xl font-bold uppercase tracking-wide md:text-3xl"
        style={{ color: "var(--color-heading)" }}
      >
        ReyZ
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted md:text-base">
        As informações sobre o desenvolvedor deste site serão adicionadas em breve.
      </p>
    </main>
  );
}
