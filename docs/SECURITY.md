# Segurança

Escopo: SPA com backend 100% simulado (MSW). Mesmo assim, tratamos como produção.

## Segredos
- `.gitignore` bloqueia `.env`, `.env.*`, `*.pem`, `*.key`; só `.env.example` é versionado.
- Tudo que é `VITE_*` é público (embutido no bundle). O app **não usa nenhum segredo**; só URLs/flags.
- Nada de token, senha ou PII em `console.*`, mensagens de erro ou URLs.
- Antes de cada commit: `git diff --cached` revisado; checar que nenhum arquivo `.env` foi adicionado.

## Autenticação e sessão (simulada)
- Senhas armazenadas no "banco" do mock só como hash PBKDF2 (WebCrypto) + salt por usuário. Credenciais fictícias documentadas no README.
- Token de sessão opaco gerado pelo mock, com expiração. Política: token em memória + `sessionStorage` para sobreviver a refresh (trade-off documentado: num backend real seria cookie `HttpOnly; Secure; SameSite=Lax`).
- 401 → limpa sessão, preserva rota de retorno (`redirect` validado como caminho interno, sem open redirect).
- Logout / troca de usuário: `queryClient.clear()`, desconectar socket, remover listeners, limpar storages privados. Eventos de socket são descartados se `userId`/`sessionId` não batem com a sessão atual.
- Isolamento: query keys privadas incluem `userId`; handlers MSW filtram sempre pelo usuário do token (nunca por id vindo do cliente).

## Entrada e saída
- Todo formulário e todo search param validados com zod; respostas da API parseadas por schema.
- React escapa por padrão; `dangerouslySetInnerHTML` proibido (oxlint `react/no-danger`).
- Links externos: `rel="noopener noreferrer"`. `redirect` só aceita paths que começam com `/` e não com `//`.
- Avatar: MIME allowlist (`image/png`, `image/jpeg`, `image/webp`), ≤ 2 MB, sem SVG; exibido via `blob:`/data URL.

## Pedidos
- Idempotency-Key (UUID por tentativa) em criação de pedido; mesma chave + payload diferente → 409.
- Botão de confirmar desabilitado durante envio; reenvio após timeout reutiliza a chave.

## Headers / deploy (`vercel.json`)
CSP restritiva (`default-src 'self'`, `frame-ancestors 'none'`), HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`. Validar a CSP no deploy (MSW worker + fontes + imagens).

## Dependências
- `npm audit --omit=dev` deve ficar em 0. Lockfile versionado; `npm ci` no CI/deploy.
- Override de `basic-ftp` (transitiva do lighthouse) para versão corrigida.
- Risco aceito: `braces` (via CLI `shadcn` → `fast-glob`), dev-only, sem versão corrigida, não entra no bundle.
