# DESIGN.md — Extração do Figma (bloco B1a)

Fonte: Figma `uweCCvGGvM7N1rQTFUjwQ3`, página `0:1` ("Marketplace de NFTs GreenMint"; a marca renderizada é **KURIO**).
O código de referência de cada seção está em `docs/design/context/<frame>/<secao>.md`. Os assets estão em `design-src/assets/`. Os screenshots estão em `docs/design/frames/*.png`.
O código do Figma é React+Tailwind com posicionamento absoluto. Use-o como referência visual, não como código final.

---

## 1. Inventário

| Tela | Desktop 1440 (frame) | Mobile 414 (frame) | Contexto salvo |
|---|---|---|---|
| Início | `2:2` (3668 px de altura) | `14:5226` | `desktop-inicio/01..05`, `mobile-inicio/01` |
| Detalhes do NFT | `10:244` | `15:5536` | `desktop-detalhe/01..03`, `mobile-detalhe/01` |
| Carrinho de NFTs | `11:1278` | `16:360` | `desktop-carrinho/01..02`, `mobile-carrinho/01` |
| Pagamento | `11:2862` | `16:748` | `desktop-pagamento/01`, `mobile-pagamento/01` |
| Confirmação de pedido | `11:4385` | **sem mobile** | `desktop-confirmacao/00..01` |
| Login (modal) | `9:115` | `16:1022` (tela cheia) | `desktop-login/00..02`, `mobile-login/01` |
| Cadastro (modal) | `9:1022` | `16:1228` (tela cheia) | `desktop-cadastro/01`, `mobile-cadastro/01` |
| Perfil do colecionador | `9:1238` | **sem mobile** | `desktop-perfil/01` |
| Carteiras | `9:1670` | **sem mobile** | `desktop-carteiras/01` |

- **Sem frame mobile:** Confirmação, Perfil e Carteiras. Derive-os dos padrões mobile (header de tela com botão voltar 35 px, cards `rounded-14`, CTA pill de 60 px).
- **Sem tablet** em nenhuma tela. O REQUIREMENTS pede 768 px, então o breakpoint intermediário precisa ser derivado.
- **Header mobile:** o mobile não tem header com logo. O Início usa barra de busca + Tab Bar inferior (Início, Favoritos, FAB central de scan, Carrinho, Perfil). Detalhe, Carrinho e Pagamento usam botão voltar + título.
- **Fundo dos modais de auth:** Login e Cadastro desktop são modais sobre a instância "Marketplace Page" (`70522:3671`/`70522:3841`). Essa instância é uma cópia do Início com algumas diferenças. Ela é a única fonte desktop do **hover do card** e do **badge RARO**.
- **Fundo da Confirmação:** a Confirmação é um modal sobre a "Checkout Page", com BG `11:5105` em ink opaco, que esconde a página inteira.
- **Componentes Figma documentados:** Header Row (variante ativa Home/Market e Badge Count), Header With Divider, Filters, Footer, Checkout Page, Marketplace Page, Password Input, Social Button (Google/Facebook) e Mobile Social Block.
- **Header com e sem divisor:** as telas do fluxo Mercado (Detalhe, Carrinho, Pagamento) usam Header Row **sem** divisor. Início, Perfil, Carteiras e Marketplace Page usam **com** divisor.

---

## 2. Tokens

### 2.1 Cores

| Token sugerido | Hex | Variável Figma | Papel |
|---|---|---|---|
| `background` / `ink` | `#140D0A` | Color/Ink | Fundo de página. Também é o texto sobre botões primary e o scrim da Confirmação |
| `foreground` | `#F5F1EB` | Color/Foreground | Texto principal, títulos e valores |
| `text-primary` | `#F7F3EC` | Color/Text Primary | Títulos do blog (praticamente igual a foreground; pode fundir) |
| `text-secondary` | `#CFB28C` | Text/Secondary | Descrições, metadados, labels de lista inativos e quantidade "(x 2)" |
| `text-accent` | `#E89B55` | Text/Accent | Item de nav/tab/filtro ativo, preço, links ("Esqueceu a senha?", "Adicionar", "Continuar explorando"), "Taxa estimada" |
| `primary` | `#D28A4C` | Color/Primary | Botões, borda de foco/seleção, sublinhados ativos, badge, divisores do footer e da confirmação, faixa de 10 px no rodapé dos modais |
| `secondary` | `#B39463` | Color/Secondary | Placeholder, "ID do token", preço antigo, chevrons dos selects |
| `text-coral` | `#F0805F` | Text/Coral | Asterisco de obrigatório, divisor "Entrar \| Criar conta" |
| `surface-card` | `#241612` | Color/Surface Card | Cards, filtros, modais, footer, linhas de carrinho, sheets mobile |
| `surface-raised` | `#2F1D15` | Color/Surface Raised | Botões circulares (voltar, favoritar, ações de hover), avatar placeholder, stepper mobile |
| `surface-dark` | `#38220F` | Color/Surface Dark | Faixa da marca no footer, input da newsletter, chip de carteiras compatíveis |
| `border` | `#3F2319` | Color/Border | Borda de inputs, paginação, botões sociais, chips de edição inativos e divisórias |
| `border-soft` | `#55321F` | Color/Border Soft | Borda do chip de carteiras, radio inativo mobile, ícone "olho" mobile, stepper − desabilitado |
| `background-elevated` | `#FBFBFB` | Color/Background Elevated | Usada só dentro da máscara dos promos. Não usar como superfície |
| `amber` | `#E3A44E` | Color/Amber | Estrela do selo de nota no mobile |
| `success` | `#00A66C` | Color/Success | Aparece só no logo Google. Bom candidato para status "confirmado" |
| `gray-light` | `#EDEDED` | Color/Gray Light | Listada no mobile Início, sem uso visível |
| logos | `#59C36A #FFDA2D #4086F4 #4175DF #FF641A #3B5999` | Logo/* | Marcas Google e Facebook (só nos SVGs) |
| (deco) | `#46A358` a 20% | — | Quadrado decorativo do banner "NFT EM DESTAQUE" |

O design **não tem cor de erro/destructive**. Sugestão: `destructive = #F0805F` (coral), que tem contraste de 7.29 sobre ink, com ícone e texto além da cor.

### 2.2 Gradientes

| Uso | Valor |
|---|---|
| Banner "NFT EM DESTAQUE" | `linear-gradient(to bottom, rgba(210,138,76,.10), rgba(210,138,76,.03))` |
| Card e hero mobile | `linear-gradient(139.5deg, #241612 12%, #2F1D15 106.6%)` |
| CTA pill mobile ("Comprar NFT", "Conectar e finalizar", "Confirmar compra") | `linear-gradient(~105deg, #D28A4C 4%, rgba(210,138,76,.8) 122%)` |
| "Aplicar" do cupom mobile | `linear-gradient(96deg, rgba(210,138,76,.54) 1%, #D28A4C 105%)`, com texto **foreground** (risco, ver §8) |
| Botão filtro mobile | `linear-gradient(137deg, rgba(210,138,76,.45) 25%, #D28A4C 100%)` |
| FAB da Tab Bar | vertical, `#D28A4C` 40% → 100% |
| Círculos decorativos do banner | `linear-gradient(145deg, rgba(210,138,76,.3) 46%, transparent 103%)` |

### 2.3 Tipografia

Fonte única: **Roboto Mono**, pesos 400, 500 e 700. O letter-spacing "10" do Figma equivale a **10%** (1.4 px a 14 px, 3.2 px a 32 px).

| Token sugerido | Tamanho/peso | Line-height | Letter-spacing | Onde |
|---|---|---|---|---|
| `display-xl` | 43 / 700 | 70 | 0 | Título do hero desktop |
| `display-logo` | 32 / 700 | normal | 10% | Logo KURIO no mobile auth |
| `heading-28` | 28 / 700 | normal | 0 | Nome do NFT (detalhe) e título do blog |
| `heading-24` | 24 / 700 | 32 (normal) | 0 | "NFT EM DESTAQUE" e letras dos medalhões do footer |
| `title-22` | 22 / 700 | 16 | 0 | Preço no detalhe, "OFERTA LIMITADA" |
| `title-22-asterisk` | 22 / 400 | 29 | 0 | Asterisco de obrigatório |
| `title-20` | 20 / 700 · 500 · 400 | 16 / 28 | 0 | Títulos mobile e preço da buy bar (700), tabs Entrar/Criar conta (500), quantidade no stepper desktop (400/28) |
| `body-18` | 18 / 700 · 500 · 400 | 16 / 25 | 0 | Títulos de filtros, footer e resumo, preço do card (700), quantidade mobile (500/25), valores do resumo e paginação (400) |
| `body-17` | 17 / 700 · 400 | 16 / 24 | 0 | Títulos de seção (accent) e quantidade no carrinho (400/24) |
| `body-16` | 16 / 700 · 500 · 400 | auto / 16 / 20 | 0 | Nav, botões, nome do NFT no card e cabeçalhos de tabela |
| `body-15` | 15 / 700 · 500 · 400 | 16 / 15 / 40 / 45 | 0 | Labels de form (15/15), listas de filtro (40), sidebar da conta (45) e tabs (500) |
| `body-14` | 14 / 700 · 500 · 400 | 24 / 22 / 20 / 16 / 15 | 0 · 10% (logo) | Parágrafos (24), placeholders (16/15), botões compactos (20) |
| `caption-13` | 13 / 500 · 400 | 16 / 22 | 0 | Botões sociais, "Ou continue com", nota da newsletter |
| `caption-12` | 12 / 700 · 500 · 400 | 14 / 16 / 18 | 0 | Meta do blog, "Taxa estimada", "Ler mais", textos do hero mobile |
| `tiny-10` | 10 / 500 | normal | 0 | Número do badge do carrinho |
| `tiny-9` | 9 / 700 | normal | 0.1 px | Chip "METAMASK • WALLETCONNECT • COINBASE" |

### 2.4 Espaçamento, container e grid

- **Espaçamentos recorrentes (px):** 4, 6, 8, 10, 12 (o mais comum), 16, 20, 24, 28, 32 (gap padrão entre blocos), 40, 44, 48, 72 (linhas da grade), 80 (inset dos modais de auth), 88, **96** (entre seções da home) e 124 (colunas do footer).
- **Container desktop:** **1200 px** centralizado, com gutter de 120 px a 1440 px. O topo da página fica a 24 px.
- **Container mobile:** 414 px com padding lateral de 24 px (Início, sheets) ou 28 px (carrinho, pagamento, auth). O conteúdo fica com 366 ou 358 px.

| Bloco | Desktop | Mobile |
|---|---|---|
| Início: catálogo | Sidebar 310 + gap 48 + grade 842, com **3 colunas** de 258 (≈34 de gap) e linhas a cada 72 | **2 colunas** de 175 com gap 16, em masonry (coluna direita com offset de 32) e linhas a cada 24 |
| Promos | 2 × 586 | — |
| Blog | 4 × 268, gap 24 | — |
| Relacionados | 5 × 219–220 (justify-between ≈26) | — |
| Detalhe | Galeria 573 (thumbs 100 + gap 16 vertical, gap 28 + principal 444) + gap 32 + detalhes ≈595 | Hero de 506 com imagem 361×356, sheet sobreposto (−114) e buy bar fixa de 164 |
| Carrinho | Tabela 782 + resumo 332 | Lista de cards 358×100, gap 20, e sheet de resumo |
| Pagamento | Form flexível (2 subcolunas, gap 24) + gap 32 + coluna de pedido de 405 | Coluna única |
| Perfil/Carteiras | Sidebar da conta 310 + gap 28 + form em 2 colunas de 417 | (derivar) |
| Modais | Auth com 500 de largura (600/656 de altura). Confirmação com 578 | Auth em tela cheia |

### 2.5 Raios, sombras e bordas

| Raio sugerido | Valor | Casos no Figma |
|---|---|---|
| `radius-xs` | 3 | Inputs e botões do checkout, perfil e carteiras |
| `radius-sm` | 4–5 | Paginação, ações de hover, inputs e botões de auth, Etherscan |
| `radius-md` | 6 | Botões primários, botão do header, thumbs, imagens do carrinho, chip de carteira |
| `radius-lg` | 8 | Cards do blog, promos, thumbs, imagens de recibo, CTA "Confirmar compra" desktop |
| `radius-xl` | 10–14 | Inputs, botões e busca mobile (10), hero mobile (12), cards de carrinho e carteira mobile (14), opções (15) |
| `radius-2xl` | 15–17 / 20 | Arte dentro dos cards (13–17), card mobile (20) |
| `radius-3xl` | 22–24 | Hero desktop (24), imagem principal do detalhe (24), destaque (22) |
| `radius-sheet` | 31–40 | Topo dos sheets e da buy bar mobile |
| `radius-full` | 9999 | Botões circulares, CTA pill, selo de nota, stepper |

O `rounded-40` no frame raiz mobile é a moldura do mockup e **não é um token**.

| Sombra | Valor | Onde |
|---|---|---|
| `shadow-sheet` | `0 0 10px rgba(10,6,4,.45)` | Input da newsletter e buy bar mobile |
| `shadow-card-mobile` | `0 6px 20px rgba(10,6,4,.45)` | Item do carrinho mobile |
| `shadow-card-active` | `0 20px 20px rgba(10,6,4,.45)` | Card de carteira selecionado (mobile) |
| `shadow-option` | `0 0 20px` / `0 0 40px rgba(10,6,4,.45)` | Opções de carteira mobile |
| `shadow-input` | `0 6px 10px rgba(10,6,4,.45)` | Input de cupom mobile |
| `shadow-stepper` | `0 4px 6px rgba(20,13,10,.15)` (desktop grande: `0 6.6px 9.9px`) | Botões − e + |

| Borda | Uso |
|---|---|
| 1 px `border` | Padrão de input, paginação, botão social e divisórias de 0.3 px |
| 1 px `primary` | Foco ou seleção: input de senha focado, thumbnail ativa, opção de carteira selecionada, input de cupom, botão secundário "Favoritar" |
| `border-l-6 primary` | Item ativo da sidebar da conta |
| 1 px `border-soft` | Chip de carteiras compatíveis |
| 1 px `#140D0A` | Contorno dos botões do stepper |

---

## 3. Componentes

| Componente (Figma) | shadcn/ui | Variantes e estados desenhados | Medidas principais |
|---|---|---|---|
| Header Row / Header With Divider | custom + `NavigationMenu` opcional | Item ativo Início/Mercado (accent bold + sublinhado de 3 px primary), badge de contagem e botão "Entrar". **Estado logado não desenhado** | Altura 34–35. Nav com gap 40. Ações com gap 28. Botão de 100×35 com raio 6 |
| Botão primário | `Button` (default) | bg primary, texto ink bold. Tamanhos 35/40/45 (desktop) e 60 (mobile, raio 10 ou pill com gradiente) | px 12–28, raio 3–8 |
| Botão secundário | `Button variant="outline"` | Borda primary, texto accent e ícone (Favoritar) | 130×40, raio 6 |
| Botão link/ghost | `Button variant="link"` | Texto accent: Esqueceu a senha?, Adicionar, Trocar carteira, Continuar explorando, Ler mais →, "Remover" (foreground) | — |
| Botão ícone circular | `Button size="icon"` | surface-raised + border. Voltar, favoritar, zoom, carrinho (mobile 60) e ações de hover (35, raio 4) | 28/30/35/60 |
| Input | `Input` + `Label` | Inativo (borda `border`), focado (borda primary), placeholder `secondary`, label 15 com `*` coral | Altura 40 (desktop), 50 (mobile), raio 3/5/10 |
| Input de senha | `Input` + botão de toggle | Ícone olho cortado | Idem |
| Input com ação (cupom, newsletter) | `Input` + `Button` acoplado | Botão à direita (Aplicar/Enviar) | 40 × 332 (cupom, botão de 102) e 40 (newsletter, botão de 85). Mobile: pill de 50 |
| Select | `Select` | Placeholder "Selecione uma rede" / "Selecione uma carteira" com chevron | 40 de altura |
| Select ".eth" + input (ENS) | `Select` (78 px) + `Input` (329) | — | Gap 10 |
| Textarea | `Textarea` | "Observação do colecionador (opcional)" | 350×152 |
| Radio | `RadioGroup` | Off (anel primary ou border-soft) e On (anel + ponto) | 15–16 |
| Opção de carteira | `RadioGroup` com cards (`Label` como card) | Desktop: linhas de 45 px, a selecionada com borda primary. Mobile: cards de 65 com círculo e letra (W/M) ou ícone | — |
| Chip de edição | `ToggleGroup type="single"` | Inativo (borda `border`, texto secondary) e selecionado (borda primary, texto accent medium) | Altura 28, larguras 36/42/46/66, raio full |
| Stepper de quantidade | custom (`Button` × 2 + valor) | Desktop detalhe 33×49.5 (pill vertical), carrinho 20×30, mobile carrinho de 24 com estados − desabilitado/habilitado | Valor 17–20 px |
| Card de NFT | custom (`Card`) | Padrão, com preço antigo e badge RARO (Marketplace Page). **Hover:** borda superior de 1 px primary + 3 ações (carrinho, favoritar, visualizar). Mobile: botão de favoritar | Desktop 258 × (300 de imagem + texto), arte de 250 com raio 15. Relacionados 219 × 255. Mobile 175 × 200 |
| Badge | `Badge` | "RARO" (bg primary, texto ink, 80×29 desktop e 68×32 mobile, sem raio), badge do carrinho (círculo de 16) e chip de carteiras (9 px) | — |
| Tabs (catálogo) | `Tabs` (ou `ToggleGroup` ligado à URL) | Ativa em accent com sublinhado de 2 px, inativa em foreground | Gap 20 (desktop) e 16 (mobile) |
| Tabs (detalhe) | `Tabs` | "Detalhes do NFT" (ativa, accent bold, sublinhado de 3 px) e "Avaliações de colecionadores (19)" | Gap 32 |
| Ordenação | `Select` / `DropdownMenu` | "Ordenar por: Listados recentemente ▾" | 300 de largura |
| Paginação | `Pagination` | Página ativa (bg primary, texto ink bold), inativas (borda `border`) e próxima (›). **Sem "anterior" e sem reticências** | 35×35, gap 8, raio 4 |
| Breadcrumb | `Breadcrumb` | "Início / Mercado", "Início / Mercado / Carrinho", "Início / Mercado / Pagamento", todo em 15 bold foreground, **sem estado de item atual** | — |
| Sidebar de filtros | custom + `Checkbox` / `Slider` | Item ativo só por cor (accent), contagem entre parênteses, range com 2 thumbs e "Aplicar". A descrição do Figma fala em checkbox, mas **nenhum checkbox está desenhado** | 310 de largura, p 20, gap 40 entre grupos |
| Range de preço | `Slider` (2 thumbs) | Thumb de 15 primary com contorno ink, trilho ativo e restante | Texto "Preço: 0,02 - 12,30 ETH" |
| Rating | custom | Desktop: 5 estrelas (4 primary + 1 secondary) + texto. Mobile: selo pill "★ 4.8 (19)" | Estrela de 15 (desktop) e 14 (mobile) |
| Galeria | custom (ou `Carousel`) | 4 thumbs de 100 (ativa com borda primary) + principal de 444, botão de zoom e dots no mobile | — |
| Carrossel (hero/relacionados) | `Carousel` | Dots (o ativo é cheio ou pill) | — |
| Tabela do carrinho / recibo | custom (grid), `Table` opcional | Linhas surface-card de 70 de altura | Colunas NFTs 250, Preço 77, Edições 75, Total 87 e lixeira 24 |
| Resumo de valores | custom | Subtotal, Desconto, Taxa de rede + "Taxa estimada" e Total (accent) | 332 / 405 / 321 |
| Modal | `Dialog` | Fechar (X primary) e faixa de 10 px primary na base. Auth sem raio (Sign In) ou com raio 8 (Sign Up) | 500 / 578 |
| Mobile sheet / buy bar | `Drawer`/`Sheet` (ou layout fixo) | Topo arredondado de 31–40 | — |
| Sidebar da conta | custom nav | Ativo com `border-l-6` primary. Itens em accent | 310 de largura, itens de 45 de altura |
| Avatar | `Avatar` + `Button`s | Placeholder de 50 com ícone de imagem, "Alterar" (primary 98×40) e "Remover" (link) | — |
| Botão social | `Button variant="outline"` | Google e Facebook | 40 de altura |
| Footer | custom | 3 medalhões (W, C, D) + newsletter, faixa da marca e 4 colunas | 1200 × 610 |
| Toast | `Sonner` | **Não desenhado** (derivar: surface-card, borda e ícone) | — |
| Skeleton | `Skeleton` | **Não desenhado** (derivar: surface-card/raised com pulse) | — |
| Tooltip | `Tooltip` | Não desenhado. Útil em ícones sem rótulo | — |

---

## 4. Dados por tela (rótulos exatos)

Colunas: campo do contrato sugerido · rótulo exato no layout · exemplo do Figma · obs. "—" = sem rótulo visível.

### 4.1 Global (header e footer)

| Campo | Rótulo exato | Exemplo | Obs |
|---|---|---|---|
| nav[] | "Início" · "Mercado" · "Criadores" · "Aprenda" | Início ativo | Criadores e Aprenda estão fora do escopo |
| cart.count | — (badge) | "6" | Linhas ou unidades? (ver §9.3) |
| auth CTA | "Entrar" | — | O header logado não foi desenhado |
| footer.features[] | "Segurança da carteira" / "Criadores em destaque" / "Alertas de lançamentos" | "Proteja sua carteira e colecione arte digital verificada com confiança." · "Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede." · "Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado." | Medalhões com as letras W, C e D |
| newsletter.email | "Antecipe-se ao próximo lançamento" · placeholder "digite seu e-mail..." · botão "Enviar" | nota "Receba lançamentos selecionados, histórias de criadores e novidades do mercado." | Fora do escopo |
| contato | "Feito para colecionadores, criadores e cultura" | "contato@email.com" · "+55 11 4002 8922" | O href real é `mailto:contact@besa.com` |
| footer.links | "Meu perfil": Meu perfil, Minha coleção, Atividade, Estúdio do criador, Lista de interesse · "Central de ajuda": Central de ajuda, Como comprar NFTs, Carteira e segurança, Política do mercado, Denunciar item · "Coleções": Arte digital, Fotografia, Música, Arte 3D, Utilidade | — | As coleções podem virar filtros |
| social[] | "Redes sociais" | Facebook, Instagram, Twitter, LinkedIn, YouTube | Só ícones |
| wallets suportadas | "Carteiras compatíveis" | "METAMASK • WALLETCONNECT • COINBASE" | 9 px |
| copyright | — | "© 2026 Kurio. Propriedade digital para todos." | — |

### 4.2 Início

| Campo | Rótulo exato | Exemplo | Obs |
|---|---|---|---|
| hero.eyebrow / title / text / cta | "Bem-vindo à Kurio" · "SEJA DONO DO FUTURO / DA ARTE DIGITAL" · "EXPLORAR" | "Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet." | Mobile: "SEJA DONO DA / CULTURA DIGITAL", "Descubra NFTs selecionados de criadores do mundo todo.", "EXPLORAR →". Dots = carrossel de 3 |
| featured | "NFT EM DESTAQUE" · "OFERTA LIMITADA" | Arte sage-nomad | Só no desktop |
| filters.collections[] {id,label,count} | "Coleções" | Arte digital (33), Fotografia (12), Música (65), Arte 3D (39), Colecionáveis (23), Generativa (17), Jogos (19), Assinaturas (13), Utilidade (18) | Multi-seleção. Soma 239 |
| filters.price {min,max} | "Faixa de preço" · "Preço: 0,02 - 12,30 ETH" · "Aplicar" | 0.02–12.30 | 2 thumbs. Usa vírgula decimal |
| filters.networks[] {id,label,count} | "Rede" | Ethereum (119), Polygon (78), Solana (86) | Soma 283 ≠ 239 |
| tab | "Todos os NFTs" · "Novos lançamentos" · "Em alta" | Todos ativo | Na URL |
| sort | "Ordenar por:" | "Listados recentemente" | É a única opção desenhada; derivar as demais |
| search (q) | (mobile) placeholder "Explorar coleções" | — | Desktop: só o ícone no header |
| card.name + number | — | "Emerald Ape #042" | `name` + `#number` |
| card.priceEth | — | "1.19 ETH" | Accent |
| card.compareAtPriceEth? | — | "2.29 ETH" ao lado de "1.99 ETH" (Neon Vessel #552) | Secondary. Renderizar riscado |
| card.badges[]? | — | "RARO" | Só na Marketplace Page e no mobile |
| card.isFavorite | — (coração) | — | Mobile e hover |
| page / totalPages | — | 1 · 2 · 3 · 4 · › | Sem "anterior" |
| promos[] {title, text, cta} | "Lançamentos gênesis / de edição limitada" · "Arte digital selecionada / e muito mais" · "Explorar →" | "Colecione edições escassas diretamente dos criadores antes da revelação pública." · "Explore novos artistas, coleções verificadas e obras digitais que definem a cultura." | O CTA pode apontar ao catálogo |
| blog | "Diário da Cunhagem" | "Histórias, guias e insights para colecionadores sobre o universo da propriedade digital." | Fora do escopo |
| blog.posts[] {date, readTime, title, excerpt} | "Ler mais →" | "12 de setembro \| Leitura de 6 min" · "Como funciona a propriedade de NFTs" · "Aprenda a colecionar, negociar e verificar ativos digitais." · (13/set, 2 min) "10 artistas digitais para acompanhar" · (15/set, 3 min) "Raridade, atributos e procedência" · (15/set, 2 min) "Como proteger sua carteira" | Estático |

Itens da grade no Início:

| NFT | Preço |
|---|---|
| Emerald Ape #042 | 1.19 |
| Sage Nomad #009 | 1.69 |
| Neon Vessel #552 | 1.99 (de 2.29) |
| Cosmic Bloom #118 | 1.29 |
| Violet Nomad #314 | 1.39 |
| Ivory Baron #088 | 1.79 |
| Golden Beat #207 | 0.99 |
| (card sem texto) | — |
| Golden Signal #160 | 0.39 |

A Marketplace Page acrescenta **Golden Frequency #071 · 0.59**.

### 4.3 Detalhes do NFT

| Campo | Rótulo exato | Exemplo | Obs |
|---|---|---|---|
| breadcrumb | "Início / Mercado" | — | O desktop não mostra o nome do NFT |
| images[] | — | 4 thumbs + principal | Zoom e dots no mobile |
| name + number | — | "Emerald Ape #042" | — |
| priceEth | — | "1.19 ETH" | Desktop: 22 px. Mobile: buy bar |
| ratingAverage / ratingCount | "19 avaliações de colecionadores" (desktop) · "4.8" "(19)" (mobile) | 4 de 5 estrelas | — |
| description.short | "Sobre este NFT:" | "Um colecionável digital finalizado à mão da coleção Kurio Editions, verificado na Ethereum, com arte desbloqueável e acesso para colecionadores." | Mobile: "Um colecionável digital 1/50 finalizado à mão da coleção Kurio Editions, verificado na Ethereum." |
| editions[] {id,label,supply,available,priceEth?} | "Edição:" | 1/1 · 1/10 · **1/50** (selecionada) · ABERTA | Seleção única. Mobile duplica o 1/10 |
| quantity | (mobile) "Qtd." | 1 | Mín. 1, máx. pela disponibilidade |
| ações | "COMPRAR" · "Favoritar" | — | Mobile: "Comprar NFT" + botão de carrinho. O desktop não tem "Adicionar ao carrinho" separado |
| tokenId | "ID do token:" | "#0042" | — |
| collection | "Coleção:" | "Kurio Apes" | O texto longo fala em "Kurio Editions" |
| attributes[] | "Atributos:" | "Óculos, Esmeralda, Raro" | — |
| share | "Compartilhar este NFT:" | LinkedIn, e-mail, Twitter | Fora do escopo |
| tabs | "Detalhes do NFT" · "Avaliações de colecionadores (19)" | — | O conteúdo das avaliações não foi desenhado |
| description.long | — | 2 parágrafos ("…obra digital 1/50…", "Nova Sato recebe 5% de direitos autorais…") | creator = "Nova Sato" |
| network | "Rede:" | "Cunhado na Ethereum com procedência imutável e metadados armazenados no IPFS." | metadataStorage = IPFS |
| contract { address, standard } | "Contrato:" | "0x7A42...19E8 • Contrato inteligente ERC-721 verificado." | **No Figma aparece sob "Direitos autorais:"** (rótulos trocados) |
| royaltyPct | "Direitos autorais:" | "Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente pelos mercados compatíveis." | **No Figma aparece sob "Contrato:"** |
| related[] | "Mais desta coleção" | 5 cards (nome + preço) | Carrossel |

### 4.4 Carrinho

| Campo | Rótulo exato | Exemplo | Obs |
|---|---|---|---|
| breadcrumb | "Início / Mercado / Carrinho" | — | Mobile: "Carrinho de NFTs" + voltar |
| line.name / image | "NFTs" | "Emerald Ape #042" | — |
| line.tokenId | "ID do token:" | "#0042", "#0009", "#0552" | Diverge do pagamento |
| line.editionLabel | (mobile) "Edição:" | "1/50", "1/1", "1/10" | O desktop não mostra a edição |
| line.unitPriceEth | "Preço" | "1.19 ETH" | — |
| line.quantity | "Edições" (coluna do stepper) | 2 · 6 · 9 | — |
| line.totalEth | "Total" | "2.38 ETH" · "8.34 ETH" · "16.11 ETH" | — |
| remover | — (lixeira) | — | — |
| coupon.code | "Código promocional" · placeholder "Digite o código promocional..." · "Aplicar" | — | — |
| summary.subtotal | "Subtotal" | "26.83 ETH" | O mobile mostra "8.92 ETH", mas as linhas somam 8.14 |
| summary.discount | "Desconto do lançamento" | "(-) 00.00" | Sem unidade |
| summary.networkFee {amount, estimated} | "Taxa de rede" · "Taxa estimada" | "0.016 ETH" | — |
| summary.total | "Total" | "26.846 ETH" | — |
| CTAs | "Resumo da carteira" · "Conectar e finalizar" · "Continuar explorando" | — | — |
| related[] | "Colecionadores também viram" | 5 cards | — |

### 4.5 Pagamento

| Campo | Rótulo exato | Exemplo / placeholder | Obs |
|---|---|---|---|
| breadcrumb | "Início / Mercado / Pagamento" | — | — |
| collector.displayName | "Nome de exibição*" | — | Seção "Perfil do colecionador" |
| collector.username | "Nome de usuário*" | — | — |
| network | "Rede*" | "Selecione uma rede" | Select |
| profileName | "Nome do perfil*" | — | — |
| walletAddress | "Endereço da carteira*" | "Endereço 0x da carteira" | Validar 0x |
| ensOrSecondary? | — | "ENS ou carteira secundária (opcional)" | Sem label |
| walletType | "Tipo de carteira*" | "Selecione uma carteira" | Select |
| referralCode | "Código de indicação*" | — | Marcado obrigatório; tratar como opcional |
| email | "E-mail*" | — | — |
| ensName | "Nome ENS*" | ".eth" ▾ | — |
| useOtherWallet | "Usar outra carteira?" | radio | — |
| note? | "Observação do colecionador (opcional)" | textarea | — |
| order.items[] | "Seus NFTs" · "NFTs" · "Subtotal" | "Emerald Ape #042", "ID do token: #0042", "(x 2)", "2.38 ETH" | IDs #0314 e #0088 |
| coupon | "Tem um código promocional? Aplique aqui" | — | Link |
| totals | "Subtotal" · "Desconto do lançamento" · "Taxa de rede" · "Taxa estimada" · "Total" | 26.83 · (-) 00.00 · 0.016 · 26.846 ETH | — |
| wallet provider | "Carteira e rede" | [chip METAMASK • WALLETCONNECT • COINBASE] · "MetaMask" · "Coinbase Wallet" (selecionada) | Mobile: WalletConnect, MetaMask, Coinbase Wallet |
| savedWallets[] {label, addressOrEns, network} | (mobile) "Carteira conectada" · "Trocar carteira" | "Reserva" nova.kurio.eth, "Rede Polygon" (selecionada) · "Principal" 0xA91F…E82C, "Rede principal Ethereum" | Menu ⋮ |
| submit | "Confirmar compra" | Mobile: "Total: 8.936 ETH" | O mobile **não tem** o formulário de dados |

### 4.6 Confirmação

| Campo | Rótulo exato | Exemplo | Obs |
|---|---|---|---|
| status / título | — | "Seus NFTs agora estão na sua carteira" + ilustração "THANK YOU" | Estado de sucesso; pendente e recusado precisam ser derivados |
| txHash | "ID da transação" | "0xA91F…E82C" | Truncado |
| createdAt | "Data" | "29 Jul, 2026" | Formato EN |
| total | "Total" | "26.846 ETH" | — |
| wallet | "Carteira" | "MetaMask" | — |
| items[] | "Detalhes da transação" · "NFTs" · "Edições" · "Subtotal" | "(x 2)" "2.38 ETH" | — |
| networkFee / total | "Taxa de rede" · "Total" | "0.016 ETH" · "26.846 ETH" | Não mostra desconto |
| mensagem | — | "Transação confirmada na Ethereum. A propriedade foi transferida para sua carteira conectada e registrada na rede." | Varia por rede e status |
| explorerUrl | "Ver no Etherscan" | — | Externo (simulado) |

### 4.7 Login e cadastro

| Campo | Rótulo exato | Exemplo / placeholder | Obs |
|---|---|---|---|
| tabs | "Entrar" \| "Criar conta" | — | Só no desktop |
| subtítulo login | — | "Entre para gerenciar sua carteira, coleção e perfil de criador." | — |
| email | — | "contato@email.com" | Sem label visível |
| password | — | "***********" (com olho) | Input focado |
| forgot | "Esqueceu a senha?" | — | Fora do escopo |
| submit login | "Entrar" | — | — |
| social | "Ou continue com" · "Continuar com Google" · "Continuar com Facebook" | — | Fora do escopo |
| link de troca (mobile) | "Novo na Kurio? Crie uma conta" · "Já tem uma conta? Entre" | — | — |
| subtítulo cadastro | — | "Crie seu perfil de colecionador e conecte uma carteira quando quiser." | Título mobile: "Criar perfil de colecionador" |
| username | — | "Nome de usuário" | — |
| email (cadastro) | — | "Digite seu e-mail" | — |
| password / confirmPassword | — | "Senha" · "Confirmar senha" | — |
| submit cadastro | "Criar conta" (desktop) · "Criar perfil" (mobile) | — | — |

### 4.8 Perfil do colecionador

| Campo | Rótulo exato | Exemplo | Obs |
|---|---|---|---|
| sidebar | "Meu perfil": "Dados do perfil" · "Carteiras" · "Atividade" · "Lista de interesse" · "Ofertas" · "Arquivos baixados" · "Suporte" · "Sair" | Dados do perfil ativo | Atividade, Ofertas, Arquivos e Suporte estão fora do escopo |
| displayName | "Nome de exibição*" | — | Seção "Perfil do colecionador" |
| username | "Nome de usuário*" | — | — |
| email | "E-mail*" | — | — |
| ensName | "Nome ENS*" | ".eth" ▾ + input | — |
| walletAlias | "Apelido da carteira*" | — | — |
| avatarUrl | "Avatar" · "Alterar" · "Remover" | Placeholder com ícone | Upload |
| currentPassword / newPassword / confirmNewPassword | "Alterar senha": "Senha atual" · "Nova senha" · "Confirmar nova senha" | — | Toggle de visibilidade |
| submit | "Salvar" | — | — |

### 4.9 Carteiras

| Campo | Rótulo exato | Exemplo | Obs |
|---|---|---|---|
| seção principal | "Carteira principal" · "Adicionar" | "Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados." | — |
| displayName | "Nome de exibição*" | — | — |
| alias | "Apelido da carteira*" | — | — |
| network | "Rede*" | "Selecione uma rede" | — |
| profileName | "Nome do perfil*" | — | — |
| address | "Endereço da carteira*" | "Endereço 0x da carteira" | — |
| ensOrSecondary? | — | "ENS ou carteira secundária (opcional)" | — |
| walletType | "Tipo de carteira*" | "Selecione uma carteira" | — |
| referralCode | "Código de indicação*" | — | — |
| email | "E-mail*" | — | — |
| ensName | "Nome ENS*" | ".eth" ▾ + input | — |
| submit | "Salvar carteira" | — | — |
| secundária | "Carteira secundária" · "Igual à carteira principal" (radio) · "Adicionar" | vazio: "Você ainda não adicionou uma carteira secundária." | role = 'secondary', sameAsPrimary |


---

## 5. Interações visíveis

| Elemento | Sugere |
|---|---|
| Nav Início/Mercado | Rotas. O item ativo é destacado |
| Ícone de busca (header) / "Explorar coleções" (mobile) | Abrir campo de busca no catálogo (estado na URL) |
| Ícone do carrinho + badge | Ir ao carrinho e mostrar a contagem total de itens |
| "Entrar" | Abrir o modal de login (desktop) ou a tela de login (mobile) |
| EXPLORAR / Explorar → | Rolar até o catálogo ou abrir o Mercado |
| Dots do hero e dos relacionados | Carrossel |
| Filtro de coleção/rede | Alternar (multi-seleção combinável), ativo em accent |
| Range + "Aplicar" | Aplicar a faixa de preço |
| Tabs do catálogo / "Ordenar por" | Mudar o conjunto e a ordenação (URL) |
| Card de NFT | Ir ao detalhe. Hover: adicionar ao carrinho, favoritar e quick view |
| Paginação | Mudar de página (URL) |
| Thumbs da galeria / zoom | Trocar a imagem principal / ampliar |
| Chips de edição | Seleção única. Afetam preço e disponibilidade |
| Stepper − / + | Quantidade (mín. 1, máx. pela disponibilidade). O − fica desabilitado em 1 (mobile) |
| COMPRAR / Comprar NFT | Adicionar e ir ao carrinho/checkout |
| Botão de carrinho (mobile detalhe) | Adicionar ao carrinho sem sair |
| Favoritar / corações | Alternar favorito (exige autenticação) |
| Compartilhar (LinkedIn, mail, Twitter) | Links externos de compartilhamento |
| Tabs Detalhes/Avaliações | Alternar painel |
| Lixeira | Remover linha |
| "Aplicar" (cupom) | Validar o cupom e atualizar o desconto |
| "Conectar e finalizar" | Ir ao pagamento (pede login se necessário) |
| "Continuar explorando" | Voltar ao catálogo |
| Radios de carteira / "Usar outra carteira?" / "Trocar carteira" / ⋮ | Escolher carteira e rede, alternar para outra carteira, menu de editar/remover |
| "Confirmar compra" | Criar o pedido e abrir a confirmação |
| "Ver no Etherscan" | Link externo (simulado) |
| X dos modais | Fechar |
| Tabs "Entrar \| Criar conta" | Alternar entre os modais |
| Olho | Mostrar/ocultar senha |
| Sidebar da conta | Navegar entre Perfil e Carteiras. Sair faz logout |
| Alterar/Remover avatar, Salvar, Salvar carteira, Adicionar | Formulários |

---

## 6. Fora do escopo visível no layout

Esses itens aparecem no layout mas não fazem parte da entrega. Pela regra "não aparentar sucesso", devem ser desabilitados, mostrar "em breve" ou usar link externo coerente, **nunca** um toast de sucesso falso.

| Local | Itens |
|---|---|
| Header | Nav "Criadores" e "Aprenda" |
| Início | Bloco "Diário da Cunhagem" (4 posts + "Ler mais →"). Promos "Explorar →" (podem apontar ao catálogo filtrado). FAB de scan na Tab Bar mobile |
| Detalhe | Compartilhar (LinkedIn/e-mail/Twitter), conteúdo da tab "Avaliações" (não desenhado), "Ver no Etherscan" (link externo simulado) |
| Pagamento | "Código de indicação", "Nome ENS"/ENS secundária (sem resolução real) |
| Auth | "Esqueceu a senha?", "Continuar com Google" e "Continuar com Facebook" |
| Sidebar da conta | Atividade, Lista de interesse (pode reutilizar favoritos), Ofertas, Arquivos baixados, Suporte |
| Footer | Medalhões (Segurança da carteira, Criadores em destaque, Alertas de lançamentos), newsletter ("Enviar"), contato (e-mail/telefone), todas as colunas (Meu perfil: Minha coleção, Atividade, Estúdio do criador, Lista de interesse; Central de ajuda: Central de ajuda, Como comprar NFTs, Carteira e segurança, Política do mercado, Denunciar item; Coleções: as 5 podem virar filtros), redes sociais (5) e chip de carteiras compatíveis (informativo) |

---

## 7. Estados não desenhados a derivar

| Estado | Onde | Sugestão visual |
|---|---|---|
| Loading / skeleton | Catálogo, detalhe, carrinho, perfil, carteiras, confirmação | `Skeleton` surface-card/raised com as mesmas dimensões do card (258×300 desktop, 175×200 mobile) |
| Refetch em segundo plano | Catálogo | Indicador discreto (barra de 2 px primary ou spinner no toolbar) |
| Vazio | Busca/filtros sem resultado, carrinho vazio, sem favoritos | Texto secondary + CTA "Continuar explorando" (existe o padrão "Você ainda não adicionou…") |
| Erro de rede / 4xx / 5xx | Todas as consultas | Bloco surface-card com mensagem e "Tentar novamente". Cor coral |
| 404 | NFT inexistente, rota inválida | Página no padrão com breadcrumb e voltar ao Mercado |
| Esgotado / edição indisponível | Chip de edição, card, stepper, COMPRAR | Chip com opacidade e risco, botão desabilitado, badge "ESGOTADO" no estilo do RARO |
| Limite de quantidade | Stepper | + desabilitado e texto auxiliar |
| Desabilitado | Botões e inputs | Opacidade de 50% e `cursor-not-allowed`. Para o − desabilitado, seguir o mobile (border-soft) |
| Foco | Todos os interativos | O único foco desenhado é a borda primary no input. Derivar um `ring` primary de 2 px com offset ink |
| Hover | Botões, links, cards | Card: usar o desenho da Marketplace Page. Botão: primary um pouco mais claro (accent) |
| Validação de formulário | Login, cadastro, perfil, carteiras, pagamento | Borda coral + mensagem de 12–13 px coral abaixo do campo + `aria-invalid` |
| Conflito no cadastro (e-mail/usuário em uso) | Cadastro | Erro no campo |
| Cupom inválido/expirado | Carrinho | Mensagem sob o input do cupom |
| Preço alterado / esgotado na compra | Pagamento | Alerta no topo da coluna "Seus NFTs" |
| Pendente / recusado / timeout do pedido | Confirmação | Variar ícone e título ("Transação pendente…" / "Pagamento recusado") e mostrar o status |
| Sessão expirada / não autorizado | Global | Abrir o modal de login com retorno ao fluxo |
| Header logado | Global | Trocar "Entrar" por avatar/menu (Perfil, Carteiras, Sair). **Perfil e Carteiras ainda mostram "Entrar"** no Figma |
| Favorito ativo | Corações | Coração preenchido primary (o desenho só mostra contorno ou fill fixo) |
| Toasts | Adicionar ao carrinho, salvar | `Sonner` em surface-card com borda primary |
| Scrim de modal | Login/Cadastro | O BG `9:945` não tem fill. Usar overlay ink a 70–80% (a Confirmação usa ink opaco) |
| Tablet (768) | Todas | Grade de 2 colunas, sidebar em `Sheet` |

---

## 8. Idioma

- **Todo o texto renderizado está em PT-BR.** Os nomes de layers em inglês (ex.: "OWN THE FUTURE OF DIGITAL ART", "Discover curated NFTs…") **não são** o texto renderizado.
- Textos e formatos em EN ou fora do padrão pt-BR:

| Texto | Onde | Observação |
|---|---|---|
| "THANK YOU" | Ilustração da Confirmação (embutido no SVG) | Não é traduzível. Manter com `alt` "Obrigado" ou trocar o asset |
| "29 Jul, 2026" | Confirmação, Data | Formato de data inglês. Em pt-BR seria "29 de jul. de 2026" |
| "insights" | Subtítulo do blog | Anglicismo |
| "Ver no Etherscan", "MetaMask", "WalletConnect", "Coinbase Wallet", "ENS", "ERC-721", "IPFS", "ETH" | Vários | Nomes próprios e técnicos |
| "0,02 - 12,30 ETH" com vírgula, contra "1.19 ETH" com ponto | Filtro de preço e preços | Separador decimal inconsistente. Padronizar via `Intl.NumberFormat` por idioma |
| "(-) 00.00" | Desconto | Sem unidade e com formato estranho |

---

## 9. Riscos de a11y e inconsistências de conteúdo

### 9.1 Contraste (WCAG 2.x, calculado)

| Par | Razão | Resultado |
|---|---|---|
| foreground `#F5F1EB` / ink | 17.10 | AAA |
| text-secondary `#CFB28C` / ink · surface-card | 9.53 · 8.68 | AAA |
| text-accent `#E89B55` / ink · surface-card | 8.47 · 7.72 | AAA |
| primary `#D28A4C` / ink · surface-card | 6.85 · 6.24 | AA |
| secondary `#B39463` / ink · surface-card · surface-dark | 6.72 · 6.12 · 5.22 | AA (placeholders ok) |
| coral `#F0805F` / ink | 7.29 | AA |
| ink / primary (botões) | 6.85 | AA |
| **foreground / primary** ("Aplicar" mobile na ponta sólida do gradiente) | **2.50** | **Falha**. No início do gradiente, sobre `#825531`, chega a 5.67. Usar texto ink |
| ink / fim do CTA pill (primary a 80% sobre ink) | 4.75 | AA, no limite |
| **border `#3F2319` / ink · surface-card** (contorno de inputs, paginação, chips inativos, botões sociais) | **1.34 · 1.22** | **Falha 1.4.11** (o mínimo é 3:1 para limite de componente) |
| **border-soft `#55321F` / ink** (olho da senha mobile, radio inativo, − desabilitado) | **1.71** | **Falha** para ícone informativo |
| Linha de risco do preço antigo (`border` sobre surface-card) | 1.22 | Invisível. Usar `text-decoration` na cor do texto |

### 9.2 Outros riscos

- **Texto pequeno:** chip de carteiras com 9 px bold e badge do carrinho com 10 px (ink sobre primary, 6.85). "Taxa estimada" e meta do blog com 12 px.
- **Estado só por cor:**
  - Filtro ativo (accent × secondary, sem checkbox).
  - Tab ativa (cor + sublinhado, ok).
  - Página da sidebar (todos os itens em accent, ativo só pela borda esquerda).
  - Chip de edição selecionado (borda e texto).
  - Opção de carteira selecionada (radio + borda, ok).
  - Usar `aria-pressed`, `aria-current` ou `aria-checked`.
- **Ícones sem rótulo:** busca, carrinho, favoritar, zoom, lixeira, X, olho, compartilhar, redes, ⋮, filtro e Tab Bar. Todos precisam de `aria-label`.
- **Placeholder como label** nos modais de auth e no mobile (não há `<label>` visível). Mesmo caso nos inputs "ENS ou carteira secundária".
- **Asterisco coral** sem legenda "* obrigatório".
- **Alvos de toque pequenos:**
  - Stepper do carrinho de 20×30 e mobile de 24.
  - Chips de 28 de altura.
  - Ícones de compartilhar de 15 px.
- **Foco não desenhado.**
- **Modal de login sem scrim:** a página de fundo fica legível e concorre com o modal.

### 9.3 Inconsistências de conteúdo no Figma (não copiar para contratos)

1. No detalhe, **"Contrato:"** vem seguido do texto de royalties e **"Direitos autorais:"** do endereço "0x7A42...19E8 • Contrato inteligente ERC-721 verificado". Os rótulos estão trocados.
2. Os token IDs divergem entre telas: Violet Nomad aparece como "#0009" no carrinho e "#0314" no pagamento e na confirmação; Ivory Baron como "#0552" e "#0088".
3. No carrinho mobile, as linhas somam 1.19 + 1.39 + 3.58 + 1.98 = **8.14**, mas o Subtotal mostra **8.92**. O desktop fecha certo (2.38 + 8.34 + 16.11 = 26.83; total 26.846).
4. O badge do header mostra "6", mas o carrinho tem 3 linhas e 17 unidades. Definir se o badge conta linhas ou unidades.
5. As edições no mobile aparecem como "1/10, 1/10, 1/50, ABERTA" (1/10 duplicado). O canônico é o desktop: 1/1, 1/10, 1/50, ABERTA.
6. Preço no mobile: o carrinho mobile mostra um único preço por linha (o total da linha); o desktop mostra preço unitário e total.
7. "(-) 00.00" sem unidade.
8. "Código de indicação" e "Nome ENS" aparecem como obrigatórios, o que não faz sentido para o negócio. Tratar como opcionais.
9. O footer exibe "contato@email.com", mas o link é `mailto:contact@besa.com`.
10. A nota do componente Marketplace Page registra defeitos conhecidos: o rótulo "2.29 ETH" está órfão e o chip RARO tem canto quadrado sobre o card arredondado.
11. Só existem **4 artes** (1254×1254) para todos os NFTs. Várias peças compartilham imagem (ex.: Sage Nomad, Cosmic Bloom e Violet Nomad).
12. O hero desktop usa "Rectangle 3" com SVG vazio: o fundo é só ink.

---

## 10. Assets

Os assets estão em `design-src/assets/` e foram deduplicados por SHA-256: são 129 arquivos únicos, e 6 duplicatas foram eliminadas. Nenhuma URL do Figma permanece.

- Arquivos com prefixo `deco-` são linhas, contornos e pontos que devem virar **CSS**. Foram mantidos só como referência.
- O logo Google (7 partes) e o ícone de scan da Tab Bar (5 partes) vieram fatiados. O export do nó inteiro trouxe o fundo do frame junto e foi descartado. Monte as partes como no código de referência ou use um SVG oficial equivalente.

### 10.1 Arte dos NFTs × produtos

| Arquivo | Produtos que usam |
|---|---|
| `nft-emerald-ape.png` | Emerald Ape #042 (todas as telas), hero desktop e mobile, promo gênesis, blog 2 |
| `nft-sage-nomad.png` | Sage Nomad #009, Cosmic Bloom #118, Violet Nomad #314, NFT em destaque, blog 3 |
| `nft-ivory-baron.png` | Neon Vessel #552, Ivory Baron #088, promo curadoria, blog 1 |
| `nft-golden-beat.png` | Golden Beat #207, Golden Signal #160, blog 4 |

**Peso:** cada PNG tem cerca de 1.9 a 2.1 MB (1254×1254) e é exibido com no máximo 450 px. Gerar WebP/AVIF com `srcset` (≈250/450/900 px) antes do Lighthouse. Os originais foram mantidos.

A Marketplace Page (fundo dos modais de auth) embaralha arte e nome; por exemplo, "Emerald Ape" aparece com a arte golden-beat. **Mapeamento canônico:** Início, Detalhe e Carrinho. Os dados mock devem ter imagem por NFT, mesmo que repetida.

### 10.2 Tabela completa

| Arquivo | Uso | Dimensões (px) |
|---|---|---|
| `nft-emerald-ape.png` | Arte NFT (macaco jaqueta verde/óculos): Emerald Ape #042 (todas as telas), hero Início, promo Gênesis, blog card 2, Neon Vessel na grade do Marketplace Page | 1254×1254 |
| `nft-golden-beat.png` | Arte NFT (macaco laranja com fones): Golden Beat #207, Golden Signal #160, grade linha 3, blog card 4 | 1254×1254 |
| `nft-ivory-baron.png` | Arte NFT (gorila preto blazer bege): Neon Vessel #552, Ivory Baron #088, promo Curadoria, blog card 1 | 1254×1254 |
| `nft-sage-nomad.png` | Arte NFT (gorila chapéu bucket/moletom roxo): Sage Nomad #009, Cosmic Bloom #118, Violet Nomad #314, NFT em destaque, blog card 3 | 1254×1254 |
| `button-favorite-mobile-alt.svg` | Mobile Início: botão favoritar no card P-2/P-4 | 28×28 |
| `button-favorite-mobile.svg` | Mobile Início: botão favoritar no card P-1 | 28×28 |
| `button-zoom.svg` | Detalhe: botão circular de zoom/lupa sobre a imagem principal | 30×30 |
| `icon-activity.svg` | Sidebar da conta: Ofertas | 15.8547×15.9022 |
| `icon-arrow-left-secondary.svg` | Mobile Detalhe: voltar | 13.1669×7.33345 |
| `icon-arrow-left.svg` | Mobile Carrinho/Pagamento: voltar | 13.1669×7.33345 |
| `icon-arrow-right-sm.svg` | Mobile Início: EXPLORAR → | 9.53296×11.5 |
| `icon-arrow-right.svg` | Promos: botão Explorar → | 10.537×12.75 |
| `icon-cart-add-foreground.svg` | Marketplace Page: ação hover adicionar ao carrinho | 20×20 |
| `icon-cart.svg` | Header desktop: carrinho | 24.0042×24 |
| `icon-chevron-down-foreground-18.svg` | Pagamento: select ".eth" | 18×18 |
| `icon-chevron-down-foreground-20.svg` | Perfil/Carteiras: select ".eth" | 20×20 |
| `icon-chevron-down-secondary-18.svg` | Pagamento: selects Rede/Tipo de carteira | 18×18 |
| `icon-chevron-down-secondary-20.svg` | Carteiras: selects Rede/Tipo de carteira | 20×20 |
| `icon-chevron-down-sm.svg` | Início: "Ordenar por" (Two-tone Arrow Down 2) | 10.8333×6.16667 |
| `icon-chevron-right.svg` | Paginação: próxima página | 12.0002×6.75012 |
| `icon-close-18.svg` | Modais Entrar/Criar conta: fechar | 18×18 |
| `icon-close.svg` | Confirmação: fechar modal | 18×17.3451 |
| `icon-danger-triangle.svg` | Sidebar da conta: Suporte | 15.7499×15 |
| `icon-delete-primary.svg` | Mobile Carrinho: remover item | 17.6505×19.9838 |
| `icon-delete.svg` | Carrinho desktop: remover item | 17.6505×19.9838 |
| `icon-download.svg` | Sidebar da conta: Arquivos baixados | 15.375×15.4565 |
| `icon-eye-off-light.svg` | Perfil: campos de senha (Light-Outline Hide) | 16.6667×14.3942 |
| `icon-eye-off-soft.svg` | Mobile auth: ocultar senha (border-soft, baixo contraste) | 15.3823×13.3305 |
| `icon-eye-off.svg` | Modais auth desktop: mostrar/ocultar senha | 18.9814×14.645 |
| `icon-filter.svg` | Mobile Início: botão de filtro | 16.1463×16.1066 |
| `icon-heart-accent.svg` | Mobile Detalhe: favoritar (topo) | 16×14.2349 |
| `icon-heart-foreground.svg` | Marketplace Page: ação hover favoritar no card | 20×20 |
| `icon-heart-primary.svg` | Detalhe: botão Favoritar | 20×20 |
| `icon-heart-secondary.svg` | Sidebar da conta: Lista de interesse | 16×16 |
| `icon-heart-tabbar.svg` | Mobile Tab Bar: favoritos | 20×17.7936 |
| `icon-home-tabbar.svg` | Mobile Tab Bar: início (ativo) | 15.8333×16.6668 |
| `icon-image.svg` | Perfil: placeholder do avatar | 20×20 |
| `icon-location-accent.svg` | Sidebar da conta: Carteiras (ativo) | 13.7497×16.2502 |
| `icon-location-secondary.svg` | Sidebar da conta: Carteiras (inativo) | 13.7497×16.2502 |
| `icon-login-ink.svg` | Header: ícone do botão Entrar (Iconly Logout, cor ink) | 17.7779×16.9167 |
| `icon-logout-accent.svg` | Sidebar da conta: Sair | 17.7779×16.9167 |
| `icon-minus-alt.svg` | Mobile Detalhe: stepper − (16px) | 16×16 |
| `icon-minus-lg.svg` | Detalhe desktop: stepper − (26.4px, preto) | 26.4×26.4 |
| `icon-minus.svg` | Carrinho desktop: stepper − (16px) | 16×16 |
| `icon-more-vertical.svg` | Mobile Pagamento: menu ⋮ do card de carteira | 3×15 |
| `icon-plus-lg.svg` | Detalhe desktop: stepper + (26.4px) | 26.4×26.4 |
| `icon-plus.svg` | Carrinho/mobile detalhe: stepper + (16px) | 16×16 |
| `icon-quick-view.svg` | Marketplace Page: ação hover visualizar (lupa) | 19.9913×20 |
| `icon-radio-coinbase-selected.svg` | Pagamento: radio selecionado + marca da opção Coinbase Wallet (39x16) | 39×16 |
| `icon-scan-part-1.svg` | Mobile Tab Bar: ícone de scan no FAB (5 partes; montar como no código) | 26.8227×1.78827 |
| `icon-scan-part-2.svg` | Mobile Tab Bar: ícone de scan | 10.3456×10.3127 |
| `icon-scan-part-3.svg` | Mobile Tab Bar: ícone de scan | 10.3856×10.2993 |
| `icon-scan-part-4.svg` | Mobile Tab Bar: ícone de scan | 10.3167×10.2514 |
| `icon-scan-part-5.svg` | Mobile Tab Bar: ícone de scan | 10.39×10.3063 |
| `icon-search-mobile.svg` | Mobile Início: barra de busca | 22×22 |
| `icon-search.svg` | Header desktop: busca | 20.0009×20 |
| `icon-share-linkedin.svg` | Detalhe: compartilhar LinkedIn | 15×14.375 |
| `icon-share-mail.svg` | Detalhe: compartilhar por e-mail | 18×18 |
| `icon-share-twitter.svg` | Detalhe: compartilhar Twitter/X | 15.9657×12.1908 |
| `icon-shop-secondary.svg` | Mobile Detalhe: botão adicionar ao carrinho | 20×20 |
| `icon-shop-tabbar.svg` | Mobile Tab Bar: carrinho | 20×20 |
| `icon-shopping-secondary.svg` | Sidebar da conta: Atividade | 18×18 |
| `icon-star-amber.svg` | Mobile Detalhe: estrela do selo 4.8 (amber #E3A44E) | 11.6682×11.0843 |
| `icon-star-filled.svg` | Detalhe: estrela preenchida (primary) | 12.5017×11.8758 |
| `icon-star-muted.svg` | Detalhe: 5ª estrela (text-secondary = parcial/vazia) | 12.5017×11.8758 |
| `icon-user-primary.svg` | Sidebar da conta: Dados do perfil (ativo no Perfil) | 18×18 |
| `icon-user-secondary.svg` | Sidebar da conta: Dados do perfil (inativo, Carteiras) | 18×18 |
| `icon-user-tabbar.svg` | Mobile Tab Bar: perfil | 20×20 |
| `icon-wallet.svg` | Mobile Pagamento: opção Coinbase Wallet | 20.101×18.5781 |
| `illustration-thank-you.svg` | Confirmação: envelope "THANK YOU" (texto EN embutido) | 65.1639×80 |
| `logo-facebook.svg` | Botão Continuar com Facebook | 20×20 |
| `logo-google-part-1.svg` | Botão Google: parte do logo (7 partes, montar como no código; não redesenhar) | 15.0117×8.46484 |
| `logo-google-part-2.svg` | Botão Google: parte do logo | 6.43358×5.73436 |
| `logo-google-part-3.svg` | Botão Google: parte do logo | 4.94922×10.125 |
| `logo-google-part-4.svg` | Botão Google: parte do logo | 10.5859×9.94921 |
| `logo-google-part-5.svg` | Botão Google: parte do logo | 10×9.94921 |
| `logo-google-part-6.svg` | Botão Google: parte do logo | 15.1771×8.46484 |
| `logo-google-part-7.svg` | Botão Google: parte do logo | 6.59891×5.89858 |
| `social-facebook.svg` | Footer: Redes sociais | 32×32 |
| `social-instagram.svg` | Footer: Redes sociais | 32×32 |
| `social-linkedin.svg` | Footer: Redes sociais | 32×32 |
| `social-twitter.svg` | Footer: Redes sociais | 32×32 |
| `social-youtube.svg` | Footer: Redes sociais | 32×32 |
| `deco-back-button-bg.svg` | Mobile Carrinho/Pagamento: círculo do botão voltar (CSS) | 35×35 |
| `deco-cart-badge.svg` | Header: círculo do contador do carrinho (substituir por CSS) | 20×20 |
| `deco-chip-edition-36.svg` | Detalhe: contorno chip edição 1/1 (CSS border-radius) | 36×28 |
| `deco-chip-edition-42.svg` | Detalhe: contorno chip edição 1/10 (CSS) | 42×28 |
| `deco-chip-edition-46-active.svg` | Detalhe: contorno chip edição 1/50 selecionado (primary) (CSS) | 46×28 |
| `deco-chip-edition-66.svg` | Detalhe: contorno chip ABERTA (CSS) | 66×28 |
| `deco-divider-110.svg` | Mobile auth: linha "Ou continue com" (CSS) | 110×1 |
| `deco-divider-1200-header.svg` | Linha sob o header (CSS border) | 1200×0.3 |
| `deco-divider-1200.svg` | Divisórias de seção 1200px (CSS border) | 1200×0.3 |
| `deco-divider-179-left.svg` | Modais auth: linha "Ou continue com" esquerda (CSS) | 179×1 |
| `deco-divider-179-right.svg` | Modais auth: linha "Ou continue com" direita (CSS) | 179×1 |
| `deco-divider-310.svg` | Sidebar da conta: linha antes de Sair (CSS) | 310×0.3 |
| `deco-divider-332.svg` | Carrinho: linha sob "Resumo da carteira" (CSS) | 332×0.3 |
| `deco-divider-405-a.svg` | Pagamento: linha sob NFTs/Subtotal (CSS) | 405×0.3 |
| `deco-divider-405-b.svg` | Pagamento: linha antes do Total (CSS) | 405×0.3 |
| `deco-divider-490.svg` | Confirmação: linhas da tabela (CSS) | 490×0.3 |
| `deco-divider-573.svg` | Detalhe: linha sob título/preço (CSS) | 573×0.3 |
| `deco-divider-782.svg` | Carrinho: linha sob cabeçalho da tabela (CSS) | 782×0.3 |
| `deco-divider-vertical-31.svg` | Confirmação: separadores verticais da meta (CSS) | 31×1 |
| `deco-dots-carousel.svg` | Relacionados: indicador do carrossel (2º ativo) | 52×12 |
| `deco-dots-gallery-mobile.svg` | Mobile Detalhe: indicador da galeria (1 ativo pill) | 56×7 |
| `deco-dots-hero-mobile.svg` | Mobile Início: indicador do banner | 33×7 |
| `deco-dots-hero.svg` | Início: indicador do carrossel do hero (3 pontos) | 40×8 |
| `deco-hero-bg-empty.svg` | Início: "Rectangle 3" fundo do hero — SVG VAZIO (grupo sem conteúdo); fundo = ink | 32×32 |
| `deco-mobile-hero-mask.svg` | Mobile Início: formas decorativas do banner | 366×190 |
| `deco-nav-underline-58.svg` | Header: sublinhado do item ativo "Início" (CSS) | 58×3 |
| `deco-nav-underline-68.svg` | Header: sublinhado do item ativo "Mercado" (CSS) | 68×3 |
| `deco-promo-mask.svg` | Promos: curvas decorativas sobre o card (máscara) | 586×250 |
| `deco-radio-off-15.svg` | Pagamento: "Usar outra carteira?" (RadioGroup/Checkbox) | 15×15 |
| `deco-radio-off-16-primary.svg` | Pagamento: opções de carteira (RadioGroup) | 16×16 |
| `deco-radio-off-16-soft.svg` | Mobile Pagamento: radio não selecionado (border-soft) | 16×16 |
| `deco-radio-off-16.svg` | Carteiras: "Igual à carteira principal" | 16×16 |
| `deco-radio-on-16.svg` | Mobile Pagamento: radio selecionado | 16×16 |
| `deco-slider-range-161.svg` | Filtros: trilho ativo do range de preço (Slider) | 161×4 |
| `deco-slider-thumb.svg` | Filtros: thumb do range de preço (Slider) | 21×21 |
| `deco-slider-track-55.svg` | Filtros: trilho restante do range (Slider) | 55×4 |
| `deco-stepper-minus-disabled.svg` | Mobile Carrinho: botão − desabilitado (qtd 1) | 24×24 |
| `deco-stepper-minus.svg` | Mobile Carrinho: botão − habilitado | 24×24 |
| `deco-strike-65.svg` | Marketplace Page: linha de "preço antigo riscado" 2.29 ETH (usar text-decoration) | 65×1 |
| `deco-tab-underline-101.svg` | Início: sublinhado tab "Todos os NFTs" (CSS) | 101×2 |
| `deco-tab-underline-104.svg` | Marketplace Page (fundo auth): sublinhado tab (CSS) | 104×2 |
| `deco-tab-underline-110.svg` | Mobile Início: sublinhado tab (CSS) | 110×2 |
| `deco-tab-underline-161.svg` | Detalhe: sublinhado da tab "Detalhes do NFT" (CSS) | 161×3 |
| `deco-tabbar-bg.svg` | Mobile Tab Bar: fundo com recorte | 474×154.95 |
| `deco-tabbar-fab.svg` | Mobile Tab Bar: botão central (gradiente) | 65×65 |
| `deco-wallet-option-circle.svg` | Mobile Pagamento: círculo do ícone da opção (CSS) | 40×40 |
