"use client";

import { useState } from "react";
import type { ExecucaoMes } from "@/lib/pcp/types";
import { salvar } from "@/app/actions";
import SaveButton from "./SaveButton";

export default function ExecucaoEditor({
  inicial,
}: {
  inicial: ExecucaoMes[];
}) {
  const [meses, setMeses] = useState<ExecucaoMes[]>(inicial);

  function alterar(i: number, campo: keyof ExecucaoMes, valor: string) {
    setMeses((prev) => {
      const novo = [...prev];
      novo[i] = { ...novo[i], [campo]: Number(valor) };
      return novo;
    });
  }

  return (
    <div className="card overflow-x-auto">
      <div className="mb-3 flex items-center justify-between">
        <div className="card-title">Lançar execução real</div>
        <SaveButton onSave={() => salvar("execucao", JSON.stringify(meses))} />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Mês</th>
            <th className="text-right">Produzido (real)</th>
            <th className="text-right">Vendido (real)</th>
          </tr>
        </thead>
        <tbody>
          {meses.map((m, i) => (
            <tr key={m.mes}>
              <td className="font-medium">Mês {m.mes}</td>
              <td className="text-right">
                <input
                  type="number"
                  className="input w-32 text-right"
                  value={m.produzidoReal}
                  onChange={(e) => alterar(i, "produzidoReal", e.target.value)}
                />
              </td>
              <td className="text-right">
                <input
                  type="number"
                  className="input w-32 text-right"
                  value={m.vendidoReal}
                  onChange={(e) => alterar(i, "vendidoReal", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-slate-500">
        Deixe 0 nos meses que ainda não fecharam. Ao salvar, a aderência ao
        plano abaixo é recalculada.
      </p>
    </div>
  );
}
