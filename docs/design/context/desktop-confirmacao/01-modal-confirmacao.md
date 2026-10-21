# Desktop / Confirmação (11:4385) — Order Confirmation Modal (fundo: Checkout Page = ver desktop-pagamento; BG 11:5105 ink opaco)

- Figma: file `uweCCvGGvM7N1rQTFUjwQ3`, node `70376:239`
- Screenshot de referência: `docs/design/frames/desktop-confirmacao.png`
- Fonte: `get_design_context` (React+Tailwind de referência; **não é código final** — adaptar ao projeto). Assets já baixados em `design-src/assets/`.

## Código de referência

```tsx
const assetDir = "/design-src/assets"; // assets locais (URLs temporárias do Figma substituídas)
const imgNftReceiptArtwork4 = `${assetDir}/nft-emerald-ape.png`;
const imgNftReceiptArtwork5 = `${assetDir}/nft-sage-nomad.png`;
const imgNftReceiptArtwork6 = `${assetDir}/nft-ivory-baron.png`;
const imgGroup = `${assetDir}/illustration-thank-you.svg`;
const imgLine10 = `${assetDir}/deco-divider-vertical-31.svg`;
const imgLine2 = `${assetDir}/deco-divider-490.svg`;
const imgX = `${assetDir}/icon-close.svg`;

export default function OrderConfirmationModal() {
  return (
    <div className="bg-[var(--color\/surface-card,#241612)] content-stretch flex flex-col items-start relative size-full" data-node-id="70376:239" data-name="Order Confirmation Modal">
      <div className="content-stretch flex flex-col gap-[16px] h-[156px] items-center justify-center overflow-clip relative shrink-0 w-full" data-node-id="70376:240" data-name="Modal Header">
        <div className="overflow-clip relative shrink-0 size-[80px]" data-node-id="11:5150" data-name="thank-you 1">
          <div className="absolute inset-[0_9.27%]" data-node-id="11:5151" data-name="Group">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup} />
          </div>
        </div>
        <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[16px] text-[color:var(--color\/text-secondary,#cfb28c)] text-center whitespace-nowrap" data-node-id="11:5149">
          Seus NFTs agora estão na sua carteira
        </p>
      </div>
      <div className="bg-[var(--color\/primary,#d28a4c)] h-px relative shrink-0 w-full" data-node-id="11:5161" />
      <div className="content-stretch flex flex-col h-[65px] items-start px-[36px] py-[4px] relative shrink-0 w-full" data-node-id="70376:241" data-name="Transaction Meta">
        <div className="content-stretch flex flex-[1_0_0] items-center justify-between min-h-px relative w-full" data-node-id="70394:2976">
          <div className="[word-break:break-word] content-stretch flex flex-col items-start relative shrink-0 text-[color:var(--color\/text-secondary,#cfb28c)] w-[127px]" data-node-id="11:5142">
            <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[14px] w-full" data-node-id="11:5131">
              ID da transação
            </p>
            <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] relative shrink-0 text-[15px] w-full" data-node-id="11:5132">
              0xA91F…E82C
            </p>
          </div>
          <div className="flex h-[31px] items-center justify-center relative shrink-0 w-0" data-node-id="11:5145">
            <div className="flex-none rotate-90">
              <div className="h-0 relative w-[31px]">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img alt="" className="block max-w-none size-full" src={imgLine10} />
                </div>
              </div>
            </div>
          </div>
          <div className="[word-break:break-word] content-stretch flex flex-col font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal items-start relative shrink-0 text-[color:var(--color\/text-secondary,#cfb28c)] w-[109px]" data-node-id="11:5139">
            <p className="leading-[16px] relative shrink-0 text-[14px] w-full" data-node-id="11:5133">
              Data
            </p>
            <p className="leading-[normal] relative shrink-0 text-[15px] w-full" data-node-id="11:5134">
              29 Jul, 2026
            </p>
          </div>
          <div className="flex h-[31px] items-center justify-center relative shrink-0 w-0" data-node-id="11:5146">
            <div className="flex-none rotate-90">
              <div className="h-0 relative w-[31px]">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img alt="" className="block max-w-none size-full" src={imgLine10} />
                </div>
              </div>
            </div>
          </div>
          <div className="[word-break:break-word] content-stretch flex flex-col font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal items-start relative shrink-0 text-[color:var(--color\/text-secondary,#cfb28c)] w-[91px]" data-node-id="11:5140">
            <p className="leading-[16px] relative shrink-0 text-[14px] w-full" data-node-id="11:5135">
              Total
            </p>
            <p className="leading-[normal] relative shrink-0 text-[15px] w-full" data-node-id="11:5136">
              26.846 ETH
            </p>
          </div>
          <div className="flex h-[31px] items-center justify-center relative shrink-0 w-0" data-node-id="11:5147">
            <div className="flex-none rotate-90">
              <div className="h-0 relative w-[31px]">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img alt="" className="block max-w-none size-full" src={imgLine10} />
                </div>
              </div>
            </div>
          </div>
          <div className="[word-break:break-word] content-stretch flex flex-col items-start relative shrink-0 text-[color:var(--color\/text-secondary,#cfb28c)] w-[73px]" data-node-id="11:5141">
            <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[14px] w-full" data-node-id="11:5137">
              Carteira
            </p>
            <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[normal] relative shrink-0 text-[15px] w-full" data-node-id="11:5138">
              MetaMask
            </p>
          </div>
        </div>
      </div>
      <div className="bg-[var(--color\/primary,#d28a4c)] h-px relative shrink-0 w-full" data-node-id="11:5163" />
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="70394:2997">
        <div className="content-stretch flex flex-col gap-[12px] h-[588px] items-start overflow-clip pb-[48px] pt-[20px] px-[44px] relative shrink-0 w-full" data-node-id="70376:242" data-name="Transaction Details">
          <div className="content-stretch flex items-center relative shrink-0 w-full" data-node-id="70394:2978">
            <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[15px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="11:5167">
              Detalhes da transação
            </p>
          </div>
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="70394:2996">
            <div className="content-stretch flex flex-col gap-[12px] items-end relative shrink-0 w-full" data-node-id="70394:2992">
              <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="70394:2991">
                <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="70394:2990">
                  <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="70376:243" data-name="Table Header">
                    <div className="content-stretch flex flex-[1_0_0] items-start min-w-px relative" data-node-id="70394:2980">
                      <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="11:5189">
                        NFTs
                      </p>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex gap-[48px] items-center leading-[16px] relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="70394:2979">
                      <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold relative shrink-0" data-node-id="11:5210">
                        Edições
                      </p>
                      <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium relative shrink-0" data-node-id="11:5190">
                        Subtotal
                      </p>
                    </div>
                  </div>
                  <div className="h-0 relative shrink-0 w-full" data-node-id="11:5195">
                    <div className="absolute inset-[-0.3px_0_0_0]">
                      <img alt="" className="block max-w-none size-full" src={imgLine2} />
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0" data-node-id="70376:244" data-name="Items">
                  <div className="bg-[var(--color\/surface-card,#241612)] content-stretch flex h-[70px] items-center justify-between relative shrink-0 w-full" data-node-id="70376:245" data-name="Item 1">
                    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-node-id="70394:2983">
                      <div className="relative rounded-[8px] shrink-0 size-[70px]" data-node-id="11:5194" data-name="NFT Receipt Artwork 4">
                        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgNftReceiptArtwork4} />
                      </div>
                      <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-start leading-[16px] relative shrink-0 w-[154px]" data-node-id="70394:2981">
                        <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] w-full" data-node-id="11:5196">
                          Emerald Ape #042
                        </p>
                        <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal relative shrink-0 text-[14px] text-[color:var(--color\/secondary,#b39463)] w-full" data-node-id="11:5199">
                          ID do token: #0042
                        </p>
                      </div>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex gap-[48px] items-center leading-[16px] relative shrink-0 text-right w-[194px] whitespace-nowrap" data-node-id="70394:2982">
                      <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal relative shrink-0 text-[14px] text-[color:var(--color\/text-secondary,#cfb28c)]" data-node-id="11:5203">
                        (x 2)
                      </p>
                      <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold relative shrink-0 text-[18px] text-[color:var(--color\/text-accent,#e89b55)]" data-node-id="11:5202">
                        2.38 ETH
                      </p>
                    </div>
                  </div>
                  <div className="bg-[var(--color\/surface-card,#241612)] content-stretch flex h-[70px] items-center justify-between relative shrink-0 w-[495px]" data-node-id="70376:246" data-name="Item 2">
                    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-node-id="70394:2985">
                      <div className="relative rounded-[8px] shrink-0 size-[66px]" data-node-id="11:5208" data-name="NFT Receipt Artwork 5">
                        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgNftReceiptArtwork5} />
                      </div>
                      <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-start leading-[16px] relative shrink-0 w-[164px]" data-node-id="70394:2984">
                        <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] w-full" data-node-id="11:5197">
                          Violet Nomad #314
                        </p>
                        <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal relative shrink-0 text-[14px] text-[color:var(--color\/secondary,#b39463)] w-full" data-node-id="11:5200">
                          ID do token: #0314
                        </p>
                      </div>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex gap-[48px] items-center leading-[16px] relative shrink-0 text-right w-[192px] whitespace-nowrap" data-node-id="70394:2986">
                      <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal relative shrink-0 text-[14px] text-[color:var(--color\/text-secondary,#cfb28c)]" data-node-id="11:5205">
                        (x 6)
                      </p>
                      <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold relative shrink-0 text-[18px] text-[color:var(--color\/text-accent,#e89b55)]" data-node-id="11:5204">
                        8.34 ETH
                      </p>
                    </div>
                  </div>
                  <div className="bg-[var(--color\/surface-card,#241612)] content-stretch flex h-[70px] items-center justify-between relative shrink-0 w-[495px]" data-node-id="70376:247" data-name="Item 3">
                    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-node-id="70394:2989">
                      <div className="relative rounded-[8px] shrink-0 size-[65px]" data-node-id="11:5209" data-name="NFT Receipt Artwork 6">
                        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgNftReceiptArtwork6} />
                      </div>
                      <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-start leading-[16px] relative shrink-0 w-[154px]" data-node-id="70394:2988">
                        <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)] w-full" data-node-id="11:5198">
                          Ivory Baron #088
                        </p>
                        <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal relative shrink-0 text-[14px] text-[color:var(--color\/secondary,#b39463)] w-full" data-node-id="11:5201">
                          ID do token: #0088
                        </p>
                      </div>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex gap-[48px] items-center leading-[16px] relative shrink-0 text-right whitespace-nowrap" data-node-id="70394:2987">
                      <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal relative shrink-0 text-[14px] text-[color:var(--color\/text-secondary,#cfb28c)]" data-node-id="11:5207">
                        (x 9)
                      </p>
                      <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold relative shrink-0 text-[18px] text-[color:var(--color\/text-accent,#e89b55)]" data-node-id="11:5206">
                        16.11 ETH
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col items-start justify-center relative shrink-0" data-node-id="70376:248" data-name="Totals">
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[12px] items-end justify-center relative shrink-0 w-[321px] whitespace-nowrap" data-node-id="70394:2995">
                  <div className="content-stretch flex font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal items-center justify-between relative shrink-0 text-[color:var(--color\/foreground,#f5f1eb)] w-full" data-node-id="70394:2993">
                    <p className="leading-[normal] relative shrink-0 text-[15px]" data-node-id="11:5211">
                      Taxa de rede
                    </p>
                    <p className="leading-[16px] relative shrink-0 text-[18px] text-right" data-node-id="11:5213">
                      0.016 ETH
                    </p>
                  </div>
                  <div className="content-stretch flex font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold items-center justify-between leading-[16px] relative shrink-0 w-full" data-node-id="70394:2994">
                    <p className="relative shrink-0 text-[16px] text-[color:var(--color\/foreground,#f5f1eb)]" data-node-id="11:5212">
                      Total
                    </p>
                    <p className="relative shrink-0 text-[18px] text-[color:var(--color\/text-accent,#e89b55)] text-right" data-node-id="11:5214">
                      26.846 ETH
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-0 relative shrink-0 w-full" data-node-id="12:5220">
              <div className="absolute inset-[-0.3px_0_0_0]">
                <img alt="" className="block max-w-none size-full" src={imgLine2} />
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col items-center justify-between min-h-px overflow-clip relative w-full" data-node-id="70376:249" data-name="Footer Note">
            <div className="[word-break:break-word] flex flex-col font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal justify-center leading-[0] min-w-full relative shrink-0 text-[14px] text-[color:var(--color\/text-secondary,#cfb28c)] text-center w-[min-content]" data-node-id="12:5217">
              <p className="leading-[22px]">Transação confirmada na Ethereum. A propriedade foi transferida para sua carteira conectada e registrada na rede.</p>
            </div>
            <div className="bg-[var(--color\/primary,#d28a4c)] content-stretch flex items-center overflow-clip p-[16px] relative rounded-[5px] shrink-0" data-node-id="70376:250" data-name="Etherscan Button">
              <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[16px] text-[color:var(--color\/ink,#140d0a)] whitespace-nowrap" data-node-id="12:5222">
                Ver no Etherscan
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[var(--color\/primary,#d28a4c)] h-[10px] relative shrink-0 w-full" data-node-id="11:5119" />
      </div>
      <div className="absolute inset-[2.04%_2.42%_95.85%_94.46%]" data-node-id="12:5223" data-name="X">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgX} />
      </div>
    </div>
  );
}
```

## Metadados do Figma

These styles are contained in the design: Color/Primary: #D28A4C, Text/Secondary: #CFB28C, Body Large/16 Bold · lh 16: Font(family: "font/family", style: Bold, size: 16, weight: 700, lineHeight: 16, letterSpacing: 0), Body/14 Bold · lh 16: Font(family: "font/family", style: Bold, size: 14, weight: 700, lineHeight: 16, letterSpacing: 0), Body/15 Regular · lh 16: Font(family: "font/family", style: Regular, size: 15, weight: 400, lineHeight: 100, letterSpacing: 0), Body/14 Regular · lh 16: Font(family: "font/family", style: Regular, size: 14, weight: 400, lineHeight: 16, letterSpacing: 0), Color/Foreground: #F5F1EB, Body/15 Bold · lh 16: Font(family: "font/family", style: Bold, size: 15, weight: 700, lineHeight: 16, letterSpacing: 0), Body Large/16 Medium · lh 16: Font(family: "font/family", style: Medium, size: 16, weight: 500, lineHeight: 16, letterSpacing: 0), Color/Secondary: #B39463, Text/Accent: #E89B55, Body Large/18 Bold · lh 16: Font(family: "font/family", style: Bold, size: 18, weight: 700, lineHeight: 16, letterSpacing: 0), Color/Surface Card: #241612, Body Large/18 Regular: Font(family: "font/family", style: Regular, size: 18, weight: 400, lineHeight: 16, letterSpacing: 0), Body/14 Regular · lh 22: Font(family: "font/family", style: Regular, size: 14, weight: 400, lineHeight: 22, letterSpacing: 0), Color/Ink: #140D0A.
