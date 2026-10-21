# Desktop / Início (2:2) — Header With Divider + Hero

- Figma: file `uweCCvGGvM7N1rQTFUjwQ3`, node `70353:242`
- Screenshot de referência: `docs/design/frames/desktop-inicio.png`
- Fonte: `get_design_context` (React+Tailwind de referência; **não é código final** — adaptar ao projeto). Assets já baixados em `design-src/assets/`.

## Código de referência

```tsx
const assetDir = "/design-src/assets"; // assets locais (URLs temporárias do Figma substituídas)
const imgFrame136 = `${assetDir}/nft-emerald-ape.png`;
const imgActiveUnderline = `${assetDir}/deco-nav-underline-58.svg`;
const imgSearchIcon = `${assetDir}/icon-search.svg`;
const imgCartIcon = `${assetDir}/icon-cart.svg`;
const imgBadge = `${assetDir}/deco-cart-badge.svg`;
const imgLogout = `${assetDir}/icon-login-ink.svg`;
const imgLine1 = `${assetDir}/deco-divider-1200-header.svg`;
const imgRectangle3 = `${assetDir}/deco-hero-bg-empty.svg`;
const imgGroup4 = `${assetDir}/deco-dots-hero.svg`;

export default function Top() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative size-full" data-node-id="70353:242" data-name="Top">
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-[1200.001px]" data-node-id="70522:3240" data-name="Header With Divider">
        <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="I70522:3240;70504:3015" data-name="Header Row">
          <div className="h-[34.3px] overflow-clip relative shrink-0 w-[160px]" data-node-id="I70522:3240;70504:3015;70486:509" data-name="Logo">
            <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[normal] left-0 text-[14px] text-[color:var(--color\/foreground,#f5f1eb)] top-[8.15px] tracking-[1.4px] whitespace-nowrap" data-node-id="I70522:3240;70504:3015;70486:510">
              KURIO
            </p>
          </div>
          <div className="content-stretch flex gap-[40px] items-start overflow-clip relative shrink-0" data-node-id="I70522:3240;70504:3015;70486:511" data-name="Nav">
            <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[58px]" data-node-id="I70522:3240;70504:3015;70486:512" data-name="Nav Item">
              <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[normal] relative shrink-0 text-[16px] text-[color:var(--color\/text-accent,#e89b55)] w-full" data-node-id="I70522:3240;70504:3015;70486:513">
                Início
              </p>
              <div className="h-0 relative shrink-0 w-full" data-node-id="I70522:3240;70504:3015;70486:514" data-name="Active Underline">
                <div className="absolute inset-[-3px_0_0_0]">
                  <img alt="" className="block max-w-none size-full" src={imgActiveUnderline} />
                </div>
              </div>
            </div>
            <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="I70522:3240;70504:3015;70486:515">
              Mercado
            </p>
            <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="I70522:3240;70504:3015;70486:516">
              Criadores
            </p>
            <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="I70522:3240;70504:3015;70486:517">
              Aprenda
            </p>
          </div>
          <div className="content-stretch flex gap-[28px] items-center relative shrink-0" data-node-id="I70522:3240;70504:3015;70486:518" data-name="Header Actions">
            <div className="h-[20px] relative shrink-0 w-[20.001px]" data-node-id="I70522:3240;70504:3015;70486:519" data-name="Search Icon">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSearchIcon} />
            </div>
            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-node-id="I70522:3240;70504:3015;70486:520" data-name="Cart">
              <div className="col-1 h-[24px] ml-0 mt-0 relative row-1 w-[24.004px]" data-node-id="I70522:3240;70504:3015;70486:521" data-name="Cart Icon">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCartIcon} />
              </div>
              <div className="col-1 ml-[15px] mt-0 relative row-1 size-[16px]" data-node-id="I70522:3240;70504:3015;70486:522" data-name="Badge">
                <div className="absolute inset-[-12.5%]">
                  <img alt="" className="block max-w-none size-full" src={imgBadge} />
                </div>
              </div>
              <p className="[word-break:break-word] col-1 font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium leading-[normal] ml-[20px] mt-[1.5px] relative row-1 text-[10px] text-[color:var(--color\/ink,#140d0a)] whitespace-nowrap" data-node-id="I70522:3240;70504:3015;70486:523">
                6
              </p>
            </div>
            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-node-id="I70522:3240;70504:3015;70486:524" data-name="Login">
              <div className="bg-[var(--color\/primary,#d28a4c)] col-1 content-stretch flex flex-col h-[35px] items-center justify-center ml-0 mt-0 relative rounded-[6px] row-1 w-[100px]" data-node-id="I70522:3240;70504:3015;70486:525" data-name="Login Button">
                <div className="content-stretch flex gap-[4px] items-start relative shrink-0" data-node-id="I70522:3240;70504:3015;70486:526" data-name="Login Button Content">
                  <div className="relative shrink-0 size-[20px]" data-node-id="I70522:3240;70504:3015;70486:527" data-name="Iconly/Curved/Logout">
                    <div className="absolute inset-[11.46%_9.2%_11.46%_9.41%]" data-node-id="I70522:3240;70504:3015;70486:527;29221:4777" data-name="Logout">
                      <div className="absolute inset-[-4.86%_-4.61%]">
                        <img alt="" className="block max-w-none size-full" src={imgLogout} />
                      </div>
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium leading-[normal] relative shrink-0 text-[16px] text-[color:var(--color\/ink,#140d0a)] whitespace-nowrap" data-node-id="I70522:3240;70504:3015;70486:528">
                    Entrar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-0 relative shrink-0 w-full" data-node-id="I70522:3240;70504:3016">
          <div className="absolute inset-[-0.3px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine1} />
          </div>
        </div>
      </div>
      <div className="content-stretch flex h-[450px] items-center pl-[40px] relative shrink-0" data-node-id="70347:239" data-name="Hero">
        <div className="absolute h-[450px] left-0 top-0 w-[1200px]" data-node-id="2:104">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgRectangle3} />
        </div>
        <div className="content-stretch flex items-center justify-between relative shrink-0 w-[1160px]" data-node-id="70342:2674">
          <div className="content-stretch flex flex-col gap-[44px] items-end relative shrink-0 w-[600px]" data-node-id="70342:2672">
            <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full" data-node-id="70342:2671">
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-node-id="70342:2670">
                <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 text-[color:var(--color\/foreground,#f5f1eb)] w-full" data-node-id="70342:2669">
                  <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium leading-[16px] relative shrink-0 text-[14px] tracking-[1.4px] w-full" data-node-id="3:113">
                    Bem-vindo à Kurio
                  </p>
                  <div className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[0] relative shrink-0 text-[43px] w-full" data-node-id="3:107">
                    <p className="leading-[70px] mb-0">SEJA DONO DO FUTURO</p>
                    <p className="leading-[70px]">DA ARTE DIGITAL</p>
                  </div>
                </div>
                <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[24px] relative shrink-0 text-[14px] text-[color:var(--color\/text-secondary,#cfb28c)] w-[557px]" data-node-id="3:114">
                  Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet.
                </p>
              </div>
              <div className="bg-[var(--color\/primary,#d28a4c)] content-stretch flex h-[40px] items-center justify-center pl-[28px] pr-[36px] py-[10px] relative rounded-[6px] shrink-0 w-[140px]" data-node-id="70342:2667">
                <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[20px] relative shrink-0 text-[16px] text-[color:var(--color\/ink,#140d0a)] whitespace-nowrap" data-node-id="3:127">
                  EXPLORAR
                </p>
              </div>
            </div>
            <div className="h-[8px] relative shrink-0 w-[40px]" data-node-id="3:131">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup4} />
            </div>
          </div>
          <div className="relative rounded-[24px] shrink-0 size-[450px]" data-node-id="70342:2673">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[24px] size-full" src={imgFrame136} />
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Metadados do Figma

These styles are contained in the design: Color/Foreground: #F5F1EB, Body/14 Bold · lh auto: Font(family: "font/family", style: Bold, size: 14, weight: 700, lineHeight: 100, letterSpacing: 10), Text/Accent: #E89B55, Body Large/16 Bold · lh auto: Font(family: "font/family", style: Bold, size: 16, weight: 700, lineHeight: 100, letterSpacing: 0), Color/Primary: #D28A4C, Body Large/16 Regular · lh auto: Font(family: "font/family", style: Regular, size: 16, weight: 400, lineHeight: 100, letterSpacing: 0), Color/Ink: #140D0A, Tiny/10 Medium: Font(family: "font/family", style: Medium, size: 10, weight: 500, lineHeight: 100, letterSpacing: 0), Body Large/16 Medium · lh auto: Font(family: "font/family", style: Medium, size: 16, weight: 500, lineHeight: 100, letterSpacing: 0), Body/14 Medium · lh 16: Font(family: "font/family", style: Medium, size: 14, weight: 500, lineHeight: 16, letterSpacing: 10), Display/43 Bold: Font(family: "font/family", style: Bold, size: 43, weight: 700, lineHeight: 70, letterSpacing: 0), Text/Secondary: #CFB28C, Body/14 Regular · lh 24: Font(family: "font/family", style: Regular, size: 14, weight: 400, lineHeight: 24, letterSpacing: 0), Body Large/16 Bold · lh 20: Font(family: "font/family", style: Bold, size: 16, weight: 700, lineHeight: 20, letterSpacing: 0).

Component descriptions: The following components have usage descriptions or documentation links defined in Figma. These descriptions provide important context about the intended usage, best practices, and any constraints for each component. Follow these guidelines when implementing or using these components.

## Header With Divider
**Node ID:** 70504:3017

Header Row plus the hairline divider beneath it. Used on the five sites that already show the divider: the home, collector profile and wallets screens, and inside Marketplace Page, which the two auth screens instance. Market screens intentionally use a bare Header Row with no divider.

## Header Row
**Node ID:** 70486:560

Desktop header row, 1200 wide: KURIO wordmark, 4-item nav with one active item, search, cart with count badge, and the sign-in button. Set Active to match the screen (Home on Início/Entrar/Criar conta/Perfil do colecionador/Carteiras, Market on the four Mercado-flow screens). Badge Count is the cart item count. Drop at index 0 of the screen Top or Header frame with FILL width and HUG height. The hairline rule under the header belongs to the host Header frame, not to this component.
