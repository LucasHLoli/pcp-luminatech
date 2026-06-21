import PageHeader from "@/components/PageHeader";
import CadastroEditor from "@/components/CadastroEditor";
import RestaurarBotao from "@/components/RestaurarBotao";
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
      <CadastroEditor
        produto={cfg.produto}
        componentesIniciais={cfg.componentes}
      />
    </div>
  );
}
