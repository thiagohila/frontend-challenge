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
| B5 | **Carrinho do visitante perdido no login** (intermitente) | `session.signIn` → `router.invalidate` → o guard do `/login` redireciona na hora; a navegação rápida abortava o merge em voo | merge **antes** de publicar a sessão, com o token novo explícito | e2e T5 "guest items…" (repetido 4× sob carga) |
| B5 | Helper de teste chamava a API antes do MSW | `fetch` em `page.evaluate` antes do `worker.start` caía no servidor estático | helpers esperam `window.__mock` | fixture `waitForMockServer` |
| B5 | Seletor `name: 'COMPRAR'` pegava "Como comprar NFTs" | match de nome por substring, case-insensitive | `exact: true` / regex ancorada | revisão de seletores |
| B5 | Preço "oculto" casado no mobile | `getByText(...).first()` pegava o preço do layout desktop (`display:none`) | `.filter({ visible: true })` | padrão nos specs de realtime |
| B5 | Lint: `role="status"`, spread "inútil", supressões de `exhaustive-deps` | atalhos | `<output>`, dependências estáveis (chave do dono) sem supressão | lint |
| B5 | `<dl>` inválido no resumo (axe) | `div > div > dt` na linha da taxa de rede | "Taxa estimada" dentro do `<dd>` | axe no carrinho com itens |
| B6 | Formulário do checkout perdido ao expirar a sessão | `useCartOwner` virava `null` em `expired` → a rota trocava o `CheckoutView` por skeleton (desmontava o form) | sessão expirada mantém o dono (mesmo usuário) | e2e A4 no checkout |
| B6 | Recibo adivinhava a arte pelo id do NFT | atalho (heurística) | `art` passa a fazer parte do snapshot da linha da cotação/pedido | contrato `quoteLineSchema` |
| B6 | Reconfirmação exigida sem mudança real (intermitente) | revisão comparava `quoteId`; o evento após o 409 gerava nova cotação com os mesmos valores | comparar o **conteúdo** da cotação (linhas, preços, taxas, total) | e2e T9 repetido 3× |
| B6 | `<details open>` controlado não deixava abrir no mobile | React reverte o atributo no próximo render | estado do usuário via `onToggle` | revisão |
| B6 | Casts em `error.details` | dado de servidor não confiável tratado com `as` | `safeParse` com zod | checklist "sem cast" |

