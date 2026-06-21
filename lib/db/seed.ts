// Script de seed manual: `npm run db:seed`.
// Útil para popular/restaurar o banco (local ou Turso) com os dados da LUX-01.

import { restaurarPadrao } from "./repo";

async function main() {
  await restaurarPadrao();
  console.log("✓ Banco populado com os dados-semente da LUX-01.");
}

main().catch((e) => {
  console.error("Falha no seed:", e);
  process.exit(1);
});
