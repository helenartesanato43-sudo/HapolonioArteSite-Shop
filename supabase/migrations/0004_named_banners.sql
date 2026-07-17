-- =========================================================
-- Hapolonio Arte — banners nomeados (desktop + mobile por registro)
-- Ainda em desenvolvimento inicial: recriamos a tabela do zero.
-- =========================================================

drop table if exists public.banners cascade;

create table public.banners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  desktop_image_url text not null,
  mobile_image_url text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index banners_sort_order_idx on public.banners (sort_order);

alter table public.banners enable row level security;

create policy "Banners são públicos para leitura"
  on public.banners for select
  using (true);

create policy "Apenas autenticados podem gerenciar banners"
  on public.banners for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop trigger if exists set_updated_at on public.banners;
create trigger set_updated_at before update on public.banners
  for each row execute function public.set_updated_at();
