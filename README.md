# Kurio — Marketplace de NFTs

Solução do desafio frontend: descoberta, compra e conta do colecionador, desktop e mobile, com **backend 100% simulado** (MSW + Socket.IO simulado). Enunciado: [`docs/CHALLENGE.md`](docs/CHALLENGE.md).

- **Aplicação publicada:** https://kurio-gold.vercel.app (o rodapé e `/version.json` mostram o commit publicado)
- **Arquitetura, contratos e decisões:** [`ARCHITECTURE.md`](ARCHITECTURE.md)
- **Rastreabilidade requisito → teste:** [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md)
- **Registro de problemas por fase (causa, correção, prevenção):** [`docs/REVIEW-LOG.md`](docs/REVIEW-LOG.md)
- **Segurança:** [`docs/SECURITY.md`](docs/SECURITY.md) · **Design (extração do Figma):** [`docs/design/DESIGN.md`](docs/design/DESIGN.md)
- **Lighthouse:** [`docs/lighthouse/`](docs/lighthouse/)

## Stack

React 19 + TypeScript (strict) · Vite · TanStack Router · TanStack Query · Axios · Socket.IO (`socket.io-client`) · Tailwind CSS v4 · shadcn/ui · MSW 2 + `@mswjs/socket.io-binding` · Playwright · Lighthouse. Formulários: react-hook-form + zod. Valores em ETH: `decimal.js` (strings decimais, nunca `number`).

## Setup

Requisitos: **Node 22** (`.nvmrc`) e npm.

```bash
nvm use                      # Node 22
npm ci
npx playwright install chromium
npm run dev                  # http://localhost:5173 — mocks ligados por padrão
```

Não há serviços externos nem segredos: tudo roda a partir de um checkout limpo.

### Variáveis de ambiente (todas públicas, opcionais)

| Variável            | Padrão                     | Uso                                                        |
| ------------------- | -------------------------- | ---------------------------------------------------------- |
| `VITE_ENABLE_MOCKS` | `true`                     | liga o servidor simulado (também no build de demonstração) |
| `VITE_API_URL`      | `/api`                     | base das rotas REST                                        |
| `VITE_SOCKET_URL`   | `wss://realtime.nft.local` | endereço do Socket.IO (interceptado pelo MSW)              |

`.env.example` documenta as mesmas variáveis. Nunca coloque segredos em `VITE_*`: elas vão para o bundle.

### Credenciais fictícias

Todas com a senha **`Kurio2026!`**:

| Usuário    | E-mail             | Observação                                                                          |
| ---------- | ------------------ | ----------------------------------------------------------------------------------- |
| Ana Sato   | `ana@kurio.test`   | 2 carteiras (principal MetaMask/Ethereum, secundária Coinbase/Polygon), 2 favoritos |
| Bruno Lima | `bruno@kurio.test` | 1 carteira (WalletConnect/Ethereum)                                                 |
| Carol Reis | `carol@kurio.test` | conta **restrita**: navega, mas compra e cadastro de carteira respondem **403**     |

Cupons: **`KURIO10`** (10%, válido) · **`GENESIS20`** (expirado) · qualquer outro código é inválido.

## Comandos

| Comando                                                       | Descrição                                                                                              |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `npm run dev`                                                 | desenvolvimento com mocks                                                                              |
| `npm run build` / `npm run preview`                           | build otimizado / servir o build (porta 4173)                                                          |
| `npm run typecheck` · `npm run lint` · `npm run format:check` | tipos (src, testes e configs) · oxlint · Prettier                                                      |
| `npm run test:e2e`                                            | Playwright: unitários (Node) + E2E em Chromium **desktop (1440)**, **mobile (390)** e **tablet (768)** |
| `npm run test:e2e:ui`                                         | modo interativo                                                                                        |
| `npm run test:visual:docker`                                  | regressão visual em Linux (imagem oficial do Playwright)                                               |
| `npm run test:visual:docker:update`                           | regenera as baselines visuais (Linux)                                                                  |
| `npm run lighthouse`                                          | Lighthouse 3× por página/perfil (sobe e derruba o preview sozinho; requer `npm run build`)             |
| `npm run assets`                                              | regenera `public/assets` (AVIF/WebP) a partir dos exports do Figma                                     |
| `npm run audit:deps`                                          | `npm audit`                                                                                            |

Relatório HTML do Playwright: `npx playwright show-report` (traces das falhas incluídos). Os testes visuais são pulados fora do Linux, porque a renderização de fontes difere; rode-os pelo Docker.

## Servidor simulado

O MSW intercepta `/api/*` (service worker) e o WebSocket do Socket.IO (no navegador). O estado (catálogo, usuários, carrinhos, pedidos, carteiras…) fica num "banco" do **servidor simulado** em `localStorage` (`msw-server-db:v1`) e sobrevive a refresh. O app nunca lê esse armazenamento; ele contém todos os usuários, como o banco de um backend real.

### Cenários

Selecione com `?scenario=<nome>` na URL, por exemplo https://kurio-gold.vercel.app/?scenario=slow. A escolha fica na aba até ser trocada.

| Cenário                 | O que simula                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------ |
| `default`               | dados completos, latência 120–400 ms                                                 |
| `empty`                 | catálogo vazio                                                                       |
| `slow`                  | 2,5 s por requisição (skeletons)                                                     |
| `jitter`                | latência 100–1800 ms (respostas fora de ordem)                                       |
| `offline`               | sem conexão                                                                          |
| `server-error`          | 503 em todas as rotas                                                                |
| `session-expired`       | sessão expira 20 s após o login                                                      |
| `register-conflict`     | cadastro sempre em conflito (409)                                                    |
| `coupon-expired`        | todos os cupons expirados                                                            |
| `price-change-checkout` | o preço muda na confirmação (409 `QUOTE_STALE`)                                      |
| `sold-out-checkout`     | a edição esgota na confirmação                                                       |
| `order-timeout`         | o pedido é criado, mas a resposta não chega (timeout → recuperação por idempotência) |
| `payment-declined`      | pagamento recusado                                                                   |
| `wallet-rejected`       | a carteira recusa a conexão                                                          |
| `wallet-disconnect`     | a carteira desconecta 5 s após conectar                                              |
| `favorite-fail`         | favoritar falha (500)                                                                |
| `unauthorized`          | 403 em rotas privadas                                                                |

### API de controle (console do navegador)

`window.__mock` age **no servidor simulado**; as mudanças chegam ao app por REST e por eventos Socket.IO, nunca por estado do app.

```js
await __mock.reset() // restaura o seed (e limpa falhas injetadas)
await __mock.setScenario('payment-declined')
__mock.fail('/nfts', { status: 503 }, { times: 3 }) // falha pontual; clearFailures() remove
__mock.setLatency([100, 2000])
await __mock.updateNft('emerald-ape-042', { priceEth: '2.50' }) // REST + evento nft.updated
__mock.dropConnection() // derruba o socket (reconexão + reconciliação)
__mock.setOrderResolution(60000) // mantém novos pedidos pendentes por 60 s
await __mock.resolveOrder('<orderId>', 'confirmed')
await __mock.expireSession() // próxima chamada privada → 401
await __mock.snapshot() // estado do servidor (leitura)
```

## Como reproduzir os fluxos de falha

| Fluxo                                | Passos                                                                                                                                                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Carregamento lento e skeletons       | `/?scenario=slow`                                                                                                                                                                                      |
| Falha e nova tentativa               | console: `__mock.fail('/nfts', { status: 503 }, { times: 3 })` e troque de aba do catálogo; depois `__mock.clearFailures()` e "Tentar novamente"                                                       |
| Respostas fora de ordem              | `/?scenario=jitter` e troque filtros rapidamente: o resultado final é sempre o do último filtro                                                                                                        |
| Favorito com rollback                | entre como Ana, `/?scenario=favorite-fail`, clique no coração: ele marca e volta, com aviso                                                                                                            |
| Sessão expirada no meio do fluxo     | entre, comece a editar uma carteira ou o checkout, rode `__mock.expireSession()` e salve: o diálogo de reautenticação preserva a tela e o formulário                                                   |
| Cupom inválido/expirado              | carrinho → `XYZ` (inválido) / `GENESIS20` (expirado) / `KURIO10` (válido)                                                                                                                              |
| Preço muda durante a compra          | no checkout com a revisão aberta: `__mock.updateNft('emerald-ape-042', { priceEth: '1.50' })` → a revisão exige nova confirmação. Ou `/?scenario=price-change-checkout`                                |
| Pagamento recusado                   | `/?scenario=payment-declined` → recusa, itens continuam no carrinho                                                                                                                                    |
| Clique repetido / timeout            | `/?scenario=order-timeout` → um único pedido é criado e recuperado pela mesma Idempotency-Key                                                                                                          |
| Carteira recusa / desconecta         | `/?scenario=wallet-rejected` / `/?scenario=wallet-disconnect`                                                                                                                                          |
| Queda de conexão com pedido pendente | `__mock.setOrderResolution(60000)`, confirme a compra, recarregue (continua pendente, sem duplicar), `__mock.dropConnection()` e `__mock.resolveOrder(id, 'confirmed')` → o app reconecta e reconcilia |
| Acesso não autorizado                | entre como `carol@kurio.test` e tente cadastrar carteira ou comprar (403)                                                                                                                              |

## Testes

- **Unitários** (`tests/unit`, Node): dinheiro em decimal, contrato do servidor simulado (idempotência, cotação desatualizada, isolamento entre usuários, merge de carrinho), portão de eventos realtime (dedupe/versão/usuário).
- **E2E** (`e2e/`): os 12 cenários do enunciado §9 (T1–T12), contrato REST via service worker, axe (WCAG 2.1 AA) e ausência de overflow horizontal (390/768/1440; 320 px ≈ zoom 400%), em desktop e mobile, com estado isolado por teste.
- **Visual** (`e2e/visual.spec.ts`): início, detalhe, carrinho e pagamento × desktop/mobile, baselines Linux versionadas.

Mapa completo de specs e requisitos: `ARCHITECTURE.md` §12 e `docs/REQUIREMENTS.md`.

## Deploy

Vercel, conectado ao GitHub: cada push na `main` publica automaticamente. `vercel.json` configura o rewrite de SPA (acesso direto e refresh em qualquer rota), a CSP e os headers de segurança. Os mocks e o realtime funcionam no ambiente publicado.

## Limitações

Backend, carteiras, blockchain e pagamentos são simulados. O binding Socket.IO do MSW não tem rooms, ping nem ack (contornados no mock; ver `ARCHITECTURE.md` §10). Decisões de UX e desvios do Figma: `ARCHITECTURE.md` §15.
