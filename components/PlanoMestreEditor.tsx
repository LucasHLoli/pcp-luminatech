"use client";

import { useState } from "react";
import type { PlanoMestreMes } from "@/lib/pcp/types";
import { calcularPMP } from "@/lib/pcp/mps";
import { salvar } from "@/app/actions";
import { fmtInt } from "@/lib/format";
import SaveButton from "./SaveButton";

export default function PlanoMestreEditor({
  inicial,
}: {
  inicial: PlanoMestreMes[];
}) {
  const [meses, setMeses] = useState<PlanoMestreMes[]>(inicial);

  function alterar(i: number, campo: keyof PlanoMestreMes, valor: string) {
    setMeses((prev) => {
      const novo = [...prev];
      novo[i] = { ...novo[i], [campo]: Number(valor) };
      return novo;
    });
  }

  // Pré-visualização da produção planejada (mesma fórmula do engine).
  const previa = calcularPMP(meses);

  return (
    <div className="card overflow-x-auto">
      <div className="mb-3 flex items-center justify-between">
        <div className="card-title">Plano Mestre (meses 13–15)</div>
        <SaveButton onSave={() => salvar("planoMestre", JSON.stringify(meses))} />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Mês</th>
            <th className="text-right">Demanda</th>
            <th className="text-right">Estoque inicial</th>
            <th className="text-right">Estoque final desejado</th>
            <th className="text-right">Produção planejada</th>
          </tr>
        </thead>
        <tbody>
          {meses.map((m, i) => (
            <tr key={m.mes}>
              <td className="font-medium">Mês {m.mes}</td>
              <td className="text-right">
                <input
                  type="number"
                  className="input w-28 text-right"
                  value={m.demanda}
                  onChange={(e) => alterar(i, "demanda", e.target.value)}
                />
              </td>
              <td className="text-right">
                {i === 0 ? (
                  <input
                    type="number"
                    className="input w-28 text-right"
                    value={m.estoqueInicial}
                    onChange={(e) =>
                      alterar(i, "estoqueInicial", e.target.value)
                    }
                  />
                ) : (
                  <span className="text-slate-400">
                    {fmtInt(previa[i].estoqueInicial)} (encadeado)
                  </span>
                )}
              </td>
              <td className="text-right">
                <input
                  type="number"
                  className="input w-28 text-right"
                  value={m.estoqueFinalDesejado}
                  onChange={(e) =>
                    alterar(i, "estoqueFinalDesejado", e.target.value)
                  }
                />
              </td>
              <td className="text-right text-lg font-bold text-brand">
                {fmtInt(previa[i].producaoPlanejada)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-slate-500">
        P = Demanda + Estoque final desejado − Estoque inicial. O estoque final
        de um mês vira o inicial do próximo (encadeamento automático).
      </p>
    </div>
  );
}
