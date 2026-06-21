// Aderência ao plano: compara o PLANEJADO com o REALIZADO (execução real).
// É o que mostra "se as decisões funcionaram" ao longo do tempo.

import type { ExecucaoMes } from "./types";
import type { LinhaPMP } from "./mps";

export interface LinhaAderencia {
  mes: number;
  // Produção
  producaoPlanejada: number;
  produzidoReal: number;
  aderenciaProducao: number | null; // % (null se ainda não executado)
  desvioProducao: number; // realizado - planejado
  // Demanda/vendas
  demandaPlanejada: number;
  vendidoReal: number;
  aderenciaVendas: number | null; // %
  executado: boolean;
}

export interface ResultadoAderencia {
  linhas: LinhaAderencia[];
  mediaAderenciaProducao: number | null;
  mediaAderenciaVendas: number | null;
  mesesExecutados: number;
}

export function calcularAderencia(
  pmp: LinhaPMP[],
  execucao: ExecucaoMes[]
): ResultadoAderencia {
  const execPorMes = new Map(execucao.map((e) => [e.mes, e]));

  const linhas: LinhaAderencia[] = pmp.map((l) => {
    const e = execPorMes.get(l.mes);
    const produzido = e?.produzidoReal ?? 0;
    const vendido = e?.vendidoReal ?? 0;
    const executado = produzido > 0 || vendido > 0;

    return {
      mes: l.mes,
      producaoPlanejada: l.producaoPlanejada,
      produzidoReal: produzido,
      aderenciaProducao:
        executado && l.producaoPlanejada > 0
          ? round((produzido / l.producaoPlanejada) * 100)
          : null,
      desvioProducao: produzido - l.producaoPlanejada,
      demandaPlanejada: l.demanda,
      vendidoReal: vendido,
      aderenciaVendas:
        executado && l.demanda > 0 ? round((vendido / l.demanda) * 100) : null,
      executado,
    };
  });

  const executadas = linhas.filter((l) => l.executado);
  const media = (vals: (number | null)[]) => {
    const v = vals.filter((x): x is number => x != null);
    return v.length ? round(v.reduce((a, b) => a + b, 0) / v.length) : null;
  };

  return {
    linhas,
    mediaAderenciaProducao: media(executadas.map((l) => l.aderenciaProducao)),
    mediaAderenciaVendas: media(executadas.map((l) => l.aderenciaVendas)),
    mesesExecutados: executadas.length,
  };
}

function round(v: number) {
  return Math.round(v * 10) / 10;
}
