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
3. `CI=1 npm run typecheck && npm run lint && npm run test:e2e` verdes; checklist a11y (§5) nas telas tocadas.
4. Pixel pass das telas do bloco contra `docs/design/frames/` (desktop + mobile).
5. **Revisão do bloco antes de fechar** (não deixar para o fim): reler o diff do bloco contra o checklist "Padrão de código" do `CLAUDE.md`, a regra de camadas (ARCH §2) e o checklist a11y (§5); rodar o axe nas telas novas; corrigir na hora o que aparecer e registrar o que virou regra.
6. Commit (Conventional). Desvio de arquitetura → ADR em ARCHITECTURE §14.
- **Push + preview Vercel** acontece nos checkpoints (B1b, 05:00, 13:30, B9), não em todo bloco, porque depende de login/permissão do usuário (§9).

## 4. Cronograma
| Bloco | Horário | Entregas | Requisitos | Pronto quando |
|---|---|---|---|---|
| B0 ✅ | 18:40–19:30 | Scaffold, stack, smoke, contexto, segurança base | D7 | verdes |
| B1a | 19:30–20:45 | **Extração do Figma** (subagente): inventário, tokens, componentes, dados por tela (→ contratos), fora do escopo visível, estados derivados, idioma, riscos de contraste, assets | S1, S2, S14, U11 | `docs/design/DESIGN.md` + `design-src/assets/` |
| B1b | 20:45–21:30 | Tema ✅ e boot rápido ✅; assets otimizados (AVIF/WebP) em `public/assets/`; shell (header/footer/nav mobile, skip link, `LiveRegion`, painel "Servidor simulado (admin)" isolado); `/version.json` + commit no rodapé; push; Lighthouse baseline local | D3, M8, L2 | shell fiel ao Figma; baseline registrado |
| B2 | 21:30–00:30 | **Fundação REST**: `contracts/` (zod, inclusive eventos), `money.ts`, `http` (timeout em JS, interceptors, `ApiError`), `query-keys`, session store base; **mock db** (seed determinístico, persistência, reset, versão), **todos os handlers REST** (idempotência consultada primeiro, `resolveAt`, 403 `carol`, cupom no carrinho, `/tx`), cenários + PRNG, API de controle (parte REST); **fixture E2E** (init só na 1ª carga) + projeto `unit` | I3, R1–R3, M1–M5, M8, K7, A8, TQ3 | unit de `money` + contrato de idempotência verdes; handlers cobrem a tabela do ARCH §4 |
| B3 | 00:30–02:30 | **Auth + sessão**: cadastro (409), login, sessão (refresh), expiração (`ReauthDialog`), logout/troca (ordem do ARCH §7), guards `_auth` + `router.invalidate`, `redirect`/`intent` validados; **carteiras** (principal/secundária, necessárias ao checkout) | S9, S10, S12, A1–A7, I1, I7, RT5 (parte) | **T3** + T8 (carteiras) verdes |
| B4 | 02:30–05:00 | **Catálogo + detalhe**: destaques, busca/filtros/ordem/página na URL (reset de página), skeletons sem CLS, vazio/erro/retry, `jitter` fora de ordem, indicador de atualização em segundo plano; detalhe (galeria, edição, quantidade, 404, esgotado); favoritos **otimista + rollback** (`isFavorite` derivado); pixel pass de Início e Detalhe | S4, S5, C1–C6, I4–I6, I9, I10, U3, U7 | **T1, T2, T4, T12** verdes |
| ⏸ | 05:00 | **Checkpoint 1**: push; comparar com o plano; atraso > 1h → linha de corte | | |
| — | 05:00–08:30 | Descanso | | |
| B5 | 08:30–11:00 | **Realtime + carrinho**: servidor mock (conexões por usuário, `session.hello`/`ready`, **ping 20s**, broadcast, `dropConnection`) + `RealtimeManager` (import dinâmico, dedupe, versão, filtro de usuário, reconciliação, `keepNewerVersion`); `nft.updated` em catálogo/detalhe/carrinho; **carrinho** (CRUD com limites, visitante + merge com `adjustments`, cupom `PUT/DELETE`, resumo via quote); pixel pass do Carrinho | S6, K1–K7, RT1, RT3, RT4, RT6, RT7 (1–3), M6, M7, M9 | **T5** + `realtime.spec` (RT1, dedupe/versão, reconexão) verdes |
| B6 | 11:00–13:30 | **Checkout + pedidos**: dados validados, carteira + rede, conectar/recusar/desconectar, revisão, revalidação (`QUOTE_STALE` → nova confirmação), idempotência (pendente antes de chave nova), pendente/confirmado/recusado via `order.updated`, recuperação (`resolveAt`) após refresh/reconexão, servidor remove só o comprado, recibo snapshot, `/tx` só do dono, expiração no checkout; pixel pass de Pagamento e Confirmação | S7, S8, S13, P1–P10, K8, RT2, RT7, RT8, A4, I8 | **T6, T7, T9, T10** verdes |
| ⏸ | 13:30 | **Checkpoint 2**: push; deploy já ativo desde 21:20 (https://kurio-gold.vercel.app — CSP, rewrite, MSW, socket e commit validados); revalidar (SPA rewrite, CSP com MSW/fontes/imagens, Node 22) + smoke na URL; linha de corte se necessário | D2, M8 | URL pública abre `/` e rota profunda com refresh |
| B6b | 13:30–14:30 | **Perfil**: dados, avatar (resize 256 WebP, allowlist), senha; pixel pass de Perfil/Carteiras | S11, A6, A7 | **T8** completo verde |
| B7 | 14:30–15:45 | **Consolidação**: responsivo 320/768 (projeto `tablet`), `layout.spec` (overflow/zoom), estados derivados, fora do escopo, passada final do checklist §5, axe em todas as rotas, **VIS no Docker** | S1, S2, S14, U1–U10, TQ2 | **T11**, `layout.spec`, AXE, VIS verdes |
| B8 | 15:45–16:30 | Lighthouse 3× (início/detalhe × mobile/desktop), otimizações reais, `docs/lighthouse/README.md` (versões, ambiente, throttling, LCP/CLS/TBT, justificativas) | L1–L6 | `summary.json` + README |
| B9 | 16:30–17:30 | README da solução, ARCHITECTURE §15, relatório HTML do Playwright em `docs/playwright-report/`, **checkout limpo** (`git clone → npm ci → build → test:e2e`), push, deploy final + `deploy.spec` (commit da URL = HEAD) | D1–D8, TQ4, I11 | todos os eliminatórios ☑ |
| Folga | 17:30–18:40 | Imprevistos → depois extras (§8) | EX1, EX2 | |

**Linha de corte** (nesta ordem): extras → polimento visual fino → pixel-perfect em tablet → cenários extras de latência → VIS mobile (manter desktop).
**Nunca cortar:** X1–X6, deploy, idempotência, realtime (T9/T10), telas obrigatórias (inclusive Perfil), checklist a11y, REQUIREMENTS sem ☐ nos eliminatórios.

## 5. Checklist de acessibilidade (por tela)
Evidência: `e2e/a11y.spec.ts` (axe WCAG 2.1 A/AA, falha em `serious`/`critical`) ✅ + T11.
- [ ] Teclado: Tab/Shift+Tab/Enter/Espaço/Esc; ordem lógica; foco visível (contraste ≥3:1).
- [ ] Skip link "Pular para o conteúdo".
- [ ] Troca de rota: foco no `h1` + `document.title` por rota.
- [ ] Diálogos/drawers: focus trap, Esc fecha, foco volta ao gatilho (filtros mobile, carrinho, reauth).
- [ ] Semântica: landmarks, headings em ordem, listas, `button` vs `link`.
- [ ] Formulários: `label`, `aria-invalid` + `aria-describedby`, foco no 1º inválido, `autocomplete`.
- [ ] Imagens: `alt` descritivo / `alt=""` decorativas; `width/height`.
- [ ] Contraste ≥4.5:1 (≥3:1 grande); estados com ícone/texto além da cor.
- [ ] `aria-live="polite"` para mutations e realtime; `role="alert"` para erros.
- [ ] Skeleton com `aria-busy`; `prefers-reduced-motion` em shimmer, transições e drawers.
- [ ] Sem overflow horizontal em 320px; zoom 200%/400% sem perda.

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
| Binding sem ping → socket cai a cada ~30s (C2) | Mock envia `'2'` a cada 20s por conexão |
| Pedido duplicado no reenvio após timeout (C3) | Idempotência consultada antes de validar; bloqueio de 2º pedido `pending` |
| Pendente não resolve após refresh (C4) | `resolveAt` persistido e reagendado no boot do mock |
| Init script limpando o db no reload (C6) | Flag `sessionStorage['mock:init']` |
| Baselines VIS diferem macOS × Linux | VIS só no Docker/Linux, `visual.spec` pulado fora do Linux |
| `context.setOffline` não afeta MSW | "Sem conexão" simulado pelo mock (`fail(..., 'network')`, `dropConnection`) |
| Socket.IO não reconecta após "server disconnect" | O mock derruba o **transporte**, nunca envia `41` |
| Timeout nativo do XHR fora do `page.clock` | Timeout do Axios em JS (`AbortController`) |
| Retry/preload engolem falha pontual nos testes | `times` maior que os retries ou falha persistente + `clearFailures()` |
| Avatar estourando a cota do `localStorage` | Resize no cliente (256 WebP) + limite de 200 KB no servidor |
| Perf mobile. **B0: home mobile 72 (LCP 3,5s). Após shell antes do MSW: 81 (LCP 3,4s, TBT 308ms)**, 1 execução. O LCP depende do download do JS (~322 KB) | B8: shell/hero estático no `index.html` (sem fake: o mesmo markup que o React hidrata/substitui), split de vendor, `modulepreload`, imagem LCP AVIF com `fetchpriority` |
| Chrome não abre porta de debug no sandbox do agente | Rodar `npm run lighthouse` fora do sandbox |
| Avaliador ver dados de 2 usuários no storage do mock | Chave `msw-server-db:v1`, documentada como storage do servidor simulado |
| MCP do Figma: limite de chamadas (Starter) | Arquivo nos drafts do Yungas Pro; frames/metadata já salvos em `docs/design/` |
| B2 e B5 densos | Infra de realtime isolada no B5; perfil movido para B6b; checkpoints |

## 8. Extras (somente na folga)
- **EX1 Idioma** pt-BR/en-US: seletor no header/footer, troca o dicionário e o `<html lang>`, persistido, sem reload; erros de validação traduzidos.
- **EX2 Data/hora**: preferência (padrão do idioma/12h/24h) via `src/lib/format.ts`, persistida.
- Moeda fora de escopo. Teste `e2e/prefs.spec.ts`: troca + persistência após refresh.

## 9. Depende do usuário
- **Vercel** (B1b): login uma vez → `! npx vercel login`.
- **GitHub** (B1b): permissão para push em `thiagohila/frontend-challenge` e repositório público na entrega.
