import PageHeader from "@/components/PageHeader";
import PlanoMestreEditor from "@/components/PlanoMestreEditor";
import { lerConfig } from "@/lib/db/repo";
import { rodarEngine } from "@/lib/pcp/engine";
import { fmtInt, fmtPct } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PlanoMestrePage() {
  const cfg = await lerConfig();
  const r = rodarEngine(cfg);

  return (
    <div>
      <PageHeader
        secao="Módulo 3"
        titulo="Plano Mestre de Produção"
        descricao="Converte demanda e estoques em produção planejada por mês e confronta com a capacidade da linha."
      />

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
