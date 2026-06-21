// Calibração do ciclo com a demanda (seção 4 do relatório).

import type { Tarefa } from "./types";

export interface CenarioCiclo {
  cenario: string;
  demanda: number;
  tempoDisponivel: number;
  tempoCicloRequerido: number; // min/un.
}

export interface ResultadoCapacidade {
  tempoDisponivel: number; // min/mês
  tempoTotalTrabalho: number; // Σ tempos padrão
  maiorTarefa: number; // min
  capacidadeMaxima: number; // un./mês no limite da maior tarefa
  cenarios: CenarioCiclo[];
}

export function calcularCapacidade(
  tarefas: Tarefa[],
  params: { horasTurno: number; diasUteis: number },
  demandasCenarios: { cenario: string; demanda: number }[]
): ResultadoCapacidade {
  const tempoDisponivel = params.horasTurno * 60 * params.diasUteis;
  const tempoTotalTrabalho = tarefas.reduce((a, t) => a + t.tempoPadrao, 0);
  const maiorTarefa = tarefas.reduce((m, t) => Math.max(m, t.tempoPadrao), 0);
  const capacidadeMaxima = Math.floor(tempoDisponivel / maiorTarefa);

  const cenarios: CenarioCiclo[] = demandasCenarios.map((c) => ({
    cenario: c.cenario,
    demanda: c.demanda,
    tempoDisponivel,
    tempoCicloRequerido: Math.round((tempoDisponivel / c.demanda) * 100) / 100,
  }));

  return {
    tempoDisponivel,
    tempoTotalTrabalho: Math.round(tempoTotalTrabalho * 10) / 10,
    maiorTarefa,
    capacidadeMaxima,
    cenarios,
  };
}
