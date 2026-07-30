-- Configurações de exibição dos carrosséis de categorias e de produtos
-- (Peças Artesanais) na página inicial: quantos itens aparecem por vez no
-- celular e no computador, e o intervalo de troca automática.
alter table public.site_settings
  add column if not exists category_carousel_mobile_count int not null default 3,
  add column if not exists category_carousel_desktop_count int not null default 6,
  add column if not exists category_carousel_interval_seconds int not null default 5,
  add column if not exists product_carousel_mobile_count int not null default 2,
  add column if not exists product_carousel_desktop_count int not null default 4,
  add column if not exists product_carousel_interval_seconds int not null default 5;
