import PageHeader from "@/components/PageHeader";
import Explicador from "@/components/Explicador";
import ExecucaoEditor from "@/components/ExecucaoEditor";
import Stat from "@/components/Stat";
import ExportButtons from "@/components/ExportButtons";
import { lerConfig } from "@/lib/db/repo";
import { rodarEngine } from "@/lib/pcp/engine";
import { fmtInt, fmtPct } from "@/lib/format";

export const dynamic = "force-dynamic";

function corAderencia(v: number | null): "slate" | "emerald" | "amber" | "rose" {
  if (v == null) return "slate";
  if (v >= 95 && v <= 105) return "emerald";
  if (v >= 85 && v <= 115) return "amber";
  return "rose";
}

export default async function ExecucaoPage() {
  const cfg = await lerConfig();
  const r = rodarEngine(cfg);
  const a = r.aderencia;

  const csv = a.linhas.map((l) => ({
    mes: l.mes,
    producao_planejada: l.producaoPlanejada,
    produzido_real: l.produzidoReal,
    aderencia_producao_pct: l.aderenciaProducao ?? "",
    desvio_producao: l.desvioProducao,
    demanda_planejada: l.demandaPlanejada,
    vendido_real: l.vendidoReal,
    aderencia_vendas_pct: l.aderenciaVendas ?? "",
  }));

  return (
    <div>
      <div className="flex items-start justify-between">
        <PageHeader
          secao="Módulo 7 · Gestão"
          titulo="Execução & Aderência"
          descricao="Compare o que foi planejado com o que realmente aconteceu. É aqui que se vê se as decisões funcionaram."
        />
        <ExportButtons csvData={csv} csvNome="execucao-aderencia" />
      </div>

      <Explicador>
        <p>
          <strong>Aderência</strong> é o quanto a realidade seguiu o plano
          (realizado ÷ planejado). Lance o que foi de fato produzido e vendido
          em cada mês e acompanhe:
        </p>
        <ul className="ml-4 list-disc">
          <li><strong>~100%</strong> = no alvo (verde).</li>
          <li><strong>abaixo de 85%</strong> = produziu/vendeu menos que o plano (atenção).</li>
          <li><strong>acima de 115%</strong> = muito acima do plano (rever previsão/capacidade).</li>
        </ul>
      </Explicador>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat
          rotulo="Aderência média (produção)"
          valor={a.mediaAderenciaProducao != null ? fmtPct(a.mediaAderenciaProducao) : "—"}
          sub={`${a.mesesExecutados} ${a.mesesExecutados === 1 ? "mês executado" : "meses executados"}`}
          cor={corAderencia(a.mediaAderenciaProducao)}
        />
        <Stat
          rotulo="Aderência média (vendas)"
          valor={a.mediaAderenciaVendas != null ? fmtPct(a.mediaAderenciaVendas) : "—"}
          sub="vendido ÷ demanda planejada"
          cor={corAderencia(a.mediaAderenciaVendas)}
        />
        <Stat
          rotulo="Meses pendentes"
          valor={String(a.linhas.length - a.mesesExecutados)}
          sub="ainda sem lançamento"
        />
      </div>

      <ExecucaoEditor inicial={cfg.execucao} />

      <div className="mt-6 card overflow-x-auto">
        <div className="card-title mb-3">Planejado × Realizado</div>
        <table className="table">
          <thead>
            <tr>
              <th>Mês</th>
              <th className="text-right">Prod. planejada</th>
              <th className="text-right">Produzido</th>
              <th className="text-right">Aderência prod.</th>
              <th className="text-right">Desvio</th>
              <th className="text-right">Demanda plan.</th>
              <th className="text-right">Vendido</th>
              <th className="text-right">Aderência vendas</th>
            </tr>
          </thead>
          <tbody>
            {a.linhas.map((l) => (
              <tr key={l.mes} className={l.executado ? "" : "text-slate-400"}>
                <td className="font-medium">Mês {l.mes}</td>
                <td className="text-right">{fmtInt(l.producaoPlanejada)}</td>
                <td className="text-right">{l.executado ? fmtInt(l.produzidoReal) : "—"}</td>
                <td className="text-right">
                  {l.aderenciaProducao != null ? (
                    <span className={`badge pill-${corAderencia(l.aderenciaProducao) === "emerald" ? "c" : corAderencia(l.aderenciaProducao) === "amber" ? "b" : "a"}`}>
                      {fmtPct(l.aderenciaProducao)}
                    </span>
                  ) : "—"}
                </td>
                <td className="text-right">
                  {l.executado ? (l.desvioProducao > 0 ? "+" : "") + fmtInt(l.desvioProducao) : "—"}
                </td>
                <td className="text-right">{fmtInt(l.demandaPlanejada)}</td>
                <td className="text-right">{l.executado ? fmtInt(l.vendidoReal) : "—"}</td>
                <td className="text-right">
                  {l.aderenciaVendas != null ? fmtPct(l.aderenciaVendas) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
