import PageHeader from "@/components/PageHeader";
import BalanceamentoExplorer from "@/components/BalanceamentoExplorer";
import Explicador from "@/components/Explicador";
import { lerConfig } from "@/lib/db/repo";
import { rodarEngine } from "@/lib/pcp/engine";
import { fmtDec1, fmtInt, fmtPct } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function BalanceamentoPage() {
  const cfg = await lerConfig();
  const r = rodarEngine(cfg);
  const p4 = r.balanceamento.proposta4;
  const p5 = r.balanceamento.proposta5;

  return (
    <div>
      <PageHeader
        secao="Módulo 6"
        titulo="Balanceamento de linha"
        descricao="Distribui as 12 tarefas (cadeia A→L) em estações respeitando precedência e tempo de ciclo."
      />

      <Explicador>
        <p>
          Balancear é <strong>dividir o trabalho entre postos</strong> para a
          linha fluir sem acúmulos. O <strong>gargalo</strong> é o posto mais
          lento — ele dita o ritmo de toda a linha.
        </p>
        <p>
          👉 Use o controle deslizante para simular: menos tempo de ciclo = mais
          estações, mais capacidade. <strong>Eficiência</strong> alta significa
          pouca ociosidade.
        </p>
      </Explicador>

      <BalanceamentoExplorer
        tarefas={cfg.tarefas}
        tempoDisponivel={r.capacidade.tempoDisponivel}
      />

      <div className="mt-6 card overflow-x-auto">
        <div className="card-title mb-3">Comparação das alternativas</div>
        <table className="table">
          <thead>
            <tr>
              <th>Critério</th>
              <th className="text-right">Proposta 1 (4 est.)</th>
              <th className="text-right">Proposta 2 (5 est.)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Tempo de ciclo real (gargalo)</td>
              <td className="text-right">{fmtDec1(p4.gargalo)} min</td>
              <td className="text-right">{fmtDec1(p5.gargalo)} min</td>
            </tr>
            <tr>
              <td>Eficiência da linha</td>
              <td className="text-right">{fmtPct(p4.eficiencia)}</td>
              <td className="text-right">{fmtPct(p5.eficiencia)}</td>
            </tr>
            <tr>
              <td>Ociosidade total</td>
              <td className="text-right">{fmtDec1(p4.ociosidadeTotal)} min</td>
              <td className="text-right">{fmtDec1(p5.ociosidadeTotal)} min</td>
            </tr>
            <tr>
              <td>Capacidade</td>
              <td className="text-right">{fmtInt(p4.capacidade)} un./mês</td>
              <td className="text-right">{fmtInt(p5.capacidade)} un./mês</td>
            </tr>
            <tr className="bg-emerald-50 font-medium">
              <td>Escolhida</td>
              <td className="text-right">—</td>
              <td className="text-right">✅ Proposta 2</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 card overflow-x-auto">
        <div className="card-title mb-3">
          Calibração do ciclo com a demanda (cenários)
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Cenário</th>
              <th className="text-right">Demanda (un./mês)</th>
              <th className="text-right">Tempo disponível (min)</th>
              <th className="text-right">Ciclo requerido (min/un.)</th>
            </tr>
          </thead>
          <tbody>
            {r.capacidade.cenarios.map((c) => (
              <tr key={c.cenario}>
                <td>{c.cenario}</td>
                <td className="text-right">{fmtInt(c.demanda)}</td>
                <td className="text-right">{fmtInt(c.tempoDisponivel)}</td>
                <td className="text-right">
                  {fmtDec1(c.tempoCicloRequerido)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-slate-500">
          Maior tarefa = {fmtDec1(r.capacidade.maiorTarefa)} min (driver e teste
          funcional). Capacidade máxima teórica ={" "}
          {fmtInt(r.capacidade.capacidadeMaxima)} un./mês. Todos os cenários
          ficam abaixo desse teto — viável com um turno.
        </p>
      </div>
    </div>
  );
}
