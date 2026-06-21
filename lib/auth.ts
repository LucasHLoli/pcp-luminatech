// Autenticação simples de demonstração (seção 11.4 do relatório):
// uma senha fixa (APP_PASSWORD) protege o app via cookie de sessão.

import { cookies } from "next/headers";

const COOKIE = "pcp_sessao";
const VALOR_OK = "autenticado";

export function senhaCorreta(senha: string): boolean {
  const esperada = process.env.APP_PASSWORD || "luminatech2026";
  return senha === esperada;
}

export function criarSessao() {
  cookies().set(COOKIE, VALOR_OK, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 horas
  });
}

export function encerrarSessao() {
  cookies().delete(COOKIE);
}

export function estaAutenticado(): boolean {
  return cookies().get(COOKIE)?.value === VALOR_OK;
}

export const USUARIO_DEMO = "admin@luminatech.com";
