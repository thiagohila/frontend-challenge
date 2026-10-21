# Arquitetura

Guia normativo do projeto (o **como**). O que está aqui **deve** ser seguido; desvios exigem registro em §14 (ADRs).
Enunciado: `docs/CHALLENGE.md` · O quê: `docs/REQUIREMENTS.md` · Plano: `docs/PLAN.md` · Segurança: `docs/SECURITY.md` · Design: `docs/DESIGN.md`.

## 0. Avaliação do estado atual (B0)
| Item | Situação | Ação |
|---|---|---|
| Vite + TS strict + aliases `@/` | ✅ adequado | — |
| Router file-based + `routeTree.gen.ts` versionado | ✅ typecheck funciona sem build | manter versionado |
| QueryClient global | ✅ | ajustar retry por erro (§6) |
| Axios `http` | ⚠️ sem interceptors | adicionar auth, normalização de erro, 401 (§5) |
| Socket criado dentro da rota `/` | ⚠️ provisório (smoke) | mover para `RealtimeProvider` por sessão (§9) |
| MSW boot lazy | ✅ não pesa no bundle principal | ⚠️ hoje bloqueia o render → renderizar o shell antes e segurar só a rede (§13) |
| Handlers MSW em arquivo único | ⚠️ não escala | dividir por recurso + db + cenários (§10) |
| Contratos | ❌ inexistentes | criar `src/contracts` (§4) antes de qualquer feature |
| E2E smoke + axe | ✅ | evoluir fixtures (§12) |

Conclusão: a base é sólida. Os riscos estão no que ainda não existe, então a ordem é contratos → mock db → http/sessão → features.

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
- `features/<x>` expõe pela `index.ts` só hooks, componentes e `queryOptions`; não importa internals de outra feature.
- `contracts` é puro (zod + tipos), sem React e sem axios.
- `components/ui` é shadcn. `components/` tem os blocos compartilhados do app (Skeleton, QueryState, FormField, PriceTag…).

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
  { error: { code: 'VALIDATION'|'UNAUTHORIZED'|'SESSION_EXPIRED'|'FORBIDDEN'|'NOT_FOUND'|'CONFLICT'|'IDEMPOTENCY_CONFLICT'|'OUT_OF_STOCK'|'QUOTE_STALE'|'COUPON_INVALID'|'COUPON_EXPIRED'|'PAYMENT_DECLINED'|'WALLET_REJECTED'|'WALLET_DISCONNECTED'|'UNAVAILABLE',
             message: string, fields?: Record<string,string>, details?: unknown } }
  ```
  HTTP: 400/422 `VALIDATION` · 401 `UNAUTHORIZED`/`SESSION_EXPIRED` · 403 `FORBIDDEN`/`WALLET_REJECTED` · 404 `NOT_FOUND` · 409 `CONFLICT`/`IDEMPOTENCY_CONFLICT`/`OUT_OF_STOCK`/`QUOTE_STALE` · 422 `COUPON_*` · 402 `PAYMENT_DECLINED` · 503/timeout/rede `UNAVAILABLE` (transitório).
- **Recurso de outro usuário** responde **404** (não 403), para não confirmar a existência.
- **Paginação**: `{ items, page, pageSize, total, totalPages }`.
- **Versionamento**: recursos mutáveis por realtime (`Nft`, `Order`, `Edition`) carregam `version: number` (monotônico) e `updatedAt`.

### Endpoints (base `/api`)
| Recurso | Método/rota | Notas |
|---|---|---|
| Sessão | `POST /auth/register` · `POST /auth/login` · `GET /auth/session` · `POST /auth/logout` | 409 email em uso; 401 `SESSION_EXPIRED` |
| NFTs | `GET /nfts?q&collection&category&priceMin&priceMax&status&sort&page&pageSize` · `GET /nfts/featured` · `GET /nfts/:id` | 404 inexistente; edições com `available` |
| Favoritos | `GET /me/favorites` · `PUT /me/favorites/:nftId` · `DELETE /me/favorites/:nftId` | idempotentes |
| Carrinho | `GET /cart` · `POST /cart/items` · `PATCH /cart/items/:itemId` · `DELETE /cart/items/:itemId` · `POST /cart/merge { guestCartId }` | dono = usuário (token) ou visitante (`X-Guest-Cart-Id`); 409 `OUT_OF_STOCK` com `available`; o merge soma por (nft, edição), limita ao estoque e devolve `adjustments[]` para avisar |
| Cotação | `POST /quote { coupon?, network? }` | retorna `quoteId`, `version`, `expiresAt`, linhas (preço unitário da cotação), `subtotal`, `discount`, `networkFee`, `total`, `changes[]` (diferenças vs carrinho/cotação anterior) |
| Pedidos | `POST /orders { quoteId, walletId, network, buyer }` (header `Idempotency-Key`) · `GET /orders/:id` · `GET /orders?status=pending` | 409 `QUOTE_STALE` + nova cotação; mesma key + mesmo payload → **mesmo pedido** (200); mesma key + payload diferente → 409 `IDEMPOTENCY_CONFLICT`. Ao confirmar, o servidor **subtrai do carrinho só (nft, edição, qtd) comprados** e grava o **snapshot** do recibo (linhas, preços, taxas, total, `txHash`, `explorerUrl`) |
| Perfil | `GET /me/profile` · `PATCH /me/profile` · `PUT /me/avatar` · `POST /me/password` | 422 validação por campo; senha atual incorreta → 422 `fields.currentPassword` |
| Carteiras | `GET /me/wallets` · `POST /me/wallets` · `PATCH /me/wallets/:id` | `role: 'primary'|'secondary'` (no máximo uma de cada); `address` validado; `networks[]` |
| Conexão de carteira | `POST /me/wallets/:id/connect { network }` · `DELETE /me/wallets/:id/connect` | 200 `{ connectionId, status: 'connected' }` · 403 `WALLET_REJECTED` (usuário "recusou") · desconexão do lado da "carteira" chega como evento `wallet.disconnected`; criar pedido com conexão inativa → 409 `WALLET_DISCONNECTED` |

### Eventos Socket.IO (namespace `/`)
Envelope: `{ eventId: string, type, resourceId: string, version: number, occurredAt: string, userId?: string, payload }`.
| Evento | Direção | Payload |
|---|---|---|
| `nft.updated` | server→client | `{ price, editions: [{ id, available }] }` |
| `order.updated` | server→client (só ao dono) | `{ status: 'pending'|'confirmed'|'declined', txHash?, reason? }` |
| `wallet.disconnected` | server→client (só ao dono) | `{ walletId, connectionId, reason }` |
| `session.hello` | client→server | `{ token }` (handshake de auth) |
| `order.subscribe` / `order.unsubscribe` | client→server | `{ orderId }` |

## 5. HTTP (Axios)
- Instância única `lib/http.ts`: `baseURL`, `timeout` (10s; checkout 15s), JSON.
- **Request interceptor**: `Authorization: Bearer <token>` vindo do session store; `X-Guest-Cart-Id` quando visitante.
- **Response interceptor**: converte para `ApiError { status, code, message, fields }`; timeout/rede → `code: 'UNAVAILABLE'`, `transient: true`. Em 401 `SESSION_EXPIRED`/`UNAUTHORIZED` → `session.expire()`, exceto em `/auth/*`.
- `api.ts` de cada feature: `schema.parse(res.data)`. Uma resposta inválida é um bug: falha alto.
- Sempre repassar `signal` do Query para cancelamento.
- Request interceptor aguarda `mocksReady` (promise resolvida após `worker.start`, ou imediatamente com os mocks desligados). Assim o shell renderiza sem esperar o MSW (§13).
- **Idempotency-Key** (`lib/idempotency.ts`): uma chave por **tentativa de compra** = (userId, quoteId). Ela é persistida em `sessionStorage` até o pedido ficar terminal; retry/timeout/refresh reutilizam a chave; nova cotação gera nova chave.

## 6. Estado remoto (TanStack Query)
- **Keys** (`lib/query-keys.ts`):
  - públicas: `['nfts', 'list', params]`, `['nfts', 'featured']`, `['nfts', 'detail', id]`
  - privadas: `['user', userId, 'favorites' | 'cart' | 'profile' | 'wallets' | 'orders', ...]`
  - visitante: `['guest', guestId, 'cart']`
- **Defaults**: `staleTime` 30s (catálogo), 0 em `quote`; `gcTime` 5min; retry só se `ApiError.transient` (máx 2, backoff); mutations sem retry.
- **Respostas fora de ordem**: key por params + `signal` (abort) + `placeholderData: keepPreviousData`. Nunca `setState` manual com resultado de fetch.
- **Invalidação após mutation**:
  | Mutation | Invalida/atualiza |
  |---|---|
  | favorito on/off | **otimista** em `favorites` + flag no detalhe; rollback no erro; `invalidate` no settle |
  | item do carrinho | `cart`, `quote` |
  | cupom | `quote` |
  | criar pedido | `setQueryData(order)`; após `confirmed`: `cart`, `nfts.detail` dos itens |
  | perfil/avatar | `profile` (+ header) |
  | carteiras | `wallets` |
  | login/logout | `queryClient.clear()` (§7) |
- **Estados**: todo componente com dados usa `<QueryState>` (loading = skeleton com dimensões fixas, empty, error com retry, `isFetching` = indicador discreto de atualização em segundo plano).

## 7. Sessão e autenticação
- `lib/session`: store externo (`useSyncExternalStore`) com `{ status: 'unknown'|'authenticated'|'anonymous'|'expired', user, token }`; token persistido em `sessionStorage`.
- Boot: se há token → `GET /auth/session` antes de resolver guards (`router.context.session`).
- Guard: layout route `_auth` com `beforeLoad` → `redirect({ to: '/login', search: { redirect: location.href } })`. `redirect` só é aceito se for path interno (`/` sem `//`).
- **Expiração no meio da navegação/checkout**: `session.expire()` abre o `ReauthDialog` (não navega), e o formulário e a rota ficam preservados. Ao relogar com o mesmo usuário, refaz as queries; se for outro usuário, aplica as regras de troca.
- **Logout/troca de usuário** (ordem): desconectar socket → limpar versões/dedupe do realtime → `queryClient.cancelQueries()` + `clear()` → limpar storages privados (`sessionStorage`, rascunhos de checkout) → navegar.
- Login de visitante com carrinho: `POST /cart/merge { guestCartId }` → anunciar `adjustments` → descartar o guestId.
- **Ação protegida a partir de tela pública** (favoritar, ir ao checkout): navega para `/login?redirect=<rota>&intent=<ação>`; após o login, volta à rota e executa a intenção (ex.: `favorite:<nftId>`). A intenção é validada por schema e só aceita ações da allowlist.
- Ao logar, um pedido `pending` do usuário (`GET /orders?status=pending`) é retomado: banner + link para o status (RT8).

## 8. Rotas
| Rota | Arquivo | Auth | Search (zod) |
|---|---|---|---|
| `/` | `index.tsx` | — | `q, collection[], category[], priceMin, priceMax, status, sort, page` |
| `/nft/$nftId` | `nft.$nftId.tsx` | — | `edition?` |
| `/cart` | `cart.tsx` | — | — |
| `/checkout` | `_auth/checkout.tsx` | ✅ | `step: 'details'|'review'` |
| `/orders/$orderId` | `_auth/orders.$orderId.tsx` | ✅ | — (confirmação/recibo) |
| `/login` | `login.tsx` | só anônimo | `redirect?` |
| `/register` | `register.tsx` | só anônimo | `redirect?` |
| `/account/profile` | `_auth/account.profile.tsx` | ✅ | — |
| `/account/wallets` | `_auth/account.wallets.tsx` | ✅ | — |
| `/tx/$hash` | `tx.$hash.tsx` | — | — (explorador simulado) |
| `*` | `__root notFoundComponent` | — | — |
- Mudança de qualquer filtro → `page: 1` (feito no helper `updateFilters`, nunca no componente).
- `loader` do detalhe: `queryClient.ensureQueryData(nftDetail(id))`; 404 → `throw notFound()`.
- `/checkout` com carrinho vazio e sem pedido pendente → `redirect` para `/cart` com aviso. `/orders/$orderId` de outro usuário ou inexistente → página 404. Status `pending` mostra a tela de aguardando; `declined` mostra a recusa com volta ao checkout; **recibo só em `confirmed`**.
- Cada rota define `head`/título e move o foco para o `h1` após a navegação.

## 9. Tempo real
- `lib/realtime/manager.ts`: **um** socket por sessão (`transports: ['websocket']`, `autoConnect: false`). Criado no login/boot, destruído no logout. Na conexão emite `session.hello { token }`.
- `RealtimeProvider` monta e desmonta o manager conforme a sessão; hooks `useRealtime(type, handler)` sempre fazem cleanup (`off`).
- **Aplicação de eventos** (`lib/realtime/apply.ts`), nesta ordem:
  1. descarta se `userId` existe e ≠ usuário atual (ou o socket é de sessão anterior);
  2. descarta se `eventId` já foi visto (LRU de 500);
  3. descarta se `version <= versão conhecida do recurso` (mapa `resourceId → version`, alimentado também pelas respostas REST);
  4. aplica: `nft.updated` → `setQueryData` no detalhe e nas listas que contêm o NFT, `invalidate(quote)`, aviso `aria-live`; `order.updated` → `setQueryData(order)` se a versão for maior. `confirmed`/`declined` são terminais e não regridem.
- **Reconexão** (`connect` depois de `disconnect`): `invalidateQueries` de `nfts` ativos, `cart`, `quote` e pedidos `pending`. É a reconciliação com o REST.
- **Checkout com cotação desatualizada**: `nft.updated` invalida a quote → a UI mostra a diferença e exige nova confirmação. O servidor também recusa um `quoteId` antigo (`QUOTE_STALE`), com defesa dupla.
- `wallet.disconnected` → marca a conexão como inativa, avisa e bloqueia "Confirmar" até reconectar.
- **Queda de conexão**: socket.io reconecta sozinho após **queda de transporte**; não reconecta após `io server disconnect`. Por isso o mock simula queda fechando o transporte (§10). Enquanto estiver desconectado, a UI mostra o status "reconectando" e pedidos `pending` fazem polling REST leve (5s) como fallback.

## 10. Mocks (MSW)
- **db** (`mocks/db`): estado único em memória (users, sessions, nfts/editions, favorites, carts, coupons, quotes, orders, idempotency, wallets, walletConnections). Persistido em `localStorage` (`msw-server-db:v1`) a cada escrita; `reset()` recarrega o seed do cenário. Seed determinístico; latência variável vem de PRNG com seed (ex.: mulberry32), então é reproduzível.
- Esse storage é **do servidor simulado** (contém todos os usuários, como um banco). O app nunca o lê; documentado no README/SECURITY para não ser confundido com vazamento.
- **Handlers** derivam o usuário **sempre** do token. Senhas como hash PBKDF2 + salt.
- **Cenários** (`mocks/scenarios.ts`): `default`, `empty`, `slow`, `jitter` (latência variável + fora de ordem), `offline`, `server-error`, `session-expired`, `register-conflict`, `coupon-expired`, `price-change-checkout`, `sold-out-checkout`, `order-timeout`, `payment-declined`. Cada um é um conjunto de overrides `{ latency, failures: { [route]: status|'network'|'timeout' }, flags }`.
- Cenários extras: `wallet-rejected`, `wallet-disconnect`, `favorite-fail`.
- **Seleção**: `?scenario=<nome>` (persistido) → painel dev (visível no build demo) → `window.__mock.setScenario()` nos testes. Reset: `window.__mock.reset()` + botão no painel.
- **API de controle** (`mocks/control.ts`, em `window.__mock`): `reset(scenario?)`, `setScenario(name)`, `fail(route, { status | 'network' | 'timeout', times })` (falha pontual, ex.: favorito falha 1x e depois funciona), `setLatency(ms | [min,max])`, `updateNft(id, patch)` (escreve no db → REST + `nft.updated`), `emitRaw(event)` (duplicado/antigo, para T10), `dropConnection()` (fecha o transporte), `resolveOrder(id, 'confirmed'|'declined')`, `disconnectWallet(id)`.
- **Painel dev** fica em `src/mocks/devtools/`, carregado só com os mocks ligados, e usa apenas a API de controle (servidor simulado → socket), nunca o cache ou os setters do app.
- **Mudança de dado = REST + evento**: toda escrita em `nfts`/`orders` passa por `db.update()`, que incrementa `version` e chama `realtime.broadcast()`. O pedido fica `pending` e é resolvido por timer do mock (controlável pelo relógio do Playwright).
- **Socket** (`handlers/realtime.ts`): `ws.link(env.socketUrl + '/*')` + `toSocketIo`. Registra as conexões e o usuário de cada uma (após `session.hello`). Limitações do binding 0.2: sem rooms/namespaces, handshake no microtask (emitir só depois do primeiro pacote do cliente), apenas transporte websocket.
- `window.__mock` só existe quando os mocks estão ligados. É a "API admin" do servidor simulado; a UI de produção nunca a chama para simular eventos.

## 11. UI, formulários e a11y
- shadcn como primitivas, tematizado por tokens CSS em `index.css` (cores, raio, tipografia do Figma). Não fazer fork de componente sem necessidade.
- Formulários: `useZodForm(schema)` (react-hook-form + resolver próprio em `lib/zod-form.ts`); erros da API (`fields`) mapeados via `setError`. `FormField` garante `label`, `aria-invalid` e `aria-describedby`.
- Skeleton com shimmer (`motion-safe:` no Tailwind) e dimensões do conteúdo real.
- `LiveRegion` global (`aria-live="polite"`) com `announce()` para mutations/realtime; erros com `role="alert"`.
- Checklist completo em `docs/PLAN.md` §5.
- **Fora do escopo** (editorial, suporte, atividade, ofertas, downloads, redes sociais): o item continua visível como no Figma, mas como `button` com `aria-disabled="true"`, badge/tooltip "Em breve" e toast informativo ao acionar. Nunca simula sucesso. Links externos reais abrem em nova aba com `rel="noopener noreferrer"` e ícone de externo.
- **Explorador de transação**: link para `/tx/$hash`, uma página interna "Explorador simulado" com os dados do snapshot e o aviso de simulação. Não aponta para Etherscan com hash falso.

## 12. Testes
- **Isolamento**: cada teste em contexto novo; `addInitScript` define o cenário e limpa o db antes do boot do app.
- **Fixture** `e2e/fixtures.ts`: `mock.scenario(name)`, `mock.reset()`, `mock.emit(event)` (via `window.__mock`, ou seja, servidor simulado → socket.io-client), `loginAs(user)`, `page.clock` para timers.
- Seletores por role/label (a11y-first); `data-testid` só quando não houver alternativa.
- Regressão visual: home, detalhe, carrinho, pagamento × desktop/mobile, cenário `default`, relógio congelado, animações desligadas.
- Projects: `desktop` (1440) e `mobile` (390). Report HTML + traces on failure (já configurado); o relatório final é copiado para `docs/playwright-report/` na entrega.
- **VIS no Linux**: `npm run test:e2e:docker` roda na imagem `mcr.microsoft.com/playwright:v1.64.1-noble`; as baselines versionadas são as Linux (o render de fonte do macOS difere).
- **Offline**: `context.setOffline` não afeta respostas do MSW. Falha de conexão é sempre simulada pelo mock (`fail(..., 'network')`, `dropConnection`).
- **Relógio**: `page.clock` só em testes sensíveis a tempo (expiração, timeout, resolução do pedido); avançar com `runFor`, porque o relógio também controla os `delay()` do MSW.
- Mapa de specs: `catalog.spec` (T1, T12) · `nft-detail.spec` (T2) · `auth.spec` (T3) · `favorites.spec` (T4) · `cart.spec` (T5) · `checkout.spec` (T6, T7) · `account.spec` (T8) · `realtime.spec` (T9, T10) · `a11y.spec` (T11 + axe) · `visual.spec` (VIS).

## 13. Performance
- **Boot**: `render()` imediato (shell + skeletons) em paralelo com `import('./mocks/browser')` + `worker.start()`; a rede espera `mocksReady` (§5). `modulepreload` do chunk do MSW. O LCP é medido no B1b para decidir otimizações.
- Code splitting por rota (`autoCodeSplitting`); MSW e socket são carregados sob demanda.
- SEO: `robots.txt`, `<title>` e `meta description` por rota, links reais (`<a href>`) na navegação.
- Imagens: assets do Figma otimizados (AVIF/WebP), `width/height`, `loading="lazy"` exceto a LCP (`fetchpriority="high"`).
- Fontes self-hosted (`@fontsource`), `font-display: swap`, preload da principal.
- Sem trabalho síncrono pesado no boot; listas grandes paginadas pelo servidor.

## 14. Decisões (ADRs curtas)
| # | Decisão | Motivo |
|---|---|---|
| 1 | Sem lib de i18n; dicionário tipado + `Intl` | o enunciado não exige; zero custo de bundle; habilita os extras |
| 2 | Resolver zod próprio | `@hookform/resolvers` com conflito de peers impede `npm ci` limpo |
| 3 | msw 2.x | `@mswjs/socket.io-binding` exige `msw@^2` |
| 4 | Token em `sessionStorage` | sobrevive a refresh, isolado por aba; em produção real seria cookie HttpOnly |
| 5 | Carrinho no servidor (também para visitante) | uma fonte de verdade para disponibilidade, cotação e merge |
| 6 | Lighthouse via API + script próprio | `@lhci/cli` trazia 17 vulnerabilidades; script dá mediana de 3 |
| 7 | `routeTree.gen.ts` versionado | typecheck/lint independem de build |
| 8 | Recurso de outro usuário → 404 | não revela existência (X4) |
| 9 | Explorador de transação interno (`/tx/$hash`) | link externo com hash falso pareceria real (S14, P10) |
| 10 | Shell renderiza antes do MSW; rede aguarda `mocksReady` | LCP/FCP no mobile sem burlar a auditoria (L2, L6) |
| 11 | Baselines VIS em Linux (Docker) | reprodutível na máquina de quem avalia (TQ2) |

## 15. Limitações, decisões de UX e desvios do Figma
Preenchido durante a implementação (obrigatório na entrega, D6).
### Limitações
- Backend, carteiras e blockchain simulados (MSW); sem rooms/namespaces no binding Socket.IO; transporte só websocket.
- Sessão em `sessionStorage` (por aba): uma nova aba exige novo login.
### Decisões de UX
- Ações fora do escopo: "Em breve" sem simular sucesso (§11).
- Expiração de sessão: modal de reautenticação sem perder o formulário/rota.
- Alterações de preço/estoque: aviso inline + `aria-live`, com nova confirmação obrigatória no checkout.
### Desvios do Figma
- _(registrar aqui cada ajuste: asset substituído, contraste corrigido, estado não desenhado)_
