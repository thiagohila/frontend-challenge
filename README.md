# NFT Marketplace

Solução do desafio frontend — enunciado em [`docs/CHALLENGE.md`](docs/CHALLENGE.md), plano em [`docs/PLAN.md`](docs/PLAN.md).

> Em construção. Setup completo, cenários, credenciais fictícias e contratos serão documentados aqui.

## Setup
```bash
nvm use        # Node 22
npm ci
npx playwright install chromium
cp .env.example .env.local   # opcional; defaults já ligam os mocks
npm run dev
```

## Comandos
| Comando | Descrição |
|---|---|
| `npm run dev` | Dev server com mocks MSW |
| `npm run build` / `npm run preview` | Build otimizado / servir build |
| `npm run typecheck` / `npm run lint` | Tipos / lint (oxlint) |
| `npm run test:e2e` | Playwright (desktop + mobile, Chromium) |
| `npm run lighthouse` | Lighthouse 3× por página/perfil (com `preview` rodando) |
