import PageHeader from "@/components/PageHeader";
import Explicador from "@/components/Explicador";
import ExportButtons from "@/components/ExportButtons";
import { lerConfig } from "@/lib/db/repo";
import { rodarEngine } from "@/lib/pcp/engine";
import { fmtInt } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MrpPage() {
  const cfg = await lerConfig();
  const r = rodarEngine(cfg);
  const meses = cfg.planoMestre.map((p) => p.mes);

  const driver = r.mrp.find((m) => m.codigo === "C05");
  // Meses de liberação do driver (inclui meses anteriores ao horizonte).
  const mesesLib = driver
    ? Array.from(
        new Set([
          ...driver.liberacoes.map((l) => l.mes),
          ...driver.linhas.map((l) => l.mes),
        ])
      ).sort((a, b) => a - b)
    : [];

  const csv: Record<string, string | number>[] = r.mrp.map((c) => {
    const linha: Record<string, string | number> = {
      codigo: c.codigo,
      item: c.nome,
      lead_time: c.leadTime,
      estoque_inicial: c.estoqueInicial,
    };
    c.linhas.forEach((l) => {
      linha[`NL_mes_${l.mes}`] = l.necessidadeLiquida;
    });
    return linha;
  });

  return (
    <div>
      <div className="flex items-start justify-between">
        <PageHeader
          secao="Módulo 4"
          titulo="MRP — Necessidades de Materiais"
          descricao="Explode a BOM sobre o Plano Mestre, desconta estoques e desloca pelo lead time. Lote a lote."
        />
        <ExportButtons csvData={csv} csvNome="mrp-necessidades" />
      </div>

      <Explicador>
        <p>
          MRP (Planejamento de Necessidades de Materiais) responde:{" "}
          <strong>o que comprar, quanto e quando?</strong> Ele pega o plano de
          produção, multiplica pela receita do produto, desconta o que já há em
          estoque e <strong>recua pelo lead time</strong> de cada item.
        </p>
        <p>
          👉 A "necessidade líquida" é o que falta comprar. A "liberação" é a{" "}
          <strong>data em que o pedido precisa sair</strong>. Itens de 2 meses
          (driver e placa LED) exigem pedido bem antes — fique de olho.
        </p>
      </Explicador>

      <div className="card overflow-x-auto">
        <div className="card-title mb-3">Necessidades líquidas por componente</div>
        <table className="table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Item</th>
              <th className="text-right">LT</th>
              <th className="text-right">Estoque inicial</th>
              {meses.map((m) => (
                <th key={m} className="text-right">
                  NL mês {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {r.mrp.map((c) => (
              <tr key={c.codigo} className={c.critico ? "bg-rose-50" : ""}>
                <td className="font-mono text-xs">{c.codigo}</td>
                <td>
                  {c.nome}
                  {c.critico && (
                    <span className="badge pill-a ml-2">crítico</span>
                  )}
                </td>
                <td className="text-right">{c.leadTime}</td>
                <td className="text-right">{fmtInt(c.estoqueInicial)}</td>
                {c.linhas.map((l) => (
                  <td key={l.mes} className="text-right">
                    {fmtInt(l.necessidadeLiquida)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {driver && (
        <div className="mt-6 card overflow-x-auto">
          <div className="card-title mb-3">
            Registro MRP do driver eletrônico (C05) — lead time {driver.leadTime} meses
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Período (mês)</th>
                {mesesLib.map((m) => (
                  <th key={m} className="text-right">
                    {m}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { rot: "Necessidade bruta", get: (m: number) => driver.linhas.find((l) => l.mes === m)?.necessidadeBruta },
                { rot: "Estoque disponível", get: (m: number) => driver.linhas.find((l) => l.mes === m)?.estoqueDisponivel },
                { rot: "Necessidade líquida", get: (m: number) => driver.linhas.find((l) => l.mes === m)?.necessidadeLiquida },
                { rot: "Recebimento planejado", get: (m: number) => driver.linhas.find((l) => l.mes === m)?.recebimentoPlanejado },
                { rot: "Liberação planejada", get: (m: number) => driver.liberacoes.find((l) => l.mes === m)?.quantidade },
              ].map((linha) => (
                <tr key={linha.rot}>
                  <td className="font-medium">{linha.rot}</td>
                  {mesesLib.map((m) => {
                    const v = linha.get(m);
                    return (
                      <td key={m} className="text-right">
                        {v ? fmtInt(v) : "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-slate-500">
            Deslocamento de {driver.leadTime} meses: o recebimento do mês{" "}
            {driver.linhas[0]?.mes} exige liberação já no mês{" "}
            {driver.linhas[0]?.mes - driver.leadTime} — antes do horizonte de
            planejamento. Alerta operacional: comprar driver e placa LED
            imediatamente.
          </p>
        </div>
      )}
    </div>
  );
}
