# PCP LuminaTech — Protótipo de ERP da luminária LED LUX-01

Protótipo do sistema de PCP descrito na **Seção 11 (Blueprint do ERP)** do
relatório da Atividade II de PRO3445 (EP-USP). Coloca "em funcionamento" toda a
lógica das seções 2 a 10: cada alteração de input recalcula a cascata
**Previsão → Plano Mestre → MRP → Estoques → Balanceamento → Dashboard**.

## Stack

- **Next.js 14** (App Router, React, TypeScript) — interface web responsiva
- **Turso / libSQL** (SQLite na borda) — persistência dos inputs editáveis
- **Tailwind CSS** — estilo
- **Vercel** — hospedagem e deploy contínuo a partir do GitHub

O coração do sistema é um *engine* de funções puras em [`lib/pcp/`](lib/pcp),
validado para **reproduzir exatamente os números do relatório** (regressão,
balanceamento, PMP, MRP, LEC/SS/PP, ABC). Rode `npx tsx scripts/validar.ts`
para conferir.

## Módulos (Seção 11.3 do relatório)

| Módulo | O que faz |
|---|---|
| **Cadastro** | Produto, componentes (BOM), custos, lead times, σ, estoques |
| **Previsão** | 4 métodos (média móvel, ponderada, suavização, regressão) + MAD/MAPE |
| **Plano Mestre** | Produção planejada por mês + verificação de capacidade |
| **MRP** | Explosão da BOM, necessidades líquidas e liberações com lead time |
| **Estoques** | LEC, estoque de segurança, ponto de pedido e curva ABC |
| **Balanceamento** | Estações, eficiência, gargalo (explorador de tempo de ciclo) |
| **Dashboard** | Indicadores consolidados de controle |

## Rodar localmente

```bash
npm install
cp .env.example .env        # no Windows: copy .env.example .env
npm run dev                 # http://localhost:3000
```

Sem configurar nada, o banco cai para um arquivo local (`file:local.db`) e é
populado automaticamente com os dados da LUX-01. Login de demonstração:

- **Usuário:** `admin@luminatech.com` (apenas decorativo)
- **Senha:** valor de `APP_PASSWORD` no `.env` (padrão `luminatech2026`)

## Deploy na Vercel (passo a passo)

### 1. Criar o banco no Turso

1. Crie conta em <https://turso.tech> e instale a CLI (ou use o painel web).
2. Crie o banco e gere o token:
   ```bash
   turso db create pcp-luminatech
   turso db show pcp-luminatech --url      # -> libsql://...
   turso db tokens create pcp-luminatech   # -> token
   ```
   (Pelo painel web: **Create Database** → aba **Connect** copia a URL e o token.)

### 2. Subir o código para o GitHub

```bash
git init
git add .
git commit -m "Protótipo PCP LUX-01"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/pcp-luminatech.git
git push -u origin main
```

### 3. Publicar na Vercel

1. Em <https://vercel.com>, **Add New → Project** e importe o repositório.
2. Em **Environment Variables**, adicione:
   | Nome | Valor |
   |---|---|
   | `TURSO_DATABASE_URL` | a URL `libsql://...` do passo 1 |
   | `TURSO_AUTH_TOKEN` | o token do passo 1 |
   | `APP_PASSWORD` | a senha de demonstração que quiser |
3. Clique em **Deploy**. A cada `git push`, a Vercel republica automaticamente.

> Na primeira visita, o app cria a tabela e popula os dados da LUX-01 sozinho.
> Para repopular/zerar, use o botão **"↺ Restaurar dados LUX-01"** na tela de
> Cadastro (ou `npm run db:seed` apontando para o Turso).

### 4. Preencher a Seção 11.4 do relatório

Depois do deploy, a Vercel gera uma URL (ex.: `https://pcp-luminatech.vercel.app`).
Use-a no campo **Link de acesso** da Seção 11.4, com o usuário e a senha definidos.

## Estrutura

```
lib/pcp/        engine puro: forecast · capacity · balancing · mps · mrp · inventory · engine
lib/db/         cliente Turso, repositório (key-value JSON) e dados-semente
app/(app)/      páginas autenticadas dos módulos + dashboard
app/login/      tela de login simples
components/      UI (Nav, editores, tabelas)
scripts/        validar.ts — confere o engine contra o relatório
```

---
Projeto acadêmico — PRO3445 / EP-USP, 2026.
