# Desktop / Detalhes do NFT (10:244) — Header Row + breadcrumb + galeria + detalhes

- Figma: file `uweCCvGGvM7N1rQTFUjwQ3`, node `70342:2770`
- Screenshot de referência: `docs/design/frames/desktop-detalhe.png`
- Fonte: `get_design_context` (React+Tailwind de referência; **não é código final** — adaptar ao projeto). Assets já baixados em `design-src/assets/`.

## Código de referência

```tsx
const assetDir = "/design-src/assets"; // assets locais (URLs temporárias do Figma substituídas)
const imgMessage = `${assetDir}/icon-share-mail.svg`;
const imgNftCollectionArtwork04 = `${assetDir}/nft-emerald-ape.png`;
const imgActiveUnderline = `${assetDir}/deco-nav-underline-68.svg`;
const imgSearchIcon = `${assetDir}/icon-search.svg`;
const imgCartIcon = `${assetDir}/icon-cart.svg`;
const imgBadge = `${assetDir}/deco-cart-badge.svg`;
const imgLogout = `${assetDir}/icon-login-ink.svg`;
const imgFrame238 = `${assetDir}/button-zoom.svg`;
const imgStar = `${assetDir}/icon-star-filled.svg`;
const imgStar1 = `${assetDir}/icon-star-muted.svg`;
const imgLine2 = `${assetDir}/deco-divider-573.svg`;
const imgEllipse24 = `${assetDir}/deco-chip-edition-36.svg`;
const imgEllipse25 = `${assetDir}/deco-chip-edition-42.svg`;
const imgEllipse26 = `${assetDir}/deco-chip-edition-46-active.svg`;
const imgEllipse27 = `${assetDir}/deco-chip-edition-66.svg`;
const imgFrame = `${assetDir}/icon-minus-lg.svg`;
const imgFrame1 = `${assetDir}/icon-plus-lg.svg`;
const imgHeart1 = `${assetDir}/icon-heart-primary.svg`;
const imgLinkedin = `${assetDir}/icon-share-linkedin.svg`;
const imgTwitter = `${assetDir}/icon-share-twitter.svg`;

function Message({ className }: { className?: string }) {
  return (
    <div className={className || "relative size-[18px]"} data-node-id="11:1248" data-name="Message">
      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMessage} />
    </div>
  );
}

export default function Top() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-end relative size-full" data-node-id="70342:2770" data-name="Top">
      <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="70488:626" data-name="Header Row">
        <div className="h-[34.3px] overflow-clip relative shrink-0 w-[160px]" data-node-id="I70488:626;70486:535" data-name="Logo">
          <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[normal] left-0 text-[14px] text-[color:var(--color\/foreground,#f5f1eb)] top-[8.15px] tracking-[1.4px] whitespace-nowrap" data-node-id="I70488:626;70486:536">
            KURIO
          </p>
        </div>
        <div className="content-stretch flex gap-[40px] items-start overflow-clip relative shrink-0" data-node-id="I70488:626;70486:537" data-name="Nav">
          <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="I70488:626;70486:538">
            Início
          </p>
          <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0" data-node-id="I70488:626;70486:539" data-name="Nav Item">
            <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[normal] relative shrink-0 text-[16px] text-[color:var(--color\/text-accent,#e89b55)] whitespace-nowrap" data-node-id="I70488:626;70486:540">
              Mercado
            </p>
            <div className="h-0 relative shrink-0 w-full" data-node-id="I70488:626;70486:541" data-name="Active Underline">
              <div className="absolute inset-[-3px_0_0_0]">
                <img alt="" className="block max-w-none size-full" src={imgActiveUnderline} />
              </div>
            </div>
          </div>
          <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="I70488:626;70486:542">
            Criadores
          </p>
          <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="I70488:626;70486:543">
            Aprenda
          </p>
        </div>
        <div className="content-stretch flex gap-[28px] items-center relative shrink-0" data-node-id="I70488:626;70486:544" data-name="Header Actions">
          <div className="h-[20px] relative shrink-0 w-[20.001px]" data-node-id="I70488:626;70486:545" data-name="Search Icon">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSearchIcon} />
          </div>
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-node-id="I70488:626;70486:546" data-name="Cart">
            <div className="col-1 h-[24px] ml-0 mt-0 relative row-1 w-[24.004px]" data-node-id="I70488:626;70486:547" data-name="Cart Icon">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCartIcon} />
            </div>
            <div className="col-1 ml-[15px] mt-0 relative row-1 size-[16px]" data-node-id="I70488:626;70486:548" data-name="Badge">
              <div className="absolute inset-[-12.5%]">
                <img alt="" className="block max-w-none size-full" src={imgBadge} />
              </div>
            </div>
            <p className="[word-break:break-word] col-1 font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium leading-[normal] ml-[20px] mt-[1.5px] relative row-1 text-[10px] text-[color:var(--color\/ink,#140d0a)] whitespace-nowrap" data-node-id="I70488:626;70486:549">
              6
            </p>
          </div>
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-node-id="I70488:626;70486:550" data-name="Login">
            <div className="bg-[var(--color\/primary,#d28a4c)] col-1 content-stretch flex flex-col h-[35px] items-center justify-center ml-0 mt-0 relative rounded-[6px] row-1 w-[100px]" data-node-id="I70488:626;70486:551" data-name="Login Button">
              <div className="content-stretch flex gap-[4px] items-start relative shrink-0" data-node-id="I70488:626;70486:552" data-name="Login Button Content">
                <div className="relative shrink-0 size-[20px]" data-node-id="I70488:626;70486:553" data-name="Iconly/Curved/Logout">
                  <div className="absolute inset-[11.46%_9.2%_11.46%_9.41%]" data-node-id="I70488:626;70486:553;29221:4777" data-name="Logout">
                    <div className="absolute inset-[-4.86%_-4.61%]">
                      <img alt="" className="block max-w-none size-full" src={imgLogout} />
                    </div>
                  </div>
                </div>
                <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium leading-[normal] relative shrink-0 text-[16px] text-[color:var(--color\/ink,#140d0a)] whitespace-nowrap" data-node-id="I70488:626;70486:554">
                  Entrar
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full" data-node-id="70362:239" data-name="Main">
        <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[15px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="10:290">
          Início / Mercado
        </p>
        <div className="content-stretch flex gap-[32px] items-start relative shrink-0 w-full" data-node-id="70342:2764" data-name="Product">
          <div className="content-stretch flex gap-[28px] h-[448px] items-center relative shrink-0 w-[573px]" data-node-id="70363:239" data-name="Product Images">
            <div className="absolute bg-[var(--color\/surface-card,#241612)] left-0 rounded-[6px] size-[100px] top-0" data-node-id="11:1074" />
            <div className="absolute bg-[var(--color\/surface-card,#241612)] left-0 rounded-[6px] size-[100px] top-[116px]" data-node-id="11:1075" />
            <div className="absolute bg-[var(--color\/surface-card,#241612)] left-0 rounded-[6px] size-[100px] top-[232px]" data-node-id="11:1076" />
            <div className="absolute bg-[var(--color\/surface-card,#241612)] left-0 rounded-[6px] size-[100px] top-[348px]" data-node-id="11:1077" />
            <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[100px]" data-node-id="70342:2682" data-name="Thumbnails">
              <div className="h-[100px] relative rounded-[8px] shrink-0 w-full" data-node-id="11:1181" data-name="NFT Collection Artwork 04">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgNftCollectionArtwork04} />
              </div>
              <div className="border border-[var(--color\/primary,#d28a4c)] border-solid h-[100px] relative rounded-[8px] shrink-0 w-full" data-node-id="11:1188" data-name="NFT Collection Artwork 02">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgNftCollectionArtwork04} />
              </div>
              <div className="h-[100px] relative rounded-[8px] shrink-0 w-full" data-node-id="11:1189" data-name="NFT Collection Artwork 05">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgNftCollectionArtwork04} />
              </div>
              <div className="h-[100px] relative rounded-[8px] shrink-0 w-full" data-node-id="11:1190" data-name="NFT Collection Artwork 03">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgNftCollectionArtwork04} />
              </div>
            </div>
            <div className="bg-[var(--color\/surface-card,#241612)] content-stretch flex items-center justify-center p-[16px] relative rounded-[6px] shrink-0 size-[444px]" data-node-id="70342:2683" data-name="Main Image">
              <div className="relative rounded-[24px] shrink-0 size-[404px]" data-node-id="11:1161" data-name="NFT Collection Artwork 01">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[24px] size-full" src={imgNftCollectionArtwork04} />
              </div>
            </div>
            <div className="absolute content-stretch flex items-center justify-center left-[530px] top-[15px]" data-node-id="70410:3937">
              <div className="relative shrink-0 size-[30px]" data-node-id="70380:2856">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame238} />
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-w-px relative self-stretch" data-node-id="70342:2763" data-name="Details">
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="70342:2686">
              <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="70342:2685">
                <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[normal] relative shrink-0 text-[28px] text-[color:var(--color\/foreground,#f5f1eb)] w-full" data-node-id="11:1132">
                  Emerald Ape #042
                </p>
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="70342:2684">
                  <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[22px] text-[color:var(--color\/text-accent,#e89b55)] whitespace-nowrap" data-node-id="11:1141">
                    1.19 ETH
                  </p>
                  <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-node-id="11:1210">
                    <div className="relative shrink-0 size-[15px]" data-node-id="11:1195" data-name="Iconly/Bold/Star">
                      <div className="absolute inset-[10.42%_8.32%_10.41%_8.33%]" data-node-id="I11:1195;11:1193" data-name="Star">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStar} />
                      </div>
                    </div>
                    <div className="relative shrink-0 size-[15px]" data-node-id="11:1198" data-name="Iconly/Bold/Star">
                      <div className="absolute inset-[10.42%_8.32%_10.41%_8.33%]" data-node-id="I11:1198;11:1193" data-name="Star">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStar} />
                      </div>
                    </div>
                    <div className="relative shrink-0 size-[15px]" data-node-id="11:1201" data-name="Iconly/Bold/Star">
                      <div className="absolute inset-[10.42%_8.32%_10.41%_8.33%]" data-node-id="I11:1201;11:1193" data-name="Star">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStar} />
                      </div>
                    </div>
                    <div className="relative shrink-0 size-[15px]" data-node-id="11:1204" data-name="Iconly/Bold/Star">
                      <div className="absolute inset-[10.42%_8.32%_10.41%_8.33%]" data-node-id="I11:1204;11:1193" data-name="Star">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStar} />
                      </div>
                    </div>
                    <div className="relative shrink-0 size-[15px]" data-node-id="11:1207" data-name="Iconly/Bold/Star">
                      <div className="absolute inset-[10.42%_8.32%_10.41%_8.33%]" data-node-id="I11:1207;11:1193" data-name="Star">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStar1} />
                      </div>
                    </div>
                    <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] relative shrink-0 text-[15px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="11:1191">
                      19 avaliações de colecionadores
                    </p>
                  </div>
                </div>
              </div>
              <div className="h-0 relative shrink-0 w-[573px]" data-node-id="11:1211">
                <div className="absolute inset-[-0.3px_0_0_0]">
                  <img alt="" className="block max-w-none size-full" src={imgLine2} />
                </div>
              </div>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[574px]" data-node-id="70342:2687">
              <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[15px] text-[color:var(--color\/foreground,#f5f1eb)] w-full" data-node-id="11:1214">
                Sobre este NFT:
              </p>
              <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal h-[66px] leading-[24px] relative shrink-0 text-[14px] text-[color:var(--color\/text-secondary,#cfb28c)] w-full" data-node-id="11:1215">
                Um colecionável digital finalizado à mão da coleção Kurio Editions, verificado na Ethereum, com arte desbloqueável e acesso para colecionadores.
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[209px]" data-node-id="70342:2696">
              <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[15px] text-[color:var(--color\/foreground,#f5f1eb)] w-full" data-node-id="11:1216">
                Edição:
              </p>
              <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-node-id="70342:2695">
                <div className="content-stretch flex gap-[10px] h-[28px] items-center justify-center px-[4px] py-[6px] relative shrink-0 w-[36px]" data-node-id="70342:2694">
                  <div className="absolute h-[28px] left-0 top-0 w-[36px]" data-node-id="11:1217">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse24} />
                  </div>
                  <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[16px] relative shrink-0 text-[14px] text-[color:var(--color\/text-secondary,#cfb28c)] whitespace-nowrap" data-node-id="11:1219">
                    1/1
                  </p>
                </div>
                <div className="content-stretch flex gap-[10px] h-[28px] items-center justify-center px-[4px] py-[6px] relative shrink-0 w-[42px]" data-node-id="70342:2691">
                  <div className="absolute h-[28px] left-0 top-0 w-[42px]" data-node-id="11:1220">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse25} />
                  </div>
                  <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[16px] relative shrink-0 text-[14px] text-[color:var(--color\/text-secondary,#cfb28c)] text-center whitespace-nowrap" data-node-id="11:1221">
                    1/10
                  </p>
                </div>
                <div className="content-stretch flex gap-[10px] h-[28px] items-center justify-center p-[6px] relative shrink-0 w-[46px]" data-node-id="70342:2692">
                  <div className="absolute h-[28px] left-0 top-0 w-[46px]" data-node-id="11:1222">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse26} />
                  </div>
                  <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium leading-[16px] relative shrink-0 text-[14px] text-[color:var(--color\/text-accent,#e89b55)] text-center whitespace-nowrap" data-node-id="11:1223">
                    1/50
                  </p>
                </div>
                <div className="content-stretch flex gap-[10px] h-[28px] items-center justify-center px-[8px] py-[6px] relative shrink-0 w-[66px]" data-node-id="70342:2693">
                  <div className="absolute h-[28px] left-0 top-0 w-[66px]" data-node-id="11:1224">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse27} />
                  </div>
                  <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[16px] relative shrink-0 text-[14px] text-[color:var(--color\/text-secondary,#cfb28c)] text-center whitespace-nowrap" data-node-id="11:1225">
                    ABERTA
                  </p>
                </div>
              </div>
            </div>
            <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="70342:2762">
              <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-node-id="11:1238" data-name="01">
                <div className="col-1 content-stretch flex items-center justify-center ml-0 mt-0 relative row-1" data-node-id="70342:2700">
                  <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-node-id="70410:4189">
                    <div className="bg-[var(--color\/primary,#d28a4c)] border border-[#140d0a] border-solid content-stretch drop-shadow-[0px_6.6px_9.9px_rgba(20,13,10,0.15)] flex flex-col h-[49.5px] items-center justify-center relative rounded-[33px] shrink-0 w-[33px]" data-node-id="70410:4190" data-name="Add Button">
                      <div className="relative shrink-0 size-[26.4px]" data-node-id="70410:4191" data-name="Frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
                      </div>
                    </div>
                    <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[28px] relative shrink-0 text-[20px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="70410:4200">
                      1
                    </p>
                    <div className="bg-[var(--color\/primary,#d28a4c)] border border-[#140d0a] border-solid content-stretch drop-shadow-[0px_6.6px_9.9px_rgba(20,13,10,0.15)] flex flex-col h-[49.5px] items-center justify-center relative rounded-[33px] shrink-0 w-[33px]" data-node-id="70410:4194" data-name="Add Button">
                      <div className="relative shrink-0 size-[26.4px]" data-node-id="70410:4195" data-name="Frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="70410:3938">
                <div className="bg-[var(--color\/primary,#d28a4c)] content-stretch flex h-[40px] items-center justify-center relative rounded-[6px] shrink-0 w-[130px]" data-node-id="70342:2756">
                  <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[20px] relative shrink-0 text-[14px] text-[color:var(--color\/ink,#140d0a)] whitespace-nowrap" data-node-id="11:1240">
                    COMPRAR
                  </p>
                </div>
                <div className="border border-[var(--color\/primary,#d28a4c)] border-solid content-stretch flex gap-[8px] h-[40px] items-center justify-center relative rounded-[6px] shrink-0 w-[130px]" data-node-id="70342:2757">
                  <div className="relative shrink-0 size-[20px]" data-node-id="70410:3940" data-name="heart 1">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHeart1} />
                  </div>
                  <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium leading-[20px] relative shrink-0 text-[14px] text-[color:var(--color\/text-accent,#e89b55)] whitespace-nowrap" data-node-id="11:1242">
                    Favoritar
                  </p>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[308px]" data-node-id="70342:2761">
              <div className="[word-break:break-word] content-stretch flex flex-col font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal gap-[12px] items-start leading-[normal] relative shrink-0 text-[15px] text-[color:var(--color\/secondary,#b39463)] w-full" data-node-id="70342:2759">
                <p className="relative shrink-0 w-full" data-node-id="10:291">
                  ID do token: #0042
                </p>
                <p className="relative shrink-0 w-full" data-node-id="11:1212">
                  Coleção: Kurio Apes
                </p>
                <p className="relative shrink-0 w-full" data-node-id="11:1226">
                  Atributos: Óculos, Esmeralda, Raro
                </p>
              </div>
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="70342:2760">
                <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[15px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="11:1244">
                  Compartilhar este NFT:
                </p>
                <div className="h-[14.375px] relative shrink-0 w-[15px]" data-node-id="11:1245" data-name="Linkedin">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLinkedin} />
                </div>
                <Message className="relative shrink-0 size-[18px]" />
                <div className="h-[12.191px] relative shrink-0 w-[15.966px]" data-node-id="11:1247" data-name="Twitter">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgTwitter} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Metadados do Figma

These styles are contained in the design: Color/Foreground: #F5F1EB, Body/14 Bold · lh auto: Font(family: "font/family", style: Bold, size: 14, weight: 700, lineHeight: 100, letterSpacing: 10), Body Large/16 Regular · lh auto: Font(family: "font/family", style: Regular, size: 16, weight: 400, lineHeight: 100, letterSpacing: 0), Text/Accent: #E89B55, Body Large/16 Bold · lh auto: Font(family: "font/family", style: Bold, size: 16, weight: 700, lineHeight: 100, letterSpacing: 0), Color/Primary: #D28A4C, Color/Ink: #140D0A, Tiny/10 Medium: Font(family: "font/family", style: Medium, size: 10, weight: 500, lineHeight: 100, letterSpacing: 0), Body Large/16 Medium · lh auto: Font(family: "font/family", style: Medium, size: 16, weight: 500, lineHeight: 100, letterSpacing: 0), Body/15 Bold · lh 16: Font(family: "font/family", style: Bold, size: 15, weight: 700, lineHeight: 16, letterSpacing: 0), Color/Surface Card: #241612, Color/Surface Raised: #2F1D15, Color/Border: #3F2319, Heading/28 Bold: Font(family: "font/family", style: Bold, size: 28, weight: 700, lineHeight: 100, letterSpacing: 0), Title/22 Bold: Font(family: "font/family", style: Bold, size: 22, weight: 700, lineHeight: 16, letterSpacing: 0), Text/Secondary: #CFB28C, Body/15 Regular · lh 16: Font(family: "font/family", style: Regular, size: 15, weight: 400, lineHeight: 100, letterSpacing: 0), Body/14 Regular · lh 24: Font(family: "font/family", style: Regular, size: 14, weight: 400, lineHeight: 24, letterSpacing: 0), Body/14 Regular · lh 16: Font(family: "font/family", style: Regular, size: 14, weight: 400, lineHeight: 16, letterSpacing: 0), Body/14 Medium · lh 16 · ls 0%: Font(family: "font/family", style: Medium, size: 14, weight: 500, lineHeight: 16, letterSpacing: 0), Color/Black: #000000, Title/20 Regular · lh 10: Font(family: "font/family", style: Regular, size: 20, weight: 400, lineHeight: 28, letterSpacing: 0), Body/14 Bold · lh 20: Font(family: "font/family", style: Bold, size: 14, weight: 700, lineHeight: 20, letterSpacing: 0), Body/14 Medium · lh 20: Font(family: "font/family", style: Medium, size: 14, weight: 500, lineHeight: 20, letterSpacing: 0), Color/Secondary: #B39463.

Component descriptions: The following components have usage descriptions or documentation links defined in Figma. These descriptions provide important context about the intended usage, best practices, and any constraints for each component. Follow these guidelines when implementing or using these components.

## Header Row
**Node ID:** 70486:560

Desktop header row, 1200 wide: KURIO wordmark, 4-item nav with one active item, search, cart with count badge, and the sign-in button. Set Active to match the screen (Home on Início/Entrar/Criar conta/Perfil do colecionador/Carteiras, Market on the four Mercado-flow screens). Badge Count is the cart item count. Drop at index 0 of the screen Top or Header frame with FILL width and HUG height. The hairline rule under the header belongs to the host Header frame, not to this component.
