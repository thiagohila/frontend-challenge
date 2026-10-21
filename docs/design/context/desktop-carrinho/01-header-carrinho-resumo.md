# Desktop / Carrinho (11:1278) — tabela + Resumo da carteira

- Figma: file `uweCCvGGvM7N1rQTFUjwQ3`, node `70371:250`
- Screenshot de referência: `docs/design/frames/desktop-carrinho.png`
- Fonte: `get_design_context` (React+Tailwind de referência; **não é código final** — adaptar ao projeto). Assets já baixados em `design-src/assets/`.

## Código de referência

```tsx
const assetDir = "/design-src/assets"; // assets locais (URLs temporárias do Figma substituídas)
const imgNftCartArtwork6 = `${assetDir}/nft-emerald-ape.png`;
const imgNftCartArtwork7 = `${assetDir}/nft-sage-nomad.png`;
const imgNftCartArtwork8 = `${assetDir}/nft-ivory-baron.png`;
const imgActiveUnderline = `${assetDir}/deco-nav-underline-68.svg`;
const imgSearchIcon = `${assetDir}/icon-search.svg`;
const imgCartIcon = `${assetDir}/icon-cart.svg`;
const imgBadge = `${assetDir}/deco-cart-badge.svg`;
const imgLogout = `${assetDir}/icon-login-ink.svg`;
const imgLine2 = `${assetDir}/deco-divider-782.svg`;
const imgFrame = `${assetDir}/icon-minus.svg`;
const imgFrame1 = `${assetDir}/icon-plus.svg`;
const imgDelete = `${assetDir}/icon-delete.svg`;
const imgLine3 = `${assetDir}/deco-divider-332.svg`;

export default function Top() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative size-full" data-node-id="70371:250" data-name="Top">
      <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="70488:651" data-name="Header Row">
        <div className="h-[34.3px] overflow-clip relative shrink-0 w-[160px]" data-node-id="I70488:651;70486:535" data-name="Logo">
          <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[normal] left-0 text-[14px] text-[color:var(--color\/foreground,#f5f1eb)] top-[8.15px] tracking-[1.4px] whitespace-nowrap" data-node-id="I70488:651;70486:536">
            KURIO
          </p>
        </div>
        <div className="content-stretch flex gap-[40px] items-start overflow-clip relative shrink-0" data-node-id="I70488:651;70486:537" data-name="Nav">
          <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="I70488:651;70486:538">
            Início
          </p>
          <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0" data-node-id="I70488:651;70486:539" data-name="Nav Item">
            <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[normal] relative shrink-0 text-[16px] text-[color:var(--color\/text-accent,#e89b55)] whitespace-nowrap" data-node-id="I70488:651;70486:540">
              Mercado
            </p>
            <div className="h-0 relative shrink-0 w-full" data-node-id="I70488:651;70486:541" data-name="Active Underline">
              <div className="absolute inset-[-3px_0_0_0]">
                <img alt="" className="block max-w-none size-full" src={imgActiveUnderline} />
              </div>
            </div>
          </div>
          <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="I70488:651;70486:542">
            Criadores
          </p>
          <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="I70488:651;70486:543">
            Aprenda
          </p>
        </div>
        <div className="content-stretch flex gap-[28px] items-center relative shrink-0" data-node-id="I70488:651;70486:544" data-name="Header Actions">
          <div className="h-[20px] relative shrink-0 w-[20.001px]" data-node-id="I70488:651;70486:545" data-name="Search Icon">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSearchIcon} />
          </div>
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-node-id="I70488:651;70486:546" data-name="Cart">
            <div className="col-1 h-[24px] ml-0 mt-0 relative row-1 w-[24.004px]" data-node-id="I70488:651;70486:547" data-name="Cart Icon">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCartIcon} />
            </div>
            <div className="col-1 ml-[15px] mt-0 relative row-1 size-[16px]" data-node-id="I70488:651;70486:548" data-name="Badge">
              <div className="absolute inset-[-12.5%]">
                <img alt="" className="block max-w-none size-full" src={imgBadge} />
              </div>
            </div>
            <p className="[word-break:break-word] col-1 font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium leading-[normal] ml-[20px] mt-[1.5px] relative row-1 text-[10px] text-[color:var(--color\/ink,#140d0a)] whitespace-nowrap" data-node-id="I70488:651;70486:549">
              6
            </p>
          </div>
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-node-id="I70488:651;70486:550" data-name="Login">
            <div className="bg-[var(--color\/primary,#d28a4c)] col-1 content-stretch flex flex-col h-[35px] items-center justify-center ml-0 mt-0 relative rounded-[6px] row-1 w-[100px]" data-node-id="I70488:651;70486:551" data-name="Login Button">
              <div className="content-stretch flex gap-[4px] items-start relative shrink-0" data-node-id="I70488:651;70486:552" data-name="Login Button Content">
                <div className="relative shrink-0 size-[20px]" data-node-id="I70488:651;70486:553" data-name="Iconly/Curved/Logout">
                  <div className="absolute inset-[11.46%_9.2%_11.46%_9.41%]" data-node-id="I70488:651;70486:553;29221:4777" data-name="Logout">
                    <div className="absolute inset-[-4.86%_-4.61%]">
                      <img alt="" className="block max-w-none size-full" src={imgLogout} />
                    </div>
                  </div>
                </div>
                <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium leading-[normal] relative shrink-0 text-[16px] text-[color:var(--color\/ink,#140d0a)] whitespace-nowrap" data-node-id="I70488:651;70486:554">
                  Entrar
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-[1200px]" data-node-id="70369:239" data-name="Cart">
        <div className="content-stretch flex items-center justify-center relative shrink-0" data-node-id="70402:3337">
          <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[15px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="11:1309">
            Início / Mercado / Carrinho
          </p>
        </div>
        <div className="content-stretch flex items-start justify-between overflow-clip relative shrink-0 w-full" data-node-id="70369:240" data-name="Cart Body">
          <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0" data-node-id="70369:241" data-name="Cart Table">
            <div className="content-stretch flex items-center justify-between pr-[24px] relative shrink-0 w-full" data-node-id="70369:242" data-name="Table Header">
              <div className="content-stretch flex items-center relative shrink-0 w-[250px]" data-node-id="70402:3326">
                <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="11:2019">
                  NFTs
                </p>
              </div>
              <div className="content-stretch flex items-center relative shrink-0 w-[77px]" data-node-id="70402:3327">
                <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium leading-[16px] relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="11:2022">
                  Preço
                </p>
              </div>
              <div className="content-stretch flex items-center relative shrink-0 w-[75px]" data-node-id="70402:3328">
                <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="11:2024">
                  Edições
                </p>
              </div>
              <div className="content-stretch flex items-end relative shrink-0 w-[87px]" data-node-id="70402:3329">
                <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium leading-[16px] relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="11:2026">
                  Total
                </p>
              </div>
              <div className="h-[16px] relative shrink-0 w-[24px]" data-node-id="70402:3331" />
            </div>
            <div className="h-0 relative shrink-0 w-full" data-node-id="11:1919">
              <div className="absolute inset-[-0.3px_0_0_0]">
                <img alt="" className="block max-w-none size-full" src={imgLine2} />
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0" data-node-id="70369:243" data-name="Cart Items">
              <div className="bg-[var(--color\/surface-card,#241612)] content-stretch flex flex-col h-[70px] items-start justify-center pr-[24px] relative shrink-0 w-full" data-node-id="70369:244" data-name="Cart Item 1">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="70402:3323">
                  <div className="flex flex-row items-center self-stretch" data-node-id="70402:3320">
                    <div className="content-stretch flex gap-[16px] h-full items-center relative shrink-0 w-[250px]">
                      <div className="relative rounded-[6px] shrink-0 size-[70px]" data-node-id="11:1900" data-name="NFT Cart Artwork 6">
                        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[6px] size-full" src={imgNftCartArtwork6} />
                      </div>
                      <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-start leading-[16px] relative shrink-0 w-[154px]" data-node-id="70402:3319">
                        <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] w-full" data-node-id="11:2020">
                          Emerald Ape #042
                        </p>
                        <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal relative shrink-0 text-[14px] text-[color:var(--color\/secondary,#b39463)] w-full" data-node-id="11:2021">
                          ID do token: #0042
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex items-center justify-center relative shrink-0" data-node-id="70402:3318">
                    <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[16px] text-[color:var(--color\/text-secondary,#cfb28c)] whitespace-nowrap" data-node-id="11:1927">
                      1.19 ETH
                    </p>
                  </div>
                  <div className="content-stretch flex gap-[12px] items-center justify-center relative shrink-0" data-node-id="11:2028">
                    <div className="bg-[var(--color\/primary,#d28a4c)] border border-[#140d0a] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(20,13,10,0.15)] flex flex-col h-[30px] items-center justify-center relative rounded-[20px] shrink-0 w-[20px]" data-node-id="70402:3303" data-name="Add Button">
                      <div className="relative shrink-0 size-[16px]" data-node-id="70402:3304" data-name="Frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
                      </div>
                    </div>
                    <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[24px] relative shrink-0 text-[17px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="11:1947">
                      2
                    </p>
                    <div className="bg-[var(--color\/primary,#d28a4c)] border border-[#140d0a] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(20,13,10,0.15)] flex flex-col h-[30px] items-center justify-center relative rounded-[20px] shrink-0 w-[20px]" data-node-id="70402:3307" data-name="Add Button">
                      <div className="relative shrink-0 size-[16px]" data-node-id="70402:3308" data-name="Frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1} />
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex items-center relative shrink-0 w-[87px]" data-node-id="70402:3317">
                    <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[16px] text-[color:var(--color\/text-accent,#e89b55)] whitespace-nowrap" data-node-id="11:2027">
                      2.38 ETH
                    </p>
                  </div>
                  <div className="content-stretch flex items-center relative shrink-0" data-node-id="70402:3316">
                    <div className="relative shrink-0 size-[24px]" data-node-id="11:2029" data-name="Iconly/Curved/Delete">
                      <div className="absolute inset-[11.31%_15.15%_11.68%_17.56%]" data-node-id="I11:2029;29221:4602" data-name="Delete">
                        <div className="absolute inset-[-4.06%_-4.64%]">
                          <img alt="" className="block max-w-none size-full" src={imgDelete} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[var(--color\/surface-card,#241612)] content-stretch flex flex-col h-[70px] items-start justify-center pr-[24px] relative shrink-0 w-full" data-node-id="70369:245" data-name="Cart Item 2">
                <div className="content-stretch flex flex-[1_0_0] items-center justify-between min-h-px relative w-full" data-node-id="70402:3322">
                  <div className="content-stretch flex gap-[16px] h-full items-center relative shrink-0" data-node-id="70402:3321">
                    <div className="aspect-[66/66] h-full relative rounded-[6px] shrink-0" data-node-id="11:2092" data-name="NFT Cart Artwork 7">
                      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[6px] size-full" src={imgNftCartArtwork7} />
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-start leading-[16px] relative shrink-0 w-[164px]" data-node-id="70402:3312">
                      <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] w-full" data-node-id="11:2059">
                        Violet Nomad #314
                      </p>
                      <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal relative shrink-0 text-[14px] text-[color:var(--color\/secondary,#b39463)] w-full" data-node-id="11:2060">
                        ID do token: #0009
                      </p>
                    </div>
                  </div>
                  <div className="content-stretch flex items-center justify-center relative shrink-0" data-node-id="70402:3313">
                    <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[16px] text-[color:var(--color\/text-secondary,#cfb28c)] whitespace-nowrap" data-node-id="11:2061">
                      1.39 ETH
                    </p>
                  </div>
                  <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-node-id="11:2063">
                    <div className="bg-[var(--color\/primary,#d28a4c)] border border-[#140d0a] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(20,13,10,0.15)] flex flex-col h-[30px] items-center justify-center relative rounded-[20px] shrink-0 w-[20px]" data-node-id="70402:3299" data-name="Add Button">
                      <div className="relative shrink-0 size-[16px]" data-node-id="70402:3300" data-name="Frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
                      </div>
                    </div>
                    <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[24px] relative shrink-0 text-[17px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="11:2064">
                      6
                    </p>
                    <div className="bg-[var(--color\/primary,#d28a4c)] border border-[#140d0a] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(20,13,10,0.15)] flex flex-col h-[30px] items-center justify-center relative rounded-[20px] shrink-0 w-[20px]" data-node-id="70402:3295" data-name="Add Button">
                      <div className="relative shrink-0 size-[16px]" data-node-id="70402:3296" data-name="Frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1} />
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex items-center justify-center relative shrink-0" data-node-id="70402:3324">
                    <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[16px] text-[color:var(--color\/text-accent,#e89b55)] w-[87px]" data-node-id="11:2062">
                      8.34 ETH
                    </p>
                  </div>
                  <div className="content-stretch flex items-center relative shrink-0" data-node-id="70402:3315">
                    <div className="relative shrink-0 size-[24px]" data-node-id="11:2069" data-name="Iconly/Curved/Delete">
                      <div className="absolute inset-[11.31%_15.15%_11.68%_17.56%]" data-node-id="I11:2069;29221:4602" data-name="Delete">
                        <div className="absolute inset-[-4.06%_-4.64%]">
                          <img alt="" className="block max-w-none size-full" src={imgDelete} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[var(--color\/surface-card,#241612)] content-stretch flex flex-col h-[70px] items-start justify-center pr-[24px] relative shrink-0 w-[782px]" data-node-id="70369:246" data-name="Cart Item 3">
                <div className="content-stretch flex flex-[1_0_0] items-center justify-between min-h-px relative w-full" data-node-id="70402:3311">
                  <div className="content-stretch flex gap-[16px] h-full items-center relative shrink-0 w-[250px]" data-node-id="70402:3279">
                    <div className="aspect-[65/65] h-full relative rounded-[6px] shrink-0" data-node-id="11:2094" data-name="NFT Cart Artwork 8">
                      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[6px] size-full" src={imgNftCartArtwork8} />
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-start leading-[16px] relative shrink-0 w-[154px]" data-node-id="70402:3278">
                      <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] w-full" data-node-id="11:2076">
                        Ivory Baron #088
                      </p>
                      <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal relative shrink-0 text-[14px] text-[color:var(--color\/secondary,#b39463)] w-full" data-node-id="11:2077">
                        ID do token: #0552
                      </p>
                    </div>
                  </div>
                  <div className="content-stretch flex items-center relative shrink-0" data-node-id="70402:3280">
                    <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[16px] text-[color:var(--color\/text-secondary,#cfb28c)] whitespace-nowrap" data-node-id="11:2078">
                      1.79 ETH
                    </p>
                  </div>
                  <div className="content-stretch flex items-center justify-between relative shrink-0 w-[75px]" data-node-id="11:2080">
                    <div className="bg-[var(--color\/primary,#d28a4c)] border border-[#140d0a] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(20,13,10,0.15)] flex flex-col h-[30px] items-center justify-center relative rounded-[20px] shrink-0 w-[20px]" data-node-id="70402:3275" data-name="Add Button">
                      <div className="relative shrink-0 size-[16px]" data-node-id="70402:3284" data-name="Frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
                      </div>
                    </div>
                    <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[24px] relative shrink-0 text-[17px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="11:2081">
                      9
                    </p>
                    <div className="bg-[var(--color\/primary,#d28a4c)] border border-[#140d0a] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(20,13,10,0.15)] flex flex-col h-[30px] items-center justify-center relative rounded-[20px] shrink-0 w-[20px]" data-node-id="70402:3239" data-name="Add Button">
                      <div className="relative shrink-0 size-[16px]" data-node-id="70402:3281" data-name="Frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1} />
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex items-center justify-center relative shrink-0" data-node-id="70402:3273">
                    <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[16px] text-[color:var(--color\/text-accent,#e89b55)] text-right whitespace-nowrap" data-node-id="11:2079">
                      16.11 ETH
                    </p>
                  </div>
                  <div className="content-stretch flex items-center relative shrink-0" data-node-id="70402:3274">
                    <div className="relative shrink-0 size-[24px]" data-node-id="11:2086" data-name="Iconly/Curved/Delete">
                      <div className="absolute inset-[11.31%_15.15%_11.68%_17.56%]" data-node-id="I11:2086;29221:4602" data-name="Delete">
                        <div className="absolute inset-[-4.06%_-4.64%]">
                          <img alt="" className="block max-w-none size-full" src={imgDelete} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[24px] items-start overflow-clip relative shrink-0 w-[332px]" data-node-id="70370:239" data-name="Wallet Summary">
            <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full" data-node-id="70370:240" data-name="Heading">
              <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[18px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="11:2848">
                Resumo da carteira
              </p>
              <div className="h-0 relative shrink-0 w-full" data-node-id="11:2856">
                <div className="absolute inset-[-0.3px_0_0_0]">
                  <img alt="" className="block max-w-none size-full" src={imgLine3} />
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start overflow-clip relative shrink-0 w-full" data-node-id="70370:241" data-name="Promo Code">
              <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[14px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="11:2096">
                Código promocional
              </p>
              <div className="border border-[var(--color\/primary,#d28a4c)] border-solid content-stretch flex h-[40px] items-center pl-[8px] relative rounded-[3px] shrink-0 w-[332px]" data-node-id="70370:242" data-name="Promo Input">
                <p className="[word-break:break-word] flex-[1_0_0] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[16px] min-w-px relative text-[12px] text-[color:var(--color\/secondary,#b39463)]" data-node-id="11:2840">
                  Digite o código promocional...
                </p>
                <div className="bg-[var(--color\/primary,#d28a4c)] content-stretch flex h-[40px] items-center justify-center relative rounded-br-[3px] rounded-tr-[3px] shrink-0 w-[102px]" data-node-id="70402:3334">
                  <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[15px] text-[color:var(--color\/ink,#140d0a)] whitespace-nowrap" data-node-id="11:2845">
                    Aplicar
                  </p>
                </div>
              </div>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-col font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal gap-[12px] items-start overflow-clip relative shrink-0 w-full whitespace-nowrap" data-node-id="70370:243" data-name="Fees">
              <div className="content-stretch flex items-start justify-between overflow-clip relative shrink-0 text-[color:var(--color\/foreground,#f5f1eb)] w-full" data-node-id="70370:244" data-name="Subtotal">
                <p className="leading-[normal] relative shrink-0 text-[15px]" data-node-id="11:2849">
                  Subtotal
                </p>
                <p className="leading-[16px] relative shrink-0 text-[18px] text-right" data-node-id="11:2850">
                  26.83 ETH
                </p>
              </div>
              <div className="content-stretch flex items-start justify-between leading-[normal] overflow-clip relative shrink-0 text-[15px] text-[color:var(--color\/foreground,#f5f1eb)] w-full" data-node-id="70370:245" data-name="Discount">
                <p className="relative shrink-0" data-node-id="11:2857">
                  Desconto do lançamento
                </p>
                <p className="relative shrink-0" data-node-id="11:2858">
                  (-) 00.00
                </p>
              </div>
              <div className="content-stretch flex flex-col gap-[12px] items-end relative shrink-0 w-full" data-node-id="70370:246" data-name="Network Fee">
                <div className="content-stretch flex items-center justify-between relative shrink-0 text-[color:var(--color\/foreground,#f5f1eb)] w-[332px]" data-node-id="70402:3336">
                  <p className="leading-[normal] relative shrink-0 text-[15px]" data-node-id="11:2851">
                    Taxa de rede
                  </p>
                  <p className="leading-[16px] relative shrink-0 text-[18px] text-right" data-node-id="11:2852">
                    0.016 ETH
                  </p>
                </div>
                <p className="leading-[16px] relative shrink-0 text-[12px] text-[color:var(--color\/text-accent,#e89b55)]" data-node-id="11:2855">
                  Taxa estimada
                </p>
              </div>
            </div>
            <div className="[word-break:break-word] content-stretch flex font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold items-start justify-between leading-[16px] overflow-clip relative shrink-0 w-full whitespace-nowrap" data-node-id="70370:247" data-name="Total">
              <p className="relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)]" data-node-id="11:2853">
                Total
              </p>
              <p className="relative shrink-0 text-[18px] text-[color:var(--color\/text-accent,#e89b55)] text-right" data-node-id="11:2854">
                26.846 ETH
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[12px] items-center overflow-clip relative shrink-0 w-full" data-node-id="70370:248" data-name="Checkout CTA">
              <div className="bg-[var(--color\/primary,#d28a4c)] content-stretch flex h-[40px] items-center justify-center overflow-clip relative rounded-[3px] shrink-0 w-full" data-node-id="70370:249" data-name="Button">
                <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[15px] text-[color:var(--color\/ink,#140d0a)] whitespace-nowrap" data-node-id="11:2860">
                  Conectar e finalizar
                </p>
              </div>
              <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] relative shrink-0 text-[15px] text-[color:var(--color\/text-accent,#e89b55)] whitespace-nowrap" data-node-id="11:2842">
                Continuar explorando
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Metadados do Figma

These styles are contained in the design: Color/Foreground: #F5F1EB, Body/14 Bold · lh auto: Font(family: "font/family", style: Bold, size: 14, weight: 700, lineHeight: 100, letterSpacing: 10), Body Large/16 Regular · lh auto: Font(family: "font/family", style: Regular, size: 16, weight: 400, lineHeight: 100, letterSpacing: 0), Text/Accent: #E89B55, Body Large/16 Bold · lh auto: Font(family: "font/family", style: Bold, size: 16, weight: 700, lineHeight: 100, letterSpacing: 0), Color/Primary: #D28A4C, Color/Ink: #140D0A, Tiny/10 Medium: Font(family: "font/family", style: Medium, size: 10, weight: 500, lineHeight: 100, letterSpacing: 0), Body Large/16 Medium · lh auto: Font(family: "font/family", style: Medium, size: 16, weight: 500, lineHeight: 100, letterSpacing: 0), Body/15 Bold · lh 16: Font(family: "font/family", style: Bold, size: 15, weight: 700, lineHeight: 16, letterSpacing: 0), Body Large/16 Bold · lh 16: Font(family: "font/family", style: Bold, size: 16, weight: 700, lineHeight: 16, letterSpacing: 0), Body Large/16 Medium · lh 16: Font(family: "font/family", style: Medium, size: 16, weight: 500, lineHeight: 16, letterSpacing: 0), Color/Secondary: #B39463, Body/14 Regular · lh 16: Font(family: "font/family", style: Regular, size: 14, weight: 400, lineHeight: 16, letterSpacing: 0), Text/Secondary: #CFB28C, Color/Black: #000000, Body Large/17 Regular · lh 10: Font(family: "font/family", style: Regular, size: 17, weight: 400, lineHeight: 24, letterSpacing: 0), Color/Surface Card: #241612, Body Large/18 Bold · lh 16: Font(family: "font/family", style: Bold, size: 18, weight: 700, lineHeight: 16, letterSpacing: 0), Body/14 Bold · lh 16: Font(family: "font/family", style: Bold, size: 14, weight: 700, lineHeight: 16, letterSpacing: 0), Caption/12 Regular · lh 16: Font(family: "font/family", style: Regular, size: 12, weight: 400, lineHeight: 16, letterSpacing: 0), Body/15 Regular · lh 16: Font(family: "font/family", style: Regular, size: 15, weight: 400, lineHeight: 100, letterSpacing: 0), Body Large/18 Regular: Font(family: "font/family", style: Regular, size: 18, weight: 400, lineHeight: 16, letterSpacing: 0).

Component descriptions: The following components have usage descriptions or documentation links defined in Figma. These descriptions provide important context about the intended usage, best practices, and any constraints for each component. Follow these guidelines when implementing or using these components.

## Header Row
**Node ID:** 70486:560

Desktop header row, 1200 wide: KURIO wordmark, 4-item nav with one active item, search, cart with count badge, and the sign-in button. Set Active to match the screen (Home on Início/Entrar/Criar conta/Perfil do colecionador/Carteiras, Market on the four Mercado-flow screens). Badge Count is the cart item count. Drop at index 0 of the screen Top or Header frame with FILL width and HUG height. The hairline rule under the header belongs to the host Header frame, not to this component.
