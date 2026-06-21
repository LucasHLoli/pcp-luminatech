"use client";

import { useState } from "react";
import type { Tarefa } from "@/lib/pcp/types";
import { balancear } from "@/lib/pcp/balancing";
import { fmtDec1, fmtInt, fmtPct } from "@/lib/format";

export default function BalanceamentoExplorer({
  tarefas,
  tempoDisponivel,
}: {
  tarefas: Tarefa[];
  tempoDisponivel: number;
}) {
  const [ciclo, setCiclo] = useState(5.5);
  const r = balancear(tarefas, ciclo, tempoDisponivel);

  return (
    <div className="card">
      <div className="card-title mb-3">Explorador de balanceamento</div>
      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm font-medium text-slate-600">
          Tempo de ciclo alvo:
        </label>
        <input
          type="range"
          min={3}
          max={8}
          step={0.5}
          value={ciclo}
          onChange={(e) => setCiclo(Number(e.target.value))}
          className="flex-1 accent-brand"
        />
        <span className="w-20 text-right font-mono text-lg font-bold text-brand">
          {fmtDec1(ciclo)} min
        </span>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Mini rotulo="Estações" valor={String(r.numEstacoes)} />
        <Mini rotulo="Gargalo" valor={`${fmtDec1(r.gargalo)} min`} />
        <Mini rotulo="Eficiência" valor={fmtPct(r.eficiencia)} />
        <Mini rotulo="Capacidade" valor={`${fmtInt(r.capacidade)}/mês`} />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {r.estacoes.map((e) => (
          <div key={e.nome} className="rounded-lg border border-slate-200 p-3">
            <div className="text-sm font-bold text-brand">{e.nome}</div>
            <div className="my-1 text-xs text-slate-500">
              {e.tarefas.join(" · ")}
            </div>
            <div className="text-sm">
              <span className="font-semibold">{fmtDec1(e.tempo)}</span> min
            </div>
            <div className="text-xs text-amber-600">
              ócio {fmtDec1(e.ociosidade)}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Arraste o ciclo: 7,5 min reproduz a Proposta 1 (4 estações); 5,5 min, a
        Proposta 2 (5 estações, eficiência 89,1%) — a escolhida no relatório.
      </p>
    </div>
  );
}

function Mini({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 text-center">
      <div className="text-xs text-slate-500">{rotulo}</div>
      <div className="text-lg font-bold text-slate-800">{valor}</div>
    </div>
  );
}
