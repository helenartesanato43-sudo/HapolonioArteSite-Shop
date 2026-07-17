import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente único para leituras públicas (produtos, categorias, configurações,
// banners, templates). Não depende de cookies, então pode ser reutilizado em
// qualquer contexto (Server Components, Route Handlers, o que for) sem forçar
// renderização dinâmica — o que permite ao Next.js cachear essas páginas.
export const publicSupabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: { persistSession: false },
  }
);
