import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { lerConfig } from "@/lib/db/repo";
import { rodarEngine } from "@/lib/pcp/engine";
import { gerarAlertas, type Severidade, type Categoria } from "@/lib/pcp/alertas";

export const dynamic = "force-dynamic";

const sev: Record<Severidade, { pill: string; rotulo: string; ordem: number }> = {
  alta: { pill: "pill-a", rotulo: "Urgente", ordem: 0 },
  media: { pill: "pill-b", rotulo: "Atenção", ordem: 1 },
  baixa: { pill: "pill-c", rotulo: "Planejar", ordem: 2 },
};

const catIcone: Record<Categoria, string> = {
  compra: "🛒",
  prazo: "⏰",
  capacidade: "🏭",
};
const catNome: Record<Categoria, string> = {
  compra: "Compra",
  prazo: "Prazo",
  capacidade: "Capacidade",
};

export default async function AcoesPage() {
  const cfg = await lerConfig();
  const r = rodarEngine(cfg);
  const { alertas, porSeveridade } = gerarAlertas(cfg, r);

  const paramProducao = alertas.filter(
    (a) => a.severidade === "alta" && (a.categoria === "compra" || a.categoria === "prazo")
  ).length;

  return (
    <div>
      <PageHeader
        secao="Decisão"
        titulo="Ações para agora"
        descricao="As decisões que precisam da sua atenção hoje, em ordem de prioridade. Comece o dia por aqui."
      />

      {/* Resumo executivo */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card text-center">
          <div className="text-4xl font-bold text-slate-800">{alertas.length}</div>
          <div className="mt-1 text-sm text-slate-500">decisões pendentes</div>
        </div>
        <div className="card text-center">
          <div className="text-4xl font-bold text-rose-600">{paramProducao}</div>
          <div className="mt-1 text-sm text-slate-500">
            param a produção se ignoradas
          </div>
        </div>
        <div className="card flex flex-col justify-center gap-1 text-sm">
          <span><span className="badge pill-a mr-2">Urgente</span>{porSeveridade.alta}</span>
          <span><span className="badge pill-b mr-2">Atenção</span>{porSeveridade.media}</span>
          <span><span className="badge pill-c mr-2">Planejar</span>{porSeveridade.baixa}</span>
        </div>
      </div>

      {/* Como ler */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <strong className="text-slate-700">Como priorizar:</strong> resolva
        primeiro as <span className="badge pill-a">Urgentes</span> (param a
        linha ou exigem pedido imediato), depois as{" "}
        <span className="badge pill-b">Atenção</span> e por fim as{" "}
        <span className="badge pill-c">Planejar</span>. Cada cartão diz o{" "}
        <em>porquê</em> e o que acontece se for ignorado.
      </div>

      {alertas.length === 0 ? (
        <div className="card text-center text-slate-500">
          <div className="text-3xl">🎉</div>
          <p className="mt-2">
            Nenhuma decisão pendente. O plano está sob controle.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {alertas
            .slice()
            .sort((a, b) => sev[a.severidade].ordem - sev[b.severidade].ordem)
            .map((a) => (
              <div key={a.id} className="card">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`badge ${sev[a.severidade].pill}`}>
                    {sev[a.severidade].rotulo}
                  </span>
                  <span className="badge bg-slate-100 text-slate-600">
                    {catIcone[a.categoria]} {catNome[a.categoria]}
                  </span>
                  <span className="font-semibold text-slate-800">{a.titulo}</span>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <div className="text-xs font-semibold uppercase text-slate-400">
                      Situação
                    </div>
                    <p className="mt-0.5 text-sm text-slate-600">{a.detalhe}</p>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase text-slate-400">
                      Por que importa
                    </div>
                    <p className="mt-0.5 text-sm text-slate-600">{a.porque}</p>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase text-rose-400">
                      Se ignorar
                    </div>
                    <p className="mt-0.5 text-sm text-slate-600">{a.impacto}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between rounded-lg bg-brand/5 px-3 py-2">
                  <span className="text-sm font-medium text-brand">
                    ✅ {a.acao}
                  </span>
                  <Link href={a.modulo} className="text-sm font-semibold text-brand hover:underline">
                    Abrir módulo →
                  </Link>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
