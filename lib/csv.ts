// Converte uma lista de objetos em CSV (separador ; — amigável ao Excel pt-BR).

export function toCSV(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const cabec = Object.keys(rows[0]);
  const escapar = (v: unknown) => {
    const s = v == null ? "" : String(v);
    if (/[;"\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const linhas = rows.map((r) => cabec.map((c) => escapar(r[c])).join(";"));
  return [cabec.join(";"), ...linhas].join("\r\n");
}
