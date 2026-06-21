# Como usar — PCP LuminaTech (LUX-01)

Guia prático para operar a plataforma como ferramenta de **gestão da
produção**, não apenas como relatório.

> Versão em tela: faça login e abra **Início → "Como usar (guia completo)"**.
> Este arquivo é a versão de referência/impressão.

---

## 1. A ideia central

Tudo parte de poucos **dados de entrada** (componentes, vendas, estoques, lead
times). A partir deles o sistema calcula em **cascata**:

```
Previsão → Plano Mestre → MRP → Estoques → Balanceamento → Início (decisões)
```

Mudou um número em qualquer módulo? Tudo recalcula na hora. Você não preenche
tabelas de resultado — você ajusta entradas e **lê decisões**.

🔑 **Regra de ouro:** mantenha os dados de entrada atualizados. A qualidade das
decisões depende disso.

---

## 2. Acesso

- URL: a gerada pela Vercel (ex.: `https://pcp-luminatech.vercel.app`)
- Usuário: `admin@luminatech.com` (decorativo)
- Senha: o valor de `APP_PASSWORD` (padrão `luminatech2026`)

---

## 3. Fluxo de trabalho (uma vez, para configurar)

| Passo | Módulo | O que fazer |
|---|---|---|
| 1 | **Cadastro** | Componentes: qtd por luminária, custo, lead time, σ e estoque atual |
| 2 | **Previsão** | Lançar vendas históricas → sistema escolhe o método de menor erro |
| 3 | **Plano Mestre** | Demanda e estoque desejado por mês → produção planejada |
| 4 | **MRP** | Explosão da BOM → quanto e quando comprar cada item |
| 5 | **Estoques** | LEC, estoque de segurança, ponto de pedido e curva ABC |
| 6 | **Balanceamento** | Estações, eficiência, gargalo (simulador de tempo de ciclo) |

---

## 4. Rotina mensal (o que mantém vivo)

Todo mês, ao fechar as vendas:

1. **Previsão** → lance as vendas reais do mês.
2. **Cadastro** → atualize o estoque atual de cada componente.
3. **Plano Mestre** → revise os próximos meses.
4. **Início** → execute as **Ações recomendadas** (comprar/produzir).
5. Acompanhe o **MAPE** (previsão acertando?) e a **utilização** (capacidade).

---

## 5. Ações recomendadas (a tela de decisão)

No **Início**, o sistema gera automaticamente uma lista priorizada:

- 🔴 **Compra** — itens no/abaixo do ponto de pedido → "emitir pedido de X un."
- 🔴 **Prazo** — pedidos cujo lead time exige liberação antes do horizonte → "pedir já"
- 🟡 **Capacidade** — meses com utilização > 85% (ou > 100%)

Cada ação é clicável e leva ao módulo correspondente. **Comece o dia por aqui.**

---

## 6. Como ler os indicadores

| Indicador | O que diz | Meta saudável |
|---|---|---|
| MAPE da previsão | Acerto da demanda | < 5% |
| Utilização do gargalo | Folga de capacidade | < 85% |
| Eficiência da linha | Trabalho útil × ocioso | > 85% |
| Itens abaixo do ponto de pedido | Risco de ruptura | 0 (classe A) |
| Pedidos fora do horizonte | Atraso de compra | 0 |

---

## 7. Dicas

- Ambiente **compartilhado**: o que um edita, todos veem.
- **"↺ Restaurar dados LUX-01"** (no Cadastro) devolve tudo ao estado original.
- Para simular sem afetar o oficial: anote os valores antes ou restaure depois.

---

## 8. Próximas evoluções sugeridas

Veja o roadmap em [ROADMAP.md](ROADMAP.md) — registro de execução real
(produzido × planejado), histórico/tendências, múltiplos produtos e exportação.
