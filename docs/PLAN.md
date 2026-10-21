# Plano de desenvolvimento — 24h

Janela: **21/10 18:40 → 22/10 18:40**. Meta: entregar todos os eliminatórios + máximo de pontos, deploy funcionando desde cedo.

## 1. Eliminatórios (não negociáveis)
| # | Requisito | Como garantimos |
|---|---|---|
| E1 | Uso efetivo de toda a stack | Router/Query/Axios/Socket/MSW/shadcn/Tailwind/Playwright/Lighthouse em fluxos reais (smoke já cobre MSW REST + WS) |
| E2 | Fluxos não apenas visuais | Toda ação passa por Axios → MSW → estado do mock |
| E3 | Compra confirmada só pela simulação | Recibo só renderiza `order.status === 'confirmed'` vindo da API/evento |
| E4 | Sem vazamento entre usuários | keys com `userId`, `queryClient.clear()`, filtro por token nos handlers, descarte de eventos de outra sessão |
| E5 | Eventos não simulados na UI | Eventos emitidos só pelo handler `ws` do MSW, via socket.io-client |
| E6 | E2E executáveis | `npm run test:e2e` verde a partir de checkout limpo |
| — | Deploy público | Vercel, SPA rewrite, mocks ligados no build |

## 2. Bloqueio atual
- **Figma**: o MCP retornou "sem acesso de edição" (`Ff0SksUi7UFtPWUO8kyNtw`). Fidelidade visual vale 20 pts. **Ação do usuário:** duplicar o arquivo para os próprios drafts (Figma → Duplicate) e me passar a nova URL, ou exportar os frames/assets (PNG + tokens). Até lá: estrutura, dados e fluxos sem pixel-perfect.

## 3. Pontuação × esforço
| Critério | Pts | Prioridade |
|---|---:|---|
| Visual/responsivo | 20 | Alta (depende do Figma) |
| Fluxos/UX | 20 | Alta |
| Integração/estado | 15 | Alta (base de tudo) |
| Tempo real | 10 | Média-alta |
| Mocking | 10 | Alta (base de tudo) |
| Testes | 10 | Média, incremental |
| A11y | 5 | Embutida em cada tela |
| Performance | 5 | Final |
| Arquitetura/docs | 5 | Final + incremental |

## 4. Cronograma (blocos)
| Bloco | Horário | Entregas | Pronto quando |
|---|---|---|---|
| B0 ✅ | 18:40–19:30 | Scaffold, stack instalada, smoke E2E, contexto, segurança base | `typecheck`/`build`/`test:e2e` verdes |
| B1 | 19:30–20:30 | **Deploy Vercel** (SPA rewrite + CSP validada), layout base (header/footer/nav mobile), tokens do Figma | URL pública abre `/` e rota direta com refresh |
| B2 | 20:30–23:00 | **Fundação de dados**: `contracts/` (zod), MSW db com persistência (localStorage) + reset, cenários (`?scenario=` / painel dev), latência/falhas configuráveis, fixtures (≥40 NFTs, 2 usuários, edições), money utils | handlers de todos os recursos (§5 do enunciado) respondendo com erros tipados |
| B3 | 23:00–02:00 | **Auth + conta**: cadastro (409), login, sessão (refresh), expiração, logout/troca de usuário, guarda de rotas com `redirect`, perfil (avatar, senha), carteiras | Fluxos de conta ponta a ponta |
| B4 | 02:00–05:00 | **Catálogo + detalhe**: destaques, busca/filtros/ordenação/paginação na URL, skeletons, vazio/erro/retry, respostas fora de ordem (abort signal + keys), detalhe (galeria, edição, quantidade, 404, esgotado), favoritos com **update otimista + rollback** | Testes E2E 1, 2, 4 |
| — | 05:00–09:00 | Descanso (não pular: qualidade cai) | |
| B5 | 09:00–11:30 | **Carrinho + cotação**: CRUD, limites por edição, merge visitante→login, cupom (inválido/expirado), resumo da API, persistência | Teste 5 |
| B6 | 11:30–14:00 | **Checkout + pedidos + realtime**: dados, carteira/rede (conectar/recusar/desconectar), revalidação de cotação, idempotência, pendente/confirmado/recusado, recuperação após refresh/reconexão, `nft.updated`/`order.updated` com versão + dedupe, reconciliação REST pós-reconexão, recibo snapshot | Testes 6, 7, 9, 10 |
| B7 | 14:00–16:00 | **Fidelidade visual + responsivo** (390/768/1440), a11y (teclado, foco em diálogos, aria-live), regressão visual (home, detalhe, carrinho, pagamento) | Testes 3, 8, 11, 12 + snapshots |
| B8 | 16:00–17:30 | Lighthouse 3× mobile/desktop (home, detalhe), otimizações (code split, imagens AVIF/WebP com dimensões, fontes self-hosted, preload LCP) | `docs/lighthouse/summary.json` |
| B9 | 17:30–18:40 | README da solução, `ARCHITECTURE.md`, checkout limpo (`npm ci && build && test:e2e`), deploy final = código entregue | Entrega |

**Linha de corte** (se atrasar >1h, nesta ordem): animações/polimento visual fino → tablet pixel-perfect → cenários extras de latência variável → snapshots mobile (manter desktop). **Nunca cortar:** E1–E6, deploy, checkout com idempotência e realtime.

## 5. Decisões técnicas
- **Contratos**: zod em `src/contracts`, compartilhados app ↔ mocks; respostas parseadas no `api.ts` de cada feature.
- **Erros**: envelope `{ error: { code, message, fields? } }`; códigos `VALIDATION`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `UNAVAILABLE`. Interceptor Axios normaliza para `ApiError`.
- **Query**: `queryOptions` por recurso; keys `['nfts', params]`, `['me', userId, 'cart']`…; `signal` do Query → Axios (cancelamento); `placeholderData: keepPreviousData` no catálogo; retry só em falha transitória.
- **Sessão**: token em memória + `sessionStorage`; 401 global → evento de expiração → modal de re-login preservando a rota/checkout.
- **Carrinho**: server-side no mock por usuário; visitante em `localStorage` (via endpoint de "guest cart" com id anônimo) e merge no login.
- **Realtime**: um socket por sessão, autenticado no handshake (`auth: { token }`); eventos `{ id, type, resourceId, version, userId?, payload }`; store de versões aplicadas (dedupe/out-of-order); `connect` após reconexão → `invalidateQueries` dos recursos ativos.
- **Cenários MSW**: seleção por `?scenario=` (persistido) e por header/`page.addInitScript` nos testes; reset via `POST /api/__reset` e botão no painel dev; relógio e eventos controláveis nos testes (endpoints `__emit` restritos ao mock).
- **Mocks em produção**: ligados no build de demo (`VITE_ENABLE_MOCKS`), worker servido em `/mockServiceWorker.js`.

## 6. Segurança no plano (detalhes: `docs/SECURITY.md`)
- B0: gitignore de segredos, `.env.example` sem segredos, CSP/headers, lint `no-danger`, audit prod = 0 ✅
- B2: hash de senha no mock; handlers sempre derivam usuário do token.
- B3: redirect interno validado; limpeza total no logout/troca; não logar token.
- B5/B6: idempotência; descarte de eventos de outra sessão; upload de avatar com allowlist.
- B9: `npm audit --omit=dev`, revisar diff por segredos, validar headers no deploy.

## 7. Riscos
- Figma sem acesso → ver §2.
- `@mswjs/socket.io-binding` 0.2: sem rooms/namespaces; handshake no microtask (só emitir após o cliente falar). Transporte apenas `websocket`.
- Lighthouse com MSW: worker adiciona JS no boot → medir cedo (B1) para não ser surpresa.
- Tempo: blocos B5/B6 são os mais densos; começar o B6 pelos contratos de pedido já no B2.
