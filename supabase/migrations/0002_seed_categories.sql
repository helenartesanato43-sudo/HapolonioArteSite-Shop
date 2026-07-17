-- Seed inicial de categorias (idempotente)
insert into public.categories (name, slug, description)
values
  ('Penduricalhos', 'penduricalhos', 'Penduricalhos de cerâmica moldados à mão, feitos com barro e muito carinho.'),
  ('Canecas', 'canecas', 'Canecas artesanais de cerâmica, únicas e feitas à mão.'),
  ('Móbiles', 'mobiles', 'Móbiles de cerâmica artesanal, delicados e feitos à mão.'),
  ('Miniaturas de Animais', 'miniaturas-de-animais', 'Miniaturas de animais em cerâmica, moldadas à mão com atenção a cada detalhe.')
on conflict (slug) do nothing;
