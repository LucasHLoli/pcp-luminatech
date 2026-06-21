// Balanceamento de linha (seção 5 do relatório).
// Processo é uma cadeia linear A->L; estações agrupam tarefas contíguas.

import type { Tarefa } from "./types";

export interface Estacao {
  nome: string; // E1, E2...
  tarefas: string[]; // rótulos das tarefas
  tempo: number; // min
  ociosidade: number; // min (ciclo - tempo)
}

export interface ResultadoBalanceamento {
  tempoCiclo: number; // ciclo alvo usado no agrupamento
  estacoes: Estacao[];
  numEstacoes: number;
  gargalo: number; // maior tempo de estação = ciclo real
  eficiencia: number; // %
  ociosidadeTotal: number; // min
  capacidade: number; // un./mês = tempoDisponivel / gargalo
}

// Agrupa a cadeia linear preenchendo cada estação até o limite do ciclo.
export function balancear(
  tarefas: Tarefa[],
  tempoCiclo: number,
  tempoDisponivel: number
): ResultadoBalanceamento {
  const ordenadas = [...tarefas].sort((a, b) =>
    a.operacao.localeCompare(b.operacao, undefined, { numeric: true })
  );

  const estacoes: Estacao[] = [];
  let atual: Tarefa[] = [];
  let tempoAtual = 0;

  for (const t of ordenadas) {
    if (atual.length > 0 && tempoAtual + t.tempoPadrao > tempoCiclo + 1e-9) {
      estacoes.push(fechar(atual, tempoAtual));
      atual = [];
      tempoAtual = 0;
    }
    atual.push(t);
    tempoAtual += t.tempoPadrao;
  }
  if (atual.length) estacoes.push(fechar(atual, tempoAtual));

  function fechar(grupo: Tarefa[], tempo: number): Estacao {
    return {
      nome: "",
      tarefas: grupo.map((g) => g.tarefa),
      tempo: Math.round(tempo * 10) / 10,
      ociosidade: 0,
    };
  }

  const gargalo = estacoes.reduce((m, e) => Math.max(m, e.tempo), 0);
  estacoes.forEach((e, i) => {
    e.nome = `E${i + 1}`;
    e.ociosidade = Math.round((gargalo - e.tempo) * 10) / 10;
  });

  const tempoTotal = ordenadas.reduce((a, t) => a + t.tempoPadrao, 0);
  const N = estacoes.length;
  const eficiencia = Math.round((tempoTotal / (N * gargalo)) * 1000) / 10;
  const ociosidadeTotal = Math.round((N * gargalo - tempoTotal) * 10) / 10;
  const capacidade = Math.floor(tempoDisponivel / gargalo);

  return {
    tempoCiclo,
    estacoes,
    numEstacoes: N,
    gargalo,
    eficiencia,
    ociosidadeTotal,
    capacidade,
  };
}
