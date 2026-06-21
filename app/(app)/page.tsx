import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Stat from "@/components/Stat";
import { lerConfig } from "@/lib/db/repo";
import { rodarEngine } from "@/lib/pcp/engine";
import { fmtDec1, fmtInt, fmtPct } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const cfg = await lerConfig();
  const r = rodarEngine(cfg);

  const bal = r.balanceamento.proposta5;
  const metodoEscolhido = r.previsao.metodos.find((m) => m.escolhido)!;
  const itensCriticos = r.mrp.filter((m) => m.critico);
  const classeA = r.estoques.itens.filter((i) => i.classe === "A");
  const ultimoMes = r.verificacao[r.verificacao.length - 1];

  return (
    <div>
      <PageHeader
        secao="Visão geral"
        titulo="Painel de PCP — LuminaTech LUX-01"
        descricao="Indicadores consolidados do sistema. Toda alteração de input nos módulos recalcula esta tela em cascata."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          rotulo="Previsão (mês 15)"
          valor={fmtInt(metodoEscolhido.prev15)}
          sub={`Método: ${metodoEscolhido.rotulo} · MAPE ${fmtPct(
            metodoEscolhido.mape
          )}`}
          cor="brand"
        />
        <Stat
          rotulo="Eficiência da linha"
          valor={fmtPct(bal.eficiencia)}
          sub={`${bal.numEstacoes} estações · gargalo ${fmtDec1(
            bal.gargalo
          )} min`}
          cor="emerald"
        />
        <Stat
          rotulo="Capacidade"
          valor={`${fmtInt(bal.capacidade)} un./mês`}
          sub={`Utilização no mês 15: ${fmtPct(ultimoMes.utilizacao)}`}
        />
        <Stat
          rotulo="Itens críticos (LT ≥ 2)"
          valor={String(itensCriticos.length)}
          sub={itensCriticos.map((i) => i.nome).join(", ")}
          cor="rose"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card">
          <div className="card-title">Plano Mestre × Capacidade</div>
          <table className="table mt-3">
            <thead>
              <tr>
                <th>Mês</th>
                <th className="text-right">Produção</th>
                <th className="text-right">Capac.</th>
                <th className="text-right">Utilização</th>
                <th className="text-right">Viável</th>
              </tr>
            </thead>
            <tbody>
              {r.verificacao.map((v) => (
                <tr key={v.mes}>
                  <td>Mês {v.mes}</td>
                  <td className="text-right">{fmtInt(v.producaoPlanejada)}</td>
                  <td className="text-right">{fmtInt(v.capacidade)}</td>
                  <td className="text-right">{fmtPct(v.utilizacao)}</td>
                  <td className="text-right">
                    {v.viavel ? "✅" : "⚠️"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-title">Itens classe A (foco do controle)</div>
          <table className="table mt-3">
            <thead>
              <tr>
                <th>Item</th>
                <th className="text-right">Participação</th>
                <th className="text-right">Ponto de pedido</th>
                <th className="text-right">Est. segurança</th>
              </tr>
            </thead>
            <tbody>
              {classeA.map((i) => (
                <tr key={i.codigo}>
                  <td>
                    <span className="badge pill-a mr-2">A</span>
                    {i.nome}
                  </td>
                  <td className="text-right">{fmtPct(i.participacao)}</td>
                  <td className="text-right">{fmtInt(i.pontoPedido)}</td>
                  <td className="text-right">{fmtInt(i.estoqueSeguranca)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-slate-500">
            Driver e placa LED concentram{" "}
            {fmtPct(classeA.reduce((a, i) => a + i.participacao, 0))} do valor
            anual — gargalo da linha e itens da FMEA.
          </p>
        </div>
      </div>

      <div className="mt-6 card">
        <div className="card-title">Atalhos dos módulos</div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            ["/cadastro", "Cadastro"],
            ["/previsao", "Previsão"],
            ["/plano-mestre", "Plano Mestre"],
            ["/mrp", "MRP"],
            ["/estoques", "Estoques"],
            ["/balanceamento", "Balanceamento"],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="btn-ghost justify-center">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
