"use server";

import { revalidatePath } from "next/cache";
import { salvarSecao, restaurarPadrao, type ConfiguracaoPCP } from "@/lib/db/repo";

const TODAS_ROTAS = [
  "/",
  "/cadastro",
  "/previsao",
  "/plano-mestre",
  "/mrp",
  "/estoques",
  "/balanceamento",
];

function revalidarTudo() {
  for (const r of TODAS_ROTAS) revalidatePath(r);
}

export async function salvar<K extends keyof ConfiguracaoPCP>(
  chave: K,
  valorJson: string
): Promise<void> {
  const valor = JSON.parse(valorJson) as ConfiguracaoPCP[K];
  await salvarSecao(chave, valor);
  revalidarTudo();
}

export async function restaurar(): Promise<void> {
  await restaurarPadrao();
  revalidarTudo();
}
