# NFT Marketplace — contexto para agentes

Desafio frontend com prazo de 24h (início 2026-10-21 18:40, entrega 2026-10-22 18:40).

- Enunciado: `docs/CHALLENGE.md` (é a fonte da verdade; o `README.md` vira o README da solução).
- Problemas achados nas revisões, causa e prevenção: `docs/REVIEW-LOG.md` (atualizar ao fechar cada bloco).
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

`npm run dev` · `build` · `preview` · `typecheck` · `lint` · `format` / `format:check` · `test:e2e` · `test:e2e:update` · `test:e2e:docker` (VIS/Linux) · `lighthouse` · `audit:deps`

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

## Padrão de código (nível sênior — inegociável)

Garantido por ferramenta (`npm run typecheck` / `lint`), não por boa vontade:

- TS `strict` + `noUncheckedIndexedAccess` + `noImplicitOverride` em **src, e2e, tests e configs** (`tsconfig.test.json`).
- Lint bloqueia: `any`, non-null `!`, import de tipo sem `type`, `href="#"`/âncora inválida, `<img>` sem `alt`, label solta, clique sem teclado, `key` por índice, `console.log`, `==`, import cíclico, mocks no app, `socket.io-client` estático.

**Fidelidade × a11y (decisão permanente)**: seguir o Figma fielmente; rótulo/texto que a acessibilidade exigir e o design não tiver entra como `sr-only`, sem mudar o visual. Desvio visual só se inevitável (ex.: contraste) e sempre registrado em ARCHITECTURE §15.

Por revisão (checklist antes de cada commit):

- **Tipos derivam de schemas zod**; `as` só para estreitar algo já validado; nunca `as never`/`as unknown as`. Configs com `satisfies`.
- **Nada de string mágica**: ícones/arte via `iconSrc`/`artSources` (union gerada em `assets.gen.ts`), rotas via `Link`/`navigate` tipados, query keys via `lib/query-keys`.
- **Semântica**: ação = `button`, navegação = `Link`; fora do escopo = `<ComingSoon>`.
- **Sem arrays paralelos por índice**: dados relacionados vivem juntos (`{ label, slug }`).
- Toda string de UI no dicionário `src/i18n`; nenhum texto solto em JSX.
- **Rotas só compõem** (search, guard, loader, head, componentes de feature); UI com estado fica em `features/<x>/components`. Sem barrels (ADR 17).
- **Erros de formulário**: campo = `aria-invalid` + `aria-describedby` (sem `role=alert`); erro geral da API = um único `<FormError>`.
- Componente com uma responsabilidade; lógica de dados em `features/<x>/queries.ts`/hooks, não no JSX; arquivos > ~200 linhas → dividir.
- Erros tratados explicitamente (`ApiError`), sem `catch` silencioso; estados loading/empty/error em todo componente com dados.
- **Sem código provisório ao fechar o bloco**: `grep -rn "Scaffold\|TODO\|FIXME" src` zerado para as telas do bloco.
- Nomes intencionais, sem abreviações; comentários explicam o _porquê_, não o _o quê_.

## Commits

Branches `feat/*`, `fix/*`, `chore/*`. Conventional Commits. Não fazer push sem pedido.
