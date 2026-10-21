# Desktop / Detalhes do NFT — "Mais desta coleção"

- Figma: file `uweCCvGGvM7N1rQTFUjwQ3`, node `70364:239`
- Screenshot de referência: `docs/design/frames/desktop-detalhe.png`
- Fonte: `get_design_context` (React+Tailwind de referência; **não é código final** — adaptar ao projeto). Assets já baixados em `design-src/assets/`.

## Código de referência

```tsx
const assetDir = "/design-src/assets"; // assets locais (URLs temporárias do Figma substituídas)
const imgNftCollectionArtwork06 = `${assetDir}/nft-sage-nomad.png`;
const imgNftCollectionArtwork08 = `${assetDir}/nft-ivory-baron.png`;
const imgNftCollectionArtwork09 = `${assetDir}/nft-golden-beat.png`;
const imgLine7 = `${assetDir}/deco-divider-1200.svg`;
const imgCarouselDots = `${assetDir}/deco-dots-carousel.svg`;

export default function RelatedProducts() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative size-full" data-node-id="70364:239" data-name="Related Products">
      <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[1200px]" data-node-id="70342:2782" data-name="Section Heading">
        <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[17px] text-[color:var(--color\/text-accent,#e89b55)] w-full" data-node-id="11:1256">
          Mais desta coleção
        </p>
        <div className="h-0 relative shrink-0 w-full" data-node-id="11:1254">
          <div className="absolute inset-[-0.3px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine7} />
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[32px] items-center relative shrink-0 w-[1200px]" data-node-id="70342:2800">
        <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="70342:2799">
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[219px]" data-node-id="70342:2798">
            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-node-id="11:1264">
              <div className="bg-[var(--color\/surface-card,#241612)] col-1 content-stretch flex h-[255px] items-start ml-0 mt-0 pb-[8px] pl-[20px] pr-[12px] pt-[4px] relative row-1 w-[219px]" data-node-id="70342:2789">
                <div className="h-[243px] relative rounded-[11px] shrink-0 w-[190px]" data-node-id="11:1177" data-name="NFT Collection Artwork 06">
                  <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[11px] size-full" src={imgNftCollectionArtwork06} />
                </div>
              </div>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-col items-start relative shrink-0 w-[154px]" data-node-id="70342:2783">
              <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] relative shrink-0 text-[15px] text-[color:var(--color\/foreground,#f5f1eb)] w-full" data-node-id="11:1133">
                Cosmic Bloom #118
              </p>
              <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[16px] text-[color:var(--color\/text-accent,#e89b55)] w-full" data-node-id="11:1142">
                1.29 ETH
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[220px]" data-node-id="70342:2797">
            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-node-id="11:1265">
              <div className="bg-[var(--color\/surface-card,#241612)] col-1 content-stretch flex h-[255px] items-start ml-0 mt-0 pb-[24px] pt-[20px] px-[4px] relative row-1 w-[220px]" data-node-id="70342:2790">
                <div className="relative rounded-[13px] shrink-0 size-[212px]" data-node-id="11:1178" data-name="NFT Collection Artwork 07">
                  <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[13px] size-full" src={imgNftCollectionArtwork06} />
                </div>
              </div>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-col items-start relative shrink-0 w-[154px]" data-node-id="70342:2785">
              <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] relative shrink-0 text-[15px] text-[color:var(--color\/foreground,#f5f1eb)] w-full" data-node-id="11:1136">
                Violet Nomad #314
              </p>
              <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[16px] text-[color:var(--color\/text-accent,#e89b55)] w-full" data-node-id="11:1145">
                1.39 ETH
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[219px]" data-node-id="70342:2796">
            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-node-id="11:1266">
              <div className="bg-[var(--color\/surface-card,#241612)] col-1 content-stretch flex h-[255px] items-start ml-0 mt-0 pb-[24px] pt-[20px] px-[4px] relative row-1 w-[219px]" data-node-id="70342:2791">
                <div className="relative rounded-[13px] shrink-0 size-[212px]" data-node-id="11:1179" data-name="NFT Collection Artwork 08">
                  <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[13px] size-full" src={imgNftCollectionArtwork08} />
                </div>
              </div>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-col items-start relative shrink-0 w-[145px]" data-node-id="70342:2786">
              <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] relative shrink-0 text-[15px] text-[color:var(--color\/foreground,#f5f1eb)] w-full" data-node-id="11:1139">
                Ivory Baron #088
              </p>
              <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[16px] text-[color:var(--color\/text-accent,#e89b55)] w-full" data-node-id="11:1148">
                1.79 ETH
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[219px]" data-node-id="70342:2795">
            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-node-id="11:1267">
              <div className="bg-[var(--color\/surface-card,#241612)] col-1 content-stretch flex h-[255px] items-start ml-0 mt-0 pb-[28px] pt-[16px] px-[4px] relative row-1 w-[219px]" data-node-id="70342:2792">
                <div className="relative rounded-[13px] shrink-0 size-[213px]" data-node-id="11:1180" data-name="NFT Collection Artwork 09">
                  <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[13px] size-full" src={imgNftCollectionArtwork09} />
                </div>
              </div>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-col items-start relative shrink-0 w-[145px]" data-node-id="70342:2787">
              <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] relative shrink-0 text-[15px] text-[color:var(--color\/foreground,#f5f1eb)] w-full" data-node-id="11:1134">
                Golden Beat #207
              </p>
              <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[16px] text-[color:var(--color\/text-accent,#e89b55)] w-full" data-node-id="11:1143">
                0.99 ETH
              </p>
            </div>
          </div>
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-node-id="11:1268">
            <div className="col-1 content-stretch flex flex-col gap-[12px] items-start ml-0 mt-0 relative row-1 w-[219px]" data-node-id="70342:2794">
              <div className="bg-[var(--color\/surface-card,#241612)] content-stretch flex h-[255px] items-start pb-[28px] pt-[16px] px-[4px] relative shrink-0 w-full" data-node-id="70342:2793">
                <div className="relative rounded-[13px] shrink-0 size-[213px]" data-node-id="11:1182" data-name="NFT Collection Artwork 10">
                  <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[13px] size-full" src={imgNftCollectionArtwork09} />
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-col items-start relative shrink-0 w-[163px]" data-node-id="70342:2788">
                <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] relative shrink-0 text-[15px] text-[color:var(--color\/foreground,#f5f1eb)] w-full" data-node-id="11:1140">
                  Golden Signal #160
                </p>
                <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[16px] text-[color:var(--color\/text-accent,#e89b55)] w-full" data-node-id="11:1149">
                  0.39 ETH
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[12px] relative shrink-0 w-[52px]" data-node-id="70364:240" data-name="Carousel Dots">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCarouselDots} />
        </div>
      </div>
    </div>
  );
}
```

## Metadados do Figma

These styles are contained in the design: Text/Accent: #E89B55, Body Large/17 Bold: Font(family: "font/family", style: Bold, size: 17, weight: 700, lineHeight: 16, letterSpacing: 0), Color/Primary: #D28A4C, Color/Surface Card: #241612, Color/Foreground: #F5F1EB, Body/15 Regular · lh 16: Font(family: "font/family", style: Regular, size: 15, weight: 400, lineHeight: 100, letterSpacing: 0), Body Large/16 Bold · lh 16: Font(family: "font/family", style: Bold, size: 16, weight: 700, lineHeight: 16, letterSpacing: 0).
