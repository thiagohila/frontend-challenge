# Registro de revisão por fase

Cada bloco termina com uma revisão (DoD, `docs/PLAN.md` §3): diff contra o checklist do `CLAUDE.md`, regra de camadas, a11y + axe.
Abaixo, o que apareceu, a causa raiz, a correção e **como evitamos que volte** (teste, regra de lint ou documento).

| Bloco | Problema | Causa raiz | Correção | Prevenção |
|---|---|---|---|---|
| B0 | `npm ci` falhava com conflito de peers | peers opcionais do `@hookform/resolvers` | resolver zod próprio (`lib/zod-form.ts`) | ADR 2 |
| B0 | Socket mock não respondia | binding envia o handshake num microtask; `emit` síncrono chegava antes | mock só emite após o cliente falar (`session.hello`) | ARCH §10 (limitações do binding) |
| B0 | 17 vulnerabilidades (dev) | `@lhci/cli` + `basic-ftp` transitivo | script Lighthouse próprio + override | `npm audit --omit=dev` no DoD |
| B1b | Tempo real quebrava ao renderizar antes do MSW | engine.io captura `globalThis.WebSocket` ao avaliar o módulo | `socket.io-client` só por `import()` após `mocksReady` | regra de lint (import estático proibido) + ADR 12 |
| B1b | Lighthouse não abria o Chrome | sandbox do agente bloqueia a porta de debug | rodar fora do sandbox; Chromium do Playwright | CLAUDE.md |
| B2 | Auditoria: 6 riscos críticos de design (ping, idempotência × cotação, pedido pendente após refresh, `/tx` público, init limpando o db) | validação insuficiente contra o comportamento real das libs | ARCH revisada; testes de contrato | memória "plano com rastreabilidade" |
| B3 | `as never` no resolver e no form de carteira | atalho de tipagem | `pipe` no zod; árvore de `FieldErrors` tipada | checklist "sem `as never`" |
| B3 | Input do ENS sem label (axe) | `FormField` clonava a `div` do afixo, não o input | `AffixInput` repassa id/aria ao `<input>` | axe em toda tela nova |
| B3 | Nome acessível ≠ texto visível (link da conta) | `aria-label` substituindo o texto | texto visível + complemento `sr-only` | axe (`label-content-name-mismatch`) |
| B3 | Cascata de anúncios em erros de formulário | `role="alert"` em cada erro de campo | erro de campo só via `aria-describedby`; um `<FormError>` | CLAUDE.md (regra de formulários) |
| B3 | UI com estado dentro de rota | atalho de camadas | `WalletSection` em `features/wallets` | ARCH §2 "rotas só compõem" + ADR 17 |
| B4 | Favorito pós-login não aplicado | intenção gravada **depois** do `signIn`; o runner reage na hora | gravar antes do `signIn` | e2e T4 |
| B4 | Barra de compra mobile fora da tela | aba "Avaliações…" com `flex-none` + `nowrap` alargava o layout viewport (390 → 509 px) | `min-w-0 flex-initial whitespace-normal` | **`e2e/layout.spec.ts` antecipado do B7** (overflow em todas as telas × 3 larguras) |
| B4 | Toast cobria as ações do topo no mobile | toasts no topo | toasts embaixo, acima das barras | ARCH §15 |
| B4 | ids duplicados de busca; `aria-label` em `div` sem papel; nome do botão de filtros | descuido de a11y | `useId`, texto `sr-only` | axe ampliado (9 telas) |
| B4 | Testes intermitentes sob carga | 3× PBKDF2 (100k) no seed a cada primeira carga | hashes pré-calculados + teste que os confere | `tests/unit` + timeout de expect documentado |
| B4 | Lógica de dados no componente (`quickAdd`) e `PurchasePanel` com 2 layouts | crescimento do bloco | `useQuickAddToCart`; `MobileBuyBar`/`NftFacts` | checklist (responsabilidade única, ~200 linhas) |
| B4 | Sem formatador | lacuna de setup | Prettier + plugin Tailwind; `format:check` | DoD |
| B4 | **Lighthouse mobile 45/42** (LCP 5,8 s, TBT 0,75–1,3 s); desktop 94/95; A11y/BP/SEO 100 | LCP (hero) depende de `/nfts/featured` → espera o MSW (437 KB) sob CPU 4×; ~1 MB de JS avaliado no boot | planejado para o B8 (ver PLAN §7) | medir a cada bloco a partir de agora (1 run) |

