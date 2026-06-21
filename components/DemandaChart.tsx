// Gráfico SVG leve (sem dependências) — demanda real × previsão.

interface Ponto {
  mes: number;
  valor: number;
}

export default function DemandaChart({
  reais,
  previstos,
}: {
  reais: Ponto[];
  previstos: Ponto[];
}) {
  const todos = [...reais, ...previstos];
  if (todos.length === 0) return null;

  const W = 720;
  const H = 240;
  const padL = 48;
  const padR = 16;
  const padT = 16;
  const padB = 28;

  const meses = todos.map((p) => p.mes);
  const minMes = Math.min(...meses);
  const maxMes = Math.max(...meses);
  const valores = todos.map((p) => p.valor);
  const maxVal = Math.max(...valores) * 1.05;
  const minVal = Math.min(...valores) * 0.9;

  const x = (mes: number) =>
    padL + ((mes - minMes) / (maxMes - minMes || 1)) * (W - padL - padR);
  const y = (val: number) =>
    H - padB - ((val - minVal) / (maxVal - minVal || 1)) * (H - padT - padB);

  const linha = (pts: Ponto[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"} ${x(p.mes)} ${y(p.valor)}`).join(" ");

  // Conecta o último real ao primeiro previsto (continuidade visual).
  const ponte =
    reais.length && previstos.length
      ? `M ${x(reais[reais.length - 1].mes)} ${y(reais[reais.length - 1].valor)} L ${x(previstos[0].mes)} ${y(previstos[0].valor)}`
      : "";

  // Linhas de grade (4 níveis de y).
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => minVal + t * (maxVal - minVal));

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Demanda real e prevista por mês">
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="#e2e8f0" strokeWidth={1} />
            <text x={padL - 6} y={y(t) + 3} textAnchor="end" fontSize={10} fill="#94a3b8">
              {Math.round(t).toLocaleString("pt-BR")}
            </text>
          </g>
        ))}
        {todos.map((p) => (
          <text key={p.mes} x={x(p.mes)} y={H - 8} textAnchor="middle" fontSize={10} fill="#94a3b8">
            {p.mes}
          </text>
        ))}

        {ponte && <path d={ponte} stroke="#14b8a6" strokeWidth={2} strokeDasharray="4 4" fill="none" />}
        <path d={linha(reais)} stroke="#0f766e" strokeWidth={2.5} fill="none" />
        <path d={linha(previstos)} stroke="#14b8a6" strokeWidth={2.5} strokeDasharray="4 4" fill="none" />

        {reais.map((p) => (
          <circle key={`r${p.mes}`} cx={x(p.mes)} cy={y(p.valor)} r={3} fill="#0f766e" />
        ))}
        {previstos.map((p) => (
          <circle key={`p${p.mes}`} cx={x(p.mes)} cy={y(p.valor)} r={3.5} fill="#14b8a6" stroke="#fff" strokeWidth={1} />
        ))}
      </svg>
      <div className="mt-1 flex gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <span className="inline-block h-0.5 w-4 bg-brand" /> Vendas reais
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-0.5 w-4 bg-brand-light" style={{ borderTop: "2px dashed" }} /> Previsão
        </span>
      </div>
    </div>
  );
}
