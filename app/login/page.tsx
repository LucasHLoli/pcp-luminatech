import { redirect } from "next/navigation";
import { criarSessao, senhaCorreta, USUARIO_DEMO } from "@/lib/auth";

async function entrar(formData: FormData) {
  "use server";
  const senha = String(formData.get("senha") || "");
  if (senhaCorreta(senha)) {
    criarSessao();
    redirect("/");
  }
  redirect("/login?erro=1");
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { erro?: string };
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand to-brand-dark p-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="text-2xl font-bold text-brand">PCP · LuminaTech</div>
          <div className="mt-1 text-sm text-slate-500">
            Sistema de PCP — Luminária LUX-01
          </div>
        </div>
        <form action={entrar} className="space-y-4">
          <div>
            <label className="label">Usuário</label>
            <input
              className="input bg-slate-50"
              value={USUARIO_DEMO}
              readOnly
              name="usuario"
            />
          </div>
          <div>
            <label className="label">Senha</label>
            <input
              className="input"
              type="password"
              name="senha"
              placeholder="Senha de demonstração"
              autoFocus
            />
          </div>
          {searchParams?.erro && (
            <p className="text-sm text-rose-600">Senha incorreta.</p>
          )}
          <button className="btn w-full" type="submit">
            Entrar
          </button>
          <p className="text-center text-xs text-slate-400">
            Ambiente de demonstração com dados da LUX-01.
          </p>
        </form>
      </div>
    </div>
  );
}
