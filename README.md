# Kurio — Marketplace de NFTs

[![CI](https://github.com/thiagohila/frontend-challenge/actions/workflows/ci.yml/badge.svg)](https://github.com/thiagohila/frontend-challenge/actions/workflows/ci.yml)

Solução do desafio frontend: descoberta, compra e conta do colecionador, desktop e mobile, com **backend 100% simulado** (MSW + Socket.IO simulado). Enunciado: [`docs/CHALLENGE.md`](docs/CHALLENGE.md).

- **Aplicação publicada:** https://kurio-gold.vercel.app (o rodapé e `/version.json` mostram o commit publicado)
- **Arquitetura, contratos e decisões:** [`ARCHITECTURE.md`](ARCHITECTURE.md)
- **Rastreabilidade requisito → teste:** [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md)
- **Registro de problemas por fase (causa, correção, prevenção):** [`docs/REVIEW-LOG.md`](docs/REVIEW-LOG.md)
- **Segurança:** [`docs/SECURITY.md`](docs/SECURITY.md) · **Design (extração do Figma):** [`docs/design/DESIGN.md`](docs/design/DESIGN.md)
- **Lighthouse:** [`docs/lighthouse/`](docs/lighthouse/)

## Entrega

| Item                                                           | Onde                                                                     |
| -------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Repositório                                                    | https://github.com/thiagohila/frontend-challenge (branch `main`)         |
| Aplicação publicada                                            | https://kurio-gold.vercel.app (`/version.json` = commit publicado)       |
| Relatório Playwright (checkout limpo)                          | [`docs/playwright-report/index.html`](docs/playwright-report/index.html) |
| Lighthouse (3× por página/perfil, mediana)                     | [`docs/lighthouse/README.md`](docs/lighthouse/README.md)                 |
| Contratos, sessão, carrinho, cache, realtime, desvios do Figma | [`ARCHITECTURE.md`](ARCHITECTURE.md) (§4–§10, §15)                       |

### Como avaliar em 5 minutos

1. Abra https://kurio-gold.vercel.app e entre com `ana@kurio.test` / `Kurio2026!` (botão **Entrar**; o login abre sobre a página atual).
2. Busque, filtre e ordene no **Mercado**; tudo fica na URL (voltar/avançar restauram).
3. Abra um NFT, adicione ao carrinho, aplique o cupom `KURIO10` e finalize: conectar carteira → **Confirmar compra** → revisão → recibo (pendente → confirmado).
4. Abra a aba **"Servidor simulado (admin)"** na borda esquerda e mude o preço do NFT aberto: a página atualiza via Socket.IO, sem recarregar. No mesmo painel, troque para `payment-declined`, `order-timeout`, `slow` ou `offline` e refaça o fluxo para ver falha e recuperação (trocar de cenário restaura o seed: entre de novo).
5. Repita no celular (ou DevTools em 390 px): layout mobile do Figma.

**Decisões e trade-offs principais:** backend 100% simulado na página (MSW + binding Socket.IO), então a **performance mobile fica abaixo de 90** (causas medidas e justificadas em `docs/lighthouse/README.md`); o checkout usa as carteiras cadastradas no perfil; todo estado de busca, filtro, página e login (`?auth=`) fica na URL.

### Melhorias possíveis

**Performance mobile no Lighthouse** (hoje, mediana de 3: **73** no início e **82** no detalhe; Acessibilidade, Boas práticas e SEO já estão em **100** em todas as páginas e perfis, e a Performance desktop em 99). As causas estão medidas em [`docs/lighthouse/README.md`](docs/lighthouse/README.md); o ganho vem de tirar trabalho do thread principal e pintar antes do JS:

1. **Servidor simulado fora do thread principal**: rodar os handlers e o "banco" num Web Worker (ou SharedWorker) em vez de na página. O script do MSW é o maior custo medido (~1,5 s com CPU 4× mais lenta) e a maior parte do TBT; num backend real ele simplesmente não existiria. De quebra, um SharedWorker deixaria o painel admin agir em várias abas.
2. **Pré-renderização (SSG) do shell e da primeira página do catálogo** (TanStack Start/SSR ou prerender no build): o HTML já chega com o hero e os cards, e o FCP (~2,9 s) deixa de esperar o bundle.
3. **LCP do primeiro card**: a imagem só é pedida quando a lista chega da API (servidor simulado na página). Já aplicado na entrega: a primeira linha do catálogo usa `loading="eager"` + `fetchpriority="high"` (antes saía `lazy`), e a arte do detalhe também. Com o item 2, ela entraria direto no HTML.
4. **Imagens**: já são AVIF/WebP com `srcset` e dimensões fixas (CLS 0). O próximo passo é um tamanho dedicado ao card mobile de 175 px (menos bytes no 4G simulado) e um placeholder de baixa resolução (blur-up) no lugar do shimmer, que melhora a percepção de carregamento. Imagem "progressiva" ajuda a percepção, mas não o LCP, porque o Lighthouse conta a imagem final.
5. **Menos JS na entrada**: dividir mais o Radix e o zod por rota e adiar o `socket.io-client` até a primeira interação que precise de tempo real.

**Resiliência** (o que já está aplicado: `ARCHITECTURE.md` §6, "Resiliência")

- **Jitter no retry das consultas**: hoje o backoff é exponencial, mas determinístico (500 ms → 1 s → 2 s). Aleatorizar o atraso (como já faz a reconexão do Socket.IO) evita que muitos clientes tentem de novo no mesmo instante depois de uma queda.
- **Uso offline de verdade (PWA)**: service worker de produção com cache do shell e dos assets, mais o último catálogo e carrinho, e um aviso "você está offline" com o `onlineManager` do TanStack Query. Hoje há só a indisponibilidade simulada (cenário `offline`). Detalhe a tratar: sem internet, o Query pausa as consultas por padrão, mesmo com o servidor simulado na página.
- **Fila de mutations offline**: guardar favoritos e itens de carrinho feitos sem conexão e reenviar ao voltar (`persistQueryClient` + mutations pausadas).

**Produto e qualidade**

- Mensagens de erro do servidor simulado também em inglês (`Accept-Language`; hoje só a interface é traduzida).
- Teste manual com leitor de tela (VoiceOver/NVDA) nos fluxos de login, catálogo e checkout; os automatizados (axe, teclado, foco) já passam.
- Servidor Socket.IO real (com rooms/ack) no lugar do binding do MSW, e testes de componente para os formulários.
- Instabilidade rara vista 1× em 236 num checkout limpo (`account.spec`, perfil): uma requisição ao service worker ficou presa até o timeout de 10 s do Axios; o app se recupera no retry, mas o teste espera os mesmos 10 s. Melhoria: investigar a requisição presa no MSW (o clone final rodou 238/238 sem instabilidade).

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

Relatório HTML do Playwright: `npx playwright show-report` (traces das falhas incluídos). Relatório da entrega (238 testes aprovados, 0 instáveis, num clone limpo do GitHub de `20b2953`, macOS, 4 projetos): [`docs/playwright-report/index.html`](docs/playwright-report/index.html); visuais (8/8) aprovados no Docker Linux. Os testes visuais são pulados fora do Linux, porque a renderização de fontes difere; rode-os pelo Docker.

## Idioma e formato de hora (extras)

No rodapé: **Idioma** (Português/English) e **Formato de hora** (padrão do idioma, 12 h, 24 h). As escolhas ficam no navegador (`kurio:prefs`), atualizam `<html lang>` e o título da página. O formato de hora aparece no explorador de transações. Mensagens geradas pelo servidor simulado continuam em pt-BR (`ARCHITECTURE.md` §15).

## Servidor simulado

O MSW intercepta `/api/*` (service worker) e o WebSocket do Socket.IO (no navegador). O estado (catálogo, usuários, carrinhos, pedidos, carteiras…) fica num "banco" do **servidor simulado** em `localStorage` (`msw-server-db:v1`) e sobrevive a refresh. O app nunca lê esse armazenamento; ele contém todos os usuários, como o banco de um backend real.

### Painel "Servidor simulado (admin)"

Com os mocks ligados (inclusive na URL pública), a aba vertical **"Servidor simulado (admin)"** na borda esquerda abre um painel lateral não modal: a página continua visível para acompanhar as mudanças chegando. Ele troca e **restaura** cenários, força latência, altera **preço e estoque** de um NFT e a taxa de rede, derruba a conexão Socket.IO, expira sessões e confirma/recusa pedidos pendentes. Age **só** pela API de controle do servidor simulado (`window.__mock`): cada mudança chega ao app por REST e pelo evento Socket.IO correspondente, como num backend real. Exemplo: abra `/nft/emerald-ape-042`, mude o preço no painel e veja a página atualizar e anunciar a mudança sem recarregar. Atua na aba atual (o servidor simulado vive na página). Nos testes automatizados ele fica oculto, a não ser que o teste peça (`e2e/mock-panel.spec.ts`).

### Cenários

Selecione com `?scenario=<nome>` na URL, por exemplo https://kurio-gold.vercel.app/?scenario=slow. Trocar de cenário pela URL **restaura o seed daquele cenário** (ex.: `empty` zera o catálogo), e a escolha fica na aba até ser trocada.

**Reset:** `?scenario=default` volta ao padrão com o seed original; no console, `await __mock.reset()` restaura o seed do cenário atual e `await __mock.reset('default')` volta ao padrão. O reset também limpa latência forçada, falhas injetadas, gatilhos únicos já consumidos (ex.: a corrida de preço de `price-change-checkout`) e a resolução de pedidos forçada, e derruba os sockets para o app reconectar e reconciliar com o REST.

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
await __mock.reset() // seed + condições do cenário atual; reset('default') volta ao padrão
await __mock.setScenario('payment-declined')
__mock.fail('/nfts', { status: 503 }, { times: 3 }) // falha pontual com o código do status; clearFailures() remove
__mock.setLatency([100, 2000])
await __mock.updateNft('emerald-ape-042', { priceEth: '2.50' }) // REST + evento nft.updated
await __mock.setNetworkFee('ethereum', '0.020') // cotação aberta fica desatualizada → nova confirmação
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
| Taxa ou estoque mudam na compra      | revisão aberta: `__mock.setNetworkFee('ethereum', '0.020')` → nova confirmação; `/?scenario=sold-out-checkout` → nenhum pedido, aviso "Esgotado: …"                                                    |
| Pagamento recusado                   | `/?scenario=payment-declined` → recusa, itens continuam no carrinho                                                                                                                                    |
| Clique repetido / timeout            | `/?scenario=order-timeout` → um único pedido é criado e recuperado pela mesma Idempotency-Key                                                                                                          |
| Carteira recusa / desconecta         | `/?scenario=wallet-rejected` / `/?scenario=wallet-disconnect`                                                                                                                                          |
| Queda de conexão com pedido pendente | `__mock.setOrderResolution(60000)`, confirme a compra, recarregue (continua pendente, sem duplicar), `__mock.dropConnection()` e `__mock.resolveOrder(id, 'confirmed')` → o app reconecta e reconcilia |
| Acesso não autorizado                | entre como `carol@kurio.test` e tente cadastrar carteira ou comprar (403)                                                                                                                              |

## Testes

- **Unitários** (`tests/unit`, Node): dinheiro em decimal, contrato do servidor simulado (idempotência, cotação desatualizada, isolamento entre usuários, merge de carrinho), portão de eventos realtime (dedupe/versão/usuário).
- **E2E** (`e2e/`): os 12 cenários do enunciado §9 (T1–T12), contrato REST via service worker, axe (WCAG 2.1 AA) e ausência de overflow horizontal (390/768/1440 e 320 px ≈ zoom 400%, em `layout.spec`), em desktop e mobile, com estado isolado por teste.
- **Visual** (`e2e/visual.spec.ts`): início, detalhe, carrinho e pagamento × desktop/mobile, baselines Linux versionadas.

Mapa completo de specs e requisitos: `ARCHITECTURE.md` §12 e `docs/REQUIREMENTS.md`.

## CI

GitHub Actions (`.github/workflows/ci.yml`) em todo push na `main` e em pull requests: `npm ci`, typecheck, lint, Prettier, `npm audit --omit=dev` e a suíte Playwright completa (unit, E2E em desktop/mobile/tablet **e regressão visual**), dentro da imagem `mcr.microsoft.com/playwright:v1.64.1-noble`, a mesma que gerou as baselines Linux. O relatório HTML fica como artefato de cada execução; os traces das falhas também.

## Deploy

Vercel, conectado ao GitHub: cada push na `main` publica automaticamente. `vercel.json` configura o rewrite de SPA (acesso direto e refresh em qualquer rota), a CSP e os headers de segurança. Os mocks e o realtime funcionam no ambiente publicado.

## Limitações

Backend, carteiras, blockchain e pagamentos são simulados. O binding Socket.IO do MSW não tem rooms, ping nem ack (contornados no mock; ver `ARCHITECTURE.md` §10). Decisões de UX e desvios do Figma: `ARCHITECTURE.md` §15.
