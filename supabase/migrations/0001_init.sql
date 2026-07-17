-- =========================================================
-- Hapolonio Arte — schema inicial do Supabase
-- Rode este arquivo no SQL Editor do painel Supabase
-- (ou via `supabase db push` / psql usando DIRECT_URL)
-- =========================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------
-- CATEGORIAS
-- ---------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- PRODUTOS
-- ---------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  price numeric(10, 2) not null default 0,
  old_price numeric(10, 2),
  image_url text,
  category_id uuid references public.categories (id) on delete set null,
  is_unique boolean not null default false,
  stock_quantity integer not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint stock_quantity_non_negative check (stock_quantity >= 0),
  constraint unique_piece_stock check (
    (is_unique = true and stock_quantity <= 1) or (is_unique = false)
  )
);

create index if not exists products_category_id_idx on public.products (category_id);

-- ---------------------------------------------------------
-- CONFIGURAÇÕES DO SITE (linha única / singleton)
-- ---------------------------------------------------------
create table if not exists public.site_settings (
  id integer primary key default 1,
  site_name text not null default 'Hapolonio Arte',
  logo_url text,
  whatsapp_contact_1 text not null default '73998567329',
  whatsapp_contact_2 text not null default '73999830011',
  whatsapp_checkout text not null default '73999078408',
  instagram_url text not null default 'https://www.instagram.com/hapolonio.arte/',
  banner_desktop_url text,
  banner_mobile_url text,
  price_color text not null default '#10C44C',
  heading_color text not null default '#3F4B63',
  accent_color text not null default '#B88556',
  text_color text not null default '#7C7C7C',
  empty_state_bg_color text not null default '#FFF6DD',
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

insert into public.site_settings (id)
values (1)
on conflict (id) do nothing;

-- ---------------------------------------------------------
-- TRIGGERS: updated_at automático
-- ---------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.categories;
create trigger set_updated_at before update on public.categories
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.products;
create trigger set_updated_at before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.site_settings;
create trigger set_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------
-- ROW LEVEL SECURITY
-- Leitura pública (a loja é um site aberto).
-- Escrita apenas para usuários autenticados (admin logado via Supabase Auth).
-- ---------------------------------------------------------
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.site_settings enable row level security;

create policy "Categorias são públicas para leitura"
  on public.categories for select
  using (true);

create policy "Apenas autenticados podem gerenciar categorias"
  on public.categories for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Produtos são públicos para leitura"
  on public.products for select
  using (true);

create policy "Apenas autenticados podem gerenciar produtos"
  on public.products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Configurações são públicas para leitura"
  on public.site_settings for select
  using (true);

create policy "Apenas autenticados podem gerenciar configurações"
  on public.site_settings for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------
-- STORAGE: buckets públicos para imagens
-- ---------------------------------------------------------
insert into storage.buckets (id, name, public)
values
  ('products', 'products', true),
  ('categories', 'categories', true),
  ('banners', 'banners', true),
  ('site', 'site', true)
on conflict (id) do nothing;

create policy "Leitura pública de imagens de produtos"
  on storage.objects for select
  using (bucket_id in ('products', 'categories', 'banners', 'site'));

create policy "Autenticados podem enviar imagens"
  on storage.objects for insert
  with check (
    bucket_id in ('products', 'categories', 'banners', 'site')
    and auth.role() = 'authenticated'
  );

create policy "Autenticados podem atualizar imagens"
  on storage.objects for update
  using (
    bucket_id in ('products', 'categories', 'banners', 'site')
    and auth.role() = 'authenticated'
  );

create policy "Autenticados podem remover imagens"
  on storage.objects for delete
  using (
    bucket_id in ('products', 'categories', 'banners', 'site')
    and auth.role() = 'authenticated'
  );
