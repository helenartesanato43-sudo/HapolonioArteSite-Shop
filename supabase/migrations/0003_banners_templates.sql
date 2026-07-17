-- =========================================================
-- Hapolonio Arte — banners múltiplos, templates de mensagem
-- e novos campos de configuração
-- =========================================================

alter table public.site_settings
  add column if not exists favicon_url text,
  add column if not exists banner_interval_seconds integer not null default 5;

alter table public.site_settings
  drop column if exists banner_desktop_url,
  drop column if exists banner_mobile_url;

-- ---------------------------------------------------------
-- BANNERS (múltiplos, por dispositivo, com ordem)
-- ---------------------------------------------------------
create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  device text not null check (device in ('desktop', 'mobile')),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists banners_device_idx on public.banners (device, sort_order);

alter table public.banners enable row level security;

create policy "Banners são públicos para leitura"
  on public.banners for select
  using (true);

create policy "Apenas autenticados podem gerenciar banners"
  on public.banners for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------
-- TEMPLATES DE MENSAGEM DO WHATSAPP
-- Placeholders suportados: {itens} {total} {loja}
-- ---------------------------------------------------------
create table if not exists public.message_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  content text not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.message_templates enable row level security;

create policy "Templates são públicos para leitura"
  on public.message_templates for select
  using (true);

create policy "Apenas autenticados podem gerenciar templates"
  on public.message_templates for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop trigger if exists set_updated_at on public.message_templates;
create trigger set_updated_at before update on public.message_templates
  for each row execute function public.set_updated_at();

-- Garante que só exista 1 template ativo por vez
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
values
  (
    'Padrão',
    E'Olá! Quero finalizar esta compra na {loja}:\n\n{itens}\n\nTotal: {total}',
    true
  ),
  (
    'Mais formal',
    E'Olá, tudo bem? Gostaria de confirmar o pedido dos itens abaixo na {loja}:\n\n{itens}\n\nValor total: {total}\n\nAguardo retorno, obrigado(a)!',
    false
  ),
  (
    'Descontraído',
    E'Oii! ✨ Amei essas peças e já separei aqui:\n\n{itens}\n\nTotal: {total}\n\nBora fechar? 💛',
    false
  )
on conflict do nothing;
