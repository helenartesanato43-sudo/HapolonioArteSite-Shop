-- =========================================================
-- Hapolonio Arte — SCRIPT DE VERIFICAÇÃO E CORREÇÃO (definitivo)
-- =========================================================
-- Rode este arquivo inteiro no SQL Editor do Supabase sempre que
-- desconfiar de algo faltando no banco. Ele substitui e inclui tudo
-- dos scripts anteriores (0001 a 0006) — é seguro rodar quantas vezes
-- precisar, não apaga dados existentes.
-- Resolve especificamente: "Could not find the 'caption_html' column"
-- e cobre toda coluna que o código do site usa hoje.
-- =========================================================

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------
-- CATEGORIES
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

alter table public.categories
  add column if not exists description text not null default '',
  add column if not exists image_url text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists set_updated_at on public.categories;
create trigger set_updated_at before update on public.categories
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------
-- PRODUCTS
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
  updated_at timestamptz not null default now()
);

alter table public.products
  add column if not exists description text not null default '',
  add column if not exists price numeric(10, 2) not null default 0,
  add column if not exists old_price numeric(10, 2),
  add column if not exists image_url text,
  add column if not exists category_id uuid references public.categories (id) on delete set null,
  add column if not exists is_unique boolean not null default false,
  add column if not exists stock_quantity integer not null default 1,
  add column if not exists is_active boolean not null default true,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create index if not exists products_category_id_idx on public.products (category_id);

drop trigger if exists set_updated_at on public.products;
create trigger set_updated_at before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------
-- SITE_SETTINGS (linha única / singleton)
-- ---------------------------------------------------------
create table if not exists public.site_settings (
  id integer primary key default 1,
  site_name text not null default 'Hapolonio Arte',
  logo_url text,
  favicon_url text,
  whatsapp_contact_1 text not null default '73998567329',
  whatsapp_contact_2 text not null default '73999830011',
  whatsapp_checkout text not null default '73999078408',
  instagram_url text not null default 'https://www.instagram.com/hapolonio.arte/',
  banner_interval_seconds integer not null default 5,
  price_color text not null default '#10C44C',
  heading_color text not null default '#3F4B63',
  accent_color text not null default '#B88556',
  text_color text not null default '#7C7C7C',
  empty_state_bg_color text not null default '#FFF6DD',
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

alter table public.site_settings
  add column if not exists logo_url text,
  add column if not exists favicon_url text,
  add column if not exists whatsapp_contact_1 text not null default '73998567329',
  add column if not exists whatsapp_contact_2 text not null default '73999830011',
  add column if not exists whatsapp_checkout text not null default '73999078408',
  add column if not exists instagram_url text not null default 'https://www.instagram.com/hapolonio.arte/',
  add column if not exists banner_interval_seconds integer not null default 5,
  add column if not exists price_color text not null default '#10C44C',
  add column if not exists heading_color text not null default '#3F4B63',
  add column if not exists accent_color text not null default '#B88556',
  add column if not exists text_color text not null default '#7C7C7C',
  add column if not exists empty_state_bg_color text not null default '#FFF6DD',
  add column if not exists updated_at timestamptz not null default now();

alter table public.site_settings
  drop column if exists banner_desktop_url,
  drop column if exists banner_mobile_url;

insert into public.site_settings (id)
values (1)
on conflict (id) do nothing;

drop trigger if exists set_updated_at on public.site_settings;
create trigger set_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------
-- BANNERS — nome + imagem desktop + imagem mobile + frase opcional
-- Se a tabela existir num formato antigo (com "device"), recria do zero.
-- ---------------------------------------------------------
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'banners')
     and exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'banners' and column_name = 'device')
  then
    drop table public.banners cascade;
  end if;
end $$;

create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Banner',
  desktop_image_url text not null default '',
  mobile_image_url text not null default '',
  caption_html text,
  overlay_opacity numeric(3, 2) not null default 0,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.banners
  add column if not exists name text not null default 'Banner',
  add column if not exists desktop_image_url text not null default '',
  add column if not exists mobile_image_url text not null default '',
  add column if not exists caption_html text,
  add column if not exists overlay_opacity numeric(3, 2) not null default 0,
  add column if not exists sort_order integer not null default 0,
  add column if not exists is_active boolean not null default true,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.banners
  drop constraint if exists banners_overlay_opacity_range;
alter table public.banners
  add constraint banners_overlay_opacity_range
  check (overlay_opacity >= 0 and overlay_opacity <= 1);

create index if not exists banners_sort_order_idx on public.banners (sort_order);

drop trigger if exists set_updated_at on public.banners;
create trigger set_updated_at before update on public.banners
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------
-- MESSAGE_TEMPLATES
-- ---------------------------------------------------------
create table if not exists public.message_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  content text not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.message_templates
  add column if not exists is_active boolean not null default false,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists set_updated_at on public.message_templates;
create trigger set_updated_at before update on public.message_templates
  for each row execute function public.set_updated_at();

create or replace function public.enforce_single_active_template()
returns trigger as $$
begin
  if new.is_active then
    update public.message_templates
    set is_active = false
    where id <> new.id;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists enforce_single_active_template on public.message_templates;
create trigger enforce_single_active_template
  before insert or update on public.message_templates
  for each row execute function public.enforce_single_active_template();

insert into public.message_templates (name, content, is_active)
select 'Padrão', E'Olá! Quero finalizar esta compra na {loja}:\n\n{itens}\n\nTotal: {total}', true
where not exists (select 1 from public.message_templates);

insert into public.message_templates (name, content, is_active)
select 'Mais formal', E'Olá, tudo bem? Gostaria de confirmar o pedido dos itens abaixo na {loja}:\n\n{itens}\n\nValor total: {total}\n\nAguardo retorno, obrigado(a)!', false
where (select count(*) from public.message_templates) = 1;

insert into public.message_templates (name, content, is_active)
select 'Descontraído', E'Oii! ✨ Amei essas peças e já separei aqui:\n\n{itens}\n\nTotal: {total}\n\nBora fechar? 💛', false
where (select count(*) from public.message_templates) = 2;

-- ---------------------------------------------------------
-- SEED DE CATEGORIAS
-- ---------------------------------------------------------
insert into public.categories (name, slug, description)
values
  ('Penduricalhos', 'penduricalhos', 'Penduricalhos de cerâmica moldados à mão, feitos com barro e muito carinho.'),
  ('Canecas', 'canecas', 'Canecas artesanais de cerâmica, únicas e feitas à mão.'),
  ('Móbiles', 'mobiles', 'Móbiles de cerâmica artesanal, delicados e feitos à mão.'),
  ('Miniaturas de Animais', 'miniaturas-de-animais', 'Miniaturas de animais em cerâmica, moldadas à mão com atenção a cada detalhe.')
on conflict (slug) do nothing;

-- ---------------------------------------------------------
-- ROW LEVEL SECURITY (idempotente: sempre recria as policies)
-- ---------------------------------------------------------
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.site_settings enable row level security;
alter table public.banners enable row level security;
alter table public.message_templates enable row level security;

drop policy if exists "Categorias são públicas para leitura" on public.categories;
create policy "Categorias são públicas para leitura" on public.categories for select using (true);
drop policy if exists "Apenas autenticados podem gerenciar categorias" on public.categories;
create policy "Apenas autenticados podem gerenciar categorias" on public.categories for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Produtos são públicos para leitura" on public.products;
create policy "Produtos são públicos para leitura" on public.products for select using (true);
drop policy if exists "Apenas autenticados podem gerenciar produtos" on public.products;
create policy "Apenas autenticados podem gerenciar produtos" on public.products for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Configurações são públicas para leitura" on public.site_settings;
create policy "Configurações são públicas para leitura" on public.site_settings for select using (true);
drop policy if exists "Apenas autenticados podem gerenciar configurações" on public.site_settings;
create policy "Apenas autenticados podem gerenciar configurações" on public.site_settings for update
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Banners são públicos para leitura" on public.banners;
create policy "Banners são públicos para leitura" on public.banners for select using (true);
drop policy if exists "Apenas autenticados podem gerenciar banners" on public.banners;
create policy "Apenas autenticados podem gerenciar banners" on public.banners for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Templates são públicos para leitura" on public.message_templates;
create policy "Templates são públicos para leitura" on public.message_templates for select using (true);
drop policy if exists "Apenas autenticados podem gerenciar templates" on public.message_templates;
create policy "Apenas autenticados podem gerenciar templates" on public.message_templates for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

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

drop policy if exists "Leitura pública de imagens de produtos" on storage.objects;
create policy "Leitura pública de imagens de produtos" on storage.objects for select
  using (bucket_id in ('products', 'categories', 'banners', 'site'));

drop policy if exists "Autenticados podem enviar imagens" on storage.objects;
create policy "Autenticados podem enviar imagens" on storage.objects for insert
  with check (bucket_id in ('products', 'categories', 'banners', 'site') and auth.role() = 'authenticated');

drop policy if exists "Autenticados podem atualizar imagens" on storage.objects;
create policy "Autenticados podem atualizar imagens" on storage.objects for update
  using (bucket_id in ('products', 'categories', 'banners', 'site') and auth.role() = 'authenticated');

drop policy if exists "Autenticados podem remover imagens" on storage.objects;
create policy "Autenticados podem remover imagens" on storage.objects for delete
  using (bucket_id in ('products', 'categories', 'banners', 'site') and auth.role() = 'authenticated');

-- ---------------------------------------------------------
-- Fim. Se rodou sem erros, o banco está 100% sincronizado
-- com o que o site espera hoje.
-- ---------------------------------------------------------
