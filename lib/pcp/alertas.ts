// Camada de DECISÃO: transforma os resultados do engine em ações concretas
// ("o que fazer hoje"). É o que torna a plataforma uma ferramenta de gestão,
// e não só um relatório com números.

import type { ConfiguracaoPCP } from "../db/repo";
import type { ResultadoEngine } from "./engine";

export type Severidade = "alta" | "media" | "baixa";
export type Categoria = "compra" | "prazo" | "capacidade";

export interface Alerta {
  id: string;
  categoria: Categoria;
  severidade: Severidade;
  titulo: string;
  detalhe: string;
  acao: string; // o que fazer
  modulo: string; // rota relacionada
}

export interface ResumoAlertas {
  alertas: Alerta[];
  porSeveridade: Record<Severidade, number>;
}

export function gerarAlertas(
  cfg: ConfiguracaoPCP,
  r: ResultadoEngine
): ResumoAlertas {
  const alertas: Alerta[] = [];
  const primeiroMes = Math.min(...cfg.planoMestre.map((p) => p.mes));

  // Mapa de políticas de estoque por código (PP, LEC, classe).
  const polPorCodigo = new Map(r.estoques.itens.map((i) => [i.codigo, i]));

  // 1) COMPRA — itens no/abaixo do ponto de pedido.
  for (const c of cfg.componentes) {
    const pol = polPorCodigo.get(c.codigo);
    if (!pol) continue;
    if (c.estoqueInicial <= pol.pontoPedido) {
      const sev: Severidade = pol.classe === "A" ? "alta" : pol.classe === "B" ? "media" : "baixa";
      alertas.push({
        id: `compra-${c.codigo}`,
        categoria: "compra",
        severidade: sev,
        titulo: `Repor ${c.nome} (${c.codigo})`,
        detalhe: `Estoque atual ${fmt(c.estoqueInicial)} un. ≤ ponto de pedido ${fmt(pol.pontoPedido)} un. (classe ${pol.classe}).`,
        acao: `Emitir pedido de ~${fmt(pol.lec)} un. (lote econômico).`,
        modulo: "/estoques",
      });
    }
  }

  // 2) PRAZO — liberações que recaem ANTES do horizonte de planejamento.
  for (const comp of r.mrp) {
    const antes = comp.liberacoes.filter(
      (l) => l.mes < primeiroMes && l.quantidade > 0
    );
    if (antes.length === 0) continue;
    const maisCedo = antes.reduce((a, b) => (a.mes < b.mes ? a : b));
    const sev: Severidade = comp.critico ? "alta" : "media";
    alertas.push({
      id: `prazo-${comp.codigo}`,
      categoria: "prazo",
      severidade: sev,
      titulo: `Pedido fora do horizonte: ${comp.nome} (${comp.codigo})`,
      detalhe: `Lead time ${comp.leadTime} ${comp.leadTime === 1 ? "mês" : "meses"}: o recebimento exige liberação já no mês ${maisCedo.mes}, antes do início do plano (mês ${primeiroMes}).`,
      acao: `Colocar o pedido IMEDIATAMENTE (${fmt(maisCedo.quantidade)} un.).`,
      modulo: "/mrp",
    });
  }

  // 3) CAPACIDADE — meses apertados ou inviáveis.
  for (const v of r.verificacao) {
    if (v.utilizacao > 100) {
      alertas.push({
        id: `cap-${v.mes}`,
        categoria: "capacidade",
        severidade: "alta",
        titulo: `Capacidade estourada no mês ${v.mes}`,
        detalhe: `Produção ${fmt(v.producaoPlanejada)} un. > capacidade ${fmt(v.capacidade)} un. (${v.utilizacao.toLocaleString("pt-BR")}%).`,
        acao: "Abrir estação paralela no gargalo, turno extra ou rever o plano.",
        modulo: "/balanceamento",
      });
    } else if (v.utilizacao > 85) {
      alertas.push({
        id: `cap-${v.mes}`,
        categoria: "capacidade",
        severidade: "media",
        titulo: `Capacidade apertada no mês ${v.mes}`,
        detalhe: `Utilização de ${v.utilizacao.toLocaleString("pt-BR")}% — pouca folga para picos ou sazonalidade.`,
        acao: "Monitorar o gargalo (E2) e preparar plano de expansão.",
        modulo: "/balanceamento",
      });
    }
  }

  const ordem: Record<Severidade, number> = { alta: 0, media: 1, baixa: 2 };
  alertas.sort((a, b) => ordem[a.severidade] - ordem[b.severidade]);

  const porSeveridade: Record<Severidade, number> = { alta: 0, media: 0, baixa: 0 };
  for (const a of alertas) porSeveridade[a.severidade]++;

  return { alertas, porSeveridade };
}

function fmt(v: number) {
  return v.toLocaleString("pt-BR");
}
