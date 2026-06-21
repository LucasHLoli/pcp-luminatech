import PageHeader from "@/components/PageHeader";
import PrevisaoEditor from "@/components/PrevisaoEditor";
import { lerConfig } from "@/lib/db/repo";
import { calcularPrevisao } from "@/lib/pcp/forecast";
import { fmtDec1, fmtInt, fmtPct } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PrevisaoPage() {
  const cfg = await lerConfig();
  const r = calcularPrevisao(cfg.demanda, {
    janelaMM: cfg.parametros.janelaMM,
    pesosMMP: cfg.parametros.pesosMMP,
    alpha: cfg.parametros.alpha,
  });

  return (
    <div>
      <PageHeader
        secao="Módulo 2"
        titulo="Previsão de demanda"
        descricao="Quatro métodos comparados por MAD e MAPE (janela meses 4–12). O sistema escolhe o de menor erro."
      />

      <PrevisaoEditor
        demandaInicial={cfg.demanda}
        parametros={cfg.parametros}
      />

      <div className="mt-6 card overflow-x-auto">
        <div className="card-title mb-3">Comparação dos métodos</div>
        <table className="table">
          <thead>
            <tr>
              <th>Método</th>
              <th className="text-right">Prev. m13</th>
              <th className="text-right">Prev. m14</th>
              <th className="text-right">Prev. m15</th>
              <th className="text-right">MAD</th>
              <th className="text-right">MAPE</th>
              <th className="text-center">Escolhido</th>
            </tr>
          </thead>
          <tbody>
            {r.metodos.map((m) => (
              <tr
                key={m.metodo}
                className={m.escolhido ? "bg-emerald-50 font-medium" : ""}
              >
                <td>{m.rotulo}</td>
                <td className="text-right">{fmtInt(m.prev13)}</td>
                <td className="text-right">{fmtInt(m.prev14)}</td>
                <td className="text-right">{fmtInt(m.prev15)}</td>
                <td className="text-right">{fmtDec1(m.mad)}</td>
                <td className="text-right">{fmtPct(m.mape)}</td>
                <td className="text-center">{m.escolhido ? "✅" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-slate-500">
          Reta de regressão: y = {fmtDec1(r.regressao.a)} +{" "}
          {r.regressao.b.toLocaleString("pt-BR")}·x. A série tem tendência
          linear de alta, então a regressão captura melhor o crescimento.
        </p>
      </div>
    </div>
  );
}
