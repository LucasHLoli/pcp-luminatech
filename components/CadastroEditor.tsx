"use client";

import { useState } from "react";
import type { Componente, Produto } from "@/lib/pcp/types";
import { salvar } from "@/app/actions";
import SaveButton from "./SaveButton";

const COLS: { campo: keyof Componente; label: string; step?: string }[] = [
  { campo: "qtdPorUnidade", label: "Qtd/un.", step: "1" },
  { campo: "custoUnitario", label: "Custo (R$)", step: "0.01" },
  { campo: "leadTime", label: "Lead time (mês)", step: "1" },
  { campo: "custoPedido", label: "Custo pedido (R$)", step: "1" },
  { campo: "sigma", label: "σ demanda", step: "1" },
  { campo: "estoqueInicial", label: "Estoque inicial", step: "1" },
];

export default function CadastroEditor({
  produto,
  componentesIniciais,
}: {
  produto: Produto;
  componentesIniciais: Componente[];
}) {
  const [comps, setComps] = useState<Componente[]>(componentesIniciais);

  function alterar(i: number, campo: keyof Componente, valor: string) {
    setComps((prev) => {
      const novo = [...prev];
      novo[i] = { ...novo[i], [campo]: Number(valor) };
      return novo;
    });
  }

  return (
    <div className="card overflow-x-auto">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="card-title">Estrutura do produto (BOM)</div>
          <div className="text-xs text-slate-500">
            {produto.codigo} — {produto.descricao}
          </div>
        </div>
        <SaveButton
          onSave={() => salvar("componentes", JSON.stringify(comps))}
        />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Componente</th>
            {COLS.map((c) => (
              <th key={c.campo} className="text-right">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comps.map((c, i) => (
            <tr key={c.codigo}>
              <td className="font-mono text-xs">{c.codigo}</td>
              <td>{c.nome}</td>
              {COLS.map((col) => (
                <td key={col.campo} className="text-right">
                  <input
                    type="number"
                    step={col.step}
                    className="input w-24 text-right"
                    value={c[col.campo] as number}
                    onChange={(e) => alterar(i, col.campo, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-slate-500">
        Alterar custo, lead time ou estoque aqui recalcula MRP, Estoques e o
        Dashboard automaticamente.
      </p>
    </div>
  );
}
