import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-navy px-4 py-10">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Voltar para o site
        </Link>

        <div className="w-full rounded-2xl bg-white p-8 shadow-card">
          <div className="mb-8 flex justify-center">
            <div className="relative h-16 w-40">
              <Image
                src="/logo.png"
                alt="Hapolonio Arte"
                fill
                className="object-contain invert"
              />
            </div>
          </div>

          <h1 className="mb-1 text-center text-lg font-bold uppercase tracking-wide text-navy">
            Painel Administrativo
          </h1>
          <p className="mb-6 text-center text-sm text-muted">
            Entre com sua conta para gerenciar a loja.
          </p>

          <LoginForm />
        </div>
      </div>
    </main>
  );
}
