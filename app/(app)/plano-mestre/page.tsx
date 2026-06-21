import PageHeader from "@/components/PageHeader";
import PlanoMestreEditor from "@/components/PlanoMestreEditor";
import Explicador from "@/components/Explicador";
import ExportButtons from "@/components/ExportButtons";
import { lerConfig } from "@/lib/db/repo";
import { rodarEngine } from "@/lib/pcp/engine";
import { fmtInt, fmtPct } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PlanoMestrePage() {
  const cfg = await lerConfig();
  const r = rodarEngine(cfg);

  const csv = r.pmp.map((l, i) => ({
    mes: l.mes,
    demanda: l.demanda,
    estoque_inicial: l.estoqueInicial,
    estoque_final_desejado: l.estoqueFinalDesejado,
    producao_planejada: l.producaoPlanejada,
    capacidade: r.verificacao[i].capacidade,
    utilizacao_pct: r.verificacao[i].utilizacao,
  }));

  return (
    <div>
      <div className="flex items-start justify-between">
        <PageHeader
          secao="Módulo 3"
          titulo="Plano Mestre de Produção"
          descricao="Converte demanda e estoques em produção planejada por mês e confronta com a capacidade da linha."
        />
        <ExportButtons csvData={csv} csvNome="plano-mestre" />
      </div>

      <Explicador>
        <p>
          O Plano Mestre responde: <strong>quanto produzir em cada mês?</strong>{" "}
          A conta é simples — produzir o que a demanda pede, mais o estoque que
          você quer deixar no fim, menos o que já tem hoje.
        </p>
        <p>
          👉 Logo abaixo, confira a <strong>utilização da capacidade</strong>:
          se passar de 85%, a linha está apertada; se passar de 100%, o plano não
          cabe num turno.
        </p>
      </Explicador>

      <PlanoMestreEditor inicial={cfg.planoMestre} />

      <div className="mt-6 card overflow-x-auto">
        <div className="card-title mb-3">
          Verificação de capacidade (linha de {r.balanceamento.proposta5.numEstacoes} estações)
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Mês</th>
              <th className="text-right">Produção planejada</th>
              <th className="text-right">Capacidade</th>
              <th className="text-right">Utilização</th>
              <th className="text-center">Viável?</th>
            </tr>
          </thead>
          <tbody>
            {r.verificacao.map((v) => (
              <tr key={v.mes}>
                <td>Mês {v.mes}</td>
                <td className="text-right">{fmtInt(v.producaoPlanejada)}</td>
                <td className="text-right">{fmtInt(v.capacidade)}</td>
                <td className="text-right">{fmtPct(v.utilizacao)}</td>
                <td className="text-center">
                  {v.viavel ? (
                    <span className="badge pill-c">Sim</span>
                  ) : (
                    <span className="badge pill-a">Não</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
