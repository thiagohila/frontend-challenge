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
| B6b | Clique em "Salvar" perdido após erro no blur | `mode: 'onTouched'`: a mensagem aparece no blur, desloca o botão sob o ponteiro e o mouseup cai fora | `mode: 'onSubmit'` + `reValidateMode: 'onChange'` em todos os formulários | e2e T8 (desktop/mobile) |
| B6b | Formulário de perfil remontado ao trocar o avatar | `key={dataUpdatedAt}` apagaria o que foi digitado | removido; `form.reset` só após salvar | revisão |
| B6b | Processo: commit seguiu após falha de script | comandos encadeados com `;` | `set -e` em comandos que terminam em commit | prática |
| B7 | Foco não voltava ao "Confirmar compra" ao fechar a revisão | diálogo aberto programaticamente (sem trigger Radix para restaurar) | `onCloseAutoFocus` devolve o foco ao botão | e2e T11 |
| B7 | Baselines visuais instáveis (±1 px de altura) | imagens `lazy` carregando durante a captura de página inteira | testes carregam e decodificam todas as imagens antes da captura; Docker Linux | `visual.spec` verificado 2× sem retry |
| B7 | T1 mobile intermitente: lista "vazia" | Radix marca a página como `aria-hidden` enquanto o drawer fecha; `getByRole` ignora | esperar o drawer sumir (`closeFilters`) | catalog.spec repetido 4× |
| B7 | Tablet herdava o layout mobile esticado (cards e arte gigantes) | só havia breakpoint `lg` | catálogo em 3 colunas a partir de `md`; arte/painel do detalhe limitados | revisão em 768 px |
| B8 | Detalhe do NFT inteiro (Radix Dialog/Tabs) no chunk de entrada | `autoCodeSplitting` só separa `component`; o `pendingComponent` importava a view | `codeSplittingOptions` separa pending/error/notFound; skeleton em módulo próprio | análise de sourcemap do chunk de entrada |
| B8 | `decimal.js` e o realtime no caminho crítico | bridge de realtime montado no root | `RealtimeBridge` lazy após o primeiro paint | idem |
| B8 | Aviso de CSP (Boas práticas 96) | zod v4 sonda `new Function` na criação do 1º schema, antes do `z.config` (ordem de chunks) | `@/lib/z` configura e reexporta o zod; lint proíbe importar `z` de `zod` | verificação de issues via CDP em produção |
| B8 | LCP mobile dependente da API | arte do hero vinha de `/nfts/featured` | hero editorial estático + preload; chunk do MSW em `modulepreload` | `docs/lighthouse/README.md` |
| EX | Rótulos que não trocariam de idioma | dicionário lido em constantes de módulo (`MobileTabBar` items, `WalletForm` `fields`) | leitura no render; a constante guarda a **chave** | regra em ARCH §11 + `e2e/prefs.spec.ts` verifica a tab bar/header em en-US |
| EX | Títulos de página e mensagem genérica fora do dicionário | strings literais em `head()` das rotas e em `applyApiErrors` | `t.titles.*`, `t.form.genericError` | busca por literais pt fora de `src/i18n` antes do commit |
| EX | Foco ia para o `<body>` ao trocar o idioma | o shell remonta por `key={locale}` e desmonta o `select` focado | o seletor recupera o foco ao remontar | `prefs.spec` (`toBeFocused`) |
| EX | Checagem de capturas só pegava linhas únicas | `grep` por padrão de uma linha | varredura em en-US de 7 telas logadas sem copy pt | `prefs.spec` "no pt-BR UI copy" |
| EX | Processo: `git checkout <commit> -- src` para medir bundle apagou edições não commitadas | medição no working tree | medir commits antigos em `git worktree` | prática |
| Figma | Promos com 180 px (Figma 250; arte 169 vs 292×250; CTA 119×36 vs 140×40) | medidas aproximadas no B4 | valores do `figma-metadata.json` | comparação lado a lado app × `docs/design/frames` (15 telas) |
| Figma | Blog com cards de 282 px e imagem de 180 (Figma 268 e 195) | grid esticado à largura | `grid-cols-[repeat(4,268px)]`, imagem 195 | idem |
| Figma | Detalhe: coluna de informações empurrada à direita, moldura da imagem 484 (Figma 444) e nota quebrando linha | galeria `w-full` no flex row + `justify-between`; coluna de 530 (Figma 595) | `lg:w-auto`, `items-start`, coluna 595, arte 404 em moldura 444, botões 130×40 | idem |
| Figma | Tab bar mobile com rótulos visíveis; ícones sociais do rodapé com borda dupla a 16 px | SVG do Figma já traz a moldura (30 px); rótulos não existem no design | rótulos `sr-only` + ponto na ativa; ícone a 30 px sem borda extra | idem |
| Figma | Mobile: cupom retangular (Figma pill 50), inputs de auth com raio 3 (Figma 10), espaçamento vertical do auth menor, pontos do hero fora do card, nota sem selo | detalhes de mobile não conferidos contra o frame | pill, raio 10/5, espaçamento do frame, pontos dentro do card, selo "★ 4.8 (19)" | idem |
| Figma | Confirmação com header/footer | rota tratada como página comum | sem chrome em `/orders/*`, X de fechar (ARCH §15) | idem |
| Figma | Diferenças menores mantidas | — | círculos decorativos do hero mobile, stepper em círculo, sem pontos no carrossel de relacionados | registradas aqui; não afetam fluxo |
| Figma | Rádio das carteiras e fatos do recibo | um layout só para os dois breakpoints; colunas iguais quebrando o texto | rádio à esquerda e sem avatar no desktop (à direita no mobile); fatos em linha única, carteira como no Figma | baseline VIS do pagamento |
| Código | `OrderView` com 213 linhas | estados pendente/recusado no mesmo arquivo | `OrderStates.tsx` | checklist (~200 linhas) |
| Auditoria | **Sair sem recarregar quebrava o app**: catálogo não renderizava e o socket anônimo morria | `clearPrivateState` fazia `cancelQueries()` + `clear()` globais depois da navegação (órfão da query do catálogo montada) e `onSessionEnd` parava o socket anônimo recém-aberto pelo bridge | remove só as queries `['user', id]`; teardown recebe o usuário e para só o socket dele | e2e "sign-out without a reload…" (sem `page.goto`, que mascarava o bug) |
| Auditoria | Reautenticar no checkout derrubava a carteira conectada | `invalidateQueries()` refazia a query local cujo `queryFn` devolvia `null` | `queryFn` devolve o valor em cache | revisão: query só de cliente nunca "busca" `null` |
| Auditoria | Carrinho avisava "ajustada (disponibilidade)"/"removido por falta de estoque" após edição do próprio usuário, com id cru | `quote.changes` era um diff contra a cotação anterior | só ajustes feitos pelo servidor (clamp de estoque) e mudanças de preço; `name` no contrato da mudança | e2e "stock drop clamps the line and the summary together…" |
| Auditoria | Queda de estoque: linha com qtd 3 e resumo com 1 | o clamp do servidor acontece na cotação e o carrinho não era refeito | cotação com ajuste invalida o carrinho | idem |
| Auditoria | `__mock.reset()` não restaurava o cenário: latência forçada, gatilhos únicos consumidos e resolução de pedido continuavam | reset só limpava falhas | reset = `setScenario(atual)` + seed + derrubar sockets (o app reconcilia) | e2e `mock-api` "reset restores the seed…" |
| Auditoria | `?scenario=empty` depois de navegar no `default` mostrava o catálogo cheio | o db salvo no `localStorage` tinha prioridade sobre o seed do cenário da URL | troca de cenário pela URL refaz o seed | idem |
| Auditoria | Falha injetada com 404/403 respondia `UNAVAILABLE` | código fixo no handler | código conforme o status | idem |
| Auditoria | Escrita que rejeita a requisição não era salva (o evento já tinha saído) | `persistence.save` depois do `mutate` | `try/finally` no `db.write` | revisão |
| Auditoria | Esgotar na confirmação mostrava "Não foi possível calcular o resumo" | cotação de carrinho vazio virava erro genérico com retry | 409 `OUT_OF_STOCK` com o nome do item; `QuoteError` mostra a mensagem definitiva e o caminho ao catálogo | e2e P4 "sells out" |
| Auditoria | Taxa de rede não era revalidada | taxas eram constantes e fora da comparação de cotação | taxa no db + `__mock.setNetworkFee`; cotação com taxa diferente é desatualizada | e2e P4 "network fee change" |
| Auditoria | Servidor aceitava pedido em rede diferente da conectada | só o cliente checava | conexão precisa estar na rede do pedido | revisão |
| Auditoria | Overflow de 61 px em 320 px na home; o README dizia que 320 era testado | `fieldset` com `min-inline-size: min-content`; coluna implícita do grid no rodapé | `min-w-0`, `grid-cols-1`; testes de 320 px em `layout.spec` | e2e "reflow at 320 px" |
| Auditoria | Foco quase invisível nos cards de NFT | `focus-visible:outline-none` no link do card | anel de foco no `::after` que cobre o card | revisão (axe não pega) |
| Auditoria | Preço no link (`?priceMin=1`) ignorado; faixa invertida | o router lê número e o schema exigia string | aceita número como decimal; faixa invertida é trocada | revisão |
| Auditoria | `?page=99` com textos contraditórios | servidor não limitava a página | página além do fim responde a última | revisão |
| Auditoria | Mudança de preço/estoque não anunciada no detalhe | anúncio só quando o item estava no carrinho | anúncio também na página do próprio NFT | e2e realtime (live region) |
| Auditoria | Sessão salva não era conferida no boot | o app nunca chamava `GET /auth/session` | conferência no boot; 401 abre a reautenticação | e2e "revoked on the server is detected on boot" |
| Auditoria | Erros silenciosos: merge do carrinho de visitante, avatar corrompido; perfil salvo mesmo com senha atual errada | `catch` que devolvia `null`; `await` fora de `try`; ordem das mutations | toast de falha no merge; erro no campo do avatar; senha antes do perfil | checklist "sem catch silencioso" |
| Auditoria | Testes fracos: jitter só olhava a URL; `order.updated` passava também por polling | asserções no lugar errado | jitter compara a lista renderizada com a resposta do filtro final; anúncio "Pagamento confirmado." só existe no caminho do socket | e2e catalog/realtime-checkout |
| Auditoria | Docs divergentes (`QueryState`, `lib/idempotency.ts`, parâmetros `category`/`status`, padrão `/nft/1` do Lighthouse, commit fora do `summary.json`) | docs escritos antes do código final | corrigidos; `summary.json` passa a gravar commit e data | revisão docs × código |
| Auditoria | Cenários e regras sem teste: `server-error`, `register-conflict`, TTL de `session-expired`, `wallet-disconnect`, `unauthorized`; guarda de carteira no servidor; avatar recusado pela API; edição de carteira + reload | testes escritos por fluxo, não por cenário | `e2e/scenarios.spec.ts`, unit da guarda de carteira (desconectada e rede errada), API do avatar em `mock-api.spec`, edição principal+secundária em `account.spec` | todo cenário novo em `scenarios.ts` entra com teste |
