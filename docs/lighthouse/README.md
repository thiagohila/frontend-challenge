# Auditoria Lighthouse

Páginas **Início** (`/`) e **Detalhe do NFT** (`/nft/emerald-ape-042`), perfis **mobile** e **desktop**, **3 medições por página e perfil**, com **mediana** por categoria (REQUIREMENTS L1–L6).

## Como reproduzir

```bash
npm run build && npm run lighthouse                                   # contra o preview local (sobe e derruba sozinho)
BASE_URL=https://kurio-gold.vercel.app npm run lighthouse             # contra a produção (usado abaixo)
LH_RUNS=3 LH_DETAIL_PATH=/nft/emerald-ape-042 npm run lighthouse      # parâmetros (padrões: 3 e /nft/emerald-ape-042)
```

Configuração versionada: [`scripts/lighthouse.mjs`](../../scripts/lighthouse.mjs). Mobile usa a configuração padrão do Lighthouse; desktop usa `lighthouse/core/config/desktop-config.js`. Saída: `<página>-<perfil>-<n>.html|json` e `summary.json` (medianas + ambiente).

**Por que medir na produção:** o `vite preview` serve sem compressão e em HTTP/1.1. A Vercel serve o mesmo build com brotli, HTTP/2 e CDN, que é o "build otimizado" de verdade. A auditoria usa o **cenário padrão dos mocks** e carrega imagens, fontes, MSW e Socket.IO, sem nenhum desvio exclusivo para a medição (L6).

## Ambiente e condições

| Item | Valor |
|---|---|
| Lighthouse | 13.5.0 (API Node, `lighthouse` npm) |
| Navegador | Chromium headless 156 (do Playwright 1.64.1, `HeadlessChrome/156.0.0.0`) |
| Node | v22.23.0 |
| Máquina | macOS (Darwin 25.5.0), Intel Core i5-1038NG7 2.0 GHz ×8, 16 GB |
| Alvo | https://kurio-gold.vercel.app, commit `cc1781c` (entrega final: passada de layout + painel do servidor simulado), medido em 2026-10-22 19:16 (BRT) |
| Mobile | emulação 412×823, rede lenta 4G simulada (RTT 150 ms, ~1,6 Mbps), **CPU 4× mais lenta** |
| Desktop | emulação desktop, sem throttling de CPU (config padrão desktop do Lighthouse) |

## Resultados (mediana de 3)

| Página / perfil | Performance | Acessibilidade | Boas práticas | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|---:|
| Início · mobile | **78** | 100 | 100 | 100 | 3,64 s | 0 | 242 ms |
| Início · desktop | **99** | 100 | 100 | 100 | 0,77 s | 0 | 10 ms |
| Detalhe · mobile | **66** | 100 | 100 | 100 | 3,57 s | 0 | 594 ms |
| Detalhe · desktop | **99** | 100 | 100 | 100 | 0,79 s | 0 | 19 ms |

Metas: Performance ≥ 90 · Acessibilidade ≥ 95 · Boas práticas ≥ 95 · SEO ≥ 90. **Todas atingidas, exceto Performance no perfil mobile** (justificado abaixo).

## Evolução (otimizações reais aplicadas)

| Etapa | Início mobile | Detalhe mobile | O que mudou |
|---|---:|---:|---|
| B4 (preview local) | 45 | 42 | primeira medição com as telas reais |
| Hero editorial estático + preload da arte LCP | 62 | 69 | o LCP do hero deixou de depender da API e do servidor simulado |
| Split de `pending/error/notFound` + realtime lazy | 76 | 78 | entrada 364 → 283 KB: a view de detalhe, Radix e `decimal.js` saíram do caminho crítico |
| Preload do chunk do servidor simulado + zod sem JIT | 83* | — | o MSW baixa em paralelo com o app; fim do aviso de CSP (Boas práticas 96 → 100) |
| Medição de `78785fa` (3×, mediana) | 79 | 75 | — |
| Medição de `97f44e4` (3×, mediana) | 73 | 72 | extras EX1/EX2 (+0,3 KB gzip) e ajuste de fidelidade (miniatura extra no hero mobile); `benchmarkIndex` variou de 1069 a 1707 |
| **Medição oficial, entrega `cc1781c` (3×, mediana)** | **78** | **66** | passada de layout e painel do servidor simulado (chunk sob demanda, fora da janela medida). Detalhe mobile por execução: 66 / 71 / 65, TBT 594 / 519 / 792 ms, `benchmarkIndex` 1318–1652; o script do MSW (`browser-*.js`, ~1,5 s com CPU 4×) segue como maior custo |

\* medição única; a variação entre execuções no mobile é de ±6 pontos (o `benchmarkIndex` variou de 1319 a 1767).

Também valem desde o início: imagens AVIF/WebP com `srcset` e dimensões fixas (CLS 0), fonte variável self-hosted com `font-display: swap`, code splitting por rota e headers de cache da Vercel.

## Por que a performance mobile fica abaixo de 90

As causas foram medidas no próprio relatório (LCP breakdown, bootup-time, long-tasks):

1. **O LCP mobile é a imagem do primeiro card do catálogo, que é um dado da API.** No frame mobile do Figma o card (175 px) é maior que a arte do hero (138 px). A imagem só pode ser pedida quando a lista chega, e a lista depende do **servidor simulado rodando na própria página**. Resultado: "resource load delay" de ~1,9 s.
2. **O servidor simulado custa caro no thread principal.** O chunk do MSW tem 462 KB (`msw` ~290 KB de fonte, mais `tough-cookie` e `tldts`, ~260 KB, usados pelo armazenamento de cookies do MSW) e responde dentro da página. Com CPU 4× mais lenta, isso soma 0,4–1,2 s de script e boa parte do TBT.
3. **SPA:** nada é pintado antes de o JS principal executar (React, Router, Query; entrada de 283 KB, ~95 KB brotli). O FCP de ~2,9 s define o piso do LCP.

O que não fizemos, por ser simplificação exclusiva para a nota (vetado pelo enunciado, L6) ou por mudar o produto:
- desligar o MSW ou usar respostas embutidas na auditoria;
- trocar dependências internas do MSW (`tough-cookie`/`tldts`) por stubs;
- pré-carregar a imagem de um NFT específico do catálogo (dependente dos dados);
- mudar a hierarquia do Figma mobile para o hero virar o maior elemento.

Num backend real (sem MSW no cliente), os itens 1 e 2 desaparecem. A latência da API passa a ser de rede e o thread principal fica livre. Com SSR ou pré-renderização do shell, o item 3 cai para algumas centenas de ms. No desktop, que tem a mesma aplicação sem throttling de CPU, as notas são 100 e 99.
