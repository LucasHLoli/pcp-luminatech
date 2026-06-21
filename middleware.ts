// Protege todas as rotas, exceto a tela de login e os assets do Next.

import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const autenticado = req.cookies.get("pcp_sessao")?.value === "autenticado";
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/login")) {
    if (autenticado) return NextResponse.redirect(new URL("/", req.url));
    return NextResponse.next();
  }

  if (!autenticado) {
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
