"use client";

import { useState } from "react";
import type { DemandaMes, ParametrosGerais } from "@/lib/pcp/types";
import { salvar } from "@/app/actions";
import SaveButton from "./SaveButton";

const NOMES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export default function PrevisaoEditor({
  demandaInicial,
  parametros,
}: {
  demandaInicial: DemandaMes[];
  parametros: ParametrosGerais;
}) {
  const [demanda, setDemanda] = useState<DemandaMes[]>(demandaInicial);
  const [alpha, setAlpha] = useState(parametros.alpha);
  const [janela, setJanela] = useState(parametros.janelaMM);

  async function salvarTudo() {
    await salvar("demanda", JSON.stringify(demanda));
    await salvar(
      "parametros",
      JSON.stringify({ ...parametros, alpha, janelaMM: janela })
    );
  }

  return (
    <div className="card">
      <div className="mb-3 flex items-center justify-between">
        <div className="card-title">Série histórica e parâmetros</div>
        <SaveButton onSave={salvarTudo} />
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {demanda.map((d, i) => (
          <div key={d.mes}>
            <label className="label">{NOMES[i]} (m{d.mes})</label>
            <input
              type="number"
              className="input text-right"
              value={d.vendas}
              onChange={(e) =>
                setDemanda((prev) => {
                  const novo = [...prev];
                  novo[i] = { ...novo[i], vendas: Number(e.target.value) };
                  return novo;
                })
              }
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-6">
        <div>
          <label className="label">Janela média móvel (n)</label>
          <input
            type="number"
            min={2}
            max={6}
            className="input w-24"
            value={janela}
            onChange={(e) => setJanela(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="label">α (suavização exponencial)</label>
          <input
            type="number"
            step="0.05"
            min={0.05}
            max={0.95}
            className="input w-24"
            value={alpha}
            onChange={(e) => setAlpha(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
