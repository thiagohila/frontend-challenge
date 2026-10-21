# Desktop / Login — Marketplace Page atrás do modal (também em Cadastro, instância 70522:3841). Única fonte desktop de hover de card e badge RARO

- Figma: file `uweCCvGGvM7N1rQTFUjwQ3`, node `70522:3671`
- Screenshot de referência: `docs/design/frames/desktop-login.png`
- Fonte: `get_design_context` (React+Tailwind de referência; **não é código final** — adaptar ao projeto). Assets já baixados em `design-src/assets/`.

## Código de referência

```tsx
const assetDir = "/design-src/assets"; // assets locais (URLs temporárias do Figma substituídas)
const imgEllipse5 = `${assetDir}/deco-slider-thumb.svg`;
const imgLine6 = `${assetDir}/deco-slider-range-161.svg`;
const imgLine5 = `${assetDir}/deco-slider-track-55.svg`;
const imgNftAuthArtwork1 = `${assetDir}/nft-emerald-ape.png`;
const imgNftAuthArtwork3 = `${assetDir}/nft-golden-beat.png`;
const imgNftAuthArtwork4 = `${assetDir}/nft-ivory-baron.png`;
const imgNftAuthArtwork6 = `${assetDir}/nft-sage-nomad.png`;
const imgActiveUnderline = `${assetDir}/deco-nav-underline-58.svg`;
const imgSearchIcon = `${assetDir}/icon-search.svg`;
const imgCartIcon = `${assetDir}/icon-cart.svg`;
const imgBadge = `${assetDir}/deco-cart-badge.svg`;
const imgLogout = `${assetDir}/icon-login-ink.svg`;
const imgLine1 = `${assetDir}/deco-divider-1200-header.svg`;
const imgGroup4 = `${assetDir}/deco-dots-hero.svg`;
const imgLine3 = `${assetDir}/deco-tab-underline-104.svg`;
const imgArrowDown2 = `${assetDir}/icon-chevron-down-sm.svg`;
const imgLine4 = `${assetDir}/deco-strike-65.svg`;
const imgShopping1 = `${assetDir}/icon-cart-add-foreground.svg`;
const imgHeart1 = `${assetDir}/icon-heart-foreground.svg`;
const imgFrame = `${assetDir}/icon-quick-view.svg`;

function Filters({ className }: { className?: string }) {
  return (
    <div className={className || "bg-[var(--color\\/surface-card,#241612)] content-stretch flex flex-col items-start overflow-clip p-[20px] relative w-[310px]"} data-node-id="70485:381" data-name="Filters">
      <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 w-full" data-node-id="70485:317">
        <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full" data-node-id="70485:318" data-name="Collections Filter">
          <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[18px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="70485:319">
            Coleções
          </p>
          <div className="content-stretch flex flex-col items-start overflow-clip px-[12px] relative shrink-0 w-full" data-node-id="70485:320" data-name="List">
            <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="70485:321">
              <div className="content-stretch flex items-center justify-center relative shrink-0" data-node-id="70485:322">
                <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[40px] relative shrink-0 text-[15px] text-[color:var(--color\/text-accent,#e89b55)] whitespace-nowrap" data-node-id="70485:323">
                  Arte digital
                </p>
              </div>
              <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[40px] relative shrink-0 text-[15px] text-[color:var(--color\/text-accent,#e89b55)] text-right whitespace-nowrap" data-node-id="70485:324">
                (33)
              </p>
            </div>
            <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="70485:325">
              <div className="content-stretch flex items-center justify-center relative shrink-0" data-node-id="70485:326">
                <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[40px] relative shrink-0 text-[15px] text-[color:var(--color\/text-secondary,#cfb28c)] whitespace-nowrap" data-node-id="70485:327">
                  Fotografia
                </p>
              </div>
              <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[40px] relative shrink-0 text-[15px] text-[color:var(--color\/text-secondary,#cfb28c)] text-right whitespace-nowrap" data-node-id="70485:328">
                (12)
              </p>
            </div>
            <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="70485:329">
              <div className="content-stretch flex items-center justify-center relative shrink-0" data-node-id="70485:330">
                <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[40px] relative shrink-0 text-[15px] text-[color:var(--color\/text-secondary,#cfb28c)] whitespace-nowrap" data-node-id="70485:331">
                  Música
                </p>
              </div>
              <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[40px] relative shrink-0 text-[15px] text-[color:var(--color\/text-secondary,#cfb28c)] text-right whitespace-nowrap" data-node-id="70485:332">
                (65)
              </p>
            </div>
            <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="70485:333">
              <div className="content-stretch flex items-center justify-center relative shrink-0" data-node-id="70485:334">
                <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[40px] relative shrink-0 text-[15px] text-[color:var(--color\/text-secondary,#cfb28c)] whitespace-nowrap" data-node-id="70485:335">
                  Arte 3D
                </p>
              </div>
              <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[40px] relative shrink-0 text-[15px] text-[color:var(--color\/text-secondary,#cfb28c)] text-right w-[37px]" data-node-id="70485:336">
                (39)
              </p>
            </div>
            <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="70485:337">
              <div className="content-stretch flex items-center justify-center relative shrink-0" data-node-id="70485:338">
                <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[40px] relative shrink-0 text-[15px] text-[color:var(--color\/text-secondary,#cfb28c)] whitespace-nowrap" data-node-id="70485:339">
                  Colecionáveis
                </p>
              </div>
              <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[40px] relative shrink-0 text-[15px] text-[color:var(--color\/text-secondary,#cfb28c)] text-right w-[37px]" data-node-id="70485:340">
                (23)
              </p>
            </div>
            <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="70485:341">
              <div className="content-stretch flex items-center justify-center relative shrink-0" data-node-id="70485:342">
                <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[40px] relative shrink-0 text-[15px] text-[color:var(--color\/text-secondary,#cfb28c)] whitespace-nowrap" data-node-id="70485:343">
                  Generativa
                </p>
              </div>
              <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[40px] relative shrink-0 text-[15px] text-[color:var(--color\/text-secondary,#cfb28c)] text-right w-[37px]" data-node-id="70485:344">
                (17)
              </p>
            </div>
            <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="70485:345">
              <div className="content-stretch flex items-center justify-center relative shrink-0" data-node-id="70485:346">
                <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[40px] relative shrink-0 text-[15px] text-[color:var(--color\/text-secondary,#cfb28c)] whitespace-nowrap" data-node-id="70485:347">
                  Jogos
                </p>
              </div>
              <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[40px] relative shrink-0 text-[15px] text-[color:var(--color\/text-secondary,#cfb28c)] text-right w-[37px]" data-node-id="70485:348">
                (19)
              </p>
            </div>
            <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="70485:349">
              <div className="content-stretch flex items-center justify-center relative shrink-0" data-node-id="70485:350">
                <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[40px] relative shrink-0 text-[15px] text-[color:var(--color\/text-secondary,#cfb28c)] whitespace-nowrap" data-node-id="70485:351">
                  Assinaturas
                </p>
              </div>
              <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[40px] relative shrink-0 text-[15px] text-[color:var(--color\/text-secondary,#cfb28c)] text-right w-[37px]" data-node-id="70485:352">
                (13)
              </p>
            </div>
            <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="70485:353">
              <div className="content-stretch flex items-center justify-center relative shrink-0" data-node-id="70485:354">
                <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[40px] relative shrink-0 text-[15px] text-[color:var(--color\/text-secondary,#cfb28c)] whitespace-nowrap" data-node-id="70485:355">
                  Utilidade
                </p>
              </div>
              <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[40px] relative shrink-0 text-[15px] text-[color:var(--color\/text-secondary,#cfb28c)] text-right w-[37px]" data-node-id="70485:356">
                (18)
              </p>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full" data-node-id="70485:357" data-name="Price Filter">
          <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[18px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="70485:358">
            Faixa de preço
          </p>
          <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip pl-[12px] relative shrink-0 w-full" data-node-id="70485:359" data-name="Controls">
            <div className="content-stretch flex isolate items-center relative shrink-0 w-full" data-node-id="70485:360" data-name="Slider">
              <div className="relative shrink-0 size-[15px] z-[4]" data-node-id="70485:361">
                <div className="absolute inset-[-20%]">
                  <img alt="" className="block max-w-none size-full" src={imgEllipse5} />
                </div>
              </div>
              <div className="h-0 relative shrink-0 w-[161px] z-[3]" data-node-id="70485:362">
                <div className="absolute inset-[-4px_0_0_0]">
                  <img alt="" className="block max-w-none size-full" src={imgLine6} />
                </div>
              </div>
              <div className="relative shrink-0 size-[15px] z-[2]" data-node-id="70485:363">
                <div className="absolute inset-[-20%]">
                  <img alt="" className="block max-w-none size-full" src={imgEllipse5} />
                </div>
              </div>
              <div className="flex-[1_0_0] h-0 min-w-px relative z-[1]" data-node-id="70485:364">
                <div className="absolute inset-[-4px_0_0_0]">
                  <img alt="" className="block max-w-none size-full" src={imgLine5} />
                </div>
              </div>
            </div>
            <div className="content-stretch flex items-center relative shrink-0 w-full" data-node-id="70485:365">
              <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] relative shrink-0 text-[15px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="70485:366">
                Preço: 0,02 - 12,30 ETH
              </p>
            </div>
            <div className="bg-[var(--color\/primary,#d28a4c)] content-stretch flex items-center overflow-clip px-[12px] py-[8px] relative rounded-[6px] shrink-0" data-node-id="70485:367" data-name="Apply Button">
              <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[20px] relative shrink-0 text-[16px] text-[color:var(--color\/ink,#140d0a)] whitespace-nowrap" data-node-id="70485:368">
                Aplicar
              </p>
            </div>
          </div>
        </div>
        <div className="[word-break:break-word] content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full whitespace-nowrap" data-node-id="70485:369" data-name="Network Filter">
          <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[18px] text-[color:var(--color\/foreground,#f5f1eb)]" data-node-id="70485:370">
            Rede
          </p>
          <div className="content-stretch flex flex-col font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal items-start leading-[40px] overflow-clip pl-[12px] relative shrink-0 text-[15px] text-[color:var(--color\/text-secondary,#cfb28c)] w-full" data-node-id="70485:371" data-name="List">
            <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="70485:372">
              <p className="relative shrink-0" data-node-id="70485:373">
                Ethereum
              </p>
              <p className="relative shrink-0 text-right" data-node-id="70485:374">
                (119)
              </p>
            </div>
            <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="70485:375">
              <p className="relative shrink-0" data-node-id="70485:376">
                Polygon
              </p>
              <p className="relative shrink-0 text-right" data-node-id="70485:377">
                (78)
              </p>
            </div>
            <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="70485:378">
              <p className="relative shrink-0" data-node-id="70485:379">
                Solana
              </p>
              <p className="relative shrink-0 text-right" data-node-id="70485:380">
                (86)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative size-full" data-node-id="70522:3671" data-name="Marketplace Page">
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-[1200.001px]" data-node-id="I70522:3671;70529:3617" data-name="Header With Divider">
        <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="I70522:3671;70529:3617;70504:3015" data-name="Header Row">
          <div className="h-[34.3px] overflow-clip relative shrink-0 w-[160px]" data-node-id="I70522:3671;70529:3617;70504:3015;70486:509" data-name="Logo">
            <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[normal] left-0 text-[14px] text-[color:var(--color\/foreground,#f5f1eb)] top-[8.15px] tracking-[1.4px] whitespace-nowrap" data-node-id="I70522:3671;70529:3617;70504:3015;70486:510">
              KURIO
            </p>
          </div>
          <div className="content-stretch flex gap-[40px] items-start overflow-clip relative shrink-0" data-node-id="I70522:3671;70529:3617;70504:3015;70486:511" data-name="Nav">
            <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[58px]" data-node-id="I70522:3671;70529:3617;70504:3015;70486:512" data-name="Nav Item">
              <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[normal] relative shrink-0 text-[16px] text-[color:var(--color\/text-accent,#e89b55)] w-full" data-node-id="I70522:3671;70529:3617;70504:3015;70486:513">
                Início
              </p>
              <div className="h-0 relative shrink-0 w-full" data-node-id="I70522:3671;70529:3617;70504:3015;70486:514" data-name="Active Underline">
                <div className="absolute inset-[-3px_0_0_0]">
                  <img alt="" className="block max-w-none size-full" src={imgActiveUnderline} />
                </div>
              </div>
            </div>
            <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="I70522:3671;70529:3617;70504:3015;70486:515">
              Mercado
            </p>
            <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="I70522:3671;70529:3617;70504:3015;70486:516">
              Criadores
            </p>
            <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="I70522:3671;70529:3617;70504:3015;70486:517">
              Aprenda
            </p>
          </div>
          <div className="content-stretch flex gap-[28px] items-center relative shrink-0" data-node-id="I70522:3671;70529:3617;70504:3015;70486:518" data-name="Header Actions">
            <div className="h-[20px] relative shrink-0 w-[20.001px]" data-node-id="I70522:3671;70529:3617;70504:3015;70486:519" data-name="Search Icon">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSearchIcon} />
            </div>
            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-node-id="I70522:3671;70529:3617;70504:3015;70486:520" data-name="Cart">
              <div className="col-1 h-[24px] ml-0 mt-0 relative row-1 w-[24.004px]" data-node-id="I70522:3671;70529:3617;70504:3015;70486:521" data-name="Cart Icon">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCartIcon} />
              </div>
              <div className="col-1 ml-[15px] mt-0 relative row-1 size-[16px]" data-node-id="I70522:3671;70529:3617;70504:3015;70486:522" data-name="Badge">
                <div className="absolute inset-[-12.5%]">
                  <img alt="" className="block max-w-none size-full" src={imgBadge} />
                </div>
              </div>
              <p className="[word-break:break-word] col-1 font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium leading-[normal] ml-[20px] mt-[1.5px] relative row-1 text-[10px] text-[color:var(--color\/ink,#140d0a)] whitespace-nowrap" data-node-id="I70522:3671;70529:3617;70504:3015;70486:523">
                6
              </p>
            </div>
            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-node-id="I70522:3671;70529:3617;70504:3015;70486:524" data-name="Login">
              <div className="bg-[var(--color\/primary,#d28a4c)] col-1 content-stretch flex flex-col h-[35px] items-center justify-center ml-0 mt-0 relative rounded-[6px] row-1 w-[100px]" data-node-id="I70522:3671;70529:3617;70504:3015;70486:525" data-name="Login Button">
                <div className="content-stretch flex gap-[4px] items-start relative shrink-0" data-node-id="I70522:3671;70529:3617;70504:3015;70486:526" data-name="Login Button Content">
                  <div className="relative shrink-0 size-[20px]" data-node-id="I70522:3671;70529:3617;70504:3015;70486:527" data-name="Iconly/Curved/Logout">
                    <div className="absolute inset-[11.46%_9.2%_11.46%_9.41%]" data-node-id="I70522:3671;70529:3617;70504:3015;70486:527;29221:4777" data-name="Logout">
                      <div className="absolute inset-[-4.87%_-4.61%_-4.86%_-4.61%]">
                        <img alt="" className="block max-w-none size-full" src={imgLogout} />
                      </div>
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium leading-[normal] relative shrink-0 text-[16px] text-[color:var(--color\/ink,#140d0a)] whitespace-nowrap" data-node-id="I70522:3671;70529:3617;70504:3015;70486:528">
                    Entrar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-0 relative shrink-0 w-full" data-node-id="I70522:3671;70529:3617;70504:3016">
          <div className="absolute inset-[-0.3px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine1} />
          </div>
        </div>
      </div>
      <div className="h-[1900px] relative shrink-0 w-[1206px]" data-node-id="I70522:3671;70504:3222" data-name="Page Content (behind overlay)">
        <div className="absolute contents left-[5px] top-0" data-node-id="I70522:3671;70504:3223" data-name="Main Banner">
          <div className="absolute h-[450px] left-[5px] top-0 w-[1200px]" data-node-id="I70522:3671;70504:3224" />
          <div className="absolute left-[755px] rounded-[16px] size-[450px] top-0" data-node-id="I70522:3671;70504:3225" data-name="NFT Auth Artwork 1">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgNftAuthArtwork1} />
          </div>
          <div className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[0] left-[45px] text-[43px] text-[color:var(--color\/foreground,#f5f1eb)] top-[91px] w-[600px]" data-node-id="I70522:3671;70504:3227">
            <p className="leading-[70px] mb-0">SEJA DONO DO FUTURO</p>
            <p className="leading-[70px]">DA ARTE DIGITAL</p>
          </div>
          <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium leading-[16px] left-[48px] text-[14px] text-[color:var(--color\/foreground,#f5f1eb)] top-[68px] tracking-[1.4px] whitespace-nowrap" data-node-id="I70522:3671;70504:3228">
            Bem-vindo à Kurio
          </p>
          <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal h-[45px] leading-[24px] left-[48px] text-[14px] text-[color:var(--color\/text-secondary,#cfb28c)] top-[236px] w-[557px]" data-node-id="I70522:3671;70504:3229">
            Descubra NFTs selecionados de criadores do mundo todo e colecione arte digital verificada.
          </p>
          <div className="absolute bg-[var(--color\/primary,#d28a4c)] h-[40px] left-[46px] rounded-[6px] top-[325px] w-[140px]" data-node-id="I70522:3671;70504:3230" />
          <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[20px] left-[75px] text-[16px] text-[color:var(--color\/ink,#140d0a)] top-[335px] whitespace-nowrap" data-node-id="I70522:3671;70504:3231">
            EXPLORAR
          </p>
          <div className="absolute h-[8px] left-[585px] top-[425px] w-[40px]" data-node-id="I70522:3671;70504:3232">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup4} />
          </div>
        </div>
        <div className="absolute contents left-[365px] top-[496px]" data-node-id="I70522:3671;70504:3236" data-name="Short By">
          <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] left-[365px] text-[15px] text-[color:var(--color\/text-accent,#e89b55)] top-[496px] whitespace-nowrap" data-node-id="I70522:3671;70504:3237">
            Todos os NFTs
          </p>
          <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] left-[505px] text-[15px] text-[color:var(--color\/foreground,#f5f1eb)] top-[496px] whitespace-nowrap" data-node-id="I70522:3671;70504:3238">
            Novos lançamentos
          </p>
          <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] left-[678px] text-[15px] text-[color:var(--color\/foreground,#f5f1eb)] top-[496px] whitespace-nowrap" data-node-id="I70522:3671;70504:3239">
            Em alta
          </p>
          <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] left-[911px] text-[15px] text-[color:var(--color\/foreground,#f5f1eb)] top-[496px] whitespace-nowrap" data-node-id="I70522:3671;70504:3240">
            Ordenar por:
          </p>
          <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] left-[1021px] text-[15px] text-[color:var(--color\/foreground,#f5f1eb)] top-[496px] whitespace-nowrap" data-node-id="I70522:3671;70504:3241">
            Listados recentemente
          </p>
          <div className="absolute h-0 left-[365px] top-[519px] w-[104px]" data-node-id="I70522:3671;70504:3242">
            <div className="absolute inset-[-2px_0_0_0]">
              <img alt="" className="block max-w-none size-full" src={imgLine3} />
            </div>
          </div>
          <div className="absolute left-[1189px] size-[16px] top-[498px]" data-node-id="I70522:3671;70504:3243" data-name="Iconly/Two-tone/Arrow - Down 2">
            <div className="absolute inset-[35.42%_20.83%]" data-node-id="I70522:3671;70504:3243;16162:1094;0:4170" data-name="Arrow - Down 2">
              <div className="absolute inset-[-16.07%_-8.04%]">
                <img alt="" className="block max-w-none size-full" src={imgArrowDown2} />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute contents left-[365px] top-[550px]" data-node-id="I70522:3671;70504:3244" data-name="Products">
          <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[16px] left-[365px] text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] top-[862px] whitespace-nowrap" data-node-id="I70522:3671;70504:3245">
            Emerald Ape #042
          </p>
          <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[16px] left-[365px] text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] top-[1282px] whitespace-nowrap" data-node-id="I70522:3671;70504:3246">
            Cosmic Bloom #118
          </p>
          <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[16px] left-[365px] text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] top-[1702px] whitespace-nowrap" data-node-id="I70522:3671;70504:3247">
            Golden Beat #207
          </p>
          <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[16px] left-[656px] text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] top-[862px] whitespace-nowrap" data-node-id="I70522:3671;70504:3248">
            Sage Nomad #009
          </p>
          <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[16px] left-[656px] text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] top-[1282px] whitespace-nowrap" data-node-id="I70522:3671;70504:3249">
            Violet Nomad #314
          </p>
          <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[16px] left-[656px] text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] top-[1702px] whitespace-nowrap" data-node-id="I70522:3671;70504:3250">
            Golden Frequency #071
          </p>
          <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[16px] left-[947px] text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] top-[862px] whitespace-nowrap" data-node-id="I70522:3671;70504:3251">
            Neon Vessel #552
          </p>
          <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[16px] left-[947px] text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] top-[1282px] whitespace-nowrap" data-node-id="I70522:3671;70504:3252">
            Ivory Baron #088
          </p>
          <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[16px] left-[947px] text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] top-[1702px] whitespace-nowrap" data-node-id="I70522:3671;70504:3253">
            Golden Signal #160
          </p>
          <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] left-[365px] text-[18px] text-[color:var(--color\/text-accent,#e89b55)] top-[884px] whitespace-nowrap" data-node-id="I70522:3671;70504:3254">
            1.19 ETH
          </p>
          <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] left-[365px] text-[18px] text-[color:var(--color\/text-accent,#e89b55)] top-[1304px] whitespace-nowrap" data-node-id="I70522:3671;70504:3255">
            1.29 ETH
          </p>
          <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] left-[365px] text-[18px] text-[color:var(--color\/text-accent,#e89b55)] top-[1724px] whitespace-nowrap" data-node-id="I70522:3671;70504:3256">
            0.99 ETH
          </p>
          <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] left-[656px] text-[18px] text-[color:var(--color\/text-accent,#e89b55)] top-[884px] whitespace-nowrap" data-node-id="I70522:3671;70504:3257">
            1.69 ETH
          </p>
          <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] left-[656px] text-[18px] text-[color:var(--color\/text-accent,#e89b55)] top-[1304px] whitespace-nowrap" data-node-id="I70522:3671;70504:3258">
            1.39 ETH
          </p>
          <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] left-[656px] text-[18px] text-[color:var(--color\/text-accent,#e89b55)] top-[1724px] whitespace-nowrap" data-node-id="I70522:3671;70504:3259">
            0.59 ETH
          </p>
          <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] left-[947px] text-[18px] text-[color:var(--color\/text-accent,#e89b55)] top-[884px] whitespace-nowrap" data-node-id="I70522:3671;70504:3260">
            1.99 ETH
          </p>
          <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] left-[947px] text-[18px] text-[color:var(--color\/text-accent,#e89b55)] top-[1304px] whitespace-nowrap" data-node-id="I70522:3671;70504:3261">
            1.79 ETH
          </p>
          <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] left-[947px] text-[18px] text-[color:var(--color\/text-accent,#e89b55)] top-[1724px] whitespace-nowrap" data-node-id="I70522:3671;70504:3262">
            0.39 ETH
          </p>
          <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[16px] left-[1046px] text-[18px] text-[color:var(--color\/secondary,#b39463)] top-[884px] whitespace-nowrap" data-node-id="I70522:3671;70504:3263">
            2.29 ETH
          </p>
          <div className="absolute bg-[var(--color\/surface-card,#241612)] h-[300px] left-[365px] top-[550px] w-[258px]" data-node-id="I70522:3671;70504:3264" />
          <div className="absolute bg-[var(--color\/surface-card,#241612)] h-[300px] left-[365px] top-[970px] w-[258px]" data-node-id="I70522:3671;70504:3265" />
          <div className="absolute bg-[var(--color\/surface-card,#241612)] h-[300px] left-[365px] top-[1390px] w-[258px]" data-node-id="I70522:3671;70504:3266" />
          <div className="absolute bg-[var(--color\/surface-card,#241612)] h-[300px] left-[656px] top-[550px] w-[258px]" data-node-id="I70522:3671;70504:3267" />
          <div className="absolute bg-[var(--color\/surface-card,#241612)] h-[300px] left-[656px] top-[970px] w-[258px]" data-node-id="I70522:3671;70504:3268" />
          <div className="absolute bg-[var(--color\/surface-card,#241612)] h-[300px] left-[656px] top-[1390px] w-[258px]" data-node-id="I70522:3671;70504:3269" />
          <div className="absolute bg-[var(--color\/primary,#d28a4c)] h-px left-[656px] top-[550px] w-[258px]" data-node-id="I70522:3671;70504:3270" />
          <div className="absolute bg-[var(--color\/surface-card,#241612)] h-[300px] left-[947px] top-[550px] w-[258px]" data-node-id="I70522:3671;70504:3271" />
          <div className="absolute bg-[var(--color\/surface-card,#241612)] h-[300px] left-[947px] top-[970px] w-[258px]" data-node-id="I70522:3671;70504:3272" />
          <div className="absolute bg-[var(--color\/surface-card,#241612)] h-[300px] left-[947px] top-[1390px] w-[258px]" data-node-id="I70522:3671;70504:3273" />
          <div className="absolute left-[369px] rounded-[16px] size-[250px] top-[581px]" data-node-id="I70522:3671;70504:3274" data-name="NFT Auth Artwork 3">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgNftAuthArtwork3} />
          </div>
          <div className="absolute left-[660px] rounded-[16px] size-[250px] top-[575px]" data-node-id="I70522:3671;70504:3275" data-name="NFT Auth Artwork 4">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgNftAuthArtwork4} />
          </div>
          <div className="absolute left-[951px] rounded-[16px] size-[250px] top-[574px]" data-node-id="I70522:3671;70504:3276" data-name="NFT Auth Artwork 5">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgNftAuthArtwork1} />
          </div>
          <div className="absolute h-0 left-[1028px] top-[893px] w-[65px]" data-node-id="I70522:3671;70504:3277">
            <div className="absolute inset-[-1px_0_0_0]">
              <img alt="" className="block max-w-none size-full" src={imgLine4} />
            </div>
          </div>
          <div className="absolute bg-[var(--color\/primary,#d28a4c)] h-[29px] left-[947px] top-[564px] w-[80px]" data-node-id="I70522:3671;70504:3278" />
          <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium leading-[16px] left-[962px] text-[16px] text-[color:var(--color\/ink,#140d0a)] top-[571px] whitespace-nowrap" data-node-id="I70522:3671;70504:3279">
            RARO
          </p>
          <div className="absolute contents left-[723px] top-[808px]" data-node-id="I70522:3671;70504:3280">
            <div className="absolute bg-[var(--color\/surface-raised,#2f1d15)] border border-[var(--color\/border,#3f2319)] border-solid left-[723px] rounded-[4px] size-[35px] top-[808px]" data-node-id="I70522:3671;70504:3281" />
            <div className="absolute bg-[var(--color\/surface-raised,#2f1d15)] border border-[var(--color\/border,#3f2319)] border-solid left-[768px] rounded-[4px] size-[35px] top-[808px]" data-node-id="I70522:3671;70504:3282" />
            <div className="absolute bg-[var(--color\/surface-raised,#2f1d15)] border border-[var(--color\/border,#3f2319)] border-solid left-[813px] rounded-[4px] size-[35px] top-[808px]" data-node-id="I70522:3671;70504:3283" />
          </div>
          <div className="absolute left-[729px] size-[20px] top-[816px]" data-node-id="I70522:3671;70504:3284" data-name="shopping 1">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShopping1} />
          </div>
          <div className="absolute left-[775px] size-[20px] top-[816px]" data-node-id="I70522:3671;70504:3286" data-name="heart 1">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHeart1} />
          </div>
          <div className="absolute h-[20px] left-[822px] top-[815px] w-[19.991px]" data-node-id="I70522:3671;70504:3288" data-name="Frame">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
          </div>
          <div className="absolute h-[286px] left-[386px] rounded-[16px] top-[976px] w-[224px]" data-node-id="I70522:3671;70504:3290" data-name="NFT Auth Artwork 6">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgNftAuthArtwork6} />
          </div>
          <div className="absolute left-[660px] rounded-[16px] size-[250px] top-[993px]" data-node-id="I70522:3671;70504:3291" data-name="NFT Auth Artwork 7">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgNftAuthArtwork3} />
          </div>
          <div className="absolute left-[951px] rounded-[16px] size-[250px] top-[993px]" data-node-id="I70522:3671;70504:3292" data-name="NFT Auth Artwork 8">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgNftAuthArtwork4} />
          </div>
          <div className="absolute left-[369px] rounded-[16px] size-[250px] top-[1408px]" data-node-id="I70522:3671;70504:3293" data-name="NFT Auth Artwork 9">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgNftAuthArtwork1} />
          </div>
          <div className="absolute left-[660px] rounded-[16px] size-[250px] top-[1418px]" data-node-id="I70522:3671;70504:3294" data-name="NFT Auth Artwork 10">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgNftAuthArtwork6} />
          </div>
          <div className="absolute left-[951px] rounded-[16px] size-[250px] top-[1409px]" data-node-id="I70522:3671;70504:3295" data-name="NFT Auth Artwork 11">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgNftAuthArtwork3} />
          </div>
        </div>
        <Filters className="absolute bg-[var(--color\/surface-card,#241612)] content-stretch flex flex-col items-start left-[5px] overflow-clip p-[20px] top-[496px] w-[310px]" />
      </div>
    </div>
  );
}
```

## Metadados do Figma

These styles are contained in the design: Color/Foreground: #F5F1EB, Body/14 Bold · lh auto: Font(family: "font/family", style: Bold, size: 14, weight: 700, lineHeight: 100, letterSpacing: 10), Text/Accent: #E89B55, Body Large/16 Bold · lh auto: Font(family: "font/family", style: Bold, size: 16, weight: 700, lineHeight: 100, letterSpacing: 0), Color/Primary: #D28A4C, Body Large/16 Regular · lh auto: Font(family: "font/family", style: Regular, size: 16, weight: 400, lineHeight: 100, letterSpacing: 0), Color/Ink: #140D0A, Tiny/10 Medium: Font(family: "font/family", style: Medium, size: 10, weight: 500, lineHeight: 100, letterSpacing: 0), Body Large/16 Medium · lh auto: Font(family: "font/family", style: Medium, size: 16, weight: 500, lineHeight: 100, letterSpacing: 0), Display/43 Bold: Font(family: "font/family", style: Bold, size: 43, weight: 700, lineHeight: 70, letterSpacing: 0), Body/14 Medium · lh 16: Font(family: "font/family", style: Medium, size: 14, weight: 500, lineHeight: 16, letterSpacing: 10), Text/Secondary: #CFB28C, Body/14 Regular · lh 24: Font(family: "font/family", style: Regular, size: 14, weight: 400, lineHeight: 24, letterSpacing: 0), Body Large/16 Bold · lh 20: Font(family: "font/family", style: Bold, size: 16, weight: 700, lineHeight: 20, letterSpacing: 0), Body/15 Bold · lh 16: Font(family: "font/family", style: Bold, size: 15, weight: 700, lineHeight: 16, letterSpacing: 0), Body/15 Regular · lh 16: Font(family: "font/family", style: Regular, size: 15, weight: 400, lineHeight: 100, letterSpacing: 0), Body Large/16 Regular · lh 16: Font(family: "font/family", style: Regular, size: 16, weight: 400, lineHeight: 16, letterSpacing: 0), Body Large/18 Bold · lh 16: Font(family: "font/family", style: Bold, size: 18, weight: 700, lineHeight: 16, letterSpacing: 0), Color/Secondary: #B39463, Body Large/18 Regular: Font(family: "font/family", style: Regular, size: 18, weight: 400, lineHeight: 16, letterSpacing: 0), Color/Surface Card: #241612, Color/Border: #3F2319, Body Large/16 Medium · lh 16: Font(family: "font/family", style: Medium, size: 16, weight: 500, lineHeight: 16, letterSpacing: 0), Color/Surface Raised: #2F1D15, Body/15 Regular · lh 40: Font(family: "font/family", style: Regular, size: 15, weight: 400, lineHeight: 40, letterSpacing: 0), Body/15 Bold · lh 40: Font(family: "font/family", style: Bold, size: 15, weight: 700, lineHeight: 40, letterSpacing: 0).

Component descriptions: The following components have usage descriptions or documentation links defined in Figma. These descriptions provide important context about the intended usage, best practices, and any constraints for each component. Follow these guidelines when implementing or using these components.

## Marketplace Page
**Node ID:** 70504:3297

Full marketplace home page content shown behind the sign-in and sign-up modals: banner, sort row, product grid and filters panel. Its header is an instance of Header With Divider. Known unfixed defects frozen here: an orphan duplicate price label "2.29 ETH" overlapping a card, and a square-cornered RARO chip overhanging a rounded card corner — fixing either one here now updates both auth screens at once.

## Header With Divider
**Node ID:** 70504:3017

Header Row plus the hairline divider beneath it. Used on the five sites that already show the divider: the home, collector profile and wallets screens, and inside Marketplace Page, which the two auth screens instance. Market screens intentionally use a bare Header Row with no divider.

## Header Row
**Node ID:** 70486:560

Desktop header row, 1200 wide: KURIO wordmark, 4-item nav with one active item, search, cart with count badge, and the sign-in button. Set Active to match the screen (Home on Início/Entrar/Criar conta/Perfil do colecionador/Carteiras, Market on the four Mercado-flow screens). Badge Count is the cart item count. Drop at index 0 of the screen Top or Header frame with FILL width and HUG height. The hairline rule under the header belongs to the host Header frame, not to this component.

## Filters
**Node ID:** 70485:381

Marketplace sidebar filter panel, 310 wide: collection checkboxes with counts, price range with Apply, and network checkboxes. Fixed 310 width — the host column owns the placement. Content is identical on every screen; no per-instance overrides expected.
