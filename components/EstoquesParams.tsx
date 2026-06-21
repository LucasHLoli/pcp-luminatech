"use client";

import { useState } from "react";
import type { ParametrosGerais } from "@/lib/pcp/types";
import { salvar } from "@/app/actions";
import SaveButton from "./SaveButton";

export default function EstoquesParams({
  parametros,
}: {
  parametros: ParametrosGerais;
}) {
  const [z, setZ] = useState(parametros.nivelServicoZ);
  const [h, setH] = useState(parametros.percentualH);
  const [d, setD] = useState(parametros.demandaMensalBase);

  return (
    <div className="card">
      <div className="mb-3 flex items-center justify-between">
        <div className="card-title">Premissas das políticas de estoque</div>
        <SaveButton
          onSave={() =>
            salvar("parametros", JSON.stringify({
              ...parametros,
              nivelServicoZ: z,
              percentualH: h,
              demandaMensalBase: d,
            }))
          }
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Nível de serviço — z</label>
          <input
            type="number"
            step="0.01"
            className="input"
            value={z}
            onChange={(e) => setZ(Number(e.target.value))}
          />
          <p className="mt-1 text-xs text-slate-400">1,65 ≈ 95%</p>
        </div>
        <div>
          <label className="label">Custo de manter (% do custo unitário)</label>
          <input
            type="number"
            step="0.05"
            className="input"
            value={h}
            onChange={(e) => setH(Number(e.target.value))}
          />
          <p className="mt-1 text-xs text-slate-400">H = % × custo · ao ano</p>
        </div>
        <div>
          <label className="label">Demanda mensal de referência</label>
          <input
            type="number"
            className="input"
            value={d}
            onChange={(e) => setD(Number(e.target.value))}
          />
          <p className="mt-1 text-xs text-slate-400">un./mês do produto</p>
        </div>
      </div>
    </div>
  );
}
