import PageHeader from "@/components/PageHeader";
import EstoquesParams from "@/components/EstoquesParams";
import { lerConfig } from "@/lib/db/repo";
import { calcularEstoques, politicaRecomendada } from "@/lib/pcp/inventory";
import { fmtBRL, fmtInt, fmtPct } from "@/lib/format";

export const dynamic = "force-dynamic";

const pill = { A: "pill-a", B: "pill-b", C: "pill-c" } as const;

export default async function EstoquesPage() {
  const cfg = await lerConfig();
  const r = calcularEstoques(cfg.componentes, cfg.parametros);

  return (
    <div>
      <PageHeader
        secao="Módulo 5"
        titulo="Gestão de estoques"
        descricao="Lote econômico (LEC), estoque de segurança, ponto de pedido e classificação ABC por valor anual."
      />

      <EstoquesParams parametros={cfg.parametros} />

      <div className="mt-6 card overflow-x-auto">
        <div className="card-title mb-3">Políticas por componente</div>
        <table className="table">
          <thead>
            <tr>
              <th>Item</th>
              <th className="text-center">Classe</th>
              <th className="text-right">LEC</th>
              <th className="text-right">Est. segurança</th>
              <th className="text-right">Ponto de pedido</th>
              <th className="text-right">Valor anual</th>
              <th className="text-right">Participação</th>
            </tr>
          </thead>
          <tbody>
            {r.itens.map((i) => (
              <tr key={i.codigo}>
                <td>
                  <span className="font-mono text-xs text-slate-400">
                    {i.codigo}
                  </span>{" "}
                  {i.nome}
                </td>
                <td className="text-center">
                  <span className={`badge ${pill[i.classe]}`}>{i.classe}</span>
                </td>
                <td className="text-right">{fmtInt(i.lec)}</td>
                <td className="text-right">{fmtInt(i.estoqueSeguranca)}</td>
                <td className="text-right">{fmtInt(i.pontoPedido)}</td>
                <td className="text-right">{fmtBRL(i.valorAnual)}</td>
                <td className="text-right">{fmtPct(i.participacao)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {(["A", "B", "C"] as const).map((cl) => {
          const itens = r.itens.filter((i) => i.classe === cl);
          if (!itens.length) return null;
          return (
            <div key={cl} className="card">
              <div className="mb-2 flex items-center gap-2">
                <span className={`badge ${pill[cl]}`}>Classe {cl}</span>
                <span className="text-xs text-slate-500">
                  {itens.length} {itens.length === 1 ? "item" : "itens"}
                </span>
              </div>
              <ul className="mb-2 list-inside list-disc text-sm text-slate-600">
                {itens.map((i) => (
                  <li key={i.codigo}>{i.nome}</li>
                ))}
              </ul>
              <p className="text-xs text-slate-500">
                {politicaRecomendada(cl)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
