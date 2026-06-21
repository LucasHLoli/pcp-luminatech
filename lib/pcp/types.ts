// Tipos compartilhados do engine de PCP da LUX-01.

export interface Produto {
  codigo: string;
  descricao: string;
}

export interface Componente {
  codigo: string;
  nome: string;
  qtdPorUnidade: number;
  custoUnitario: number; // R$
  leadTime: number; // meses
  custoPedido: number; // S — R$/pedido
  sigma: number; // desvio-padrão da demanda mensal
  estoqueInicial: number; // unidades
}

export interface Tarefa {
  tarefa: string; // A..L
  operacao: string; // O1..O12
  descricao: string;
  tempoPadrao: number; // min
  precedencia: string | null; // tarefa anterior (cadeia linear)
}

export interface DemandaMes {
  mes: number; // 1..12
  vendas: number;
}

export interface ParametrosGerais {
  // Produção / capacidade
  horasTurno: number; // h/dia
  diasUteis: number; // dias/mês
  // Previsão
  janelaMM: number; // n da média móvel
  pesosMMP: number[]; // pesos média ponderada (recente -> antigo)
  alpha: number; // suavização exponencial
  // Estoques
  nivelServicoZ: number; // z (1,65 para 95%)
  percentualH: number; // fração do custo unitário = custo de manter/ano
  demandaMensalBase: number; // demanda mensal representativa p/ políticas de estoque
}

export interface PlanoMestreMes {
  mes: number;
  demanda: number;
  estoqueInicial: number;
  estoqueFinalDesejado: number;
}
