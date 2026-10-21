# Plano de desenvolvimento — 24h

Janela: **21/10 18:40 → 22/10 18:40**. **Congelamento do código às 17:30**; depois disso, só folga/extras.
Fontes de verdade (não duplicar aqui):
- **O quê**: `docs/REQUIREMENTS.md` (matriz requisito → bloco → teste). O status é atualizado ao fechar cada bloco.
- **Como**: `ARCHITECTURE.md` (contratos, keys, sessão, realtime, mocks, testes).
- **Segurança**: `docs/SECURITY.md`. **Design**: `docs/DESIGN.md` (gerado no B1a).

## 1. Eliminatórios (não negociáveis)
X1 stack efetiva · X2 fluxos reais · X3 confirmação só pela simulação · X4 sem vazamento entre usuários · X5 eventos só via `socket.io-client` · X6 E2E executáveis · **deploy público** (D2). Detalhe e testes: REQUIREMENTS "Eliminatórios".

## 2. Pontuação × prioridade
| Critério | Pts | Onde se ganha |
|---|---:|---|
| Visual/responsivo | 20 | B1a/B1b (base fiel desde o início) + B7 |
| Fluxos/UX | 20 | B3–B6 |
| Integração/estado | 15 | B2 (fundação) + todos |
| Tempo real | 10 | B2 (infra), B4–B6 |
| Mocking | 10 | B2 |
| Testes | 10 | junto de cada feature |
| A11y | 5 | checklist §5 em cada tela + B7 |
| Performance | 5 | baseline B1b, B8 |
| Arquitetura/docs | 5 | contínuo + B9 |

## 3. Definition of Done (todo bloco)
1. Requisitos do bloco com status atualizado em REQUIREMENTS.
2. Testes E2E do bloco escritos **no próprio bloco** e verdes em desktop+mobile.
3. `typecheck` + `lint` + `test:e2e` verdes; checklist a11y (§5) nas telas tocadas.
4. Commit (Conventional) + push → preview na Vercel abre e funciona.
5. Desvio de arquitetura → ADR em ARCHITECTURE §14.

## 4. Cronograma
| Bloco | Horário | Entregas | Requisitos | Pronto quando |
|---|---|---|---|---|
| B0 ✅ | 18:40–19:30 | Scaffold, stack, smoke, contexto, segurança base | D7 | verdes |
| B1a | 19:30–20:30 | **Extração do Figma**: inventário de frames (tela × breakpoint), campos exibidos por tela (→ contratos), tokens (cor, tipografia, espaçamento, raio, sombra, breakpoints), assets (download + AVIF/WebP), mapa componente → shadcn/app, idioma do layout (→ `lang`), itens fora do escopo visíveis no layout, estados não desenhados a derivar; conferir que a cópia "Kurio-v1 (Copy)" = original | S1, S2, S14, U11 | `docs/DESIGN.md` + `public/assets/` |
| B1b | 20:30–21:15 | Tokens no tema shadcn, fontes self-hosted, shell (header/footer/nav mobile, skip link, `LiveRegion`), **boot rápido** (shell renderiza antes do MSW; queries aguardam `mocksReady`), `robots.txt`, **push + deploy Vercel** (SPA rewrite, CSP validada), **Lighthouse baseline** | D2, D3, M8, L2 | URL pública abre `/` e rota profunda com refresh; baseline LH registrado |
| B2 | 21:15–23:30 | **Fundação**: `contracts/` (zod, incluindo eventos e carteira), `money.ts` + teste unitário, `http` com interceptors + `ApiError`, `query-keys`; **mock db** (seed determinístico, persistência, reset, `db.update` → versão + broadcast), handlers de todos os recursos com erros tipados, cenários + PRNG com seed, `mock.fail(rota, resp, {times})`, `window.__mock` (reset/scenario/fail/emit/disconnect/advance); **realtime**: servidor mock (conexões por usuário, `session.hello`, broadcast, `dropConnection`) + `RealtimeManager` no cliente (dedupe/versão/filtro de usuário/reconciliação); **fixture E2E** (`mock`, `loginAs`, clock) | I3, R1–R3, M1–M9, RT3, RT4, RT6, TQ3, K7, A8 | handlers respondem os contratos; teste de contrato de idempotência; evento chega via `socket.io-client` em teste |
| B3 | 23:30–02:00 | **Auth + conta**: cadastro (409), login, sessão (refresh), expiração (`ReauthDialog`), logout/troca de usuário (limpeza total), guards + `redirect` validado, ações protegidas de visitante (retomar após login), perfil (dados, avatar com allowlist, senha), carteiras (principal/secundária) | S9–S13, A1–A7, I1, I7, RT5 | **T3, T8** verdes |
| B4 | 02:00–05:00 | **Catálogo + detalhe**: destaques, busca/filtros/ordem/página na URL (reset de página), skeletons sem CLS, vazio/erro/retry, `jitter` fora de ordem, detalhe (galeria, edição, quantidade, 404, esgotado), favoritos com **otimista + rollback**, `nft.updated` em lista/detalhe | S4, S5, C1–C6, I4–I6, I9, I10, RT1, U3, U7 | **T1, T2, T4, T12** verdes |
| ⏸ | 05:00 | **Checkpoint 1**: comparar com o plano; atraso > 1h → aplicar a linha de corte | | |
| — | 05:00–09:00 | Descanso | | |
| B5 | 09:00–11:00 | **Carrinho + cotação**: CRUD com limites por edição, carrinho de visitante + merge no login (limitado ao estoque + aviso), cupom (inválido/expirado), resumo da API com skeleton, `nft.updated` no carrinho com aviso `aria-live` e nova cotação | S6, K1–K7, RT1, RT7 (parte 1–3) | **T5** verde |
| B6 | 11:00–13:30 | **Checkout + pedidos**: dados validados, carteira cadastrada + rede, conectar/recusar/desconectar (contrato próprio), revisão, revalidação da cotação (`QUOTE_STALE` → nova confirmação), idempotência (chave persistida por tentativa), pendente/confirmado/recusado via `order.updated`, recuperação após refresh/reconexão, servidor remove só o comprado, recibo snapshot, explorador simulado, expiração no checkout | S7, S8, P1–P10, K8, RT2, RT7, RT8, A4, I8 | **T6, T7, T9, T10** verdes |
| ⏸ | 13:30 | **Checkpoint 2**: linha de corte se necessário | | |
| B7 | 13:30–15:30 | **Visual + responsivo + a11y**: pixel pass vs Figma (390/768/1440 + 320), estados derivados, fora do escopo, passada final do checklist §5, axe em todas as rotas, **VIS no Docker (Linux)** com baselines versionadas | S1, S2, S14, U1–U10, TQ2 | **T11**, AXE, VIS verdes |
| B8 | 15:30–16:30 | Lighthouse 3× (início/detalhe × mobile/desktop), otimizações reais (imagem LCP com `fetchpriority`, `srcset`, fontes, chunks), `docs/lighthouse/README.md` (versões, ambiente, throttling, LCP/CLS/TBT, justificativas) | L1–L6 | `summary.json` + README |
| B9 | 16:30–17:30 | README da solução, ARCHITECTURE §15 (limitações, UX, desvios), relatório HTML do Playwright em `docs/playwright-report/`, **checkout limpo** (`git clone → npm ci → build → test:e2e`), smoke contra a URL pública, deploy final = commit entregue | D1–D8, TQ4, I11 | todos os eliminatórios ☑ |
| Folga | 17:30–18:40 | Imprevistos → depois extras (§8) | EX1, EX2 | |

**Linha de corte** (nesta ordem): extras → polimento visual fino → pixel-perfect em tablet → cenários extras de latência → VIS mobile (manter desktop).
**Nunca cortar:** X1–X6, deploy, idempotência, realtime (T9/T10), checklist a11y, REQUIREMENTS sem ☐ nos eliminatórios.

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
- B2: hash PBKDF2 no mock; usuário sempre derivado do token; storage do mock com namespace próprio e documentado.
- B3: `redirect` só interno; limpeza total no logout/troca; avatar com allowlist (png/jpeg/webp ≤2 MB); nada de token em log.
- B6: idempotência; eventos de outra sessão descartados.
- B9: audit, revisão do diff por segredos, headers validados na URL pública.

## 7. Riscos e mitigação
| Risco | Mitigação |
|---|---|
| Baselines VIS diferem macOS × Linux | Gerar e rodar VIS no Docker (`mcr.microsoft.com/playwright:v1.64.1`), script `test:e2e:docker`; baselines Linux versionadas |
| `context.setOffline` não afeta MSW (SW e WS interceptados) | "Sem conexão" simulado pelo mock (`HttpResponse.error()`, `dropConnection`) |
| Socket.IO não reconecta após pacote "server disconnect" | Mock derruba o **transporte** (`client.close()`), nunca envia `41` |
| Binding 0.2: handshake em microtask, sem rooms, só websocket | Emitir só após `session.hello`; rooms por mapa de conexões no mock |
| `page.clock` congela os `delay()` do MSW | Instalar o relógio só nos testes de tempo; usar `runFor`/`fastForward` |
| Perf mobile: MSW (437 KB) + `await worker.start` antes do render. **Medido no B0: home mobile = 72 (LCP 3,5s, TBT 289ms) com a página quase vazia** | Shell renderiza antes do MSW; `modulepreload`; LCP estável; remedir no B1b (meta ≥90) |
| Chrome não abre porta de debug no sandbox do agente | Rodar `npm run lighthouse` fora do sandbox (Playwright usa pipe e funciona) |
| Lighthouse sem Chrome na máquina do avaliador | Script usa `CHROME_PATH` ou o Chromium do Playwright |
| Avaliador ver dados de 2 usuários no storage do mock | Chave `msw-server-db:v1`, documentado como "storage do servidor simulado"; o app nunca lê |
| B5/B6 densos | Infra de realtime/idempotência antecipada no B2; checkpoints 1 e 2 |
| Cópia do Figma com nome diferente | Conferir no B1a |

## 8. Extras (somente na folga)
- **EX1 Idioma** pt-BR/en-US: seletor no header/footer, troca o dicionário e o `<html lang>`, persistido, sem reload; erros de validação traduzidos.
- **EX2 Data/hora**: preferência (padrão do idioma/12h/24h) via `src/lib/format.ts`, persistida.
- Moeda fora de escopo. Teste `e2e/prefs.spec.ts`: troca + persistência após refresh.

## 9. Depende do usuário
- **Vercel** (B1b): login uma vez → `! npx vercel login`.
- **GitHub** (B1b): permissão para push em `thiagohila/frontend-challenge` e repositório público na entrega.
