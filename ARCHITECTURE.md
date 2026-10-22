# Arquitetura

Guia normativo do projeto (o **como**). O que está aqui **deve** ser seguido; desvios exigem registro em §14 (ADRs).
Enunciado: `docs/CHALLENGE.md` · O quê: `docs/REQUIREMENTS.md` · Plano: `docs/PLAN.md` · Segurança: `docs/SECURITY.md` · Design: `docs/DESIGN.md`.

## 0. Estado na entrega

A avaliação inicial (B0) apontava interceptors, contratos, socket por sessão e handlers por recurso como lacunas. Todas foram resolvidas; o histórico de problemas, causas e prevenções está em `docs/REVIEW-LOG.md`.

| Área                                                           | Onde                                                                                       | Garantia                                               |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| Contratos zod compartilhados app ↔ mocks                       | `src/contracts`                                                                            | typecheck + parse em toda resposta                     |
| HTTP com timeout em JS, auth/guest, 401 → reauth               | `src/lib/http.ts`                                                                          | e2e T3/T7, unit                                        |
| Servidor simulado (serviços puros + handlers MSW finos)        | `src/mocks/server`, `src/mocks/handlers`                                                   | unit de contrato + e2e via service worker              |
| Realtime por sessão (portão de eventos, reconciliação)         | `src/lib/realtime`                                                                         | unit `realtime-gate`, e2e realtime/T9/T10              |
| Fluxos (catálogo, detalhe, carrinho, checkout, pedidos, conta) | `src/features/*`, rotas só compõem                                                         | e2e T1–T12                                             |
| A11y                                                           | componentes de formulário, diálogos Radix, live region                                     | axe em 12 telas × 2 perfis, T11, overflow 390/768/1440 |
| Qualidade                                                      | strict TS (+ testes/configs), oxlint (a11y, imports, sem `any`/`!`/`zod` direto), Prettier | DoD por bloco                                          |

## 1. Princípios

1. **A rede é a fronteira.** O app só conhece contratos HTTP/WS. MSW é "o backend". Nenhum `if (mock)` fora de `src/mocks` e `main.tsx`.
2. **O servidor é a fonte da verdade.** Preço, disponibilidade, cotação, pedido e carrinho são autoritativos do mock. O cliente exibe, valida a UX e reconcilia.
3. **Estado remoto = TanStack Query; estado de navegação = URL (Router); estado local = React.** Sem store global extra; a exceção é a sessão, com um store mínimo (§7).
4. **Tipos derivados de schemas zod** (`z.infer`), validados na borda (resposta da API, search params, formulários).
5. **Isolamento por usuário em todas as camadas**: key, handler, evento, storage.

## 2. Camadas e regra de dependência

```
routes/  ──►  features/*  ──►  lib/, contracts/, components/
                 │
                 └──► api.ts ──► lib/http (axios) ──► [rede] ──► mocks/ (MSW)
mocks/  ──►  contracts/   (nunca importa app)
```

- `routes` compõem a página: `validateSearch`, `beforeLoad` (guards), `loader` (prefetch), pending/error/notFound. Lógica de negócio fica fora das rotas.
- `features/<x>`: sem barrel `index.ts` (ADR 17). Outras partes importam só `components/*`, `queries.ts` e `api.ts` de uma feature; helpers internos (ex.: `form.ts`) são privados a ela.
- Rotas só compõem: `validateSearch`, guards, loader, `head` e montagem de componentes de feature. UI com estado vive em `features/<x>/components`.
- `contracts` é puro (zod + tipos), sem React e sem axios.
- `components/ui` é shadcn. `components/` tem os blocos compartilhados do app (Skeleton, FormField, NftCard, NftArt…).

## 3. Estrutura

```
src/
  main.tsx                 # boot: mocks? → providers → router
  env.ts                   # config pública (VITE_*)
  routes/                  # file-based (ver §8)
  contracts/               # common.ts (Money, Pagination, ApiError), nft, auth, cart, quote, order, profile, wallet, events
  lib/
    http.ts                # axios + interceptors
    api-error.ts           # ApiError + type guards
    query-client.ts        # defaults + retry policy
    query-keys.ts          # fábrica central de keys
    session/               # session store + hooks
    realtime/              # socket manager, provider, dedupe, handlers → cache
    money.ts               # decimal.js helpers
    format.ts              # Intl date/time
    zod-form.ts            # useZodForm (resolver próprio)
    idempotency.ts         # geração/persistência de Idempotency-Key
  i18n/                    # dicionários tipados (pt.ts, en.ts) + t()
  features/
    catalog/  nft/  favorites/  cart/  checkout/  orders/  auth/  profile/  wallets/
      api.ts               # chamadas axios + parse zod
      queries.ts           # queryOptions + mutations
      components/          # UI da feature
  components/ui/           # shadcn
  components/              # compartilhados
  mocks/
    browser.ts             # setupWorker
    handlers/              # um arquivo por recurso + realtime.ts
    db/                    # estado, seed (fixtures), persistência, reset
    fixtures/              # NFTs, usuários, cupons, carteiras
    scenarios.ts           # registro de cenários (latência, falhas, flags)
    control.ts             # API de controle (reset, cenário, emit) exposta em window.__mock
    utils.ts               # delay, auth do request, envelope de erro
e2e/
  fixtures.ts              # test estendido: mock control, login helper, clock
  *.spec.ts                # 1 spec por fluxo do enunciado §9
scripts/lighthouse.mjs
```

## 4. Contratos

- **Money**: `z.string().regex(/^\d+(\.\d{1,18})?$/)` (ETH, string decimal). Cálculos só em `lib/money.ts` (decimal.js). Proibido `Number(price)` e `parseFloat`.
- **Quantidade**: `z.number().int().positive()`.
- **Erro (envelope único)**:
  ```ts
  { error: { code: 'VALIDATION'|'UNAUTHORIZED'|'SESSION_EXPIRED'|'FORBIDDEN'|'NOT_FOUND'|'CONFLICT'|'IDEMPOTENCY_CONFLICT'|'OUT_OF_STOCK'|'QUOTE_STALE'|'COUPON_INVALID'|'COUPON_EXPIRED'|'WALLET_REJECTED'|'WALLET_DISCONNECTED'|'UNAVAILABLE',
             message: string, fields?: Record<string,string>, details?: unknown } }
  ```
  HTTP: 400/422 `VALIDATION` · 401 `UNAUTHORIZED`/`SESSION_EXPIRED` · 403 `FORBIDDEN`/`WALLET_REJECTED` · 404 `NOT_FOUND` · 409 `CONFLICT`/`IDEMPOTENCY_CONFLICT`/`OUT_OF_STOCK`/`QUOTE_STALE` · 422 `COUPON_*` · 503/timeout/rede `UNAVAILABLE` (transitório). **Recusa de pagamento não é erro HTTP**: o pedido é criado e termina em `declined` (status terminal), e o reenvio com a mesma chave devolve esse mesmo pedido.
- **403 `FORBIDDEN` (caso concreto)**: o usuário fixture `carol` tem a conta `restricted`; ela navega, mas `POST /orders` e `POST /me/wallets` respondem 403. O cenário `unauthorized` aplica 403 a todas as rotas `/me/*` e `/orders` de qualquer usuário.
- **Recurso de outro usuário** responde **404** (não 403), para não confirmar a existência.
- **Paginação**: `{ items, page, pageSize, total, totalPages }`.
- **Versionamento**: `Nft` e `Order` carregam `version: number` (monotônico por recurso) e `updatedAt`. As edições não têm versão própria: qualquer mudança de preço ou disponibilidade de uma edição incrementa a `version` do NFT. É ela que governa o dedupe.

### Endpoints (base `/api`)

| Recurso             | Método/rota                                                                                                                                             | Notas                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sessão              | `POST /auth/register` · `POST /auth/login` · `GET /auth/session` · `POST /auth/logout`                                                                  | 409 email em uso; 401 `SESSION_EXPIRED`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| NFTs                | `GET /nfts?q&collection&network&priceMin&priceMax&tab&sort&page&pageSize` (página além do fim → última página) · `GET /nfts/featured` · `GET /nfts/:id` | 404 inexistente; edições com `available`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Favoritos           | `GET /me/favorites` · `PUT /me/favorites/:nftId` · `DELETE /me/favorites/:nftId`                                                                        | idempotentes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Carrinho            | `GET /cart` · `POST /cart/items` · `PATCH /cart/items/:itemId` · `DELETE /cart/items/:itemId` · `POST /cart/merge { guestCartId }`                      | dono = usuário (token) ou visitante (`X-Guest-Cart-Id`); 409 `OUT_OF_STOCK` com `available`; o merge soma por (nft, edição), limita ao estoque e devolve `adjustments[]` para avisar                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Cupom               | `PUT /cart/coupon { code }` · `DELETE /cart/coupon`                                                                                                     | cupom **guardado no carrinho do servidor** (sobrevive a refresh/login/merge); 422 `COUPON_INVALID`/`COUPON_EXPIRED`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Cotação             | `POST /quote { network? }` (usa o cupom do carrinho)                                                                                                    | retorna `quoteId`, `version`, `expiresAt`, linhas (preço unitário da cotação), `subtotal`, `discount`, `networkFee`, `total`, `changes[]` (diferenças vs carrinho/cotação anterior)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Pedidos             | `POST /orders { quoteId, walletId, network, buyer }` (header `Idempotency-Key`) · `GET /orders/:id` · `GET /orders?status=pending`                      | 409 `QUOTE_STALE` + nova cotação; mesma key + mesmo payload → **mesmo pedido** (200); mesma key + payload diferente → 409 `IDEMPOTENCY_CONFLICT`. **Ordem no handler: 1) consultar a `Idempotency-Key` (se existe, devolve o pedido, sem revalidar cotação/estoque); 2) se o usuário já tem pedido `pending` → 409 `CONFLICT` com `details.orderId`; 3) só então validar cotação/estoque/carteira.** A criação reserva o estoque; a recusa o libera. Ao confirmar, o servidor **subtrai do carrinho só (nft, edição, qtd) comprados** e grava o **snapshot** do recibo (linhas, preços, taxas, total, `txHash`, `explorerUrl`). Cada pedido `pending` guarda `resolveAt` no db (C4) |
| Perfil              | `GET /me/profile` · `PATCH /me/profile` · `PUT /me/avatar` · `POST /me/password`                                                                        | 422 validação por campo; senha atual incorreta → 422 `fields.currentPassword`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Transação           | `GET /tx/:hash`                                                                                                                                         | só para o dono do pedido (os outros recebem 404); devolve `{ hash, network, status, total, confirmedAt }`, sem itens                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Carteiras           | `GET /me/wallets` · `POST /me/wallets` · `PATCH /me/wallets/:id`                                                                                        | `role: 'primary'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 'secondary'`(no máximo uma de cada);`address`validado;`networks[]` |
| Conexão de carteira | `POST /me/wallets/:id/connect { network }` · `DELETE /me/wallets/:id/connect`                                                                           | 200 `{ connectionId, status: 'connected' }` · 403 `WALLET_REJECTED` (usuário "recusou") · desconexão do lado da "carteira" chega como evento `wallet.disconnected`; criar pedido com conexão inativa → 409 `WALLET_DISCONNECTED`                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

### Eventos Socket.IO (namespace `/`)

Envelope: `{ eventId: string, type, resourceId: string, version: number, occurredAt: string, userId?: string, payload }`.

| Evento                | Direção                    | Payload                                                             |
| --------------------- | -------------------------- | ------------------------------------------------------------------- |
| `nft.updated`         | server→client              | `{ price, editions: [{ id, available }] }`                          |
| `order.updated`       | server→client (só ao dono) | `{ status: 'pending'                                                | 'confirmed' | 'declined', txHash?, reason? }` |
| `wallet.disconnected` | server→client (só ao dono) | `{ walletId, connectionId, reason }`                                |
| `session.hello`       | client→server              | `{ token }` (auth após conectar)                                    |
| `session.ready`       | server→client              | `{ userId }` (confirma o hello; o binding não suporta ack/callback) |

## 5. HTTP (Axios)

- Instância única `lib/http.ts`: `baseURL`, JSON. **Timeout implementado em JS** (`AbortController` + `setTimeout`, 10s; checkout 15s), não no `timeout` nativo do XHR, para que o `page.clock` controle o timeout nos testes (T7). Ele é combinado com o `signal` do Query.
- **Request interceptor**: `Authorization: Bearer <token>` vindo do session store; `X-Guest-Cart-Id` quando visitante.
- **Response interceptor**: converte para `ApiError { status, code, message, fields }`; timeout/rede → `code: 'UNAVAILABLE'`, `transient: true`. Em 401 `SESSION_EXPIRED`/`UNAUTHORIZED` → `session.expire()`, exceto em `/auth/*` **e quando o status da sessão já não é `authenticated`** (evita reauth depois do logout, I6).
- `api.ts` de cada feature: `schema.parse(res.data)`. Uma resposta inválida é um bug: falha alto.
- Sempre repassar `signal` do Query para cancelamento.
- Request interceptor aguarda `mocksReady` (promise resolvida após `worker.start`, ou imediatamente com os mocks desligados). Assim o shell renderiza sem esperar o MSW (§13).
- **Idempotency-Key** (`features/checkout/attempt.ts`): uma chave por **tentativa de compra** = (userId, quoteId), persistida em `sessionStorage` até o pedido ficar terminal. Retry/timeout/refresh reutilizam a chave. **Antes de gerar uma chave nova** (nova cotação), o cliente consulta `GET /orders?status=pending`; se existir pedido pendente, retoma esse pedido em vez de criar outro (C3).

## 6. Estado remoto (TanStack Query)

- **Keys** (`lib/query-keys.ts`):
  - públicas: `['nfts', 'list', params]`, `['nfts', 'featured']`, `['nfts', 'detail', id]`
  - privadas: `['user', userId, 'favorites' | 'cart' | 'profile' | 'wallets' | 'orders', ...]`, `['user', userId, 'quote', { network }]`
  - visitante: `['guest', guestId, 'cart']`, `['guest', guestId, 'quote', { network }]`
  - **Nunca pôr dado de usuário em key pública.** `isFavorite` é derivado da query de favoritos (`select`), nunca gravado no detalhe.
- **Defaults** (`lib/query-client.ts`): `staleTime` 30s (5 min no destaque, 0 na cotação); `gcTime` 5min; `refetchOnWindowFocus: false` (o tempo real e a reconciliação na reconexão mantêm os dados frescos); retry só se `ApiError.transient` (máx 2, backoff 1s→4s); mutations sem retry. Pedido pendente: polling de 5s como rede de segurança do `order.updated`.
- **Versão nunca regride**: o `structuralSharing` customizado (`keepNewerVersion`) em queries de `Nft`/`Order` mantém o dado em cache quando a resposta REST traz `version` menor que a já aplicada por evento (I5).
- **Respostas fora de ordem**: key por params + `signal` (abort) + `placeholderData: keepPreviousData`. Nunca `setState` manual com resultado de fetch.
- **Invalidação após mutation**:
  | Mutation              | Invalida/atualiza                                                                                                    |
  | --------------------- | -------------------------------------------------------------------------------------------------------------------- |
  | favorito on/off       | **otimista** em `['user',id,'favorites']` (cancelQueries → snapshot → set); rollback no erro; `invalidate` no settle |
  | item do carrinho      | `cart`, `quote`                                                                                                      |
  | cupom aplicar/remover | `cart`, `quote`                                                                                                      |
  | criar pedido          | `setQueryData(order)`; após `confirmed`: `cart`, `nfts.detail` dos itens                                             |
  | perfil/avatar         | `profile` (+ header)                                                                                                 |
  | carteiras             | `wallets`                                                                                                            |
  | login/logout          | `queryClient.clear()` (§7)                                                                                           |
- **Estados**: todo componente com dados trata explicitamente loading (skeleton com dimensões fixas), empty, error (retry só se transitório) e `isFetching` (indicador discreto de atualização em segundo plano) — ex.: `CatalogResults`, `CartSummary`/`QuoteError`, `OrderView`.

## 7. Sessão e autenticação

- `lib/session`: store externo (`useSyncExternalStore`) com `{ status: 'unknown'|'authenticated'|'anonymous'|'expired', user, token }`; token persistido em `sessionStorage`.
- Boot: se há token → `GET /auth/session` antes de resolver guards. A sessão entra em `createRouter({ context: { queryClient, session } })`, e cada mudança de sessão chama `router.invalidate()` para reavaliar os guards.
- A chave do token (`kurio:session`) é fixa. As demais chaves privadas do app usam o namespace `kurio:<userId>:*`.
- Guard: layout route `_auth` com `beforeLoad` → `redirect({ to: '/login', search: { redirect: location.href } })`. `redirect` só é aceito se `new URL(value, location.origin).origin === location.origin` (bloqueia `//evil`, `/\evil`, `javascript:`).
- **Expiração no meio da navegação/checkout**: `session.expire()` abre o `ReauthDialog` (não navega), e o formulário e a rota ficam preservados. Ao relogar com o mesmo usuário, refaz as queries; se for outro usuário, aplica as regras de troca.
- **Logout/troca de usuário** (ordem): marcar a sessão como `anonymous` → navegar para rota pública (`/` ou `/login`) → desconectar socket → limpar versões/dedupe do realtime → `queryClient.cancelQueries()` + `clear()` → limpar storages privados `kurio:<userId>:*`.
- Login de visitante com carrinho: `POST /cart/merge { guestCartId }` com o token novo **antes** de publicar a sessão (o `signIn` reavalia os guards e pode navegar na hora, abortando o merge — REVIEW-LOG B5) → anunciar `adjustments` → descartar o guestId.
- **Ação protegida a partir de tela pública** (favoritar, ir ao checkout): navega para `/login?redirect=<rota>&intent=<ação>`; após o login, volta à rota e executa a intenção (ex.: `favorite:<nftId>`). A intenção é validada por schema e só aceita ações da allowlist.
- Ao logar, um pedido `pending` do usuário (`GET /orders?status=pending`) é retomado: banner + link para o status (RT8).

## 8. Rotas

| Rota               | Arquivo                     | Auth       | Search (zod)                                                      |
| ------------------ | --------------------------- | ---------- | ----------------------------------------------------------------- |
| `/`                | `index.tsx`                 | —          | `q, collection[], network[], priceMin, priceMax, tab, sort, page` |
| `/nft/$nftId`      | `nft.$nftId.tsx`            | —          | `edition?`                                                        |
| `/cart`            | `cart.tsx`                  | —          | —                                                                 |
| (layout)           | `_auth.tsx`                 | ✅         | `beforeLoad` com o guard                                          |
| `/checkout`        | `_auth/checkout.tsx`        | ✅         | `step: 'details'                                                  | 'review'` |
| `/orders/$orderId` | `_auth/orders.$orderId.tsx` | ✅         | — (confirmação/recibo)                                            |
| `/login`           | `login.tsx`                 | só anônimo | `redirect?`, `intent?`                                            |
| `/register`        | `register.tsx`              | só anônimo | `redirect?`, `intent?`                                            |
| `/favorites`       | `_auth/favorites.tsx`       | ✅         | — (lista de favoritos; Tab Bar mobile e "Lista de interesse")     |
| `/account/profile` | `_auth/account.profile.tsx` | ✅         | —                                                                 |
| `/account/wallets` | `_auth/account.wallets.tsx` | ✅         | —                                                                 |
| `/tx/$hash`        | `_auth/tx.$hash.tsx`        | ✅ (dono)  | — (explorador simulado; 404 para os demais)                       |
| `*`                | `__root notFoundComponent`  | —          | —                                                                 |

- Mudança de qualquer filtro → `page: 1` (feito no helper `updateFilters`, nunca no componente).
- `loader` do detalhe: `queryClient.ensureQueryData(nftDetail(id))`; 404 → `throw notFound()`.
- `/checkout` com carrinho vazio e sem pedido pendente → `redirect` para `/cart` com aviso. `/orders/$orderId` de outro usuário ou inexistente → página 404. Status `pending` mostra a tela de aguardando; `declined` mostra a recusa com volta ao checkout; **recibo só em `confirmed`**.
- Cada rota define `head`/título e move o foco para o `h1` após a navegação.

## 9. Tempo real

- `lib/realtime/manager.ts`: **um** socket por sessão (`transports: ['websocket']`, `autoConnect: false`). Criado no login/boot, destruído no logout. Na conexão emite `session.hello { token }` e espera `session.ready`.
- **`socket.io-client` só por `import()` dinâmico depois de `mocksReady`** (`lib/socket.ts`). O engine.io-client captura `globalThis.WebSocket` quando o módulo é avaliado, e o MSW só o substitui em `worker.start()`. Import estático é bloqueado pelo lint (C1, já corrigido e testado).
- `RealtimeProvider` monta e desmonta o manager conforme a sessão; hooks `useRealtime(type, handler)` sempre fazem cleanup (`off`).
- **Aplicação de eventos** (`lib/realtime/apply.ts`), nesta ordem:
  1. descarta se `userId` existe e ≠ usuário atual (ou o socket é de sessão anterior);
  2. descarta se `eventId` já foi visto (LRU de 500);
  3. descarta se `version <= versão conhecida do recurso` (mapa `resourceId → version`, alimentado também pelas respostas REST);
  4. aplica: `nft.updated` → `cancelQueries` + `setQueryData` no detalhe, nas listas que contêm o NFT e nas **linhas do carrinho** (preço/disponibilidade); `invalidate(quote)`; aviso `aria-live`; `order.updated` → `setQueryData(order)` se a versão for maior. `confirmed`/`declined` são terminais e não regridem.
- **Reconexão** (`connect` depois de `disconnect`): `invalidateQueries` de `nfts` ativos, `cart`, `quote` e pedidos `pending`. É a reconciliação com o REST.
- **Checkout com cotação desatualizada**: `nft.updated` invalida a quote → a UI mostra a diferença e exige nova confirmação. O servidor também recusa um `quoteId` antigo (`QUOTE_STALE`), com defesa dupla.
- `wallet.disconnected` → marca a conexão como inativa, avisa e bloqueia "Confirmar" até reconectar.
- **Queda de conexão**: socket.io reconecta sozinho após **queda de transporte**; não reconecta após `io server disconnect`. Por isso o mock simula queda fechando o transporte (§10). Enquanto estiver desconectado, a UI mostra o status "reconectando" e pedidos `pending` fazem polling REST leve (5s) como fallback.

## 10. Mocks (MSW)

- **db** (`mocks/db`): estado único em memória (users, sessions, nfts/editions, favorites, carts, coupons, quotes, orders, idempotency, wallets, walletConnections). Persistido em `localStorage` (`msw-server-db:v1`) a cada escrita; `reset()` recarrega o seed do cenário. Seed determinístico; latência variável vem de PRNG com seed (ex.: mulberry32), então é reproduzível.
- Esse storage é **do servidor simulado** (contém todos os usuários, como um banco). O app nunca o lê; documentado no README/SECURITY para não ser confundido com vazamento.
- **Handlers** derivam o usuário **sempre** do token. Senhas como hash PBKDF2 + salt.
- **Cenários** (`mocks/scenarios.ts`): `default`, `empty`, `slow`, `jitter` (latência variável + fora de ordem), `offline`, `server-error`, `session-expired`, `register-conflict`, `coupon-expired`, `price-change-checkout`, `sold-out-checkout`, `order-timeout`, `payment-declined`. Cada um é um conjunto de overrides `{ latency, failures: { [route]: status|'network'|'timeout' }, flags }`.
- Cenários extras: `wallet-rejected`, `wallet-disconnect`, `favorite-fail`, `unauthorized` (403).
- **Avatar**: o cliente redimensiona para 256×256 WebP (canvas, ~<100 KB) antes do upload; o servidor rejeita >200 KB. Assim o db cabe na cota do `localStorage` (I9).
- **Seleção**: `?scenario=<nome>` (persistido) → painel dev (visível no build demo) → `window.__mock.setScenario()` nos testes. Reset: `window.__mock.reset()` + botão no painel.
- **API de controle** (`mocks/control.ts`, em `window.__mock`). **Fonte única dos nomes**; o PLAN e a fixture usam estes:
  | Função                                                      | Efeito                                                                  |
  | ----------------------------------------------------------- | ----------------------------------------------------------------------- |
  | `reset(scenario?)`                                          | restaura o seed (e o cenário)                                           |
  | `setScenario(name)`                                         | troca o cenário ativo                                                   |
  | `fail(route, { status \| 'network' \| 'timeout', times? })` | falha pontual (`times` omitido = persistente); `clearFailures()` remove |
  | `setLatency(ms \| [min, max])`                              | latência fixa/variável (PRNG com seed)                                  |
  | `updateNft(id, patch)`                                      | escreve no db → REST + `nft.updated`                                    |
  | `emitRaw(event)`                                            | envia evento cru (duplicado/antigo, T10)                                |
  | `dropConnection()`                                          | fecha o transporte (o cliente reconecta)                                |
  | `resolveOrder(id, 'confirmed' \| 'declined')`               | resolve um pedido pendente                                              |
  | `disconnectWallet(id)`                                      | emite `wallet.disconnected`                                             |
  | `expireSession()`                                           | invalida o token atual (próxima chamada → 401)                          |
  | `dropConnection()` / `socketConnections()`                  | derruba os transportes Socket.IO / conta conexões ativas                |
  | `setOrderResolution(ms \| null)`                            | tempo até a resolução de novos pedidos (testes de pendente)             |
  | `snapshot()`                                                | leitura do estado do servidor (asserções nos testes)                    |
- **Painel dev** fica em `src/mocks/devtools/`, carregado só com os mocks ligados, e usa apenas a API de controle (servidor simulado → socket), nunca o cache ou os setters do app. Ele aparece **visualmente isolado** (botão flutuante "Servidor simulado (admin)", visual distinto do app) para não ser confundido com UI do produto.
- **Mudança de dado = REST + evento**: toda escrita em `nfts`/`orders` passa por `db.update()`, que incrementa `version` e chama `realtime.broadcast()`. O pedido fica `pending` com `resolveAt` (e o resultado planejado pelo cenário) **gravados no db**. No boot do mock e a cada `GET /orders/:id`, pedidos com `resolveAt` vencido são resolvidos e emitem `order.updated`; os não vencidos são reagendados. Assim o pedido sobrevive a refresh (C4). O timer é controlável pelo `page.clock`.
- **Socket** (`handlers/realtime.ts`): `ws.link(env.socketUrl + '/*')` + `toSocketIo`. Registra as conexões e o usuário de cada uma (após `session.hello`). Limitações do binding 0.2 (verificadas no código):
  - sem rooms/namespaces: "rooms" via mapa `userId → conexões` no mock;
  - handshake no microtask: emitir só depois do `session.hello`;
  - só transporte websocket;
  - **não envia ping**: o cliente cai por "ping timeout" em ~30s. O mock envia `'2'` cru a cada 20s por conexão (`clearInterval` no `close`);
  - `sid` fixo `'test'`: não indexar por `socket.id`;
  - sem ack/callback: responder com evento;
  - listener recebe `(messageEvent, ...data)`: o payload é o 2º argumento;
  - StrictMode abre 2 conexões em dev: remover a conexão no `close`;
  - `client.close()` só aceita os códigos 1000 e 3000–4999.
- `window.__mock` só existe quando os mocks estão ligados. É a "API admin" do servidor simulado; a UI de produção nunca a chama para simular eventos.

## 11. UI, formulários e a11y

- shadcn como primitivas, tematizado por tokens CSS em `index.css` (cores, raio, tipografia do Figma). Não fazer fork de componente sem necessidade.
- Formulários: `useZodForm(schema)` (react-hook-form + resolver próprio em `lib/zod-form.ts`); erros da API (`fields`) mapeados via `setError`. `FormField` garante `label`, `aria-invalid` e `aria-describedby`.
- Skeleton com shimmer (`motion-safe:` no Tailwind) e dimensões do conteúdo real.
- `LiveRegion` global (`aria-live="polite"`) com `announce()` para mutations/realtime; erros com `role="alert"`.
- Checklist completo em `docs/PLAN.md` §5.
- **i18n (EX1/EX2):** `t` é um Proxy que resolve no dicionário do idioma atual (`src/lib/prefs.ts`, `localStorage` `kurio:prefs`) a cada leitura. Regra: **ler `t` só durante o render**, nunca em constante de módulo (guardar a chave, como na `MobileTabBar`). `en.ts` é checado contra `Dictionary` (forma do `pt.ts` com textos alargados para `string`; identificadores `tab`/`art`/`slug` travados). A troca de idioma atualiza `<html lang>`, invalida o router (títulos) e remonta o shell por `key`. Mensagens de validação dos contratos ficam em pt-BR e são traduzidas no render (`translateMessage` em `FormField`/`FormError`/toasts). Datas via `Intl` com o ciclo de hora escolhido (`src/lib/format.ts`).
- **Fora do escopo** (editorial, suporte, atividade, ofertas, downloads, redes sociais): o item continua visível como no Figma, mas como `button` com `aria-disabled="true"`, badge/tooltip "Em breve" e toast informativo ao acionar. Nunca simula sucesso. Links externos reais abrem em nova aba com `rel="noopener noreferrer"` e ícone de externo.
- **Explorador de transação**: link para `/tx/$hash`, uma página interna "Explorador simulado", **só para o dono** (404 para os demais). Mostra apenas hash, rede, status, total e data, sem itens, com o aviso de simulação. Não aponta para Etherscan com hash falso.

## 12. Testes

- **Isolamento**: cada teste em contexto novo. O `addInitScript` define o cenário e limpa o db **só na primeira carga** (flag `sessionStorage['mock:init']`), para que `page.reload()` preserve o estado nos testes de persistência (C6).
- **Fixture** `e2e/fixtures.ts`: objeto `mock` que espelha 1:1 a API de controle do §10 (via `page.evaluate` → `window.__mock`, ou seja, servidor simulado → socket.io-client), mais `loginAs(user)` e `page.clock` para timers.
- **Falhas e retry**: falhas transitórias são absorvidas por até 2 retries. Os testes de erro (T4, T12) usam `fail(..., { times: 3+ })` ou uma falha persistente seguida de `clearFailures()` e "Tentar novamente", e evitam hover nos links durante a falha (preload `intent`).
- **Unitários** (projeto Playwright `unit`, sem browser, `tests/unit/*.spec.ts`): `money.ts`, contrato de idempotência dos handlers, `apply.ts` (dedupe/versão).
- Seletores por role/label (a11y-first); `data-testid` só quando não houver alternativa.
- Regressão visual: home, detalhe, carrinho, pagamento × desktop/mobile, cenário `default`, relógio congelado, animações desligadas.
- Projects: `desktop` (1440) e `mobile` (390). Report HTML + traces on failure (já configurado); o relatório final é copiado para `docs/playwright-report/` na entrega.
- **VIS no Linux**: `npm run test:e2e:docker` roda na imagem `mcr.microsoft.com/playwright:v1.64.1-noble`; as baselines versionadas são as Linux (o render de fonte do macOS difere). O `visual.spec` é **pulado fora do Linux** (`test.skip(process.platform !== 'linux')`), então `npm run test:e2e` continua verde no macOS (X6). Isso fica documentado no README.
- **Larguras**: o projeto `tablet` (768) roda smoke e `layout.spec`. O `layout.spec` verifica a ausência de overflow horizontal (`scrollWidth <= clientWidth`) e de conteúdo cortado em 320/390/768/1440; 320px equivale ao zoom de 400% em 1280 (WCAG 1.4.10).
- **Shimmer**: o T12 sobrescreve `reducedMotion` (`no-preference` e `reduce`) e verifica a animação ligada e desligada.
- **Atualização em segundo plano**: o T12 também verifica o indicador de "atualizando" durante um refetch com dados em cache.
- **Checks do DoD** rodam com `CI=1`, para não reaproveitar um servidor de preview com build antigo.
- **Offline**: `context.setOffline` não afeta respostas do MSW. Falha de conexão é sempre simulada pelo mock (`fail(..., 'network')`, `dropConnection`).
- **Relógio**: `page.clock` só em testes sensíveis a tempo (expiração, timeout, resolução do pedido). Com `install()` o tempo continua correndo; com `pauseAt()` ele congela tudo, inclusive os `delay()` do MSW e o ping do socket, e então é preciso avançar com `runFor`/`fastForward`.
- Mapa de specs: `catalog.spec` (T1, T12) · `nft-detail.spec` (T2) · `auth.spec` (T3) · `favorites.spec` (T4) · `cart.spec` (T5) · `checkout.spec` (T6, T7) · `account.spec` (T8) · `realtime.spec` (T9, T10, RT1 no catálogo/detalhe) · `a11y.spec` (T11 + axe) · `layout.spec` (U2, U10) · `visual.spec` (VIS) · `deploy.spec` (smoke contra a URL pública, `BASE_URL`, compara o commit) · `tests/unit/*` (unit).

## 13. Performance

- **Boot** ✅: `render()` imediato (shell + skeletons) em paralelo com `import('./mocks/browser')` + `worker.start()`; a rede (Axios **e** o import do socket) espera `mocksReady` (§5, §9). `modulepreload` do chunk do MSW. O LCP é medido no B1b para decidir otimizações.
- Code splitting por rota (`autoCodeSplitting`); MSW e socket são carregados sob demanda.
- **Versão publicada = código**: o build injeta o commit (`VERCEL_GIT_COMMIT_SHA` ou `git rev-parse`) em `/version.json` e no rodapé; o `deploy.spec` confere com o HEAD entregue (D2).
- SEO: `robots.txt`, `<title>` e `meta description` por rota, links reais (`<a href>`) na navegação.
- Imagens: assets do Figma otimizados (AVIF/WebP), `width/height`, `loading="lazy"` exceto a LCP (`fetchpriority="high"`).
- Fontes self-hosted (`@fontsource`), `font-display: swap`, preload da principal.
- Sem trabalho síncrono pesado no boot; listas grandes paginadas pelo servidor.

## 14. Decisões (ADRs curtas)

| #   | Decisão                                                             | Motivo                                                                                                                                                    |
| --- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Sem lib de i18n; dicionário tipado + `Intl`                         | o enunciado não exige; zero custo de bundle; habilita os extras                                                                                           |
| 2   | Resolver zod próprio                                                | `@hookform/resolvers` com conflito de peers impede `npm ci` limpo                                                                                         |
| 3   | msw 2.x                                                             | `@mswjs/socket.io-binding` exige `msw@^2`                                                                                                                 |
| 4   | Token em `sessionStorage`                                           | sobrevive a refresh, isolado por aba; em produção real seria cookie HttpOnly                                                                              |
| 5   | Carrinho no servidor (também para visitante)                        | uma fonte de verdade para disponibilidade, cotação e merge                                                                                                |
| 6   | Lighthouse via API + script próprio                                 | `@lhci/cli` trazia 17 vulnerabilidades; script dá mediana de 3                                                                                            |
| 7   | `routeTree.gen.ts` versionado                                       | typecheck/lint independem de build                                                                                                                        |
| 8   | Recurso de outro usuário → 404                                      | não revela existência (X4)                                                                                                                                |
| 9   | Explorador de transação interno (`/tx/$hash`)                       | link externo com hash falso pareceria real (S14, P10)                                                                                                     |
| 10  | Shell renderiza antes do MSW; rede aguarda `mocksReady`             | LCP/FCP no mobile sem burlar a auditoria (L2, L6)                                                                                                         |
| 11  | Baselines VIS em Linux (Docker); `visual.spec` pulado fora do Linux | reprodutível na máquina de quem avalia, sem quebrar `test:e2e` no macOS (TQ2, X6)                                                                         |
| 12  | `socket.io-client` só por import dinâmico após `mocksReady`         | engine.io captura o `WebSocket` no carregamento do módulo (C1)                                                                                            |
| 13  | Ping manual no mock                                                 | o binding não envia ping; sem ele o socket cai a cada 30s (C2)                                                                                            |
| 14  | Idempotência consultada antes de qualquer validação                 | reenvio após timeout recupera o pedido, nunca duplica (C3)                                                                                                |
| 15  | Cupom guardado no carrinho do servidor                              | aplicar/remover persiste em refresh e login (K4, K2)                                                                                                      |
| 16  | Timeout do Axios em JS (AbortController)                            | controlável pelo `page.clock` (TQ3, T7)                                                                                                                   |
| 17  | Sem barrel files nas features                                       | barrels puxam o módulo inteiro para o chunk de cada rota e pioram o code splitting e o HMR                                                                |
| 18  | Troca de idioma remonta o shell (`key={locale}`)                    | cada leitura de `t` sem Context/hook em 60+ arquivos; queries em cache tornam a troca instantânea. Custo: rascunhos de formulário abertos são descartados |

## 15. Limitações, decisões de UX e desvios do Figma

Preenchido durante a implementação (obrigatório na entrega, D6).

### Limitações

- Backend, carteiras e blockchain simulados (MSW). Limitações do binding Socket.IO em §10 (sem rooms, sem ping, sem ack, só websocket).
- Sessão em `sessionStorage` (por aba): uma nova aba exige novo login.
- Idempotency-Key por cotação: um reload durante o envio gera nova cotação e nova chave; a duplicidade continua impossível pelo `GET /orders?status=pending` antes de cada envio e pela regra do servidor de um pedido pendente por usuário.
- IDs, tokens e hashes de transação do mock usam `crypto.randomUUID`/`getRandomValues`: os **resultados** dos cenários são determinísticos (seed e PRNG fixos), os identificadores não.
- O cupom expirado é testado ao aplicar (`coupon-expired`); a API de controle não expira um cupom já aplicado (a revalidação na confirmação cobre esse caso no código, `isQuoteStale`).
- Idioma (EX1): mensagens **escritas pelo servidor** simulado (ex.: "Cupom expirado") continuam em pt-BR; um backend real localizaria por `Accept-Language`. Valores em ETH não mudam de formato (moeda fora do escopo do extra). Trocar o idioma descarta rascunhos de formulário abertos (ADR 18).

### Decisões de UX

- Ações fora do escopo: "Em breve" sem simular sucesso (§11).
- Expiração de sessão: modal de reautenticação sem perder o formulário/rota.
- Alterações de preço/estoque: aviso inline + `aria-live`, com nova confirmação obrigatória no checkout.

### Desvios do Figma

Detalhe e inventário em `docs/design/DESIGN.md`; **todo desvio fica registrado aqui** (exigência do enunciado §12):

| Desvio                                                                                                                                                                                              | Motivo                                                                                                                                      |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Borda de inputs/controles/paginação/chips `#3F2319` → `--control-border` `#8A6A4A` (≥3:1 sobre ink e card)                                                                                          | `#3F2319` dá 1.34:1, abaixo dos 3:1 da WCAG 1.4.11. Divisórias decorativas mantêm `#3F2319`                                                 |
| Texto do "Aplicar" do cupom mobile: foreground → ink                                                                                                                                                | foreground sobre primary dá 2.50:1                                                                                                          |
| Cor de erro coral `#F0805F` (não existe no Figma), sempre com ícone e texto                                                                                                                         | o design não tem estado de erro; 7.29:1 sobre ink                                                                                           |
| Estados ativos (filtro, sidebar, edição) ganham indicador além da cor (check/borda/peso, `aria-pressed`/`aria-current`)                                                                             | WCAG 1.4.1                                                                                                                                  |
| Texto de 9 px (chip de carteiras) → 11 px; badge do carrinho 10 px → 11 px                                                                                                                          | legibilidade                                                                                                                                |
| Header logado, tablet (768), mobile de Confirmação/Perfil/Carteiras, skeleton, toast, vazio/erro/404                                                                                                | não desenhados; derivados dos padrões existentes (DESIGN.md §7)                                                                             |
| Conteúdo inconsistente do Figma (token IDs, somas do carrinho, "Contrato"/"Direitos autorais" trocados) não copiado                                                                                 | os valores vêm da API simulada (DESIGN.md §9.3)                                                                                             |
| 4 artes para todos os NFTs, reutilizadas nas fixtures; servidas em AVIF/WebP com `srcset`                                                                                                           | só existem 4 artes no Figma (PNG ~2 MB)                                                                                                     |
| Logo do Google inline (SVG oficial)                                                                                                                                                                 | o export do Figma veio fatiado em 7 partes                                                                                                  |
| "Código de indicação" opcional (Figma marca `*`)                                                                                                                                                    | indicação é opcional por natureza; obrigá-lo bloquearia o cadastro de carteira                                                              |
| Header logado (avatar + nome → Minha conta)                                                                                                                                                         | estado logado não desenhado; derivado do estilo da sidebar da conta                                                                         |
| Login/cadastro com labels só para leitores de tela                                                                                                                                                  | Figma usa apenas placeholder; label visível mudaria o layout, então fica `sr-only` (WCAG 1.3.1/4.1.2 atendidos)                             |
| ENS: ".eth" como afixo fixo (não um select)                                                                                                                                                         | só existe a opção ".eth"; um select de uma opção não faz sentido                                                                            |
| Campo de busca no topo da sidebar no desktop (o Figma desktop só tem o ícone no header)                                                                                                             | busca é requisito (S4); o ícone do header leva ao catálogo; o mobile segue o Figma ("Explorar coleções")                                    |
| Paginação ganha "anterior" (a partir da pág. 2)                                                                                                                                                     | navegação por teclado/leitor sem depender de números; o Figma só tem números + "próxima"                                                    |
| Preço do filtro com ponto ("0.39 - 12.11")                                                                                                                                                          | o Figma usa vírgula só ali; todos os outros preços usam ponto (consistência)                                                                |
| Tab bar mobile só com ícones (nomes `sr-only`); a aba ativa ganha um ponto além da cor                                                                                                              | o Figma não tem rótulos; WCAG 1.4.1 pede indicador além da cor                                                                              |
| Confirmação como rota `/orders/$id` sem header/footer, centralizada, com X e "Continuar explorando"                                                                                                 | no Figma é um modal sobre scrim opaco; a rota mantém acesso direto/refresh (pendente → confirmado) e o X leva ao catálogo                   |
| Seletores de idioma e formato de hora no rodapé (`select` nativos)                                                                                                                                  | extras EX1/EX2 não existem no Figma; rodapé evita mexer no header desenhado                                                                 |
| Aba "Avaliações" com aviso "em breve"                                                                                                                                                               | o conteúdo da aba não foi desenhado; o resumo (estrelas e contagem) continua visível                                                        |
| Galeria com 4 miniaturas da mesma arte                                                                                                                                                              | o Figma tem uma arte por NFT, repetida 4×; mantido                                                                                          |
| Toasts embaixo (acima da tab bar/buy bar)                                                                                                                                                           | no topo, cobriam as ações da barra superior do mobile (achado em teste)                                                                     |
| "Ordenar por" também no mobile                                                                                                                                                                      | ordenação é requisito (S4); o frame mobile não a mostra                                                                                     |
| Card no mobile: favoritar no topo direito; desktop: 3 ações no hover **e no foco do teclado**                                                                                                       | Figma; o foco revela as ações para quem navega por teclado                                                                                  |
| Carrinho desktop mostra também a edição sob o ID do token                                                                                                                                           | sem a edição, duas linhas do mesmo NFT (edições diferentes) ficariam indistinguíveis                                                        |
| Rótulo "Código promocional" só para leitores de tela no mobile                                                                                                                                      | o frame mobile não mostra o rótulo (regra fidelidade × a11y)                                                                                |
| Banner "Reconectando ao tempo real…" no topo enquanto o socket cai                                                                                                                                  | estado não desenhado; necessário para RT8/feedback                                                                                          |
| Checkout: campos de carteira do Figma (endereço, tipo, ENS, indicação) substituídos pela escolha de **carteiras cadastradas** + rede; "Usar outra carteira?" → "Trocar carteira" (leva a Carteiras) | o enunciado exige usar as carteiras cadastradas; os campos de carteira já existem em Carteiras — duplicá-los criaria duas fontes de verdade |
| Botão "Conectar carteira" explícito e diálogo "Revise seu pedido" (não desenhados)                                                                                                                  | simulação de conexão/recusa/desconexão (P3) e revisão antes do envio (P1)                                                                   |
| Formulário do colecionador recolhido no mobile                                                                                                                                                      | o frame mobile não tem formulário; os dados vêm pré-preenchidos do perfil                                                                   |
| "Ver no Etherscan" → "Ver no explorador (simulado)"                                                                                                                                                 | hash simulado não existe no Etherscan (S14)                                                                                                 |
| Telas de pedido pendente e recusado                                                                                                                                                                 | não desenhadas; derivadas do recibo (mesma moldura e paleta)                                                                                |
| Data do recibo em pt-BR ("21 de out. de 2026")                                                                                                                                                      | o Figma usa formato EN ("29 Jul, 2026"); a interface é pt-BR                                                                                |
| Tablet (768 px): catálogo em 3 colunas, arte do detalhe limitada a 520 px                                                                                                                           | tablet não desenhado; o layout mobile esticado ficava desproporcional                                                                       |
