// Gestão de estoques (seção 8 do relatório): LEC, estoque de segurança,
// ponto de pedido e classificação ABC.

import type { Componente, ParametrosGerais } from "./types";

export interface PoliticaEstoque {
  codigo: string;
  nome: string;
  custoUnitario: number;
  leadTime: number;
  demandaMensal: number; // d (mensal · qtd por unidade)
  demandaAnual: number;
  lec: number; // Q*
  estoqueSeguranca: number; // SS
  pontoPedido: number; // PP
  valorAnual: number; // demanda anual × custo unitário
  participacao: number; // % do valor total
  classe: "A" | "B" | "C";
}

export interface ResultadoEstoques {
  itens: PoliticaEstoque[];
  valorTotal: number;
}

export function calcularEstoques(
  componentes: Componente[],
  params: ParametrosGerais
): ResultadoEstoques {
  const { nivelServicoZ: z, percentualH, demandaMensalBase } = params;

  const parciais = componentes.map((c) => {
    const d = demandaMensalBase * c.qtdPorUnidade; // demanda mensal do item
    const D = d * 12; // demanda anual
    const H = percentualH * c.custoUnitario; // custo de manter/ano por unidade
    const lec = Math.round(Math.sqrt((2 * D * c.custoPedido) / H));
    const ss = Math.round(z * c.sigma * Math.sqrt(c.leadTime));
    const pp = Math.round(d * c.leadTime + ss);
    const valorAnual = D * c.custoUnitario;
    return { c, d, D, lec, ss, pp, valorAnual };
  });

  const valorTotal = parciais.reduce((a, p) => a + p.valorAnual, 0);

  // Classificação ABC pelo valor anual movimentado (acumulado).
  const ordenados = [...parciais].sort((a, b) => b.valorAnual - a.valorAnual);
  let acumulado = 0;
  const classeDe = new Map<string, "A" | "B" | "C">();
  for (const p of ordenados) {
    acumulado += p.valorAnual;
    const pctAcum = (acumulado / valorTotal) * 100;
    let classe: "A" | "B" | "C";
    if (pctAcum <= 80) classe = "A";
    else if (pctAcum <= 95) classe = "B";
    else classe = "C";
    classeDe.set(p.c.codigo, classe);
  }

  const itens: PoliticaEstoque[] = ordenados.map((p) => ({
    codigo: p.c.codigo,
    nome: p.c.nome,
    custoUnitario: p.c.custoUnitario,
    leadTime: p.c.leadTime,
    demandaMensal: p.d,
    demandaAnual: p.D,
    lec: p.lec,
    estoqueSeguranca: p.ss,
    pontoPedido: p.pp,
    valorAnual: p.valorAnual,
    participacao: Math.round((p.valorAnual / valorTotal) * 1000) / 10,
    classe: classeDe.get(p.c.codigo)!,
  }));

  return { itens, valorTotal };
}

export function politicaRecomendada(classe: "A" | "B" | "C"): string {
  switch (classe) {
    case "A":
      return "Revisão contínua (ponto de pedido), estoque de segurança robusto, dupla fonte e monitoramento próximo do fornecedor.";
    case "B":
      return "Revisão periódica, estoque de segurança moderado, controle intermediário.";
    case "C":
      return "Controle simples (duas gavetas / two-bin), lote grande, poucos pedidos por ano.";
  }
}
