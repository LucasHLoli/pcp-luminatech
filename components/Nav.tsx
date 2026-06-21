"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "Início", icon: "▤" },
  { href: "/acoes", label: "Ações agora", icon: "⚡" },
  { href: "/como-usar", label: "Como usar", icon: "📖" },
  { href: "/cadastro", label: "Cadastro", icon: "▦" },
  { href: "/previsao", label: "Previsão", icon: "📈" },
  { href: "/plano-mestre", label: "Plano Mestre", icon: "🗓" },
  { href: "/mrp", label: "MRP", icon: "🧮" },
  { href: "/estoques", label: "Estoques", icon: "📦" },
  { href: "/balanceamento", label: "Balanceamento", icon: "⚖" },
  { href: "/execucao", label: "Execução", icon: "✅" },
];

export default function Nav() {
  const path = usePathname();
  const [aberto, setAberto] = useState(false);

  return (
    <>
      {/* Barra superior (apenas no celular) */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden print:hidden">
        <div>
          <span className="font-bold text-brand">PCP · LuminaTech</span>
        </div>
        <button
          onClick={() => setAberto((v) => !v)}
          aria-label="Abrir menu"
          className="rounded-lg p-2 text-2xl leading-none text-slate-600 hover:bg-slate-100"
        >
          {aberto ? "✕" : "☰"}
        </button>
      </div>

      {/* Fundo escuro do menu mobile */}
      {aberto && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setAberto(false)}
        />
      )}

      {/* Barra lateral — fixa no desktop, gaveta deslizante no celular */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white transition-transform md:static md:translate-x-0 print:hidden ${
          aberto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="text-lg font-bold text-brand">PCP · LuminaTech</div>
          <div className="text-xs text-slate-500">Sistema LUX-01</div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {LINKS.map((l) => {
            const ativo = l.href === "/" ? path === "/" : path.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setAberto(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  ativo ? "bg-brand text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="w-5 text-center">{l.icon}</span>
                {l.label}
              </Link>
            );
          })}
        </nav>
        <form action="/api/logout" method="post" className="border-t border-slate-200 p-3">
          <button className="btn-ghost w-full" type="submit">Sair</button>
        </form>
      </aside>
    </>
  );
}
