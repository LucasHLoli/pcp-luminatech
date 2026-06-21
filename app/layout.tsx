import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PCP LuminaTech · LUX-01",
    template: "%s · PCP LuminaTech",
  },
  description:
    "Sistema de PCP da luminária LED LUX-01 — previsão, plano mestre, MRP, estoques, balanceamento e gestão da execução.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
