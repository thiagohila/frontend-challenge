# Plano de desenvolvimento — 24h

Janela: **21/10 18:40 → 22/10 18:40**. **Congelamento do código às 17:30**; depois disso, só folga/extras.
Fontes de verdade (não duplicar aqui):
- **O quê**: `docs/REQUIREMENTS.md` (matriz requisito → bloco → teste). O status é atualizado ao fechar cada bloco.
- **Como**: `ARCHITECTURE.md` (contratos, keys, sessão, realtime, mocks, **API de controle do mock §10**, testes §12).
- **Segurança**: `docs/SECURITY.md`. **Design**: `docs/design/DESIGN.md`.

## 1. Eliminatórios (não negociáveis)
X1 stack efetiva · X2 fluxos reais · X3 confirmação só pela simulação · X4 sem vazamento entre usuários · X5 eventos só via `socket.io-client` · X6 E2E executáveis · **deploy público** (D2). Detalhe e testes: REQUIREMENTS "Eliminatórios".

## 2. Pontuação × prioridade
| Critério | Pts | Onde se ganha |
|---|---:|---|
| Visual/responsivo | 20 | B1b (tema/shell) + **pixel pass de cada tela no próprio bloco** + B7 (consolidação 320/768) |
| Fluxos/UX | 20 | B3–B6b |
| Integração/estado | 15 | B2 (fundação) + todos |
| Tempo real | 10 | B5 (infra + `nft.updated`), B6 (`order.updated`) |
| Mocking | 10 | B2 (REST), B5 (socket) |
| Testes | 10 | junto de cada feature |
| A11y | 5 | checklist §5 em cada tela + B7 |
| Performance | 5 | baseline B1b, B8 |
| Arquitetura/docs | 5 | contínuo + B9 |

## 3. Definition of Done (todo bloco)
1. Requisitos do bloco com status atualizado em REQUIREMENTS.
2. Testes do bloco escritos **no próprio bloco** e verdes (desktop + mobile; unit quando houver).
3. `CI=1 npm run typecheck && npm run lint && npm run format:check && npm run test:e2e` verdes; checklist a11y (§5) nas telas tocadas.
4. Pixel pass das telas do bloco contra `docs/design/frames/` (desktop + mobile).
5. **Revisão do bloco antes de fechar** (não deixar para o fim): reler o diff do bloco contra o checklist "Padrão de código" do `CLAUDE.md`, a regra de camadas (ARCH §2) e o checklist a11y (§5); rodar o axe nas telas novas; corrigir na hora o que aparecer e registrar em `docs/REVIEW-LOG.md` (problema, causa, correção, prevenção).
6. Commit (Conventional). Desvio de arquitetura → ADR em ARCHITECTURE §14.
- **Push + preview Vercel** acontece nos checkpoints (B1b, 05:00, 13:30, B9), não em todo bloco, porque depende de login/permissão do usuário (§9).

## 4. Cronograma
| Bloco | Horário | Entregas | Requisitos | Pronto quando |
|---|---|---|---|---|
| B0 ✅ | 18:40–19:30 | Scaffold, stack, smoke, contexto, segurança base | D7 | verdes |
| B1a ✅ | 19:30–20:45 | **Extração do Figma** (subagente): inventário, tokens, componentes, dados por tela (→ contratos), fora do escopo visível, estados derivados, idioma, riscos de contraste, assets | S1, S2, S14, U11 | `docs/design/DESIGN.md` + `design-src/assets/` |
| B1b ◐ | 20:45–21:30 | Tema ✅ e boot rápido ✅; assets otimizados (AVIF/WebP) em `public/assets/`; shell (header/footer/nav mobile, skip link, `LiveRegion`, painel "Servidor simulado (admin)" isolado); `/version.json` + commit no rodapé; push; Lighthouse baseline local | D3, M8, L2 | shell fiel ao Figma; baseline registrado |
| B2 ✅ | 21:30–00:30 | **Fundação REST**: `contracts/` (zod, inclusive eventos), `money.ts`, `http` (timeout em JS, interceptors, `ApiError`), `query-keys`, session store base; **mock db** (seed determinístico, persistência, reset, versão), **todos os handlers REST** (idempotência consultada primeiro, `resolveAt`, 403 `carol`, cupom no carrinho, `/tx`), cenários + PRNG, API de controle (parte REST); **fixture E2E** (init só na 1ª carga) + projeto `unit` | I3, R1–R3, M1–M5, M8, K7, A8, TQ3 | unit de `money` + contrato de idempotência verdes; handlers cobrem a tabela do ARCH §4 |
| B3 ✅ | 00:30–02:30 | **Auth + sessão**: cadastro (409), login, sessão (refresh), expiração (`ReauthDialog`), logout/troca (ordem do ARCH §7), guards `_auth` + `router.invalidate`, `redirect`/`intent` validados; **carteiras** (principal/secundária, necessárias ao checkout) | S9, S10, S12, A1–A7, I1, I7, RT5 (parte) | **T3** + T8 (carteiras) verdes |
| B4 ✅ | 02:30–05:00 | **Catálogo + detalhe**: destaques, busca/filtros/ordem/página na URL (reset de página), skeletons sem CLS, vazio/erro/retry, `jitter` fora de ordem, indicador de atualização em segundo plano; detalhe (galeria, edição, quantidade, 404, esgotado); favoritos **otimista + rollback** (`isFavorite` derivado); pixel pass de Início e Detalhe | S4, S5, C1–C6, I4–I6, I9, I10, U3, U7 | **T1, T2, T4, T12** verdes |
| ⏸ | 05:00 | **Checkpoint 1**: push; comparar com o plano; atraso > 1h → linha de corte | | |
| — | 05:00–08:30 | Descanso | | |
| B5 ✅ | 08:30–11:00 | **Realtime + carrinho**: servidor mock (conexões por usuário, `session.hello`/`ready`, **ping 20s**, broadcast, `dropConnection`) + `RealtimeManager` (import dinâmico, dedupe, versão, filtro de usuário, reconciliação, `keepNewerVersion`); `nft.updated` em catálogo/detalhe/carrinho; **carrinho** (CRUD com limites, visitante + merge com `adjustments`, cupom `PUT/DELETE`, resumo via quote); pixel pass do Carrinho | S6, K1–K7, RT1, RT3, RT4, RT6, RT7 (1–3), M6, M7, M9 | **T5** + `realtime.spec` (RT1, dedupe/versão, reconexão) verdes |
| B6 ✅ | 11:00–13:30 | **Checkout + pedidos**: dados validados, carteira + rede, conectar/recusar/desconectar, revisão, revalidação (`QUOTE_STALE` → nova confirmação), idempotência (pendente antes de chave nova), pendente/confirmado/recusado via `order.updated`, recuperação (`resolveAt`) após refresh/reconexão, servidor remove só o comprado, recibo snapshot, `/tx` só do dono, expiração no checkout; pixel pass de Pagamento e Confirmação | S7, S8, S13, P1–P10, K8, RT2, RT7, RT8, A4, I8 | **T6, T7, T9, T10** verdes |
| ⏸ | 13:30 | **Checkpoint 2**: push; deploy já ativo desde 21:20 (https://kurio-gold.vercel.app — CSP, rewrite, MSW, socket e commit validados); revalidar (SPA rewrite, CSP com MSW/fontes/imagens, Node 22) + smoke na URL; linha de corte se necessário | D2, M8 | URL pública abre `/` e rota profunda com refresh |
| B6b ✅ | 13:30–14:30 | **Perfil**: dados, avatar (resize 256 WebP, allowlist), senha; pixel pass de Perfil/Carteiras | S11, A6, A7 | **T8** completo verde |
| B7 ✅ | 14:30–15:45 | **Consolidação**: responsivo 320/768 (projeto `tablet`), `layout.spec` (overflow/zoom), estados derivados, fora do escopo, passada final do checklist §5, axe em todas as rotas, **VIS no Docker** | S1, S2, S14, U1–U10, TQ2 | **T11**, `layout.spec`, AXE, VIS verdes |
| B8 ◐ | 15:45–16:30 | Lighthouse 3× (início/detalhe × mobile/desktop), otimizações reais, `docs/lighthouse/README.md` (versões, ambiente, throttling, LCP/CLS/TBT, justificativas) | L1–L6 | `summary.json` + README |
| B9 ✅ | 16:30–17:30 | README da solução, ARCHITECTURE §15, relatório HTML do Playwright em `docs/playwright-report/`, **checkout limpo** (`git clone → npm ci → build → test:e2e`), push, deploy final + `deploy.spec` (commit da URL = HEAD) | D1–D8, TQ4, I11 | todos os eliminatórios ☑ |
| Folga ✅ | 17:30–18:40 | Imprevistos → depois extras (§8) | EX1, EX2 | `prefs.spec` verde |

### 4.1 Execução real (revisão de 22/10, 11:25)

O plano rodou adiantado: B1–B9 e os extras ficaram prontos na madrugada (último commit da noite 02:27), e a manhã foi de revisão. Desvios:

| Item | Planejado | Real |
|---|---|---|
| B1b — painel "Servidor simulado (admin)" | painel isolado na demo, com seleção e reset de cenário | **feito na F1** (antes: só `window.__mock` no console e `?scenario=` na URL) |
| B8 — Performance ≥ 90 | meta em todas as páginas/perfis | desktop 99/99; **mobile 73/82** (`20b2953`) (MSW dentro da página), justificado em `docs/lighthouse/README.md` |
| Checkpoints e push | só nos checkpoints | push a cada bloco (Vercel conectado ao GitHub desde B1b) |
| Revisões | revisão por bloco (DoD 5) | feita, mas a **auditoria de requisitos** de 22/10 ainda achou 20+ falhas reais (sair sem reload quebrava o app, carrinho divergente, reset incompleto…) → corrigidas com teste (REVIEW-LOG "Auditoria") |
| Fora do plano, feito | — | comparação lado a lado com os frames do Figma (15 telas) e ajuste fino; CI no GitHub Actions; cobertura de todos os cenários do mock (`scenarios.spec`) |

**Linha de corte** (nesta ordem): extras → polimento visual fino → pixel-perfect em tablet → cenários extras de latência → VIS mobile (manter desktop).
**Nunca cortar:** X1–X6, deploy, idempotência, realtime (T9/T10), telas obrigatórias (inclusive Perfil), checklist a11y, REQUIREMENTS sem ☐ nos eliminatórios.

## 5. Checklist de acessibilidade (por tela)
Evidência: `e2e/a11y.spec.ts` (axe WCAG 2.1 A/AA, falha em `serious`/`critical`) ✅ + T11 (`keyboard.spec`) + `layout.spec` (inclui 320 px). Pendente só o teste manual com leitor de tela (F4).
- [x] Teclado: Tab/Shift+Tab/Enter/Espaço/Esc; ordem lógica; foco visível (contraste ≥3:1).
- [x] Skip link "Pular para o conteúdo".
- [x] Troca de rota: foco no `h1` + `document.title` por rota.
- [x] Diálogos/drawers: focus trap, Esc fecha, foco volta ao gatilho (filtros mobile, carrinho, reauth).
- [x] Semântica: landmarks, headings em ordem, listas, `button` vs `link`.
- [x] Formulários: `label`, `aria-invalid` + `aria-describedby`, foco no 1º inválido, `autocomplete`.
- [x] Imagens: `alt` descritivo / `alt=""` decorativas; `width/height`.
- [x] Contraste ≥4.5:1 (≥3:1 grande); estados com ícone/texto além da cor.
- [x] `aria-live="polite"` para mutations e realtime; `role="alert"` para erros.
- [x] Skeleton com `aria-busy`; `prefers-reduced-motion` em shimmer, transições e drawers.
- [x] Sem overflow horizontal em 320px; zoom 200%/400% sem perda.

## 6. Segurança por bloco (detalhes: `docs/SECURITY.md`)
- B0 ✅ gitignore de segredos, `.env.example`, CSP/headers, `react/no-danger`, `npm audit --omit=dev` = 0.
- B2: hash PBKDF2 no mock; usuário sempre derivado do token; recurso alheio → 404; storage do mock com namespace próprio e documentado.
- B3: `redirect`/`intent` validados por origem + allowlist; logout na ordem segura; nada de token em log.
- B5/B6: eventos de outra sessão descartados; idempotência; `/tx` só do dono.
- B6b: avatar com allowlist + resize.
- B9: audit, revisão do diff por segredos, headers validados na URL pública.

## 7. Riscos e mitigação
| Risco | Mitigação |
|---|---|
| ✅ `socket.io-client` capturando o `WebSocket` antes do MSW (auditoria C1) | Import dinâmico após `mocksReady` + regra de lint (feito, testado) |
| ✅ Binding sem ping → socket cai a cada ~30s (C2) | Mock envia `'2'` a cada 20s por conexão |
| ✅ Pedido duplicado no reenvio após timeout (C3) | Idempotência consultada antes de validar; bloqueio de 2º pedido `pending` |
| ✅ Pendente não resolve após refresh (C4) | `resolveAt` persistido e reagendado no boot do mock |
| ✅ Init script limpando o db no reload (C6) | Flag `sessionStorage['mock:init']` |
| ✅ Baselines VIS diferem macOS × Linux | VIS só no Docker/Linux, `visual.spec` pulado fora do Linux |
| ✅ `context.setOffline` não afeta MSW | "Sem conexão" simulado pelo mock (`fail(..., 'network')`, `dropConnection`) |
| ✅ Socket.IO não reconecta após "server disconnect" | O mock derruba o **transporte**, nunca envia `41` |
| ✅ Timeout nativo do XHR fora do `page.clock` | Timeout do Axios em JS (`AbortController`) |
| ✅ Retry/preload engolem falha pontual nos testes | `times` maior que os retries ou falha persistente + `clearFailures()` |
| ✅ Avatar estourando a cota do `localStorage` | Resize no cliente (256 WebP) + limite de 200 KB no servidor |
| Perf mobile. **B0: home mobile 72 (LCP 3,5s). Após shell antes do MSW: 81 (LCP 3,4s, TBT 308ms)**, 1 execução. O LCP depende do download do JS (~322 KB) | B8: shell/hero estático no `index.html` (sem fake: o mesmo markup que o React hidrata/substitui), split de vendor, `modulepreload`, imagem LCP AVIF com `fetchpriority` |
| **Perf mobile real (B4): 45 (home) / 42 (detalhe)**: LCP 5,8 s, TBT até 1,3 s | B8: (1) hero editorial estático (não depende da API/MSW) + `preload` da imagem LCP; (2) dividir chunks (radix/zod/msw) e adiar o que não é do primeiro paint; (3) `modulepreload` do MSW; (4) medir de novo a cada mudança |
| ✅ Chrome não abre porta de debug no sandbox do agente | Rodar `npm run lighthouse` fora do sandbox |
| ✅ Avaliador ver dados de 2 usuários no storage do mock | Chave `msw-server-db:v1`, documentada como storage do servidor simulado |
| ✅ MCP do Figma: limite de chamadas (Starter) | Arquivo nos drafts do Yungas Pro; frames/metadata já salvos em `docs/design/` |
| ✅ B2 e B5 densos | Infra de realtime isolada no B5; perfil movido para B6b; checkpoints |

## 8. Extras (somente na folga)
- **EX1 Idioma** pt-BR/en-US: seletor no header/footer, troca o dicionário e o `<html lang>`, persistido, sem reload; erros de validação traduzidos.
- **EX2 Data/hora**: preferência (padrão do idioma/12h/24h) via `src/lib/format.ts`, persistida.
- Moeda fora de escopo. Teste `e2e/prefs.spec.ts`: troca + persistência após refresh.

## 9. Depende do usuário
- ✅ **Vercel** (B1b): login feito; deploy automático a cada push na `main`.
- ✅ **GitHub** (B1b): push em `thiagohila/frontend-challenge` (público). Actions habilitado no fork em 22/10.
- **F4**: teste manual com leitor de tela (VoiceOver: Cmd+F5) — só o usuário pode fazer.

## 10. Fases finais (22/10, 11:30 → 18:40)

Mesma DoD (§3). **Congelamento às 17:30**; F7 é a última coisa antes da entrega.

| Fase | Horário | Entregas | Requisitos | Pronto quando |
|---|---|---|---|---|
| F0 ✅ | 07:00–11:25 | Revisão pós-entrega: fidelidade ao Figma (15 telas), auditoria de requisitos com 5 revisores (20+ correções), todos os cenários do mock com teste, limite de quantidade do detalhe, CI | — | 218 ✓ em checkout limpo; deploy = HEAD |
| FL ✅ | 14:00–18:00 | **Passada de layout com o usuário** (desktop + mobile, tela a tela): home (header fixo com marcador, hero, abas, filtros, âncora do mercado), conta/carteiras, login como diálogo sobre a página (`?auth=`), detalhe, carrinho, pagamento, confirmação, tab bar com o recorte do FAB. Desvios em ARCH §15, causas no REVIEW-LOG | D2, U1 | 210 e2e + 20 unit ✓; VIS Linux 8/8 |
| F1 ✅ | 18:00–18:30 | **Painel do servidor simulado** (o que o B1b previa e os docs já citam): botão flutuante só com mocks ligados, carregado sob demanda (fora do caminho crítico); seleção e **reset** de cenário, latência, mudar preço/estoque de um NFT, derrubar o socket, resolver pedido pendente. Age **só** pela API de controle (`window.__mock`) → REST/eventos, nunca no estado do app (X5). Diálogo acessível; desvio do Figma em ARCH §15 | M4, M5, X5 | e2e: troca de cenário e reset pelo painel; axe; Lighthouse sem regressão (chunk lazy) |
| F2 ✅ | 19:30 | **Resumo para quem avalia** no topo do README: como avaliar em 5 min, decisões e trade-offs (performance mobile, checkout com carteiras cadastradas, MSW na página), links para as evidências | D4, D6 | README revisado |
| F3 → README "Melhorias possíveis" | — | **Mensagens do servidor no idioma escolhido**: `Accept-Language` no Axios; o mock responde em pt-BR/en-US; remove a limitação documentada | EX1 | `prefs.spec` com erro de API em en-US |
| F4 → README "Melhorias possíveis" | — | **Teste manual com leitor de tela** (usuário, ~10 min): login, catálogo, checkout | U4–U6 | anotado no REVIEW-LOG |
| F5 ✅ | 14:15–14:45 | **CI verde no GitHub** (primeira execução; GitHub estava degradado às 11:20) e ajustes se o ambiente do runner divergir do Docker local | TQ1, TQ2 | badge verde no README |
| F6 ✅ | 20:00 | **Lighthouse final** (3×) no commit de entrega, README e `summary.json` com commit/data | L1–L5 | medianas do commit entregue |
| F7 ✅ | 19:00–20:15 | **Verificação final**: checkout limpo, `deploy.spec` (URL = HEAD), CI verde, varredura docs × código (nada prometido que não exista), relatório do Playwright do commit final, congelamento | D1–D8, TQ4 | REQUIREMENTS sem ☐; tudo ☑ exceto L2 justificado |

**Linha de corte das fases finais** (nesta ordem): F3 → F2 → F6 (mantém a medição de `97f44e4`, documentada). **Nunca cortar:** F1 (ou, no mínimo, corrigir os docs que citam o painel) e F7.

## 11. Depois da entrega (evolução)

Shell pré-renderizado ou mock fora da página para performance mobile ≥ 90; detalhes decorativos do Figma e diff pixel a pixel contra os frames; servidor Socket.IO real no lugar do binding; testes de componente.
