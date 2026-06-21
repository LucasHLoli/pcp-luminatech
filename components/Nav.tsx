"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
];

export default function Nav() {
  const path = usePathname();
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="text-lg font-bold text-brand">PCP · LuminaTech</div>
        <div className="text-xs text-slate-500">Sistema LUX-01</div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {LINKS.map((l) => {
          const ativo = l.href === "/" ? path === "/" : path.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                ativo
                  ? "bg-brand text-white"
                  : "text-slate-600 hover:bg-slate-100"
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
  );
}
