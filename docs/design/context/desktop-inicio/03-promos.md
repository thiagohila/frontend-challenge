# Desktop / Início — Promos (2 cards)

- Figma: file `uweCCvGGvM7N1rQTFUjwQ3`, node `70353:241`
- Screenshot de referência: `docs/design/frames/desktop-inicio.png`
- Fonte: `get_design_context` (React+Tailwind de referência; **não é código final** — adaptar ao projeto). Assets já baixados em `design-src/assets/`.

## Código de referência

```tsx
const assetDir = "/design-src/assets"; // assets locais (URLs temporárias do Figma substituídas)
const imgNftArtwork17 = `${assetDir}/nft-emerald-ape.png`;
const imgNftArtwork16 = `${assetDir}/nft-ivory-baron.png`;
const imgArrowRight = `${assetDir}/icon-arrow-right.svg`;
const imgMaskGroup = `${assetDir}/deco-promo-mask.svg`;

export default function Promos() {
  return (
    <div className="content-stretch flex items-start justify-between relative size-full" data-node-id="70353:241" data-name="Promos">
      <div className="h-[250px] overflow-clip relative rounded-[8px] shrink-0 w-[586px]" data-node-id="70353:239" data-name="Promo Card — Genesis Drops">
        <div className="absolute bg-[var(--color\/surface-card,#241612)] h-[250px] left-0 top-0 w-[586px]" data-node-id="4:431" />
        <div className="-translate-x-full [word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[0] left-[556px] text-[18px] text-[color:var(--color\/foreground,#f5f1eb)] text-right top-[37px] whitespace-nowrap" data-node-id="4:406">
          <p className="leading-[24px] mb-0">Lançamentos gênesis</p>
          <p className="leading-[24px]">de edição limitada</p>
        </div>
        <p className="-translate-x-full [word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal h-[45px] leading-[24px] left-[556px] text-[14px] text-[color:var(--color\/text-secondary,#cfb28c)] text-right top-[94px] w-[263px]" data-node-id="4:425">
          Colecione edições escassas diretamente dos criadores antes da revelação pública.
        </p>
        <div className="absolute h-[250px] left-[-5px] rounded-[18px] top-0 w-[292px]" data-node-id="4:428" data-name="NFT Artwork 17">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[18px] size-full" src={imgNftArtwork17} />
        </div>
        <div className="absolute contents left-[416px] top-[164px]" data-node-id="5:112">
          <div className="absolute bg-[var(--color\/primary,#d28a4c)] h-[40px] left-[416px] rounded-[6px] top-[164px] w-[140px]" data-node-id="4:416" />
          <div className="absolute contents left-[442px] top-[174px]" data-node-id="5:107">
            <div className="absolute content-stretch flex items-end justify-between left-[442px] top-[174px]" data-node-id="5:111">
              <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium leading-[20px] relative shrink-0 text-[14px] text-[color:var(--color\/ink,#140d0a)] whitespace-nowrap" data-node-id="4:417">
                Explorar
              </p>
              <div className="relative shrink-0 size-[18px]" data-node-id="5:99" data-name="Iconly/Curved/Arrow - Right">
                <div className="absolute flex inset-[23.76%_17.71%_26.04%_19.79%] items-center justify-center" data-node-id="I5:99;29221:4926" style={{ containerType: "size" }}>
                  <div className="-rotate-90 flex-none h-[100cqw] w-[100cqh]">
                    <div className="relative size-full" data-name="Arrow - Right">
                      <div className="absolute inset-[-6.67%_-8.3%]">
                        <img alt="" className="block max-w-none size-full" src={imgArrowRight} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute h-[250px] left-0 top-0 w-[586px]" data-node-id="5:134" data-name="Mask Group">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMaskGroup} />
        </div>
      </div>
      <div className="h-[250px] overflow-clip relative rounded-[8px] shrink-0 w-[586px]" data-node-id="70353:240" data-name="Promo Card — Curated Art">
        <div className="absolute bg-[var(--color\/surface-card,#241612)] h-[250px] left-0 top-0 w-[586px]" data-node-id="4:419" />
        <div className="-translate-x-full [word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[0] left-[551px] text-[18px] text-[color:var(--color\/foreground,#f5f1eb)] text-right top-[37px] whitespace-nowrap" data-node-id="4:420">
          <p className="leading-[24px] mb-0">Arte digital selecionada</p>
          <p className="leading-[24px]">e muito mais</p>
        </div>
        <div className="absolute h-[250px] left-[2px] rounded-[17px] top-0 w-[287px]" data-node-id="4:423" data-name="NFT Artwork 16">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[17px] size-full" src={imgNftArtwork16} />
        </div>
        <p className="-translate-x-full [word-break:break-word] absolute font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal h-[45px] leading-[24px] left-[547px] text-[14px] text-[color:var(--color\/text-secondary,#cfb28c)] text-right top-[94px] w-[252px]" data-node-id="4:426">
          Explore novos artistas, coleções verificadas e obras digitais que definem a cultura.
        </p>
        <div className="absolute contents left-[411px] top-[164px]" data-node-id="5:113">
          <div className="absolute bg-[var(--color\/primary,#d28a4c)] h-[40px] left-[411px] rounded-[6px] top-[164px] w-[140px]" data-node-id="5:114" />
          <div className="absolute contents left-[439px] top-[174px]" data-node-id="70304:390">
            <div className="absolute content-stretch flex items-end justify-between left-[439px] top-[174px]" data-node-id="70304:391">
              <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium leading-[20px] relative shrink-0 text-[14px] text-[color:var(--color\/ink,#140d0a)] whitespace-nowrap" data-node-id="70304:392">
                Explorar
              </p>
              <div className="relative shrink-0 size-[18px]" data-node-id="70304:393" data-name="Iconly/Curved/Arrow - Right">
                <div className="absolute flex inset-[23.76%_17.71%_26.04%_19.79%] items-center justify-center" data-node-id="I70304:393;29221:4926" style={{ containerType: "size" }}>
                  <div className="-rotate-90 flex-none h-[100cqw] w-[100cqh]">
                    <div className="relative size-full" data-name="Arrow - Right">
                      <div className="absolute inset-[-6.67%_-8.3%]">
                        <img alt="" className="block max-w-none size-full" src={imgArrowRight} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute h-[250px] left-0 top-0 w-[586px]" data-node-id="5:130" data-name="Mask Group">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMaskGroup} />
        </div>
      </div>
    </div>
  );
}
```

## Metadados do Figma

These styles are contained in the design: Color/Surface Card: #241612, Color/Foreground: #F5F1EB, Body Large/18 Bold · lh 24: Font(family: "font/family", style: Bold, size: 18, weight: 700, lineHeight: 24, letterSpacing: 0), Text/Secondary: #CFB28C, Body/14 Regular · lh 24: Font(family: "font/family", style: Regular, size: 14, weight: 400, lineHeight: 24, letterSpacing: 0), Color/Primary: #D28A4C, Color/Ink: #140D0A, Body/14 Medium · lh 20: Font(family: "font/family", style: Medium, size: 14, weight: 500, lineHeight: 20, letterSpacing: 0), Color/Background Elevated: #FBFBFB.
