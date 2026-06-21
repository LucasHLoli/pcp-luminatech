import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PCP LuminaTech · LUX-01",
  description:
    "Protótipo de ERP/PCP para a luminária LED LUX-01 — PRO3445, EP-USP.",
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
