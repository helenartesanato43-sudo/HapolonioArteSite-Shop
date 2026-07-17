-- =========================================================
-- Hapolonio Arte — frase opcional e opacidade do banner
-- =========================================================

alter table public.banners
  add column if not exists caption_html text,
  add column if not exists overlay_opacity numeric(3, 2) not null default 0;

alter table public.banners
  drop constraint if exists banners_overlay_opacity_range;

alter table public.banners
  add constraint banners_overlay_opacity_range
  check (overlay_opacity >= 0 and overlay_opacity <= 1);
