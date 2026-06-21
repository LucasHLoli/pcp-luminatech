// Dados-semente da LUX-01 — calibrados para reproduzir o relatório ABNT.
// Estes valores alimentam o protótipo na primeira carga e podem ser editados
// nos módulos (a edição persiste no Turso).

import type {
  Componente,
  DemandaMes,
  ExecucaoMes,
  ParametrosGerais,
  PlanoMestreMes,
  Produto,
  Tarefa,
} from "../pcp/types";

export const PRODUTO: Produto = {
  codigo: "PA01",
  descricao: "Luminária LED de mesa LUX-01",
};

// Estrutura (BOM), custos, lead times e parâmetros de estoque.
// Custos/σ/custo de pedido calibrados para reproduzir a Tabela H (driver e
// placa LED batem exatamente; os demais usam premissas do enunciado).
export const COMPONENTES: Componente[] = [
  { codigo: "C01", nome: "Base plástica",       qtdPorUnidade: 1, custoUnitario: 8.0,  leadTime: 1, custoPedido: 80,  sigma: 120, estoqueInicial: 500 },
  { codigo: "C02", nome: "Haste articulada",    qtdPorUnidade: 1, custoUnitario: 6.0,  leadTime: 1, custoPedido: 60,  sigma: 100, estoqueInicial: 420 },
  { codigo: "C03", nome: "Cúpula superior",     qtdPorUnidade: 1, custoUnitario: 5.0,  leadTime: 1, custoPedido: 60,  sigma: 90,  estoqueInicial: 380 },
  { codigo: "C04", nome: "Placa LED",           qtdPorUnidade: 1, custoUnitario: 18.0, leadTime: 2, custoPedido: 120, sigma: 180, estoqueInicial: 300 },
  { codigo: "C05", nome: "Driver eletrônico",   qtdPorUnidade: 1, custoUnitario: 22.0, leadTime: 2, custoPedido: 120, sigma: 160, estoqueInicial: 250 },
  { codigo: "C06", nome: "Interruptor",         qtdPorUnidade: 1, custoUnitario: 2.5,  leadTime: 1, custoPedido: 40,  sigma: 80,  estoqueInicial: 600 },
  { codigo: "C07", nome: "Cabo de alimentação", qtdPorUnidade: 1, custoUnitario: 3.5,  leadTime: 1, custoPedido: 50,  sigma: 80,  estoqueInicial: 450 },
  { codigo: "C08", nome: "Parafusos",           qtdPorUnidade: 4, custoUnitario: 0.05, leadTime: 1, custoPedido: 50,  sigma: 500, estoqueInicial: 4000 },
  { codigo: "C09", nome: "Manual do usuário",   qtdPorUnidade: 1, custoUnitario: 1.2,  leadTime: 1, custoPedido: 30,  sigma: 70,  estoqueInicial: 900 },
  { codigo: "C10", nome: "Embalagem final",     qtdPorUnidade: 1, custoUnitario: 3.0,  leadTime: 1, custoPedido: 60,  sigma: 90,  estoqueInicial: 700 },
];

// Tarefas, tempos padrão e precedências (Tabela 2 do relatório).
export const TAREFAS: Tarefa[] = [
  { tarefa: "A", operacao: "O1",  descricao: "Separar componentes",         tempoPadrao: 1.5, precedencia: null },
  { tarefa: "B", operacao: "O2",  descricao: "Fixar haste na base",         tempoPadrao: 2.0, precedencia: "A" },
  { tarefa: "C", operacao: "O3",  descricao: "Instalar cúpula",             tempoPadrao: 1.5, precedencia: "B" },
  { tarefa: "D", operacao: "O4",  descricao: "Fixar placa LED",             tempoPadrao: 2.5, precedencia: "C" },
  { tarefa: "E", operacao: "O5",  descricao: "Instalar driver eletrônico",  tempoPadrao: 3.0, precedencia: "D" },
  { tarefa: "F", operacao: "O6",  descricao: "Instalar interruptor",        tempoPadrao: 2.0, precedencia: "E" },
  { tarefa: "G", operacao: "O7",  descricao: "Conectar cabo de alimentação", tempoPadrao: 2.5, precedencia: "F" },
  { tarefa: "H", operacao: "O8",  descricao: "Fechar carcaça",              tempoPadrao: 2.0, precedencia: "G" },
  { tarefa: "I", operacao: "O9",  descricao: "Testar funcionamento",        tempoPadrao: 3.0, precedencia: "H" },
  { tarefa: "J", operacao: "O10", descricao: "Fazer inspeção visual",       tempoPadrao: 1.5, precedencia: "I" },
  { tarefa: "K", operacao: "O11", descricao: "Embalar produto",             tempoPadrao: 2.0, precedencia: "J" },
  { tarefa: "L", operacao: "O12", descricao: "Etiquetar embalagem",         tempoPadrao: 1.0, precedencia: "K" },
];

// Demanda histórica mensal (Tabela 6).
export const DEMANDA: DemandaMes[] = [
  { mes: 1, vendas: 820 },
  { mes: 2, vendas: 860 },
  { mes: 3, vendas: 910 },
  { mes: 4, vendas: 950 },
  { mes: 5, vendas: 1020 },
  { mes: 6, vendas: 1080 },
  { mes: 7, vendas: 1160 },
  { mes: 8, vendas: 1210 },
  { mes: 9, vendas: 1280 },
  { mes: 10, vendas: 1350 },
  { mes: 11, vendas: 1480 },
  { mes: 12, vendas: 1650 },
];

// Plano Mestre (Tabela D): demanda e estoques vêm do enunciado (meses 13-15).
export const PLANO_MESTRE: PlanoMestreMes[] = [
  { mes: 13, demanda: 1200, estoqueInicial: 150, estoqueFinalDesejado: 200 },
  { mes: 14, demanda: 1300, estoqueInicial: 200, estoqueFinalDesejado: 220 },
  { mes: 15, demanda: 1420, estoqueInicial: 220, estoqueFinalDesejado: 250 },
];

export const PARAMETROS: ParametrosGerais = {
  horasTurno: 8,
  diasUteis: 20,
  janelaMM: 3,
  pesosMMP: [0.5, 0.3, 0.2],
  alpha: 0.3,
  nivelServicoZ: 1.65,
  percentualH: 0.2,
  demandaMensalBase: 1300,
};

// Execução real (exemplo): mês 13 já fechou; 14 e 15 ainda não.
// Valores fictícios para demonstrar a aderência ao plano.
export const EXECUCAO: ExecucaoMes[] = [
  { mes: 13, produzidoReal: 1230, vendidoReal: 1180 },
  { mes: 14, produzidoReal: 0, vendidoReal: 0 },
  { mes: 15, produzidoReal: 0, vendidoReal: 0 },
];

// Cenários de demanda para a calibração do ciclo (Tabela 8).
export const CENARIOS = [
  { cenario: "Base", demanda: 1200 },
  { cenario: "Crescimento moderado", demanda: 1320 },
  { cenario: "Crescimento forte", demanda: 1440 },
  { cenario: "Crescimento agressivo", demanda: 1560 },
];
