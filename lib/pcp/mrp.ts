// Planejamento das Necessidades de Materiais — MRP (seção 7 do relatório).
// Todos os componentes estão no nível 1 (filhos diretos do PA01). Lote a lote.

import type { Componente } from "./types";
import type { LinhaPMP } from "./mps";

export interface LinhaMRPMes {
  mes: number;
  necessidadeBruta: number;
  estoqueDisponivel: number;
  necessidadeLiquida: number;
  recebimentoPlanejado: number;
  liberacaoPlanejada: number; // alocada no mês (t - leadTime)
}

export interface RegistroMRP {
  codigo: string;
  nome: string;
  leadTime: number;
  qtdPorUnidade: number;
  estoqueInicial: number;
  critico: boolean;
  linhas: LinhaMRPMes[]; // por mês do horizonte
  // liberações deslocadas (mês -> quantidade), inclui meses anteriores ao horizonte
  liberacoes: { mes: number; quantidade: number }[];
}

// Gera o registro MRP de cada componente a partir do PMP.
export function calcularMRP(
  componentes: Componente[],
  pmp: LinhaPMP[]
): RegistroMRP[] {
  const meses = pmp.map((l) => l.mes);

  return componentes.map((c) => {
    let disponivel = c.estoqueInicial;
    const linhas: LinhaMRPMes[] = [];
    const liberacoes: { mes: number; quantidade: number }[] = [];

    for (const l of pmp) {
      const nb = l.producaoPlanejada * c.qtdPorUnidade;
      const usaEstoque = Math.min(disponivel, nb);
      const nl = Math.max(0, nb - disponivel);
      disponivel = Math.max(0, disponivel - nb);
      const recebimento = nl; // lote a lote
      linhas.push({
        mes: l.mes,
        necessidadeBruta: nb,
        estoqueDisponivel: usaEstoque,
        necessidadeLiquida: nl,
        recebimentoPlanejado: recebimento,
        liberacaoPlanejada: 0, // preenchido abaixo
      });
      if (recebimento > 0) {
        liberacoes.push({ mes: l.mes - c.leadTime, quantidade: recebimento });
      }
    }

    // Marca a liberação dentro do horizonte quando o mês deslocado existe nele.
    for (const lib of liberacoes) {
      const idx = linhas.findIndex((x) => x.mes === lib.mes);
      if (idx >= 0) linhas[idx].liberacaoPlanejada = lib.quantidade;
    }

    const critico = c.leadTime >= 2;
    return {
      codigo: c.codigo,
      nome: c.nome,
      leadTime: c.leadTime,
      qtdPorUnidade: c.qtdPorUnidade,
      estoqueInicial: c.estoqueInicial,
      critico,
      linhas,
      liberacoes: liberacoes.sort((a, b) => a.mes - b.mes),
    };
  });
}
