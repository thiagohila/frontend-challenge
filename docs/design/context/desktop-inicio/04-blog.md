# Desktop / Início — Blog "Diário da Cunhagem"

- Figma: file `uweCCvGGvM7N1rQTFUjwQ3`, node `70343:253`
- Screenshot de referência: `docs/design/frames/desktop-inicio.png`
- Fonte: `get_design_context` (React+Tailwind de referência; **não é código final** — adaptar ao projeto). Assets já baixados em `design-src/assets/`.

## Código de referência

```tsx
const assetDir = "/design-src/assets"; // assets locais (URLs temporárias do Figma substituídas)
const imgImage = `${assetDir}/nft-ivory-baron.png`;
const imgImage1 = `${assetDir}/nft-emerald-ape.png`;
const imgImage2 = `${assetDir}/nft-sage-nomad.png`;
const imgImage3 = `${assetDir}/nft-golden-beat.png`;

export default function Blog() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] items-center relative size-full" data-node-id="70343:253" data-name="Blog">
      <div className="[word-break:break-word] content-stretch flex flex-col gap-[12px] items-center leading-[normal] overflow-clip relative shrink-0 text-center w-full" data-node-id="70343:254" data-name="Blog Section Header">
        <p className="font-['Roboto_Mono:Bold'] font-bold relative shrink-0 text-[28px] text-[color:var(--color\/text-primary,#f7f3ec)] w-full" data-node-id="70343:255">
          Diário da Cunhagem
        </p>
        <p className="font-['Roboto_Mono:Regular'] font-normal relative shrink-0 text-[14px] text-[color:var(--color\/text-secondary,#cfb28c)] w-full" data-node-id="70343:256">
          Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
        </p>
      </div>
      <div className="content-stretch flex gap-[24px] items-start overflow-clip relative shrink-0 w-full" data-node-id="70343:257" data-name="Cards">
        <div className="bg-[var(--color\/surface-card,#241612)] content-stretch flex flex-col items-start overflow-clip relative rounded-[8px] shrink-0 w-[268px]" data-node-id="70343:258" data-name="Card 1">
          <div className="h-[195px] relative shrink-0 w-full" data-node-id="70343:259" data-name="Image">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage} />
          </div>
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start overflow-clip pb-[16px] pt-[12px] px-[16px] relative shrink-0 w-full" data-node-id="70343:260" data-name="Content">
            <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium leading-[16px] min-w-full relative shrink-0 text-[12px] text-[color:var(--color\/text-secondary,#cfb28c)] w-[min-content] whitespace-pre-wrap" data-node-id="70343:261">{`12 de setembro  |  Leitura de 6 min`}</p>
            <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[normal] min-w-full relative shrink-0 text-[16px] text-[color:var(--color\/text-primary,#f7f3ec)] w-[min-content]" data-node-id="70343:262">
              Como funciona a propriedade de NFTs
            </p>
            <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium leading-[16px] min-w-full relative shrink-0 text-[12px] text-[color:var(--color\/text-secondary,#cfb28c)] w-[min-content]" data-node-id="70343:263">
              Aprenda a colecionar, negociar e verificar ativos digitais.
            </p>
            <div className="content-stretch flex gap-[4px] items-start overflow-clip relative shrink-0 text-[12px] text-[color:var(--color\/text-accent,#e89b55)] whitespace-nowrap" data-node-id="70343:264" data-name="CTA">
              <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[14px] relative shrink-0" data-node-id="70343:265">
                Ler mais
              </p>
              <p className="font-['Roboto_Mono:Regular'] font-normal leading-[normal] relative shrink-0" data-node-id="70343:266">
                →
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[var(--color\/surface-card,#241612)] content-stretch flex flex-col items-start overflow-clip relative rounded-[8px] shrink-0 w-[268px]" data-node-id="70343:267" data-name="Card 2">
          <div className="h-[195px] relative shrink-0 w-full" data-node-id="70343:268" data-name="Image">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage1} />
          </div>
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start overflow-clip pb-[16px] pt-[12px] px-[16px] relative shrink-0 w-full" data-node-id="70343:269" data-name="Content">
            <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium leading-[16px] min-w-full relative shrink-0 text-[12px] text-[color:var(--color\/text-secondary,#cfb28c)] w-[min-content] whitespace-pre-wrap" data-node-id="70343:270">{`13 de setembro  |  Leitura de 2 min`}</p>
            <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[normal] min-w-full relative shrink-0 text-[16px] text-[color:var(--color\/text-primary,#f7f3ec)] w-[min-content]" data-node-id="70343:271">
              10 artistas digitais para acompanhar
            </p>
            <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium leading-[16px] min-w-full relative shrink-0 text-[12px] text-[color:var(--color\/text-secondary,#cfb28c)] w-[min-content]" data-node-id="70343:272">
              Conheça criadores que moldam a cultura digital.
            </p>
            <div className="content-stretch flex gap-[4px] items-start overflow-clip relative shrink-0 text-[12px] text-[color:var(--color\/text-accent,#e89b55)] whitespace-nowrap" data-node-id="70343:273" data-name="CTA">
              <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[14px] relative shrink-0" data-node-id="70343:274">
                Ler mais
              </p>
              <p className="font-['Roboto_Mono:Regular'] font-normal leading-[normal] relative shrink-0" data-node-id="70343:275">
                →
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[var(--color\/surface-card,#241612)] content-stretch flex flex-col items-start overflow-clip relative rounded-[8px] shrink-0 w-[268px]" data-node-id="70343:276" data-name="Card 3">
          <div className="h-[195px] relative shrink-0 w-full" data-node-id="70343:277" data-name="Image">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage2} />
          </div>
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start overflow-clip pb-[16px] pt-[12px] px-[16px] relative shrink-0 w-full" data-node-id="70343:278" data-name="Content">
            <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium leading-[16px] min-w-full relative shrink-0 text-[12px] text-[color:var(--color\/text-secondary,#cfb28c)] w-[min-content] whitespace-pre-wrap" data-node-id="70343:279">{`15 de setembro  |  Leitura de 3 min`}</p>
            <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[normal] min-w-full relative shrink-0 text-[16px] text-[color:var(--color\/text-primary,#f7f3ec)] w-[min-content]" data-node-id="70343:280">
              Raridade, atributos e procedência
            </p>
            <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium leading-[16px] min-w-full relative shrink-0 text-[12px] text-[color:var(--color\/text-secondary,#cfb28c)] w-[min-content]" data-node-id="70343:281">
              Entenda raridade, procedência, direitos autorais e utilidade.
            </p>
            <div className="content-stretch flex gap-[4px] items-start overflow-clip relative shrink-0 text-[12px] text-[color:var(--color\/text-accent,#e89b55)] whitespace-nowrap" data-node-id="70343:282" data-name="CTA">
              <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[14px] relative shrink-0" data-node-id="70343:283">
                Ler mais
              </p>
              <p className="font-['Roboto_Mono:Regular'] font-normal leading-[normal] relative shrink-0" data-node-id="70343:284">
                →
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[var(--color\/surface-card,#241612)] content-stretch flex flex-col items-start overflow-clip relative rounded-[8px] self-stretch shrink-0 w-[268px]" data-node-id="70343:285" data-name="Card 4">
          <div className="h-[195px] relative shrink-0 w-full" data-node-id="70343:286" data-name="Image">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage3} />
          </div>
          <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px overflow-clip pb-[16px] pt-[12px] px-[16px] relative w-full" data-node-id="70343:287" data-name="Content">
            <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium leading-[16px] min-w-full relative shrink-0 text-[12px] text-[color:var(--color\/text-secondary,#cfb28c)] w-[min-content] whitespace-pre-wrap" data-node-id="70343:288">{`15 de setembro  |  Leitura de 2 min`}</p>
            <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[normal] min-w-full relative shrink-0 text-[16px] text-[color:var(--color\/text-primary,#f7f3ec)] w-[min-content]" data-node-id="70343:289">
              Como proteger sua carteira
            </p>
            <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium leading-[16px] min-w-full relative shrink-0 text-[12px] text-[color:var(--color\/text-secondary,#cfb28c)] w-[min-content]" data-node-id="70343:290">
              Proteja sua carteira, seus ativos e sua identidade.
            </p>
            <div className="content-stretch flex gap-[4px] items-start overflow-clip relative shrink-0 text-[12px] text-[color:var(--color\/text-accent,#e89b55)] whitespace-nowrap" data-node-id="70343:291" data-name="CTA">
              <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[14px] relative shrink-0" data-node-id="70343:292">
                Ler mais
              </p>
              <p className="font-['Roboto_Mono:Regular'] font-normal leading-[normal] relative shrink-0" data-node-id="70343:293">
                →
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

These styles are contained in the design: Text/Secondary: #CFB28C, Body Large/16 Bold · lh auto: Font(family: "font/family", style: Bold, size: 16, weight: 700, lineHeight: 100, letterSpacing: 0), Text/Accent: #E89B55, Caption/12 Bold: Font(family: "font/family", style: Bold, size: 12, weight: 700, lineHeight: 14, letterSpacing: 0), Color/Surface Card: #241612.
