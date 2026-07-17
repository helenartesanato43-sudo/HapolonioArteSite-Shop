import Image from "next/image";
import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-card">
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
    </main>
  );
}
