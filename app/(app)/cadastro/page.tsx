import PageHeader from "@/components/PageHeader";
import CadastroEditor from "@/components/CadastroEditor";
import RestaurarBotao from "@/components/RestaurarBotao";
import Explicador from "@/components/Explicador";
import { lerConfig } from "@/lib/db/repo";

export const dynamic = "force-dynamic";

export default async function CadastroPage() {
  const cfg = await lerConfig();
  return (
    <div>
      <div className="flex items-start justify-between">
        <PageHeader
          secao="Módulo 1"
          titulo="Cadastro"
          descricao="Produto, componentes (BOM), custos e lead times — a base de todos os cálculos."
        />
        <RestaurarBotao />
      </div>
      <Explicador>
        <p>
          Aqui ficam as <strong>peças que formam a luminária</strong> (a "receita"
          do produto) e os dados de cada uma: quantas entram em cada unidade,
          quanto custam, quanto tempo demoram para chegar (lead time), o quanto a
          demanda varia (σ) e o estoque que você tem hoje.
        </p>
        <p>
          👉 É a <strong>base de tudo</strong>: mudar qualquer número aqui
          recalcula automaticamente o MRP, os Estoques e o painel de decisões.
        </p>
      </Explicador>
      <CadastroEditor
        produto={cfg.produto}
        componentesIniciais={cfg.componentes}
      />
    </div>
  );
}
