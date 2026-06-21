// Orquestrador: recebe a configuração completa e roda toda a cascata de PCP.
// É o que garante o efeito "muda um input -> recalcula tudo".

import type { ConfiguracaoPCP } from "../db/repo";
import { calcularPrevisao } from "./forecast";
import { calcularCapacidade } from "./capacity";
import { balancear } from "./balancing";
import { calcularPMP, verificarCapacidade } from "./mps";
import { calcularMRP } from "./mrp";
import { calcularEstoques } from "./inventory";

export function rodarEngine(cfg: ConfiguracaoPCP) {
  const previsao = calcularPrevisao(cfg.demanda, {
    janelaMM: cfg.parametros.janelaMM,
    pesosMMP: cfg.parametros.pesosMMP,
    alpha: cfg.parametros.alpha,
  });

  const capacidade = calcularCapacidade(
    cfg.tarefas,
    { horasTurno: cfg.parametros.horasTurno, diasUteis: cfg.parametros.diasUteis },
    cfg.cenarios
  );

  // Ciclo alvo = tempo da maior tarefa (limite teórico do balanceamento).
  // O balanceamento padrão usa 5,5 min (Proposta 2 do relatório), obtido ao
  // agrupar a cadeia respeitando esse ciclo. Permitimos escolher o ciclo.
  const balanceamento5 = balancear(cfg.tarefas, 5.5, capacidade.tempoDisponivel);
  const balanceamento4 = balancear(cfg.tarefas, 7.5, capacidade.tempoDisponivel);

  const pmp = calcularPMP(cfg.planoMestre);
  const verificacao = verificarCapacidade(pmp, balanceamento5.capacidade);

  const mrp = calcularMRP(cfg.componentes, pmp);
  const estoques = calcularEstoques(cfg.componentes, cfg.parametros);

  return {
    previsao,
    capacidade,
    balanceamento: { proposta4: balanceamento4, proposta5: balanceamento5 },
    pmp,
    verificacao,
    mrp,
    estoques,
  };
}

export type ResultadoEngine = ReturnType<typeof rodarEngine>;
