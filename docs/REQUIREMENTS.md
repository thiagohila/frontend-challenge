# Matriz de rastreabilidade

Fonte: `docs/CHALLENGE.md` (§ = seção do enunciado). Cada requisito tem ID, bloco (`docs/PLAN.md` §4), teste e evidência.
Testes: `T1–T12` = cenários do enunciado §9 · `VIS` regressão visual · `AXE` auditoria axe · `LH` Lighthouse · `SMK` smoke · `unit` projeto Playwright sem browser. Mapa de specs: ARCHITECTURE §12.
Status: ☐ pendente · ◐ parcial · ☑ feito. **Atualizar o status ao fechar cada bloco.** Requisito sem teste precisa de uma evidência explícita.

## Eliminatórios (§11)
| ID | Requisito | Bloco | Teste/Evidência | St |
|---|---|---|---|---|
| X1 | Uso efetivo de toda a stack (§2) | todos | SMK + ARCHITECTURE §2 | ◐ |
| X2 | Fluxos principais não apenas visuais | B3–B6 | T3, T5, T6, T8 | ◐ |
| X3 | Compra confirmada só com resposta da simulação | B6 | T6, T7 (recusado não mostra recibo) | ☐ |
| X4 | Sem exposição de dados entre usuários | B2, B3, B6 | T3 (troca de usuário), T10 (evento de outra sessão), checkout.spec (`/orders/:id` e `/tx/:hash` alheios → 404) | ◐ |
| X5 | Eventos não simulados diretamente na UI | B5, B6 | T9, T10 via `socket.io-client`; painel admin isolado (ARCH §10) | ☐ |
| X6 | E2E executáveis | todos | `npm run test:e2e` em checkout limpo (B9) | ◐ |

## Escopo, telas e fluxos (§1, §3)
| ID | Requisito | Bloco | Teste/Evidência | St |
|---|---|---|---|---|
| S1 | Frames desktop e mobile do Figma | B1a, B7 | VIS desktop+mobile | ◐ |
| S2 | Estados não desenhados no mesmo padrão visual | B1a (lista), B7 | DESIGN.md "estados derivados" | ◐ |
| S3 | Blockchain/carteira/pagamento só simulados | B2 | ARCHITECTURE §10 | ☐ |
| S4 | Início: destaques, catálogo, busca, filtros, ordenação, navegação ao NFT | B4 | T1 | ☐ |
| S5 | Detalhe: galeria, informações, edição, quantidade, favoritos, compra | B4, B5 | T2, T4, T5 | ☐ |
| S6 | Carrinho: quantidades, remoção, cupom, resumo | B5 | T5 | ☐ |
| S7 | Pagamento: dados, carteira+rede, revisão, envio | B6 | T6 | ☐ |
| S8 | Confirmação: resultado, transação, itens, taxas, total | B6 | T6 | ☐ |
| S9 | Login: autenticação, validação, **retorno ao fluxo anterior** | B3 | T3 | ◐ |
| S10 | Cadastro: criação, validação, conflito | B3 | T3 | ☑ |
| S11 | Perfil: dados, avatar, senha | B6b | T8 | ☐ |
| S12 | Carteiras: cadastro/edição principal e secundária | B3 | T8 (carteiras) | ☑ |
| S13 | Perfil, carteiras e confirmação funcionam em mobile sem frame | B3, B6, B6b, B7 | T6/T8 no projeto mobile | ☐ |
| S14 | Fora do escopo (editorial, suporte, atividade, ofertas, downloads) **não aparenta sucesso**; links externos coerentes | B1b, B7 | ARCHITECTURE §11 "fora do escopo" + inspeção | ◐ |

## Catálogo e detalhe (§3)
| ID | Requisito | Bloco | Teste | St |
|---|---|---|---|---|
| C1 | Busca/filtros/ordem/página na URL, sobrevivem a refresh e histórico | B4 | T1 | ☐ |
| C2 | Filtros combináveis; mudança de filtro → página 1 | B4 | T1 | ☐ |
| C3 | Query reflete os params enviados à API | B4 | T1 (asserção no request/resultado) | ☐ |
| C4 | Resultado vazio, falha, respostas fora de ordem | B4 | T1 (cenário `jitter`), T12 (falha com `times` > retries) | ☐ |
| C5 | Detalhe: acesso direto, inexistente (404), edição indisponível, limite de quantidade | B4 | T2 | ☐ |
| C6 | Favoritos persistem para o usuário autenticado; visitante → login → volta e conclui | B4 | T4 | ☐ |

## Carrinho (§3)
| ID | Requisito | Bloco | Teste | St |
|---|---|---|---|---|
| K1 | Adicionar/alterar/remover respeitando disponibilidade por NFT e edição | B5 | T5 | ☐ |
| K2 | Persistir após refresh | B5 | T5 | ☐ |
| K3 | Preservar itens do visitante ao autenticar (merge; excedente limitado ao estoque + aviso) | B5 | T5 | ☐ |
| K4 | Cupom aplicar/remover (persistido no carrinho do servidor); inválido e expirado | B5 | T5 (inclui refresh com cupom) | ☐ |
| K5 | Subtotal, desconto, taxa de rede e total vindos da API | B5 | T5 | ☐ |
| K6 | Reflete preço/disponibilidade recebidos com o carrinho aberto | B5 | `realtime.spec` (carrinho), T9 | ☐ |
| K7 | ETH como string decimal, precisão no cálculo e na exibição; quantidade inteira | B2, B5 | unit `money.spec` + T5 (valores exatos) | ◐ |
| K8 | Cotação da API é a referência para finalizar | B6 | T9 | ☐ |

## Pagamento e confirmação (§3)
| ID | Requisito | Bloco | Teste | St |
|---|---|---|---|---|
| P1 | Validar campos do layout; revisão antes do envio | B6 | T6, T11 | ☐ |
| P2 | Usa carteiras cadastradas; seleção de rede | B6 | T6 | ☐ |
| P3 | Simulação de conexão, **recusa** e **desconexão** da carteira | B2, B5, B6 | T7 (recusa), T10 (desconexão via `wallet.disconnected`) | ☐ |
| P4 | Revalidar preço, disponibilidade, cupom e taxas antes de confirmar; mudança exige nova confirmação | B6 | T9 | ☐ |
| P5 | Sem pedido duplicado: clique repetido e reenvio após timeout (idempotência consultada antes de validar) | B2, B6 | T7 + unit de contrato | ☐ |
| P6 | Pendente, confirmado e recusado; recuperação após refresh/reconexão (`resolveAt` persistido) | B2, B6 | T7, T10 | ☐ |
| P7 | Confirmação só para pedido confirmado | B6 | T6, T7 | ☐ |
| P8 | Falha preserva itens; confirmação remove **só itens e quantidades comprados** (no servidor) | B6 | T6, T7 | ☐ |
| P9 | Recibo = snapshot (mudança posterior no catálogo não altera) | B6 | T6 (emite `nft.updated` após confirmar) | ☐ |
| P10 | Referência de transação e link de explorador simulados (`/tx` só do dono) | B6 | T6 | ☐ |

## Conta e sessão (§3)
| ID | Requisito | Bloco | Teste | St |
|---|---|---|---|---|
| A1 | Cadastro, login, logout e sessão integrados à API | B3 | T3 | ☑ |
| A2 | Checkout, perfil, carteiras, favoritos e pedidos exigem auth | B3 | T3 (guards) | ☑ |
| A3 | Sessão recuperável após refresh | B3 | T3 | ☑ |
| A4 | Expiração durante navegação **e durante checkout**, preservando o contexto | B3, B6 | T3, T7 | ◐ |
| A5 | Logout/troca limpa cache privado e subscriptions | B3 | T3 | ☑ |
| A6 | Validar cadastro, perfil, senha e carteiras, incluindo erros da API | B3, B6b | T3, T8, T11 | ◐ |
| A7 | Alterações confirmadas persistem após refresh | B3, B6b | T8 | ◐ |
| A8 | Credenciais fictícias; senha nunca em claro | B2 | SECURITY.md + inspeção do db | ☑ |

## Integração e estado (§4)
| ID | Requisito | Bloco | Teste | St |
|---|---|---|---|---|
| I1 | Router em rotas, search params e proteção | B3, B4 | T1, T3 | ◐ |
| I2 | Query em consultas, mutations e cache; REST só via Axios | todos | revisão + ARCHITECTURE §5–6 | ☐ |
| I3 | Contratos tipados transporte→estado→UI | B2 | `contracts/` + typecheck | ◐ |
| I4 | Estados loading, vazio, erro, sucesso, atualização em segundo plano | B4–B6 | T12 (inclui indicador de refetch) | ☐ |
| I5 | Invalidação coerente após mutations e eventos; versão nunca regride | B4–B6 | T4, T5, `realtime.spec` | ☐ |
| I6 | Cancelar/descartar respostas obsoletas | B4 | T1 (`jitter`) | ☐ |
| I7 | Isolamento por usuário e por parâmetros | B3 | T3 | ☑ |
| I8 | Recuperar falhas sem duplicar operações | B6 | T7 | ☐ |
| I9 | Rota inexistente; acesso direto a qualquer tela (inclui `/checkout` vazio, pedido alheio = 404) | B3–B6 | T2, SMK | ☐ |
| I10 | Update otimista com rollback (≥1) | B4 | T4 | ☐ |
| I11 | Política de cache/retry/sync documentada | B9 | ARCHITECTURE §6 | ◐ |

## Contratos REST (§5)
| ID | Requisito | Bloco | Evidência | St |
|---|---|---|---|---|
| R1 | Recursos: sessão, NFTs, favoritos, carrinho, cotação, pedidos, perfil, carteiras | B2 | ARCHITECTURE §4 | ☑ |
| R2 | Erros: validação, sessão inválida, permissão (403 `carol`/`unauthorized`), inexistente, conflito, transitório | B2 | unit de contrato + T3 (401), checkout.spec (403) | ◐ |
| R3 | Idempotência: mesma chave → mesmo pedido; chave + payload diferente → conflito | B2, B6 | unit de contrato + T7 | ◐ |

## Mocking (§6)
| ID | Requisito | Bloco | Evidência | St |
|---|---|---|---|---|
| M1 | Mocks só na camada de rede, reutilizados em dev/demo/testes; sem respostas fictícias no app | B2 | lint de import (`src/**` ≠ `@/mocks`) | ◐ |
| M2 | Estado consistente entre os recursos; persistência; reset integral | B2 | T5/T8 (refresh) + `mock.reset` | ☑ |
| M3 | Lentidão, latência variável, timeout, sem conexão, HTTP erro, configuráveis e reproduzíveis (PRNG com seed) | B2 | T1, T7, T12 | ◐ |
| M4 | Fixtures: variedade p/ filtros+paginação, ≥2 usuários | B2 | `mocks/fixtures` | ☑ |
| M5 | Cenários: sucesso/vazio · latência/fora de ordem · conexão/4xx/5xx · sessão expirada/não autorizado (`unauthorized`) · conflito cadastro/validação · cupom inválido/expirado · preço/esgotado na compra · timeout pós-criação · pagamento confirmado/recusado | B2 | `mocks/scenarios.ts` + README | ◐ |
| M6 | Socket via MSW + `@mswjs/socket.io-binding`; transporte e limitações documentados (ping, ack, sid) | B5 | ARCHITECTURE §10 | ◐ |
| M7 | Cenários exercitam `socket.io-client` (sem setters/cache diretos) | B5, B6 | T9, T10, `realtime.spec` | ☐ |
| M8 | Mocks ativados por config e presentes no build de demo | B1b | deploy | ☑ |
| M9 | Mudança no dado simulado → REST **e** evento | B5 | `realtime.spec` (`updateNft` → evento + refetch iguais) | ☐ |

## Tempo real (§7)
| ID | Requisito | Bloco | Teste | St |
|---|---|---|---|---|
| RT1 | `nft.updated` atualiza catálogo, detalhe e carrinho | B5 | `realtime.spec`, T9 | ☐ |
| RT2 | `order.updated` atualiza o pedido; mostra confirmação/recusa | B6 | T6, T7 | ☐ |
| RT3 | Eventos com id estável, recurso e versão; dedupe; não regridem nem reaplicam | B5 | unit `apply.spec` + T10 | ☐ |
| RT4 | Reconexão → reconciliação com REST | B5, B6 | `realtime.spec`, T10 | ☐ |
| RT5 | Evento de sessão anterior não afeta outro usuário | B3, B5 | T10 | ◐ |
| RT6 | Listeners liberados ao fim do ciclo de vida | B5 | T3 (logout) + revisão | ☐ |
| RT7 | Cenário: item no carrinho → muda preço/estoque → UI avisa e atualiza o resumo → checkout bloqueia cotação velha | B5, B6 | T9 | ☐ |
| RT8 | Queda de conexão com pedido pendente → reconectar/recarregar recupera sem nova compra; terminais | B6 | T10 | ☐ |

## Interface e a11y (§8)
| ID | Requisito | Bloco | Teste | St |
|---|---|---|---|---|
| U1 | Fidelidade: tipografia, cores, espaçamentos, hierarquia, imagens, proporções; shadcn adaptado | B1b, B7 | VIS | ☐ |
| U2 | Desktop, tablet e mobile em todas as telas (390/768/1440 no mínimo) | B7 | projeto `tablet` + `layout.spec` + VIS | ☐ |
| U3 | Skeleton com shimmer (catálogo, detalhe, resumo do carrinho), sem CLS, com reduced motion | B4, B5 | T12 (`reducedMotion` nos dois modos) + LH CLS | ☐ |
| U4 | Teclado e foco visível | todos | T11, AXE | ☐ |
| U5 | Foco em diálogos e drawers | B4–B6 | T11 | ◐ |
| U6 | Semântica, labels, erros associados | B3, B6 | T11, AXE | ◐ |
| U7 | Texto alternativo | B4 | AXE | ☐ |
| U8 | Contraste; estado não só por cor | B7 | AXE | ☐ |
| U9 | Feedback acessível de mutations e realtime | B4–B6 | T11 (`aria-live`) | ☐ |
| U10 | Sem overflow horizontal; zoom sem perda | B7 | `layout.spec` (320px ≈ zoom 400%) | ☐ |
| U11 | Assets do Figma locais; substituições documentadas | B1a, B1b | DESIGN.md + ARCHITECTURE §15 | ◐ |

## Testes (§9)
| ID | Requisito | Bloco | St |
|---|---|---|---|
| T1 | Busca, filtros, ordem, paginação, histórico | B4 | ☐ |
| T2 | Acesso direto ao detalhe + inexistente | B4 | ☐ |
| T3 | Cadastro, login, expiração, logout, troca de usuário | B3 | ☑ |
| T4 | Favoritos + falha de mutation + recuperação | B4 | ☐ |
| T5 | Carrinho, quantidades, remoção, cupom, persistência refresh/login | B5 | ☐ |
| T6 | Compra completa até o recibo confirmado | B6 | ☐ |
| T7 | Falha de pagamento, clique repetido, timeout → mesmo pedido | B6 | ☐ |
| T8 | Perfil, avatar, senha, carteiras + erros de validação | B3 | ☐ |
| T9 | Preço/disponibilidade via Socket.IO durante o checkout | B6 | ☐ |
| T10 | Eventos duplicados/antigos, desconexão, retomada de pendente | B6 | ☐ |
| T11 | Teclado, foco em diálogos, validação de formulários | B3–B7 | ☐ |
| T12 | Skeleton em carga lenta, feedback de falha, nova tentativa | B4 | ☐ |
| TQ1 | Fluxos principais em Chromium desktop + mobile (+ tablet no smoke/layout) | todos | ◐ |
| TQ2 | VIS de início, detalhe, carrinho, pagamento; baselines Linux versionadas (Docker), pulado fora do Linux; dados estáveis | B7 | ☐ |
| TQ3 | Estado isolado por teste (init só na 1ª carga); controle de relógio (timeout em JS), latência e eventos | B2 | ◐ |
| TQ4 | Relatório HTML + traces de falha **entregues** | B9 | ☐ |
| TQ5 | Asserções na UI e no resultado das operações; realtime via cliente Socket.IO, REST via MSW | todos | ☐ |

## Performance (§10)
| ID | Requisito | Bloco | Evidência | St |
|---|---|---|---|---|
| L1 | Início e detalhe × mobile e desktop, build otimizado, cenário padrão | B8 | `docs/lighthouse/` | ☐ |
| L2 | Perf ≥90, A11y ≥95, BP ≥95, SEO ≥90 | B1b (baseline), B8 | `summary.json` | ☐ |
| L3 | 3 medições, mediana por categoria | B8 | `scripts/lighthouse.mjs` (sobe e derruba o preview sozinho) | ◐ |
| L4 | Config versionada; HTML/JSON; versões, ambiente e condições | B8 | `docs/lighthouse/README.md` | ◐ |
| L5 | LCP, CLS, TBT registrados; justificar abaixo da meta | B8 | `docs/lighthouse/README.md` | ☐ |
| L6 | Sem simplificação só para a auditoria | B8 | revisão | ☐ |

## Entrega (§12)
| ID | Requisito | Bloco | Evidência | St |
|---|---|---|---|---|
| D1 | Código, lockfile, assets, mocks, fixtures, testes e configs de auditoria | B9 | repo | ◐ |
| D2 | Deploy público = código entregue; mocks e realtime ativos; refresh/acesso direto | B1b, B9 | `deploy.spec` (`/version.json` = HEAD) | ◐ |
| D3 | Link do repositório (push) | B1b | GitHub | ◐ |
| D4 | README: setup, env, credenciais fictícias, cenários (seleção/reset), comandos, como reproduzir falhas | B9 | README | ☐ |
| D5 | Docs: contratos REST/eventos, sessão, carrinho, cache, reconciliação REST × Socket | B9 | ARCHITECTURE | ◐ |
| D6 | ARCHITECTURE: limitações, decisões de UX, desvios do Figma | B9 | ARCHITECTURE §15 (espelha DESIGN.md) | ◐ |
| D7 | Comandos: dev com mocks, build, preview, typecheck, lint, e2e, lighthouse | B0 | package.json | ☑ |
| D8 | Roda de checkout limpo sem serviços privados | B9 | `git clone && npm ci && build && test:e2e` | ☐ |

## Extras (fora do enunciado, PLAN §8)
| ID | Requisito | Bloco | Teste | St |
|---|---|---|---|---|
| EX1 | Troca de idioma pt-BR/en-US (strings + `lang`), persistida | Folga | e2e `prefs.spec` | ☐ |
| EX2 | Preferência de formato de data/hora (padrão do idioma/12h/24h), persistida | Folga | e2e `prefs.spec` | ☐ |
