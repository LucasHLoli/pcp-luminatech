import Link from "next/link";
import Stat from "@/components/Stat";
import DemandaChart from "@/components/DemandaChart";
import { lerConfig } from "@/lib/db/repo";
import { rodarEngine } from "@/lib/pcp/engine";
import { gerarAlertas, type Severidade } from "@/lib/pcp/alertas";
import { fmtDec1, fmtInt, fmtPct } from "@/lib/format";

export const dynamic = "force-dynamic";

const PASSOS = [
  {
    n: 1,
    titulo: "Cadastro",
    href: "/cadastro",
    o_que: "Registre componentes, custos, lead times e estoque atual.",
    dica: "É a base: tudo depois é calculado a partir daqui.",
  },
  {
    n: 2,
    titulo: "Previsão de demanda",
    href: "/previsao",
    o_que: "Lance as vendas históricas; o sistema testa 4 métodos e escolhe o melhor.",
    dica: "Recalibre todo mês com as vendas reais (menor MAPE = melhor).",
  },
  {
    n: 3,
    titulo: "Plano Mestre",
    href: "/plano-mestre",
    o_que: "Defina demanda e estoque desejado; veja quanto produzir por mês.",
    dica: "Confira a utilização da capacidade antes de fechar o plano.",
  },
  {
    n: 4,
    titulo: "MRP",
    href: "/mrp",
    o_que: "Explode a lista de materiais e mostra quando liberar cada pedido.",
    dica: "Atenção aos itens de lead time 2 meses (driver e placa LED).",
  },
  {
    n: 5,
    titulo: "Estoques",
    href: "/estoques",
    o_que: "Calcula lote econômico, estoque de segurança, ponto de pedido e curva ABC.",
    dica: "Foque o controle nos itens classe A (maior valor e risco).",
  },
  {
    n: 6,
    titulo: "Balanceamento",
    href: "/balanceamento",
    o_que: "Distribui as tarefas em estações e mostra eficiência e gargalo.",
    dica: "Arraste o tempo de ciclo para simular cenários de demanda.",
  },
];

const sevEstilo: Record<Severidade, { pill: string; rotulo: string }> = {
  alta: { pill: "pill-a", rotulo: "Alta" },
  media: { pill: "pill-b", rotulo: "Média" },
  baixa: { pill: "pill-c", rotulo: "Baixa" },
};

export default async function Inicio() {
  const cfg = await lerConfig();
  const r = rodarEngine(cfg);
  const { alertas } = gerarAlertas(cfg, r);

  const bal = r.balanceamento.proposta5;
  const metodo = r.previsao.metodos.find((m) => m.escolhido)!;
  const ultimoMes = r.verificacao[r.verificacao.length - 1];

  const reais = [...cfg.demanda]
    .sort((a, b) => a.mes - b.mes)
    .map((d) => ({ mes: d.mes, valor: d.vendas }));
  const previstos = [
    { mes: 13, valor: metodo.prev13 },
    { mes: 14, valor: metodo.prev14 },
    { mes: 15, valor: metodo.prev15 },
  ];
  const topAlertas = alertas.slice(0, 4);

  return (
    <div>
      {/* Boas-vindas */}
      <div className="rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-7 text-white">
        <div className="text-xs font-semibold uppercase tracking-wide text-white/70">
          Sistema de PCP — LuminaTech LUX-01
        </div>
        <h1 className="mt-1 text-2xl font-bold">
          Bem-vindo ao painel de gestão da produção
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/80">
          Esta plataforma integra previsão, plano mestre, materiais, estoques e
          balanceamento numa única tela. Edite qualquer dado e tudo recalcula em
          cascata. Comece pelas <strong>ações recomendadas</strong> abaixo ou
          siga o passo a passo.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/como-usar" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand hover:bg-white/90">
            📖 Como usar (guia completo)
          </Link>
          <Link href="/cadastro" className="rounded-lg border border-white/40 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
            Começar pelo Cadastro →
          </Link>
        </div>
      </div>

      {/* Ações recomendadas — o coração da gestão */}
      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">
            ⚡ Ações recomendadas hoje
          </h2>
          <Link href="/acoes" className="text-sm font-semibold text-brand hover:underline">
            Ver todas ({alertas.length}) →
          </Link>
        </div>

        {alertas.length === 0 ? (
          <div className="card text-sm text-slate-500">
            Nenhuma ação pendente. 🎉
          </div>
        ) : (
          <div className="space-y-2">
            {topAlertas.map((a) => (
              <Link
                key={a.id}
                href="/acoes"
                className="card flex items-start gap-4 transition hover:border-brand"
              >
                <span className={`badge ${sevEstilo[a.severidade].pill} mt-0.5 shrink-0`}>
                  {sevEstilo[a.severidade].rotulo}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-slate-800">{a.titulo}</div>
                  <div className="text-sm text-slate-500">{a.detalhe}</div>
                  <div className="mt-1 text-sm font-medium text-brand">
                    → {a.acao}
                  </div>
                </div>
                <span className="shrink-0 self-center text-slate-300">›</span>
              </Link>
            ))}
            {alertas.length > topAlertas.length && (
              <Link href="/acoes" className="block py-2 text-center text-sm font-medium text-brand hover:underline">
                + {alertas.length - topAlertas.length} outras ações na aba “Ações agora”
              </Link>
            )}
          </div>
        )}
      </section>

      {/* Tendência de demanda */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold text-slate-800">
          📈 Tendência de demanda
        </h2>
        <div className="card">
          <DemandaChart reais={reais} previstos={previstos} />
          <p className="mt-2 text-xs text-slate-500">
            Linha cheia = vendas reais (12 meses); tracejado = previsão escolhida
            ({metodo.rotulo}). A série cresce — por isso a regressão linear é a
            mais indicada.
          </p>
        </div>
      </section>

      {/* Saúde do sistema */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold text-slate-800">
          📊 Saúde do sistema
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            rotulo="Previsão (mês 15)"
            valor={fmtInt(metodo.prev15)}
            sub={`${metodo.rotulo} · MAPE ${fmtPct(metodo.mape)}`}
            cor="brand"
          />
          <Stat
            rotulo="Eficiência da linha"
            valor={fmtPct(bal.eficiencia)}
            sub={`${bal.numEstacoes} estações · gargalo ${fmtDec1(bal.gargalo)} min`}
            cor="emerald"
          />
          <Stat
            rotulo="Capacidade"
            valor={`${fmtInt(bal.capacidade)}/mês`}
            sub={`Utilização mês 15: ${fmtPct(ultimoMes.utilizacao)}`}
          />
          <Stat
            rotulo="Itens críticos (LT ≥ 2)"
            valor={String(r.mrp.filter((m) => m.critico).length)}
            sub={r.mrp.filter((m) => m.critico).map((i) => i.nome).join(", ")}
            cor="rose"
          />
        </div>
      </section>

      {/* Resultado vs plano */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold text-slate-800">
          🎯 Resultado vs plano
        </h2>
        <Link href="/execucao" className="card flex flex-wrap items-center justify-between gap-4 transition hover:border-brand">
          <div>
            <div className="text-sm text-slate-500">Aderência média da produção</div>
            <div className="text-3xl font-bold text-slate-800">
              {r.aderencia.mediaAderenciaProducao != null
                ? fmtPct(r.aderencia.mediaAderenciaProducao)
                : "—"}
            </div>
            <div className="text-xs text-slate-400">
              {r.aderencia.mesesExecutados} de {r.aderencia.linhas.length} meses lançados
            </div>
          </div>
          <span className="text-sm font-semibold text-brand">
            Lançar execução e ver aderência →
          </span>
        </Link>
      </section>

      {/* Como usar em 6 passos */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold text-slate-800">
          🚀 Como usar em 6 passos
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PASSOS.map((p) => (
            <Link key={p.n} href={p.href} className="card transition hover:border-brand">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                  {p.n}
                </span>
                <span className="font-semibold text-slate-800">{p.titulo}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{p.o_que}</p>
              <p className="mt-2 text-xs text-slate-400">💡 {p.dica}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
