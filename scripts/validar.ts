// Validação: roda o engine sobre os dados-semente e confere com o relatório.
import {
  CENARIOS, COMPONENTES, DEMANDA, EXECUCAO, PARAMETROS, PLANO_MESTRE, PRODUTO, TAREFAS,
} from "../lib/db/seed-data";
import { rodarEngine } from "../lib/pcp/engine";

const cfg = {
  produto: PRODUTO, componentes: COMPONENTES, tarefas: TAREFAS,
  demanda: DEMANDA, planoMestre: PLANO_MESTRE, parametros: PARAMETROS,
  cenarios: CENARIOS, execucao: EXECUCAO,
};
const r = rodarEngine(cfg);

const esperado: [string, unknown, unknown][] = [];
const reg = r.previsao.metodos.find((m) => m.metodo === "regressao")!;
esperado.push(["Regressão a", r.previsao.regressao.a, 690.9]);
esperado.push(["Regressão b", r.previsao.regressao.b, 70.24]);
esperado.push(["Regressão prev m13", reg.prev13, 1604]);
esperado.push(["Regressão prev m15", reg.prev15, 1745]);
esperado.push(["Regressão escolhida?", reg.escolhido, true]);
esperado.push(["Regressão MAPE (~3.1)", reg.mape, "~3.1"]);

const mp = r.previsao.metodos.find((m) => m.metodo === "media_ponderada")!;
esperado.push(["M.Ponderada prev m13", mp.prev13, 1539]);

const p5 = r.balanceamento.proposta5;
esperado.push(["Balanc. estações", p5.numEstacoes, 5]);
esperado.push(["Balanc. gargalo", p5.gargalo, 5.5]);
esperado.push(["Balanc. eficiência (~89.1)", p5.eficiencia, 89.1]);
esperado.push(["Balanc. capacidade", p5.capacidade, 1745]);

esperado.push(["Capac. máxima", r.capacidade.capacidadeMaxima, 3200]);
esperado.push(["Tempo disponível", r.capacidade.tempoDisponivel, 9600]);

esperado.push(["PMP m13 produção", r.pmp[0].producaoPlanejada, 1250]);
esperado.push(["PMP m14 produção", r.pmp[1].producaoPlanejada, 1320]);
esperado.push(["PMP m15 produção", r.pmp[2].producaoPlanejada, 1450]);

const driver = r.mrp.find((m) => m.codigo === "C05")!;
esperado.push(["MRP driver NL m13", driver.linhas[0].necessidadeLiquida, 1000]);
esperado.push(["MRP driver liberação mês 11", driver.liberacoes[0].mes, 11]);

const drv = r.estoques.itens.find((i) => i.codigo === "C05")!;
const plc = r.estoques.itens.find((i) => i.codigo === "C04")!;
const base = r.estoques.itens.find((i) => i.codigo === "C01")!;
esperado.push(["Estoque driver LEC", drv.lec, 922]);
esperado.push(["Estoque driver SS", drv.estoqueSeguranca, 373]);
esperado.push(["Estoque driver PP", drv.pontoPedido, 2973]);
esperado.push(["Estoque driver classe", drv.classe, "A"]);
esperado.push(["Estoque placa LEC", plc.lec, 1020]);
esperado.push(["Estoque placa PP", plc.pontoPedido, 3020]);
esperado.push(["Estoque placa classe", plc.classe, "A"]);
esperado.push(["Estoque base LEC", base.lec, 1249]);
esperado.push(["Estoque base PP", base.pontoPedido, 1498]);

console.log("\n=== VALIDAÇÃO ENGINE × RELATÓRIO ===\n");
for (const [nome, obtido, ref] of esperado) {
  console.log(`${String(nome).padEnd(34)} obtido=${String(obtido).padEnd(10)} relatório=${ref}`);
}
console.log("");
