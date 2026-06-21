import Link from "next/link";
import PageHeader from "@/components/PageHeader";

export const dynamic = "force-static";

function Secao({ children, titulo, n }: { children: React.ReactNode; titulo: string; n?: string }) {
  return (
    <section className="card">
      <h2 className="mb-3 text-lg font-bold text-slate-800">
        {n && <span className="mr-2 text-brand">{n}</span>}
        {titulo}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-slate-600">
        {children}
      </div>
    </section>
  );
}

export default function ComoUsar() {
  return (
    <div>
      <PageHeader
        secao="Guia"
        titulo="Como usar a plataforma"
        descricao="Do cadastro à decisão: como operar o sistema de PCP para gerir a produção da LUX-01 e ver resultados."
      />

      <div className="space-y-5">
        <Secao titulo="A ideia central" n="①">
          <p>
            Tudo no sistema parte de poucos <strong>dados de entrada</strong>{" "}
            (componentes, vendas, estoques, lead times). A partir deles, o
            sistema calcula em <strong>cascata</strong>: Previsão → Plano Mestre
            → MRP → Estoques → Balanceamento. Mudou um número? Tudo recalcula na
            hora. Você não preenche tabelas de resultado — você ajusta entradas
            e <strong>lê decisões</strong>.
          </p>
          <p className="rounded-lg bg-slate-50 p-3">
            🔑 <strong>Regra de ouro:</strong> mantenha os dados de entrada
            atualizados (vendas do mês, estoque atual, custos). A qualidade das
            decisões depende disso.
          </p>
        </Secao>

        <Secao titulo="O fluxo de trabalho (passo a passo)" n="②">
          <ol className="ml-4 list-decimal space-y-2">
            <li>
              <Link href="/cadastro" className="font-semibold text-brand">Cadastro</Link>{" "}
              — registre cada componente: quantidade por luminária, custo, lead
              time (meses até chegar), σ (variação da demanda) e o estoque que
              você tem hoje.
            </li>
            <li>
              <Link href="/previsao" className="font-semibold text-brand">Previsão</Link>{" "}
              — lance as vendas reais mês a mês. O sistema compara média móvel,
              média ponderada, suavização e regressão, e escolhe a de{" "}
              <strong>menor erro (MAD/MAPE)</strong>.
            </li>
            <li>
              <Link href="/plano-mestre" className="font-semibold text-brand">Plano Mestre</Link>{" "}
              — informe a demanda e o estoque final desejado de cada mês; o
              sistema calcula a <strong>produção planejada</strong> e verifica
              se cabe na capacidade.
            </li>
            <li>
              <Link href="/mrp" className="font-semibold text-brand">MRP</Link>{" "}
              — a partir do plano, explode a lista de materiais e diz{" "}
              <strong>quanto e quando comprar</strong> cada componente,
              descontando o estoque e recuando pelo lead time.
            </li>
            <li>
              <Link href="/estoques" className="font-semibold text-brand">Estoques</Link>{" "}
              — define a política de cada item: lote econômico (LEC), estoque de
              segurança, ponto de pedido e classe ABC.
            </li>
            <li>
              <Link href="/balanceamento" className="font-semibold text-brand">Balanceamento</Link>{" "}
              — mostra como dividir as 12 tarefas em estações, a eficiência da
              linha e o gargalo. Use o controle deslizante para simular.
            </li>
          </ol>
        </Secao>

        <Secao titulo="Rotina mensal de gestão (faça todo mês)" n="③">
          <p>Para a plataforma continuar útil, repita este ciclo a cada mês:</p>
          <ul className="ml-4 list-disc space-y-1.5">
            <li><strong>Atualize as vendas reais</strong> do mês que fechou em Previsão.</li>
            <li><strong>Atualize o estoque atual</strong> de cada componente em Cadastro.</li>
            <li><strong>Reveja o Plano Mestre</strong> para os próximos meses.</li>
            <li>
              Volte ao <Link href="/" className="font-semibold text-brand">Início</Link> e
              execute as <strong>Ações recomendadas</strong> (o que comprar/fazer hoje).
            </li>
            <li>Acompanhe se a previsão está acertando (MAPE caindo = bom).</li>
          </ul>
        </Secao>

        <Secao titulo="Como ler os resultados" n="④">
          <ul className="ml-4 list-disc space-y-1.5">
            <li>
              <strong>Ações recomendadas (Início):</strong> a lista do que
              precisa de decisão — itens abaixo do ponto de pedido, pedidos
              urgentes e meses com capacidade apertada. Comece sempre por aqui.
            </li>
            <li>
              <strong>MAPE (Previsão):</strong> erro percentual da previsão.
              Abaixo de ~5% é ótimo; acima de 15%, troque o método ou revise os
              dados.
            </li>
            <li>
              <strong>Utilização (Plano Mestre):</strong> % da capacidade usada.
              Acima de 85% acende alerta; acima de 100% o plano não cabe.
            </li>
            <li>
              <strong>Classe ABC (Estoques):</strong> onde concentrar o
              controle. Poucos itens (A) costumam representar a maior parte do
              valor — driver e placa LED no caso da LUX-01.
            </li>
            <li>
              <strong>Eficiência e gargalo (Balanceamento):</strong> quanto da
              linha é trabalho útil e qual estação limita o ritmo.
            </li>
          </ul>
        </Secao>

        <Secao titulo="Indicadores para monitorar" n="⑤">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Indicador</th>
                  <th>O que diz</th>
                  <th>Meta saudável</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>MAPE da previsão</td><td>Acerto da demanda</td><td>&lt; 5%</td></tr>
                <tr><td>Utilização do gargalo</td><td>Folga de capacidade</td><td>&lt; 85%</td></tr>
                <tr><td>Eficiência da linha</td><td>Trabalho útil x ocioso</td><td>&gt; 85%</td></tr>
                <tr><td>Itens abaixo do ponto de pedido</td><td>Risco de ruptura</td><td>0 (classe A)</td></tr>
                <tr><td>Pedidos fora do horizonte</td><td>Atraso de compra</td><td>0</td></tr>
              </tbody>
            </table>
          </div>
        </Secao>

        <Secao titulo="Dicas e segurança" n="⑥">
          <ul className="ml-4 list-disc space-y-1.5">
            <li>
              Todo dado editado é salvo no banco e vale para todos que acessam —
              é um ambiente compartilhado.
            </li>
            <li>
              Botão <strong>"↺ Restaurar dados LUX-01"</strong> (no Cadastro)
              devolve tudo aos valores originais do relatório, caso queira
              recomeçar uma simulação.
            </li>
            <li>
              Para experimentar livremente sem afetar o oficial, anote os
              valores antes ou restaure depois.
            </li>
          </ul>
        </Secao>
        <Secao titulo="Glossário (termos sem mistério)" n="⑦">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr><th>Termo</th><th>O que é, em palavras simples</th></tr>
              </thead>
              <tbody>
                <tr><td><strong>BOM / Lista de materiais</strong></td><td>A "receita" do produto: quais peças e quantas entram em cada unidade.</td></tr>
                <tr><td><strong>Lead time</strong></td><td>Tempo entre pedir e receber um componente.</td></tr>
                <tr><td><strong>Previsão</strong></td><td>Estimativa de quanto será vendido nos próximos meses.</td></tr>
                <tr><td><strong>MAPE</strong></td><td>Erro médio da previsão, em %. Menor é melhor.</td></tr>
                <tr><td><strong>Plano Mestre (PMP)</strong></td><td>Quanto produzir em cada mês.</td></tr>
                <tr><td><strong>MRP</strong></td><td>Cálculo do que comprar, quanto e quando, item a item.</td></tr>
                <tr><td><strong>LEC</strong></td><td>Lote econômico: quantidade ideal por pedido para gastar menos.</td></tr>
                <tr><td><strong>Estoque de segurança</strong></td><td>Colchão extra para não faltar peça em imprevistos.</td></tr>
                <tr><td><strong>Ponto de pedido</strong></td><td>Nível de estoque em que se deve comprar de novo.</td></tr>
                <tr><td><strong>Curva ABC</strong></td><td>Classifica itens por valor: poucos A (caros) × muitos C (baratos).</td></tr>
                <tr><td><strong>Gargalo</strong></td><td>O posto mais lento da linha — limita a produção de todos.</td></tr>
                <tr><td><strong>Takt / tempo de ciclo</strong></td><td>Ritmo necessário para atender a demanda no prazo.</td></tr>
              </tbody>
            </table>
          </div>
        </Secao>
      </div>

      <div className="mt-6 flex gap-3">
        <Link href="/" className="btn">← Voltar ao Início</Link>
        <Link href="/cadastro" className="btn-ghost">Ir para o Cadastro</Link>
      </div>
    </div>
  );
}
