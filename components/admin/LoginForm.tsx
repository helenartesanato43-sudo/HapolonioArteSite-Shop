"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signIn } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Entrando..." : "Entrar"}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(signIn, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-navy">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-clay/30 px-3 py-2 text-sm focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-navy">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-clay/30 px-3 py-2 text-sm focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
        />
      </div>

      {state?.error ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
