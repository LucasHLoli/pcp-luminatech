// Plano Mestre de Produção (seção 6 do relatório).
// P_t = D_t + EF_t - EI_t ; o EF de um mês vira o EI do mês seguinte.

import type { PlanoMestreMes } from "./types";

export interface LinhaPMP {
  mes: number;
  demanda: number;
  estoqueInicial: number;
  estoqueFinalDesejado: number;
  producaoPlanejada: number;
}

export interface VerificacaoCapacidade {
  mes: number;
  producaoPlanejada: number;
  capacidade: number;
  utilizacao: number; // %
  viavel: boolean;
}

export function calcularPMP(meses: PlanoMestreMes[]): LinhaPMP[] {
  const ordenados = [...meses].sort((a, b) => a.mes - b.mes);
  const linhas: LinhaPMP[] = [];
  let estoqueInicialEncadeado: number | null = null;

  for (const m of ordenados) {
    // Encadeia: EI do mês = EF desejado do mês anterior (se houver).
    const ei =
      estoqueInicialEncadeado != null
        ? estoqueInicialEncadeado
        : m.estoqueInicial;
    const producao = m.demanda + m.estoqueFinalDesejado - ei;
    linhas.push({
      mes: m.mes,
      demanda: m.demanda,
      estoqueInicial: ei,
      estoqueFinalDesejado: m.estoqueFinalDesejado,
      producaoPlanejada: producao,
    });
    estoqueInicialEncadeado = m.estoqueFinalDesejado;
  }
  return linhas;
}

export function verificarCapacidade(
  pmp: LinhaPMP[],
  capacidade: number
): VerificacaoCapacidade[] {
  return pmp.map((l) => ({
    mes: l.mes,
    producaoPlanejada: l.producaoPlanejada,
    capacidade,
    utilizacao: Math.round((l.producaoPlanejada / capacidade) * 1000) / 10,
    viavel: l.producaoPlanejada <= capacidade,
  }));
}
