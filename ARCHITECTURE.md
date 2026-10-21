# Arquitetura

Guia normativo do projeto. O que está aqui **deve** ser seguido; desvios exigem registro em §14 (ADRs).
Enunciado: `docs/CHALLENGE.md` · Plano: `docs/PLAN.md` · Segurança: `docs/SECURITY.md`.

## 0. Avaliação do estado atual (B0)
| Item | Situação | Ação |
|---|---|---|
| Vite + TS strict + aliases `@/` | ✅ adequado | — |
| Router file-based + `routeTree.gen.ts` versionado | ✅ typecheck funciona sem build | manter versionado |
| QueryClient global | ✅ | ajustar retry por erro (§6) |
| Axios `http` | ⚠️ sem interceptors | adicionar auth, normalização de erro, 401 (§5) |
| Socket criado dentro da rota `/` | ⚠️ provisório (smoke) | mover para `RealtimeProvider` por sessão (§9) |
| MSW boot lazy antes do render | ✅ não pesa no bundle principal | manter |
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
  { error: { code: 'VALIDATION'|'UNAUTHORIZED'|'SESSION_EXPIRED'|'FORBIDDEN'|'NOT_FOUND'|'CONFLICT'|'OUT_OF_STOCK'|'QUOTE_STALE'|'COUPON_INVALID'|'COUPON_EXPIRED'|'PAYMENT_DECLINED'|'UNAVAILABLE',
             message: string, fields?: Record<string,string>, details?: unknown } }
  ```
- **Paginação**: `{ items, page, pageSize, total, totalPages }`.
- **Versionamento**: recursos mutáveis por realtime (`Nft`, `Order`, `Edition`) carregam `version: number` (monotônico) e `updatedAt`.

### Endpoints (base `/api`)
| Recurso | Método/rota | Notas |
|---|---|---|
| Sessão | `POST /auth/register` · `POST /auth/login` · `GET /auth/session` · `POST /auth/logout` | 409 email em uso; 401 `SESSION_EXPIRED` |
| NFTs | `GET /nfts?q&collection&category&priceMin&priceMax&status&sort&page&pageSize` · `GET /nfts/featured` · `GET /nfts/:id` | 404 inexistente; edições com `available` |
| Favoritos | `GET /me/favorites` · `PUT /me/favorites/:nftId` · `DELETE /me/favorites/:nftId` | idempotentes |
| Carrinho | `GET /cart` · `POST /cart/items` · `PATCH /cart/items/:itemId` · `DELETE /cart/items/:itemId` · `POST /cart/merge` | dono = usuário (token) ou visitante (`X-Guest-Cart-Id`); 409 `OUT_OF_STOCK` |
| Cotação | `POST /quote { coupon? }` | retorna `quoteId`, `version`, `expiresAt`, linhas, `subtotal`, `discount`, `networkFee`, `total` |
| Pedidos | `POST /orders` (header `Idempotency-Key`) · `GET /orders/:id` · `GET /orders?status=pending` | 409 `QUOTE_STALE` + nova cotação; mesma key + payload diferente → 409 `CONFLICT` |
| Perfil | `GET /me/profile` · `PATCH /me/profile` · `PUT /me/avatar` · `POST /me/password` | 422 validação por campo |
| Carteiras | `GET /me/wallets` · `POST /me/wallets` · `PATCH /me/wallets/:id` | `role: 'primary'|'secondary'`; rede por carteira |

### Eventos Socket.IO (namespace `/`)
Envelope: `{ eventId: string, type, resourceId: string, version: number, occurredAt: string, userId?: string, payload }`.
| Evento | Direção | Payload |
|---|---|---|
| `nft.updated` | server→client | `{ price, editions: [{ id, available }] }` |
| `order.updated` | server→client (só ao dono) | `{ status: 'pending'|'confirmed'|'declined', txHash?, reason? }` |
| `session.hello` | client→server | `{ token }` (handshake de auth) |
| `order.subscribe` / `order.unsubscribe` | client→server | `{ orderId }` |

## 5. HTTP (Axios)
- Instância única `lib/http.ts`: `baseURL`, `timeout` (10s; checkout 15s), JSON.
- **Request interceptor**: `Authorization: Bearer <token>` vindo do session store; `X-Guest-Cart-Id` quando visitante.
- **Response interceptor**: converte para `ApiError { status, code, message, fields }`; timeout/rede → `code: 'UNAVAILABLE'`, `transient: true`. Em 401 `SESSION_EXPIRED`/`UNAUTHORIZED` → `session.expire()`, exceto em `/auth/*`.
- `api.ts` de cada feature: `schema.parse(res.data)`. Uma resposta inválida é um bug: falha alto.
- Sempre repassar `signal` do Query para cancelamento.

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
- Login de visitante com carrinho: `POST /cart/merge { guestCartId }` e depois descartar o guestId.

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
| `*` | `__root notFoundComponent` | — | — |
- Mudança de qualquer filtro → `page: 1` (feito no helper `updateFilters`, nunca no componente).
- `loader` do detalhe: `queryClient.ensureQueryData(nftDetail(id))`; 404 → `throw notFound()`.
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

## 10. Mocks (MSW)
- **db** (`mocks/db`): estado único em memória (users, sessions, nfts/editions, favorites, carts, coupons, quotes, orders, idempotency, wallets). Persistido em `localStorage` (`nft-mock-db:v1`) a cada escrita; `reset()` recarrega o seed do cenário. Seed determinístico (sem `Math.random` sem seed).
- **Handlers** derivam o usuário **sempre** do token. Senhas como hash PBKDF2 + salt.
- **Cenários** (`mocks/scenarios.ts`): `default`, `empty`, `slow`, `jitter` (latência variável + fora de ordem), `offline`, `server-error`, `session-expired`, `register-conflict`, `coupon-expired`, `price-change-checkout`, `sold-out-checkout`, `order-timeout`, `payment-declined`. Cada um é um conjunto de overrides `{ latency, failures: { [route]: status|'network'|'timeout' }, flags }`.
- **Seleção**: `?scenario=<nome>` (persistido) → painel dev (visível no build demo) → `window.__mock.setScenario()` nos testes. Reset: `window.__mock.reset()` + botão no painel.
- **Mudança de dado = REST + evento**: toda escrita em `nfts`/`orders` passa por `db.update()`, que incrementa `version` e chama `realtime.broadcast()`. O pedido fica `pending` e é resolvido por timer do mock (controlável pelo relógio do Playwright).
- **Socket** (`handlers/realtime.ts`): `ws.link(env.socketUrl + '/*')` + `toSocketIo`. Registra as conexões e o usuário de cada uma (após `session.hello`). Limitações do binding 0.2: sem rooms/namespaces, handshake no microtask (emitir só depois do primeiro pacote do cliente), apenas transporte websocket.
- `window.__mock` só existe quando os mocks estão ligados. É a "API admin" do servidor simulado; a UI de produção nunca a chama para simular eventos.

## 11. UI, formulários e a11y
- shadcn como primitivas, tematizado por tokens CSS em `index.css` (cores, raio, tipografia do Figma). Não fazer fork de componente sem necessidade.
- Formulários: `useZodForm(schema)` (react-hook-form + resolver próprio em `lib/zod-form.ts`); erros da API (`fields`) mapeados via `setError`. `FormField` garante `label`, `aria-invalid` e `aria-describedby`.
- Skeleton com shimmer (`motion-safe:` no Tailwind) e dimensões do conteúdo real.
- `LiveRegion` global (`aria-live="polite"`) com `announce()` para mutations/realtime; erros com `role="alert"`.
- Checklist completo em `docs/PLAN.md` §6.

## 12. Testes
- **Isolamento**: cada teste em contexto novo; `addInitScript` define o cenário e limpa o db antes do boot do app.
- **Fixture** `e2e/fixtures.ts`: `mock.scenario(name)`, `mock.reset()`, `mock.emit(event)` (via `window.__mock`, ou seja, servidor simulado → socket.io-client), `loginAs(user)`, `page.clock` para timers.
- Seletores por role/label (a11y-first); `data-testid` só quando não houver alternativa.
- Regressão visual: home, detalhe, carrinho, pagamento × desktop/mobile, cenário `default`, relógio congelado, animações desligadas.
- Projects: `desktop` (1440) e `mobile` (390). Report HTML + traces on failure (já configurado).

## 13. Performance
- Code splitting por rota (`autoCodeSplitting`); MSW e socket são carregados sob demanda.
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
