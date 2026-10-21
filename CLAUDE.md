# NFT Marketplace — contexto para agentes

Desafio frontend com prazo de 24h (início 2026-10-21 18:40, entrega 2026-10-22 18:40).
- Enunciado: `docs/CHALLENGE.md` (é a fonte da verdade; o `README.md` vira o README da solução).
- **O quê**: `docs/REQUIREMENTS.md` — matriz requisito → bloco → teste. Atualize o status ao fechar cada bloco; nada é "pronto" sem teste/evidência.
- Plano/prioridades: `docs/PLAN.md`. Segurança: `docs/SECURITY.md`. Design: `docs/DESIGN.md`.
- **Arquitetura (normativa, seguir sempre): `ARCHITECTURE.md`** — camadas, contratos, keys, sessão, realtime, mocks.

## Modo de trabalho
- Seja sucinto e pragmático. Nada de verbosidade.
- Enroscou 2x no mesmo erro: pare, ache a causa raiz, mude a abordagem.
- Priorize os eliminatórios (`docs/PLAN.md` §1) antes de polir.

## Stack (obrigatória, uso efetivo)
React 19 + TS strict · Vite 8 · TanStack Router (file-based, `src/routes`) · TanStack Query · Axios (`src/lib/http.ts`) · socket.io-client (`src/lib/realtime/`) · Tailwind v4 · shadcn/ui (radix-nova, `src/components/ui`) · MSW 2 + `@mswjs/socket.io-binding` (`src/mocks`) · Playwright (`e2e/`) · Lighthouse (`scripts/lighthouse.mjs`). Formulários: react-hook-form + zod. Dinheiro: `decimal.js`.

## Comandos (Node ≥22 — `nvm use`; o shell padrão é v18)
`npm run dev` · `build` · `preview` · `typecheck` · `lint` · `test:e2e` · `test:e2e:update` · `test:e2e:docker` (VIS/Linux) · `lighthouse` · `audit:deps`

## Estrutura
Ver `ARCHITECTURE.md` §2 (camadas e regra de dependência) e §3 (pastas). Não duplicar aqui.

## Regras
- Lint bloqueia import de `@/mocks` fora de `src/main.tsx`/`src/mocks`.
- `npm run lighthouse` precisa rodar fora do sandbox do agente (o Chrome abre uma porta de debug).
- Testes visuais: baselines Linux via `npm run test:e2e:docker`.
- **Zero dado fictício fora de `src/mocks`.** Componentes/hooks/axios nunca têm caminho alternativo de mock.
- **Tempo real só via socket.io-client**; nunca simular eventos chamando setters/cache direto.
- Contratos em `src/contracts` (zod) usados por app **e** mocks.
- ETH sempre string decimal; cálculo com `decimal.js`; quantidade inteira.
- Query keys incluem o userId para dados privados; logout/troca de usuário → `queryClient.clear()` + desconectar socket.
- Todo estado de busca/filtro/página na URL (search params validados).
- Acessibilidade: labels, `aria-describedby` nos erros, foco visível, `aria-live` para mutations/realtime.
- Skeletons com shimmer, respeitando `prefers-reduced-motion`, sem CLS.

## Segurança (resumo — detalhes em `docs/SECURITY.md`)
- Nunca commitar `.env*` (só `.env.example`). Nunca colocar segredo em `VITE_*` (vai para o bundle).
- O app não precisa de nenhum segredo real. Não logar tokens/senhas.
- Senhas no mock: hash (WebCrypto PBKDF2/SHA-256 + salt), nunca em claro.
- Sem `dangerouslySetInnerHTML` (lint bloqueia). Validar todo input com zod.
- Upload de avatar: allowlist de MIME (png/jpeg/webp), limite de tamanho, sem SVG.

## Commits
Branches `feat/*`, `fix/*`, `chore/*`. Conventional Commits. Não fazer push sem pedido.
