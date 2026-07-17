import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center md:px-8">
      <h1 className="text-3xl font-bold uppercase tracking-wide text-navy">
        Página não encontrada
      </h1>
      <p className="mt-4 max-w-md text-sm text-muted">
        A peça que você procura não está por aqui. Volte para explorar nossas
        peças artesanais.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-clay px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-clay-dark"
      >
        Voltar para a Página Inicial
      </Link>
    </main>
  );
}
