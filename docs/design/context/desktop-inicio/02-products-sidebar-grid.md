# Desktop / Início — Products: Filters, NFT em destaque, Toolbar (tabs/ordenar), grade, paginação

- Figma: file `uweCCvGGvM7N1rQTFUjwQ3`, node `70342:2831`
- Screenshot de referência: `docs/design/frames/desktop-inicio.png`
- Fonte: `get_design_context` (React+Tailwind de referência; **não é código final** — adaptar ao projeto). Assets já baixados em `design-src/assets/`.

## Código de referência

```tsx
const assetDir = "/design-src/assets"; // assets locais (URLs temporárias do Figma substituídas)
const imgEllipse5 = `${assetDir}/deco-slider-thumb.svg`;
const imgLine6 = `${assetDir}/deco-slider-range-161.svg`;
const imgLine5 = `${assetDir}/deco-slider-track-55.svg`;
const imgNftArtwork18 = `${assetDir}/nft-sage-nomad.png`;
const imgNftArtwork03 = `${assetDir}/nft-emerald-ape.png`;
const imgNftArtwork05 = `${assetDir}/nft-ivory-baron.png`;
const imgNftArtwork09 = `${assetDir}/nft-golden-beat.png`;
const imgArrowDown2 = `${assetDir}/icon-chevron-down-sm.svg`;
const imgLine3 = `${assetDir}/deco-tab-underline-101.svg`;
const imgArrowRight2 = `${assetDir}/icon-chevron-right.svg`;

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

export default function Products() {
  return (
    <div className="content-stretch flex gap-[48px] items-start relative size-full" data-node-id="70342:2831" data-name="Products">
      <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0" data-node-id="70410:3725" data-name="Sidebar">
        <Filters className="bg-[var(--color\/surface-card,#241612)] content-stretch flex flex-col items-start overflow-clip p-[20px] relative shrink-0 w-[310px]" />
        <div className="bg-gradient-to-b content-stretch flex from-[rgba(210,138,76,0.1)] gap-[10px] h-[470px] items-start overflow-clip pb-[4px] pt-[24px] relative shrink-0 to-[rgba(210,138,76,0.03)] w-[310px]" data-node-id="70410:3791" data-name="Featured NFT Banner">
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[310px]" data-node-id="70410:3792">
            <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0 w-full" data-node-id="70410:3793">
              <div className="content-stretch flex items-center justify-center px-[20px] relative shrink-0 w-full" data-node-id="70410:3794">
                <p className="[word-break:break-word] flex-[1_0_0] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[32px] min-w-px relative text-[24px] text-[color:var(--color\/text-accent,#e89b55)]" data-node-id="70410:3795">
                  NFT EM DESTAQUE
                </p>
              </div>
              <div className="content-stretch flex items-center justify-center px-[20px] relative shrink-0 w-full" data-node-id="70410:3796">
                <p className="[word-break:break-word] flex-[1_0_0] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] min-w-px relative text-[22px] text-[color:var(--color\/foreground,#f5f1eb)] text-center" data-node-id="70410:3797">
                  OFERTA LIMITADA
                </p>
              </div>
            </div>
            <div className="h-[368px] relative rounded-[22px] shrink-0 w-full" data-node-id="70410:3798" data-name="NFT Artwork 18">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[22px] size-full" src={imgNftArtwork18} />
            </div>
          </div>
          <div className="absolute border-2 border-[#46a358] border-solid left-[16px] opacity-20 rounded-[7px] size-[22px] top-[299px]" data-node-id="70410:3799" />
          <div className="absolute left-[248px] rounded-[29px] size-[45px] top-[343px]" data-node-id="70410:3800" style={{ backgroundImage: "linear-gradient(145.45990829607373deg, rgba(210, 138, 76, 0.3) 46.085%, rgba(210, 138, 76, 0) 103.28%)" }} />
          <div className="absolute left-[38px] rounded-[29px] size-[15px] top-[105px]" data-node-id="70410:3801" style={{ backgroundImage: "linear-gradient(145.45990829607373deg, rgba(210, 138, 76, 0.3) 46.085%, rgba(210, 138, 76, 0) 103.28%)" }} />
        </div>
      </div>
      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[88px] items-end min-w-px relative" data-node-id="70342:2830" data-name="Product Grid">
        <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full" data-node-id="70342:2829">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="70351:239" data-name="Toolbar">
            <div className="[word-break:break-word] content-stretch flex font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium gap-[20px] items-start leading-[16px] overflow-clip relative shrink-0 text-[15px] whitespace-nowrap" data-node-id="70351:240" data-name="Tabs">
              <p className="relative shrink-0 text-[color:var(--color\/text-accent,#e89b55)]" data-node-id="4:138">
                Todos os NFTs
              </p>
              <p className="relative shrink-0 text-[color:var(--color\/foreground,#f5f1eb)]" data-node-id="4:144">
                Novos lançamentos
              </p>
              <p className="relative shrink-0 text-[color:var(--color\/foreground,#f5f1eb)]" data-node-id="4:145">
                Em alta
              </p>
            </div>
            <div className="h-[18px] relative shrink-0 w-[300px]" data-node-id="70351:241" data-name="Sort">
              <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] left-0 text-[15px] text-[color:var(--color\/foreground,#f5f1eb)] top-0 whitespace-nowrap" data-node-id="4:147">
                Ordenar por:
              </p>
              <p className="[word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] left-[110px] text-[15px] text-[color:var(--color\/foreground,#f5f1eb)] top-0 whitespace-nowrap" data-node-id="4:148">
                Listados recentemente
              </p>
              <div className="absolute left-[278px] size-[16px] top-[2px]" data-node-id="4:152" data-name="Iconly/Two-tone/Arrow - Down 2">
                <div className="absolute inset-[35.42%_20.83%]" data-node-id="I4:152;16162:1094;0:4170" data-name="Arrow - Down 2">
                  <div className="absolute inset-[-16.07%_-8.04%]">
                    <img alt="" className="block max-w-none size-full" src={imgArrowDown2} />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute h-0 left-0 top-[23px] w-[101px]" data-node-id="4:146">
              <div className="absolute inset-[-2px_0_0_0]">
                <img alt="" className="block max-w-none size-full" src={imgLine3} />
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[72px] items-start relative shrink-0 w-full" data-node-id="70342:2828" data-name="Grid Rows">
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="70342:2802">
              <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[258px]" data-node-id="70342:2678">
                <div className="bg-[var(--color\/surface-card,#241612)] h-[300px] relative shrink-0 w-full" data-node-id="3:133" />
                <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[16px] min-w-full relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] w-[min-content]" data-node-id="4:165">
                  Emerald Ape #042
                </p>
                <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] min-w-full relative shrink-0 text-[18px] text-[color:var(--color\/text-accent,#e89b55)] w-[min-content]" data-node-id="4:166">
                  1.19 ETH
                </p>
                <div className="absolute left-[4px] rounded-[15px] size-[250px] top-[31px]" data-node-id="4:137" data-name="NFT Artwork 03">
                  <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[15px] size-full" src={imgNftArtwork03} />
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[258px]" data-node-id="70342:2679">
                <div className="bg-[var(--color\/surface-card,#241612)] h-[300px] relative shrink-0 w-full" data-node-id="3:134" />
                <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[16px] min-w-full relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] w-[min-content]" data-node-id="4:167">
                  Sage Nomad #009
                </p>
                <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] min-w-full relative shrink-0 text-[18px] text-[color:var(--color\/text-accent,#e89b55)] w-[min-content]" data-node-id="4:168">
                  1.69 ETH
                </p>
                <div className="absolute left-[4px] rounded-[15px] size-[250px] top-[25px]" data-node-id="4:162" data-name="NFT Artwork 04">
                  <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[15px] size-full" src={imgNftArtwork18} />
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[258px]" data-node-id="70342:2681">
                <div className="bg-[var(--color\/surface-card,#241612)] h-[300px] relative shrink-0 w-full" data-node-id="3:135" />
                <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[16px] min-w-full relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] w-[min-content]" data-node-id="4:169">
                  Neon Vessel #552
                </p>
                <div className="[word-break:break-word] content-stretch flex gap-[12px] items-center leading-[16px] relative shrink-0 text-[18px] whitespace-nowrap" data-node-id="70342:2680">
                  <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold relative shrink-0 text-[color:var(--color\/text-accent,#e89b55)]" data-node-id="4:170">
                    1.99 ETH
                  </p>
                  <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal relative shrink-0 text-[color:var(--color\/secondary,#b39463)]" data-node-id="4:171">
                    2.29 ETH
                  </p>
                </div>
                <div className="absolute left-[4px] rounded-[15px] size-[250px] top-[24px]" data-node-id="4:164" data-name="NFT Artwork 05">
                  <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[15px] size-full" src={imgNftArtwork05} />
                </div>
              </div>
            </div>
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="70342:2826">
              <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[258px]" data-node-id="70342:2805">
                <div className="bg-[var(--color\/surface-card,#241612)] content-stretch flex h-[300px] items-start pb-[8px] pl-[20px] pr-[12px] pt-[6px] relative shrink-0 w-full" data-node-id="70342:2803">
                  <div className="h-[286px] relative rounded-[13px] shrink-0 w-[224px]" data-node-id="4:280" data-name="NFT Artwork 06">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[13px] size-full" src={imgNftArtwork18} />
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-start leading-[16px] relative shrink-0 w-[164px]" data-node-id="70342:2804">
                  <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] w-full" data-node-id="4:224">
                    Cosmic Bloom #118
                  </p>
                  <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold relative shrink-0 text-[18px] text-[color:var(--color\/text-accent,#e89b55)] w-full" data-node-id="4:227">
                    1.29 ETH
                  </p>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[258px]" data-node-id="70342:2808">
                <div className="bg-[var(--color\/surface-card,#241612)] content-stretch flex h-[300px] items-start pb-[28px] pt-[24px] px-[4px] relative shrink-0 w-full" data-node-id="70342:2807">
                  <div className="relative rounded-[15px] shrink-0 size-[250px]" data-node-id="4:282" data-name="NFT Artwork 07">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[15px] size-full" src={imgNftArtwork18} />
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-start leading-[16px] relative shrink-0 w-[164px]" data-node-id="70342:2806">
                  <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] w-full" data-node-id="4:225">
                    Violet Nomad #314
                  </p>
                  <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold relative shrink-0 text-[18px] text-[color:var(--color\/text-accent,#e89b55)] w-full" data-node-id="4:228">
                    1.39 ETH
                  </p>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[258px]" data-node-id="70342:2811">
                <div className="bg-[var(--color\/surface-card,#241612)] content-stretch flex h-[300px] items-start pb-[28px] pt-[24px] px-[4px] relative shrink-0 w-full" data-node-id="70342:2810">
                  <div className="relative rounded-[15px] shrink-0 size-[250px]" data-node-id="4:284" data-name="NFT Artwork 08">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[15px] size-full" src={imgNftArtwork05} />
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-start leading-[16px] relative shrink-0 w-[154px]" data-node-id="70342:2809">
                  <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] w-full" data-node-id="4:226">
                    Ivory Baron #088
                  </p>
                  <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold relative shrink-0 text-[18px] text-[color:var(--color\/text-accent,#e89b55)] w-full" data-node-id="4:229">
                    1.79 ETH
                  </p>
                </div>
              </div>
            </div>
            <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="70342:2827">
              <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[258px]" data-node-id="70342:2814">
                <div className="bg-[var(--color\/surface-card,#241612)] content-stretch flex h-[300px] items-start pb-[32px] pt-[20px] px-[4px] relative shrink-0 w-full" data-node-id="70342:2812">
                  <div className="relative rounded-[15px] shrink-0 size-[250px]" data-node-id="4:286" data-name="NFT Artwork 09">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[15px] size-full" src={imgNftArtwork09} />
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-start leading-[16px] relative shrink-0 w-[154px]" data-node-id="70342:2813">
                  <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] w-full" data-node-id="4:251">
                    Golden Beat #207
                  </p>
                  <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold relative shrink-0 text-[18px] text-[color:var(--color\/text-accent,#e89b55)] w-full" data-node-id="4:254">
                    0.99 ETH
                  </p>
                </div>
              </div>
              <div className="bg-[var(--color\/surface-card,#241612)] content-stretch flex h-[300px] items-start pb-[24px] pt-[28px] px-[4px] relative shrink-0 w-[258px]" data-node-id="70342:2816">
                <div className="relative rounded-[15px] shrink-0 size-[250px]" data-node-id="4:289" data-name="NFT Artwork 10">
                  <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[15px] size-full" src={imgNftArtwork09} />
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[258px]" data-node-id="70342:2819">
                <div className="bg-[var(--color\/surface-card,#241612)] content-stretch flex h-[300px] items-start pb-[32px] pt-[20px] px-[4px] relative shrink-0 w-full" data-node-id="70342:2817">
                  <div className="relative rounded-[15px] shrink-0 size-[250px]" data-node-id="4:291" data-name="NFT Artwork 11">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[15px] size-full" src={imgNftArtwork09} />
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-start leading-[16px] relative shrink-0 w-[173px]" data-node-id="70342:2818">
                  <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] w-full" data-node-id="4:253">
                    Golden Signal #160
                  </p>
                  <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold relative shrink-0 text-[18px] text-[color:var(--color\/text-accent,#e89b55)] w-full" data-node-id="4:256">
                    0.39 ETH
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="70342:2825" data-name="Pagination">
          <div className="bg-[var(--color\/primary,#d28a4c)] content-stretch flex flex-col items-center justify-center relative rounded-[4px] shrink-0 size-[35px]" data-node-id="70342:2820">
            <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[18px] text-[color:var(--color\/ink,#140d0a)] whitespace-nowrap" data-node-id="4:388">
              1
            </p>
          </div>
          <div className="border border-[var(--color\/border,#3f2319)] border-solid content-stretch flex flex-col items-center justify-center pb-[10px] pt-[8px] px-[12px] relative rounded-[4px] shrink-0 size-[35px]" data-node-id="70342:2821">
            <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[16px] relative shrink-0 text-[18px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="4:389">
              2
            </p>
          </div>
          <div className="border border-[var(--color\/border,#3f2319)] border-solid content-stretch flex flex-col items-center justify-center pb-[10px] pt-[8px] px-[12px] relative rounded-[4px] shrink-0 size-[35px]" data-node-id="70342:2822">
            <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[16px] relative shrink-0 text-[18px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="4:390">
              3
            </p>
          </div>
          <div className="border border-[var(--color\/border,#3f2319)] border-solid content-stretch flex flex-col items-center justify-center pb-[10px] pt-[8px] px-[12px] relative rounded-[4px] shrink-0 size-[35px]" data-node-id="70342:2823">
            <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[16px] relative shrink-0 text-[18px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="4:391">
              4
            </p>
          </div>
          <div className="border border-[var(--color\/border,#3f2319)] border-solid content-stretch flex items-start p-[8px] relative rounded-[4px] shrink-0 size-[35px]" data-node-id="70342:2824">
            <div className="relative shrink-0 size-[18px]" data-node-id="4:392" data-name="Iconly/Curved/Arrow - Right 2">
              <div className="absolute flex inset-[20.83%_35.42%] items-center justify-center" data-node-id="I4:392;29221:4935" style={{ containerType: "size" }}>
                <div className="-rotate-90 flex-none h-[100cqw] w-[100cqh]">
                  <div className="relative size-full" data-name="Arrow - Right 2">
                    <div className="absolute inset-[-14.29%_-7.14%]">
                      <img alt="" className="block max-w-none size-full" src={imgArrowRight2} />
                    </div>
                  </div>
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

These styles are contained in the design: Color/Foreground: #F5F1EB, Body Large/18 Bold · lh 16: Font(family: "font/family", style: Bold, size: 18, weight: 700, lineHeight: 16, letterSpacing: 0), Text/Accent: #E89B55, Body/15 Regular · lh 40: Font(family: "font/family", style: Regular, size: 15, weight: 400, lineHeight: 40, letterSpacing: 0), Body/15 Bold · lh 40: Font(family: "font/family", style: Bold, size: 15, weight: 700, lineHeight: 40, letterSpacing: 0), Text/Secondary: #CFB28C, Color/Primary: #D28A4C, Color/Ink: #140D0A, Body/15 Regular · lh 16: Font(family: "font/family", style: Regular, size: 15, weight: 400, lineHeight: 100, letterSpacing: 0), Body Large/16 Bold · lh 20: Font(family: "font/family", style: Bold, size: 16, weight: 700, lineHeight: 20, letterSpacing: 0), Color/Surface Card: #241612, Body/15 Medium: Font(family: "font/family", style: Medium, size: 15, weight: 500, lineHeight: 16, letterSpacing: 0), Body Large/16 Regular · lh 16: Font(family: "font/family", style: Regular, size: 16, weight: 400, lineHeight: 16, letterSpacing: 0), Color/Secondary: #B39463, Body Large/18 Regular: Font(family: "font/family", style: Regular, size: 18, weight: 400, lineHeight: 16, letterSpacing: 0), Color/Border: #3F2319.

Component descriptions: The following components have usage descriptions or documentation links defined in Figma. These descriptions provide important context about the intended usage, best practices, and any constraints for each component. Follow these guidelines when implementing or using these components.

## Filters
**Node ID:** 70485:381

Marketplace sidebar filter panel, 310 wide: collection checkboxes with counts, price range with Apply, and network checkboxes. Fixed 310 width — the host column owns the placement. Content is identical on every screen; no per-instance overrides expected.
