-- Configurações do carrossel de "produtos semelhantes" na página do produto.
alter table public.site_settings
  add column if not exists similar_products_mobile_count int not null default 2,
  add column if not exists similar_products_desktop_count int not null default 4,
  add column if not exists similar_products_interval_seconds int not null default 5;
