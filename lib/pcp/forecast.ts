// Previsão de demanda (seção 3 do relatório).
// Quatro métodos comparados por MAD e MAPE na janela meses 4..12.

import type { DemandaMes } from "./types";

export type MetodoPrevisao =
  | "media_movel"
  | "media_ponderada"
  | "suavizacao"
  | "regressao";

export interface ResultadoMetodo {
  metodo: MetodoPrevisao;
  rotulo: string;
  // previsão "in-sample" para t = 1..12 (null quando não há base suficiente)
  ajuste: (number | null)[];
  prev13: number;
  prev14: number;
  prev15: number;
  mad: number;
  mape: number; // %
  escolhido: boolean;
}

export interface ResultadoPrevisao {
  metodos: ResultadoMetodo[];
  melhor: MetodoPrevisao;
  // coeficientes da regressão (para exibição)
  regressao: { a: number; b: number };
}

const round = (v: number, casas = 1) => {
  const f = 10 ** casas;
  return Math.round(v * f) / f;
};

// Média móvel simples de janela n, com roll-forward para os meses futuros.
function mediaMovel(vendas: number[], n: number, horizonte: number) {
  const serie = [...vendas];
  const ajuste: (number | null)[] = [];
  for (let t = 0; t < vendas.length; t++) {
    if (t < n) ajuste.push(null);
    else {
      const janela = serie.slice(t - n, t);
      ajuste.push(janela.reduce((a, b) => a + b, 0) / n);
    }
  }
  const futuros: number[] = [];
  const ext = [...serie];
  for (let h = 0; h < horizonte; h++) {
    const janela = ext.slice(ext.length - n);
    const f = janela.reduce((a, b) => a + b, 0) / n;
    futuros.push(f);
    ext.push(f);
  }
  return { ajuste, futuros };
}

// Média móvel ponderada (pesos do mais recente ao mais antigo, soma 1).
function mediaPonderada(vendas: number[], pesos: number[], horizonte: number) {
  const n = pesos.length;
  const ajuste: (number | null)[] = [];
  for (let t = 0; t < vendas.length; t++) {
    if (t < n) ajuste.push(null);
    else {
      let f = 0;
      for (let i = 0; i < n; i++) f += pesos[i] * vendas[t - 1 - i];
      ajuste.push(f);
    }
  }
  const futuros: number[] = [];
  const ext = [...vendas];
  for (let h = 0; h < horizonte; h++) {
    let f = 0;
    for (let i = 0; i < n; i++) f += pesos[i] * ext[ext.length - 1 - i];
    futuros.push(f);
    ext.push(f);
  }
  return { ajuste, futuros };
}

// Suavização exponencial simples: F_t = α·D_{t-1} + (1-α)·F_{t-1}, F_1 = D_1.
function suavizacao(vendas: number[], alpha: number, horizonte: number) {
  const ajuste: (number | null)[] = [];
  const F: number[] = [];
  F[0] = vendas[0];
  ajuste.push(null); // não comparamos o mês 1 (inicialização)
  for (let t = 1; t < vendas.length; t++) {
    F[t] = alpha * vendas[t - 1] + (1 - alpha) * F[t - 1];
    ajuste.push(F[t]);
  }
  // mês 13 usa D_12; depois a previsão fica constante (não modela tendência)
  let prox = alpha * vendas[vendas.length - 1] + (1 - alpha) * F[F.length - 1];
  const futuros: number[] = [];
  for (let h = 0; h < horizonte; h++) futuros.push(prox); // constante
  return { ajuste, futuros };
}

// Regressão linear simples y = a + b·x, x = 1..12.
function regressao(vendas: number[], horizonte: number) {
  const n = vendas.length;
  const xs = vendas.map((_, i) => i + 1);
  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = vendas.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((acc, x, i) => acc + x * vendas[i], 0);
  const sumX2 = xs.reduce((acc, x) => acc + x * x, 0);
  const b = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const a = sumY / n - b * (sumX / n);
  const ajuste: (number | null)[] = xs.map((x) => a + b * x);
  const futuros: number[] = [];
  for (let h = 0; h < horizonte; h++) futuros.push(a + b * (n + 1 + h));
  return { ajuste, futuros, a, b };
}

// MAD e MAPE na janela [inicio, fim] (1-based, inclusivo).
function erros(
  vendas: number[],
  ajuste: (number | null)[],
  inicio: number,
  fim: number
) {
  let somaAbs = 0;
  let somaPct = 0;
  let k = 0;
  for (let t = inicio; t <= fim; t++) {
    const prev = ajuste[t - 1];
    if (prev == null) continue;
    const real = vendas[t - 1];
    const err = Math.abs(real - prev);
    somaAbs += err;
    somaPct += err / real;
    k++;
  }
  return { mad: k ? somaAbs / k : 0, mape: k ? (100 * somaPct) / k : 0 };
}

export function calcularPrevisao(
  demanda: DemandaMes[],
  params: { janelaMM: number; pesosMMP: number[]; alpha: number },
  janelaErro: { inicio: number; fim: number } = { inicio: 4, fim: 12 }
): ResultadoPrevisao {
  const vendas = [...demanda]
    .sort((a, b) => a.mes - b.mes)
    .map((d) => d.vendas);
  const H = 3;

  const mm = mediaMovel(vendas, params.janelaMM, H);
  const mp = mediaPonderada(vendas, params.pesosMMP, H);
  const se = suavizacao(vendas, params.alpha, H);
  const rl = regressao(vendas, H);

  const montar = (
    metodo: MetodoPrevisao,
    rotulo: string,
    r: { ajuste: (number | null)[]; futuros: number[] }
  ): ResultadoMetodo => {
    const e = erros(vendas, r.ajuste, janelaErro.inicio, janelaErro.fim);
    return {
      metodo,
      rotulo,
      ajuste: r.ajuste.map((v) => (v == null ? null : round(v, 1))),
      prev13: Math.round(r.futuros[0]),
      prev14: Math.round(r.futuros[1]),
      prev15: Math.round(r.futuros[2]),
      mad: round(e.mad, 1),
      mape: round(e.mape, 1),
      escolhido: false,
    };
  };

  const metodos: ResultadoMetodo[] = [
    montar("media_movel", `Média móvel simples (n=${params.janelaMM})`, mm),
    montar(
      "media_ponderada",
      `Média móvel ponderada (${params.pesosMMP.join("/")})`,
      mp
    ),
    montar("suavizacao", `Suavização exponencial (α=${params.alpha})`, se),
    montar("regressao", "Regressão linear", rl),
  ];

  // Escolhe o método de menor MAD.
  let melhorIdx = 0;
  metodos.forEach((m, i) => {
    if (m.mad < metodos[melhorIdx].mad) melhorIdx = i;
  });
  metodos[melhorIdx].escolhido = true;

  return {
    metodos,
    melhor: metodos[melhorIdx].metodo,
    regressao: { a: round(rl.a, 1), b: round(rl.b, 2) },
  };
}
