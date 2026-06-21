export default function Stat({
  rotulo,
  valor,
  sub,
  cor = "slate",
}: {
  rotulo: string;
  valor: string;
  sub?: string;
  cor?: "slate" | "brand" | "rose" | "amber" | "emerald";
}) {
  const cores: Record<string, string> = {
    slate: "text-slate-800",
    brand: "text-brand",
    rose: "text-rose-600",
    amber: "text-amber-600",
    emerald: "text-emerald-600",
  };
  return (
    <div className="card">
      <div className="card-title">{rotulo}</div>
      <div className={`mt-2 text-3xl font-bold ${cores[cor]}`}>{valor}</div>
      {sub && <div className="mt-1 text-xs text-slate-500">{sub}</div>}
    </div>
  );
}
