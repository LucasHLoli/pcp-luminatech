// Formatação numérica em pt-BR.

export const nf0 = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
export const nf1 = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
export const nf2 = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const fmtInt = (v: number) => nf0.format(v);
export const fmtDec1 = (v: number) => nf1.format(v);
export const fmtDec2 = (v: number) => nf2.format(v);
export const fmtPct = (v: number) => `${nf1.format(v)}%`;
export const fmtBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const MESES_NOME: Record<number, string> = {
  13: "Mês 13", 14: "Mês 14", 15: "Mês 15",
};
