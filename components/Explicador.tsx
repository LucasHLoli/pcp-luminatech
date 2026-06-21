// Caixa didática reutilizável: explica, em linguagem simples, o que o módulo
// faz e por que importa para o negócio. É recolhível para não poluir.

"use client";

import { useState } from "react";

export default function Explicador({
  titulo = "Entenda este módulo",
  children,
}: {
  titulo?: string;
  children: React.ReactNode;
}) {
  const [aberto, setAberto] = useState(true);
  return (
    <div className="mb-6 rounded-xl border border-brand/20 bg-brand/5">
      <button
        onClick={() => setAberto((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-brand">
          💡 {titulo}
        </span>
        <span className="text-brand">{aberto ? "−" : "+"}</span>
      </button>
      {aberto && (
        <div className="space-y-2 px-4 pb-4 text-sm leading-relaxed text-slate-600">
          {children}
        </div>
      )}
    </div>
  );
}
