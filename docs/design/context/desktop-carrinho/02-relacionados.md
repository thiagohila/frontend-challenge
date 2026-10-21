# Desktop / Carrinho — "Colecionadores também viram"

- Figma: file `uweCCvGGvM7N1rQTFUjwQ3`, node `70371:239`
- Screenshot de referência: `docs/design/frames/desktop-carrinho.png`
- Fonte: `get_design_context` (React+Tailwind de referência; **não é código final** — adaptar ao projeto). Assets já baixados em `design-src/assets/`.

## Código de referência

```tsx
const assetDir = "/design-src/assets"; // assets locais (URLs temporárias do Figma substituídas)
const imgNftCartArtwork1 = `${assetDir}/nft-sage-nomad.png`;
const imgNftCartArtwork3 = `${assetDir}/nft-ivory-baron.png`;
const imgNftCartArtwork4 = `${assetDir}/nft-golden-beat.png`;
const imgLine7 = `${assetDir}/deco-divider-1200.svg`;
const imgCarouselDots = `${assetDir}/deco-dots-carousel.svg`;

export default function RelatedProducts() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-center relative size-full" data-node-id="70371:239" data-name="Related Products">
      <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full" data-node-id="70371:240" data-name="Section Heading">
        <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[17px] text-[color:var(--color\/text-accent,#e89b55)] whitespace-nowrap" data-node-id="11:1963">
          Colecionadores também viram
        </p>
        <div className="h-0 relative shrink-0 w-full" data-node-id="11:1962">
          <div className="absolute inset-[-0.3px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine7} />
          </div>
        </div>
      </div>
      <div className="content-stretch flex items-start justify-between overflow-clip relative shrink-0 w-full" data-node-id="70371:241" data-name="Cards">
        <div className="content-stretch flex flex-col gap-[8px] items-start overflow-clip relative shrink-0" data-node-id="70371:242" data-name="Product Card 1">
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-node-id="11:1974">
            <div className="bg-[var(--color\/surface-card,#241612)] col-1 content-stretch flex h-[255px] items-center justify-center ml-0 mt-0 relative row-1 w-[219px]" data-node-id="70402:3338">
              <div className="h-[243px] relative rounded-[15px] shrink-0 w-[190px]" data-node-id="11:1976" data-name="NFT Cart Artwork 1">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[15px] size-full" src={imgNftCartArtwork1} />
              </div>
            </div>
          </div>
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 whitespace-nowrap" data-node-id="70402:3347">
            <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] relative shrink-0 text-[15px] text-[color:var(--color\/foreground,#f5f1eb)]" data-node-id="11:1964">
              Cosmic Bloom #118
            </p>
            <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[16px] text-[color:var(--color\/text-accent,#e89b55)]" data-node-id="11:1969">
              1.29 ETH
            </p>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[8px] items-start overflow-clip relative shrink-0" data-node-id="70371:243" data-name="Product Card 2">
          <div className="bg-[var(--color\/surface-card,#241612)] content-stretch flex h-[255px] items-center justify-center relative shrink-0 w-[220px]" data-node-id="70371:244" data-name="Artwork">
            <div className="relative rounded-[17px] shrink-0 size-[212px]" data-node-id="11:1979" data-name="NFT Cart Artwork 2">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[17px] size-full" src={imgNftCartArtwork1} />
            </div>
          </div>
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 whitespace-nowrap" data-node-id="70402:3346">
            <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] relative shrink-0 text-[15px] text-[color:var(--color\/foreground,#f5f1eb)]" data-node-id="11:1966">
              Violet Nomad #314
            </p>
            <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[16px] text-[color:var(--color\/text-accent,#e89b55)]" data-node-id="11:1971">
              1.39 ETH
            </p>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[8px] items-start overflow-clip relative shrink-0" data-node-id="70371:245" data-name="Product Card 3">
          <div className="content-stretch flex flex-col items-start relative shrink-0" data-node-id="70371:246" data-name="Artwork">
            <div className="bg-[var(--color\/surface-card,#241612)] content-stretch flex h-[255px] items-center justify-center relative shrink-0 w-[219px]" data-node-id="70402:3339">
              <div className="relative rounded-[17px] shrink-0 size-[212px]" data-node-id="11:1982" data-name="NFT Cart Artwork 3">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[17px] size-full" src={imgNftCartArtwork3} />
              </div>
            </div>
          </div>
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 whitespace-nowrap" data-node-id="70402:3345">
            <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] relative shrink-0 text-[15px] text-[color:var(--color\/foreground,#f5f1eb)]" data-node-id="11:1967">
              Ivory Baron #088
            </p>
            <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[16px] text-[color:var(--color\/text-accent,#e89b55)]" data-node-id="11:1972">
              1.79 ETH
            </p>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[8px] items-start overflow-clip relative shrink-0" data-node-id="70371:247" data-name="Product Card 4">
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-node-id="11:1983">
            <div className="bg-[var(--color\/surface-card,#241612)] col-1 content-stretch flex h-[255px] items-center justify-center ml-0 mt-0 relative row-1 w-[219px]" data-node-id="70402:3340">
              <div className="relative rounded-[17px] shrink-0 size-[213px]" data-node-id="11:1985" data-name="NFT Cart Artwork 4">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[17px] size-full" src={imgNftCartArtwork4} />
              </div>
            </div>
          </div>
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 whitespace-nowrap" data-node-id="70402:3344">
            <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] relative shrink-0 text-[15px] text-[color:var(--color\/foreground,#f5f1eb)]" data-node-id="11:1965">
              Golden Beat #207
            </p>
            <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[16px] text-[color:var(--color\/text-accent,#e89b55)]" data-node-id="11:1970">
              0.99 ETH
            </p>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[8px] items-start overflow-clip relative shrink-0" data-node-id="70371:248" data-name="Product Card 5">
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-node-id="11:1986">
            <div className="bg-[var(--color\/surface-card,#241612)] col-1 content-stretch flex h-[255px] items-center justify-center ml-0 mt-0 relative row-1 w-[219px]" data-node-id="70402:3341">
              <div className="relative rounded-[17px] shrink-0 size-[213px]" data-node-id="11:1988" data-name="NFT Cart Artwork 5">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[17px] size-full" src={imgNftCartArtwork4} />
              </div>
            </div>
          </div>
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 whitespace-nowrap" data-node-id="70402:3342">
            <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] relative shrink-0 text-[15px] text-[color:var(--color\/foreground,#f5f1eb)]" data-node-id="11:1968">
              Golden Signal #160
            </p>
            <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[16px] text-[color:var(--color\/text-accent,#e89b55)]" data-node-id="11:1973">
              0.39 ETH
            </p>
          </div>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-[52px]" data-node-id="70371:249" data-name="Carousel Dots">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCarouselDots} />
      </div>
    </div>
  );
}
```

## Metadados do Figma

These styles are contained in the design: Text/Accent: #E89B55, Body Large/17 Bold: Font(family: "font/family", style: Bold, size: 17, weight: 700, lineHeight: 16, letterSpacing: 0), Color/Primary: #D28A4C, Color/Surface Card: #241612, Color/Foreground: #F5F1EB, Body/15 Regular · lh 16: Font(family: "font/family", style: Regular, size: 15, weight: 400, lineHeight: 100, letterSpacing: 0), Body Large/16 Bold · lh 16: Font(family: "font/family", style: Bold, size: 16, weight: 700, lineHeight: 16, letterSpacing: 0).
