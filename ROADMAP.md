# Análise & Roadmap — PCP LuminaTech

Análise crítica do protótipo e plano de evolução para virar uma ferramenta de
gestão contínua, online e orientada a resultados.

## ✅ O que já está sólido

- **Engine determinístico e correto** — reproduz exatamente os números do
  relatório (validado em `scripts/validar.ts`).
- **Cascata real** — editar uma entrada recalcula previsão → plano → MRP →
  estoques → balanceamento.
- **Camada de decisão** — a tela Início converte cálculos em **ações**
  (comprar, pedir já, capacidade), não só tabelas.
- **Online e persistente** — Next.js + Turso na Vercel, deploy contínuo.
- **Onboarding** — landing pós-login + guia "Como usar".

## ⚠️ Lacunas para virar gestão de verdade

| # | Lacuna | Impacto | Esforço |
|---|---|---|---|
| 1 | **Não registra execução real** (produzido, vendido, recebido) | Sem isso não há aderência ao plano, OTIF, ruptura real | Médio |
| 2 | **Sem histórico/tendência** | Não dá para "ver resultado ao longo do tempo" | Médio |
| 3 | **Previsão recalibra manualmente** | Deveria puxar vendas reais automaticamente | Baixo |
| 4 | **Um único produto / um cenário** | Negócio real tem vários SKUs e cenários salvos | Médio |
| 5 | **Auth fraca (senha única)** | Sem usuários/papéis, sem trilha de quem mudou o quê | Médio |
| 6 | **Sem exportação** (PDF/Excel) | Relatórios para a diretoria/professor | Baixo |
| 7 | **Sem gráficos** | Demanda, ABC e capacidade pedem visual | Baixo |
| 8 | **Sem auditoria/log de alterações** | Rastreabilidade das decisões | Médio |

## 🗺️ Roadmap por ondas

### Onda 1 — Decisão e didática ✅ (feito)
- [x] Tela Início com **ações recomendadas** + gráfico de demanda × previsão
- [x] **Aba "Ações agora"** — central de decisão do cliente (por quê / se ignorar / o que fazer)
- [x] **Explicadores** em cada módulo (linguagem de cliente, recolhíveis)
- [x] Guia "Como usar" + **glossário** + HOW-TO-USE
- [x] Indicadores de saúde

### Onda 2 — Resultados ao longo do tempo (próxima)
- [ ] **Registro de execução**: lançar produção/vendas reais por mês
- [ ] **Aderência ao plano** (planejado × realizado) e **índice de ruptura**
- [ ] **Gráficos**: demanda × previsão, curva ABC, utilização por mês
- [ ] **Realimentar a previsão** com as vendas reais automaticamente

### Onda 3 — Escala de negócio
- [ ] **Múltiplos produtos/SKUs** (BOM por produto)
- [ ] **Cenários salvos** (base, otimista, pessimista) comparáveis
- [ ] **Usuários e papéis** (gestor/operador) + trilha de auditoria
- [ ] **Exportação** PDF/Excel dos planos e indicadores
- [ ] **Notificações** (e-mail) quando um item cruzar o ponto de pedido

## 💡 Como cada onda gera "resultado visível"

- **Onda 1:** o gestor abre o sistema e já sabe *o que fazer hoje*.
- **Onda 2:** vê *se as decisões funcionaram* (previsão acertou? evitou
  ruptura? cumpriu o plano?).
- **Onda 3:** opera *o negócio inteiro* (vários produtos, equipe, histórico)
  com relatórios para apresentar.
