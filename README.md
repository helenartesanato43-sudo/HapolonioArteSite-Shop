# Hapolonio Arte — Marketplace Artesanal

Site completo em Next.js 15 (App Router) + TypeScript + TailwindCSS + Supabase,
com loja pública e painel administrativo para cadastro de produtos, categorias,
banners e configurações visuais.

## ⚠️ Antes de tudo: segurança das chaves

Você compartilhou a senha do banco e a **service role key** do Supabase
diretamente no chat. A service role key ignora todas as regras de segurança
(RLS) do banco — qualquer pessoa com ela tem acesso total aos dados.

Recomendo fortemente:
1. No painel Supabase → **Project Settings → API**, gere uma nova service
   role key (isso invalida a antiga).
2. No painel Supabase → **Project Settings → Database**, troque a senha do
   Postgres.
3. Nunca cole essas chaves em conversas, commits ou arquivos públicos —
   apenas em `.env.local` (que já está no `.gitignore`).

O projeto já está configurado com as chaves que você enviou em `.env.local`
para você conseguir rodar agora, mas troque-as assim que possível.

## 1. Configurar o Supabase

1. Abra o **SQL Editor** do seu projeto Supabase.
2. Se este é o primeiro setup, rode nesta ordem: `0001_init.sql`,
   `0002_seed_categories.sql`, `0003_banners_templates.sql`,
   `0004_named_banners.sql`.
3. **Rode também `0005_schema_repair.sql`** — é o mais importante. Ele
   verifica tudo que o site pode pedir ao banco (todas as colunas de
   `categories`, `products`, `site_settings`, `banners` e
   `message_templates`) e cria o que estiver faltando, sem apagar dados
   existentes. É seguro rodar mais de uma vez, e cobre o caso de migrations
   antigas terem sido puladas ou aplicadas fora de ordem.
4. **Rode `0006_banner_caption.sql`** — adiciona a frase opcional e a
   opacidade do banner.
5. Crie o usuário administrador rodando, na raiz do projeto:

   ```bash
   npm install
   node scripts/create-admin-user.mjs
   ```

   - **E-mail:** `admin@hapolonio.arte`
   - **Senha:** `Hapolonio@2026!Arte`

   Troque a senha depois pelo painel do Supabase (Authentication → Users).

> Daqui para frente, sempre que eu adicionar ou mudar campos no banco, vou
> gerar um novo arquivo de migration numerado — só rodar o mais recente no
> SQL Editor resolve.

## 2. Rodar o projeto

```bash
npm run dev
```

O botão **"Painel administrativo"** no rodapé leva para `/admin/login`.

## 2.1 Colocar no ar (produção)

Veja **[DEPLOY.md](./DEPLOY.md)** para o passo a passo completo: subir o
código no GitHub, publicar no Coolify via Docker Compose, e apontar o
domínio `hapolonioarte.shop` (Hostinger → Cloudflare → sua VM). Use o
`.env.example` como referência das variáveis necessárias.

## Novidades desta rodada

- **Barra superior menor**: reduzida a praticamente metade da altura
  anterior (logo e espaçamento menores).
- **Frase opcional nos banners**: no cadastro de banner, agora dá para
  escrever uma frase (fonte Montserrat) com negrito, itálico e tamanho da
  fonte, igual ao editor da descrição do produto. Se usar frase, aparece
  também um controle de opacidade do preto por trás do texto, pra manter a
  legibilidade sobre a foto. É tudo opcional — sem frase, o banner continua
  só a imagem.
- **Botão "Ver Carrinho"**: agora é um botão com borda marrom (cor de
  destaque do site), mais evidente do que o link discreto de antes.
- **Deploy**: adicionei `Dockerfile`, `docker-compose.yaml`, `.dockerignore`
  e `.env.example`, e um guia completo em `DEPLOY.md` (GitHub → Coolify →
  domínio `hapolonioarte.shop` via Hostinger/Cloudflare). Não tenho acesso
  à internet aqui, então não consigo criar o repositório ou fazer o push
  por você — o `DEPLOY.md` tem os comandos exatos de `git` pra rodar na sua
  máquina.

- **Painel administrativo sem a barra do site**: era um bug de estrutura —
  o cabeçalho e o carrinho da loja apareciam em cima do painel porque tudo
  ficava dentro do mesmo layout raiz. Separei a loja (`(storefront)`) do
  admin em layouts diferentes; agora o admin mostra só a barra lateral
  cinza, com a logo (a mesma configurada em Configurações) e "Painel
  Administrativo" em destaque abaixo dela.
- **Ícones de categoria maiores** na home, se destacando mais.
- **"Estoque baixo"** removido da Visão Geral (já não aparecia mais desde a
  rodada anterior).
- **Descrição do produto com editor de texto**: negrito, itálico e tamanho
  da fonte, direto no cadastro do produto.
- **"Produtos semelhantes"**: já aparecia no fim da página do produto,
  puxando outros produtos da mesma categoria — confirmado e mantido.
- **Banners reformulados**: agora funcionam como o cadastro de produtos —
  uma lista com nome, e cada banner tem as duas imagens (computador e
  celular) no mesmo cadastro, com a proporção recomendada indicada em cada
  campo (21:8 para computador, 4:5 para celular).
- **Mensagem do WhatsApp** virou uma seção própria no menu lateral,
  separada de Configurações, com prévia ao vivo da mensagem usando dados de
  exemplo.
- **Aparência reorganizada**: cada cor agora é um card com uma prévia maior
  e mais clara de onde ela aparece no site, em vez de uma lista apertada.

> ⚠️ Este round trouxe mudança de schema: rode
> `supabase/migrations/0004_named_banners.sql` no SQL Editor do Supabase
> antes de testar os banners (ele recria a tabela `banners` do zero — sem
> problema, ainda estamos no início).




## 3. Variáveis de ambiente

Já preenchidas em `.env.local` a partir do que você enviou:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (não usada no código atual, mas disponível caso
  precise de rotinas administrativas via API routes no futuro)
- `DATABASE_URL` / `DIRECT_URL` (apenas se for rodar migrations via CLI/psql)

## Estrutura

```
app/
  page.tsx                       Home (banner, destaques, seção "arte moldada à mão")
  categoria/[slug]/page.tsx      Página de categoria (grid ou estado vazio)
  produto/[slug]/page.tsx        Página do produto (quantidade, peça única, adicionar ao carrinho)
  carrinho/page.tsx              Carrinho → finaliza pelo WhatsApp
  admin/
    login/page.tsx               Login do admin (Supabase Auth)
    (dashboard)/                 Área logada (protegida pelo middleware)
      page.tsx                    Visão geral
      produtos/                   CRUD de produtos (com upload de imagem)
      categorias/                 CRUD de categorias
      banners/                    Upload dos banners desktop/mobile
      configuracoes/              Nome do site, WhatsApp, Instagram
      aparencia/                  Cores do site (preço, títulos, header/rodapé...)
components/
  layout/                        Header, Navbar, Footer, Breadcrumb, CategoryLayout, BackToTop, CartIcon
  home/                          Hero, SectionTitle, CraftedSection
  product/                       ProductCard, ProductGrid, DiscountBadge, AddToCartControls, CartView
  category/                      EmptyState
  admin/                         Sidebar, formulários (Product/Category/Banner/Settings/Theme), ImageUploader
lib/
  supabase/                      Clientes browser/server + middleware de sessão
  data/                          Leitura de dados (categorias, produtos, configurações)
  actions/                       Server Actions de escrita (auth, produtos, categorias, configurações)
  cart-context.tsx               Carrinho (localStorage), com regra de peça única
supabase/migrations/             SQL do schema, RLS e buckets de storage
```

## Como funciona cada parte do que você pediu

- **Logo**: `public/logo.png` (o arquivo que você enviou) é usado como
  fallback; o admin também pode trocar a logo salvando uma nova imagem em
  `site_settings.logo_url` (edite via SQL ou, se quiser, posso adicionar um
  campo de upload de logo em Configurações).
- **Peça única**: ao marcar "peça única" no cadastro do produto, o estoque
  fica travado em 1 e o botão "Adicionar ao carrinho" some assim que a peça é
  vendida ou já está no carrinho de alguém.
- **Checkout via WhatsApp**: no carrinho, "Finalizar compra" monta uma
  mensagem com todos os produtos, quantidades e o total, e redireciona para
  `wa.me/55<73999078408>` com a mensagem pronta.
- **Banners**: dois campos obrigatórios em `/admin/banners`, um para desktop
  e um para mobile — a Home escolhe automaticamente qual mostrar conforme a
  tela do visitante.
- **Cores**: em `/admin/aparencia` você edita a cor dos preços, dos títulos,
  do header/rodapé, do texto secundário e do fundo do "nenhum produto
  encontrado" — tudo aplicado via variáveis CSS globais, sem precisar mexer
  em código.

## Observações

- Imagens de produto/categoria/banner são enviadas direto do dispositivo para
  o Supabase Storage (buckets públicos, só admin autenticado pode enviar).
- Não há checkout automatizado (pagamento online) — o fluxo é exatamente o
  que você pediu: o cliente monta o carrinho no site e finaliza a negociação
  direto com você pelo WhatsApp.
