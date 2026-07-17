# Deploy — GitHub + Coolify (Nixpacks) + hapolonioarte.shop

Este guia cobre três partes: subir o código no GitHub, publicar no Coolify
usando **Nixpacks** (mais simples que Docker Compose, sem precisar mexer em
Dockerfile), e apontar o domínio `hapolonioarte.shop` (Hostinger + DNS na
Cloudflare) para a sua VM.

---

## 1. Subir o projeto no GitHub

Eu não tenho acesso à internet neste ambiente, então não consigo criar o
repositório nem rodar o `git push` por você — mas o projeto já está pronto
para isso. Rode na sua máquina, dentro da pasta do projeto:

```bash
# 1. Crie um repositório vazio no GitHub (github.com/new), sem README/licença

# 2. Dentro da pasta do projeto, gere o package-lock.json (eu não consigo
#    gerar esse arquivo aqui por não ter acesso à internet neste ambiente,
#    mas ele precisa existir e ser commitado para os builds funcionarem):
npm install

# 3. Suba tudo, incluindo o package-lock.json:
git init
git add .
git commit -m "Hapolonio Arte — versão inicial"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/hapolonio-arte.git
git push -u origin main
```

O `.gitignore` já impede que `.env.local` (com suas chaves) suba para o
GitHub — só o `.env.example` (sem valores reais) vai junto.

Sempre que eu fizer mudanças novas, você repete:
```bash
git add .
git commit -m "descrição da mudança"
git push
```

---

## 2. Publicar no Coolify (Nixpacks)

1. No painel do Coolify, vá em **Projects → seu projeto → + New Resource**.
2. Escolha **Application** (não "Docker Compose").
3. Em **Source**, conecte o repositório do GitHub que você criou (Coolify
   pede pra instalar o GitHub App na primeira vez — autorize só o
   repositório `hapolonio-arte`).
4. Branch: `main`.
5. Em **Build Pack**, confirme que está **Nixpacks** (é o padrão pra
   projetos Node/Next.js).
6. Preencha os campos de build exatamente assim:

   | Campo | Valor |
   |---|---|
   | **Base Directory** | `/` |
   | **Install Command** | `npm install --legacy-peer-deps` |
   | **Build Command** | `npm run build` |
   | **Start Command** | `npm run start` |
   | **Port** (Ports Exposes) | `3000` |

   O `--legacy-peer-deps` é necessário porque o projeto usa React 19 e
   alguns pacotes ainda declaram só React 18 em `peerDependencies` — sem
   essa flag o `npm install` quebra com erro `ERESOLVE`.

7. Em **Environment Variables**, adicione (sem aspas):

   | Nome | Valor | Build time | Runtime |
   |---|---|---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://nxgtwtbuiomnljyurkbx.supabase.co` | ✅ | ✅ |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | sua anon key do Supabase | ✅ | ✅ |

   Não precisa cadastrar `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL` nem
   `DIRECT_URL` — nenhuma delas é lida pelo app em produção (só por scripts
   que você roda localmente).

8. Em **Domains**, adicione `https://hapolonioarte.shop` (e
   `https://www.hapolonioarte.shop` se quiser o www também).
9. Clique em **Deploy** e acompanhe o log.

### Atualizações futuras
Com o repositório conectado, cada `git push` para `main` pode disparar um
novo deploy automático (ative em **Settings → Automatic Deployment**), ou
você clica em **Redeploy** manualmente.

---

## 3. Domínio: Hostinger → Cloudflare → sua VM

### 3.1 Apontar a Hostinger para a Cloudflare
1. No painel da Cloudflare, **Add a Site** → digite `hapolonioarte.shop`.
2. A Cloudflare vai te dar 2 nameservers (algo como `ana.ns.cloudflare.com`
   e `bob.ns.cloudflare.com`).
3. No painel da Hostinger, vá em **Domínios → hapolonioarte.shop → DNS /
   Nameservers** e troque os nameservers para os que a Cloudflare deu.
4. A propagação pode levar de alguns minutos até 24h.

### 3.2 Criar o registro DNS apontando para a VM
Na Cloudflare, aba **DNS**, adicione:

| Tipo | Nome | Conteúdo | Proxy |
|---|---|---|---|
| A | `@` | IP público da sua VM | Proxied (ou DNS only, veja abaixo) |
| A | `www` | IP público da sua VM | Proxied |

**Sobre o proxy da Cloudflare (nuvem laranja):**
- Se deixar **Proxied**, a Cloudflare fica na frente (esconde o IP da VM,
  cacheia e protege). Nesse caso, configure o SSL/TLS da Cloudflare como
  **Full (strict)** (aba SSL/TLS) — isso exige que o Coolify tenha um
  certificado válido também (ele gera automaticamente via Let's Encrypt).
- Se preferir mais simples no começo, deixe **DNS only** (nuvem cinza) até
  confirmar que o site está no ar, e ative o proxy depois.

### 3.3 Configurar o Coolify para o domínio
1. Confirme que as portas 80 e 443 da VM estão liberadas no firewall
   (grupo de segurança da nuvem onde a VM está hospedada).
2. No recurso do Coolify, em **Domains**, garanta que está
   `https://hapolonioarte.shop`. O Coolify usa o Traefik internamente e
   emite certificado Let's Encrypt automático assim que o DNS resolver para
   a VM.
3. Espere o DNS propagar (`dig hapolonioarte.shop` deve devolver o IP da
   VM) e acesse `https://hapolonioarte.shop` — o certificado deve aparecer
   válido em alguns minutos.

---

## 4. Depois do primeiro deploy

- Rode as migrations do Supabase (pasta `supabase/migrations`, na ordem dos
  números, terminando sempre no arquivo mais recente) no SQL Editor do
  Supabase, se ainda não rodou.
- Crie o usuário administrador com `node scripts/create-admin-user.mjs`
  (rode isso na sua máquina local, apontando para o mesmo Supabase).
- Acesse `https://hapolonioarte.shop/admin/login` para confirmar que o
  painel está funcionando.

---

## Problemas comuns

- **`ERESOLVE` / conflito de dependências no `npm install`**: confirme que
  o **Install Command** está como `npm install --legacy-peer-deps`
  (passo 2.6 acima) — sem essa flag, o React 19 conflita com o
  `peerDependencies` de algum pacote.
- **Build falha por falta de variável de ambiente**: confirme que
  `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão
  marcadas como "Build time" no Coolify — o Next.js precisa delas durante o
  `npm run build`, não só em runtime.
- **Imagens do Supabase Storage não aparecem**: o `next.config.js` já lê o
  hostname a partir de `NEXT_PUBLIC_SUPABASE_URL` automaticamente, então
  isso só acontece se essa variável estiver errada ou ausente no build.
- **Certificado SSL não emite**: geralmente é DNS ainda propagando, ou
  porta 80/443 bloqueada no firewall da VM — o Let's Encrypt precisa
  acessar a porta 80 para validar o domínio.

---

## Alternativa: Docker Compose

O projeto também tem `Dockerfile` e `docker-compose.yaml` prontos, caso
prefira Docker Compose no futuro (build multi-stage, imagem enxuta, usuário
não-root). Para usar: escolha **Docker Compose** como tipo de recurso no
Coolify em vez de Application, aponte pro `docker-compose.yaml` na raiz, e
cadastre as mesmas variáveis de ambiente da tabela acima. Mas, como você já
viu, o caminho com Nixpacks (seção 2) é mais direto — fique com ele a menos
que tenha um motivo específico para trocar.
