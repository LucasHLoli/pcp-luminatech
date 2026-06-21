"use client";

import { toCSV } from "@/lib/csv";

export default function ExportButtons({
  csvData,
  csvNome,
}: {
  csvData?: Record<string, unknown>[];
  csvNome?: string;
}) {
  function baixarCSV() {
    if (!csvData || csvData.length === 0) return;
    // BOM para o Excel reconhecer UTF-8 (acentos).
    const conteudo = "﻿" + toCSV(csvData);
    const blob = new Blob([conteudo], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${csvNome || "dados"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex gap-2 print:hidden">
      {csvData && csvData.length > 0 && (
        <button onClick={baixarCSV} className="btn-ghost" title="Baixar planilha (Excel)">
          ⬇ CSV
        </button>
      )}
      <button onClick={() => window.print()} className="btn-ghost" title="Imprimir ou salvar como PDF">
        🖨 PDF
      </button>
    </div>
  );
}
