export default function PageHeader({
  titulo,
  descricao,
  secao,
}: {
  titulo: string;
  descricao?: string;
  secao?: string;
}) {
  return (
    <div className="mb-6">
      {secao && (
        <div className="text-xs font-semibold uppercase tracking-wide text-brand">
          {secao}
        </div>
      )}
      <h1 className="text-2xl font-bold text-slate-800">{titulo}</h1>
      {descricao && <p className="mt-1 text-sm text-slate-500">{descricao}</p>}
    </div>
  );
}
