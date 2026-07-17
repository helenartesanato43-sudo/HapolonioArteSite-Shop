// Cria (ou atualiza a senha de) o usuário administrador no Supabase Auth.
//
// Como rodar (uma vez só, localmente):
//   node scripts/create-admin-user.mjs
//
// Usa as variáveis de NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY
// do seu .env.local. Você pode sobrescrever o e-mail e a senha padrão
// definindo ADMIN_EMAIL e ADMIN_PASSWORD antes de rodar, por exemplo:
//
//   ADMIN_EMAIL=voce@exemplo.com ADMIN_PASSWORD="SuaSenhaForte123!" node scripts/create-admin-user.mjs

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";

function loadEnvLocal() {
  if (!existsSync(".env.local")) return;
  const content = readFileSync(".env.local", "utf-8");
  for (const line of content.split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim();
    }
  }
}

loadEnvLocal();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@hapolonio.arte";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Hapolonio@2026!Arte";

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Faltam NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY. Confira o .env.local."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data: existing } = await supabase.auth.admin.listUsers();
  const found = existing?.users?.find((u) => u.email === ADMIN_EMAIL);

  if (found) {
    const { error } = await supabase.auth.admin.updateUserById(found.id, {
      password: ADMIN_PASSWORD,
      email_confirm: true,
    });
    if (error) throw error;
    console.log(`Senha atualizada para o usuário existente: ${ADMIN_EMAIL}`);
  } else {
    const { error } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
    });
    if (error) throw error;
    console.log(`Usuário administrador criado: ${ADMIN_EMAIL}`);
  }

  console.log("\nAcesse /admin/login com:");
  console.log(`  E-mail: ${ADMIN_EMAIL}`);
  console.log(`  Senha:  ${ADMIN_PASSWORD}`);
  console.log("\nTroque essa senha depois pelo painel do Supabase (Authentication > Users).");
}

main().catch((error) => {
  console.error("Erro ao criar o usuário administrador:", error.message);
  process.exit(1);
});
