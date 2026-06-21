// Repositório de configuração do PCP. Armazena cada seção como JSON numa
// tabela key-value no Turso. Auto-cria o schema e faz seed na primeira carga.

import { getClient } from "./client";
import type {
  Componente,
  DemandaMes,
  ExecucaoMes,
  ParametrosGerais,
  PlanoMestreMes,
  Produto,
  Tarefa,
} from "../pcp/types";
import {
  CENARIOS,
  COMPONENTES,
  DEMANDA,
  EXECUCAO,
  PARAMETROS,
  PLANO_MESTRE,
  PRODUTO,
  TAREFAS,
} from "./seed-data";

export interface ConfiguracaoPCP {
  produto: Produto;
  componentes: Componente[];
  tarefas: Tarefa[];
  demanda: DemandaMes[];
  planoMestre: PlanoMestreMes[];
  parametros: ParametrosGerais;
  cenarios: { cenario: string; demanda: number }[];
  execucao: ExecucaoMes[];
}

const PADRAO: ConfiguracaoPCP = {
  produto: PRODUTO,
  componentes: COMPONENTES,
  tarefas: TAREFAS,
  demanda: DEMANDA,
  planoMestre: PLANO_MESTRE,
  parametros: PARAMETROS,
  cenarios: CENARIOS,
  execucao: EXECUCAO,
};

let inicializado = false;

async function garantirSchema() {
  if (inicializado) return;
  const db = getClient();
  await db.execute(
    `CREATE TABLE IF NOT EXISTS config (chave TEXT PRIMARY KEY, valor TEXT NOT NULL)`
  );
  // Seed das chaves ausentes (não sobrescreve edições já feitas).
  for (const [chave, valor] of Object.entries(PADRAO)) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO config (chave, valor) VALUES (?, ?)`,
      args: [chave, JSON.stringify(valor)],
    });
  }
  inicializado = true;
}

export async function lerConfig(): Promise<ConfiguracaoPCP> {
  await garantirSchema();
  const db = getClient();
  const res = await db.execute(`SELECT chave, valor FROM config`);
  const out: Record<string, unknown> = { ...PADRAO };
  for (const row of res.rows) {
    const chave = row.chave as string;
    try {
      out[chave] = JSON.parse(row.valor as string);
    } catch {
      // mantém o padrão se o JSON estiver corrompido
    }
  }
  return out as unknown as ConfiguracaoPCP;
}

export async function salvarSecao<K extends keyof ConfiguracaoPCP>(
  chave: K,
  valor: ConfiguracaoPCP[K]
): Promise<void> {
  await garantirSchema();
  const db = getClient();
  await db.execute({
    sql: `INSERT INTO config (chave, valor) VALUES (?, ?)
          ON CONFLICT(chave) DO UPDATE SET valor = excluded.valor`,
    args: [chave as string, JSON.stringify(valor)],
  });
}

// Restaura todas as seções para os valores-semente da LUX-01.
export async function restaurarPadrao(): Promise<void> {
  await garantirSchema();
  const db = getClient();
  for (const [chave, valor] of Object.entries(PADRAO)) {
    await db.execute({
      sql: `INSERT INTO config (chave, valor) VALUES (?, ?)
            ON CONFLICT(chave) DO UPDATE SET valor = excluded.valor`,
      args: [chave, JSON.stringify(valor)],
    });
  }
}
