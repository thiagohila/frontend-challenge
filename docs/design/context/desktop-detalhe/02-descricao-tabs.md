# Desktop / Detalhes do NFT — tabs Detalhes/Avaliações + descrição

- Figma: file `uweCCvGGvM7N1rQTFUjwQ3`, node `70342:2780`
- Screenshot de referência: `docs/design/frames/desktop-detalhe.png`
- Fonte: `get_design_context` (React+Tailwind de referência; **não é código final** — adaptar ao projeto). Assets já baixados em `design-src/assets/`.

## Código de referência

```tsx
const assetDir = "/design-src/assets"; // assets locais (URLs temporárias do Figma substituídas)
const imgLine6 = `${assetDir}/deco-tab-underline-161.svg`;
const imgLine5 = `${assetDir}/deco-divider-1200.svg`;

export default function Description() {
  return (
    <div className="content-stretch flex flex-col items-end relative size-full" data-node-id="70342:2780" data-name="Description">
      <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="70342:2779">
        <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-node-id="70342:2778">
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="70342:2777">
            <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-node-id="70342:2776">
              <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="70342:2775">
                <div className="content-stretch flex flex-col gap-[12px] items-end relative shrink-0 w-full" data-node-id="70342:2774">
                  <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="70342:2773">
                    <div className="content-stretch flex gap-[32px] items-start relative shrink-0" data-node-id="70342:2772">
                      <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[161px]" data-node-id="70342:2771">
                        <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[17px] text-[color:var(--color\/text-accent,#e89b55)] w-full" data-node-id="10:289">
                          Detalhes do NFT
                        </p>
                        <div className="h-0 relative shrink-0 w-full" data-node-id="11:1252">
                          <div className="absolute inset-[-3px_0_0_0]">
                            <img alt="" className="block max-w-none size-full" src={imgLine6} />
                          </div>
                        </div>
                      </div>
                      <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[16px] relative shrink-0 text-[17px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="11:1253">
                        Avaliações de colecionadores (19)
                      </p>
                    </div>
                    <div className="h-0 relative shrink-0 w-full" data-node-id="11:1250">
                      <div className="absolute inset-[-0.3px_0_0_0]">
                        <img alt="" className="block max-w-none size-full" src={imgLine5} />
                      </div>
                    </div>
                  </div>
                  <div className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[0] relative shrink-0 text-[14px] text-[color:var(--color\/text-secondary,#cfb28c)] w-full whitespace-pre-wrap" data-node-id="11:1251">
                    <p className="leading-[24px] mb-0">Emerald Ape #042 é uma obra digital 1/50 finalizada à mão da coleção Kurio Editions. Cada atributo fica armazenado nos metadados do token e verificado na Ethereum. A obra explora identidade, movimento e luz em um mundo digital sem fronteiras.</p>
                    <p className="leading-[24px] mb-0">​</p>
                    <p className="leading-[24px]">A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores e um registro permanente de procedência registrada na rede. Nova Sato recebe 5% de direitos autorais nas vendas secundárias, apoiando novos trabalhos e lançamentos da comunidade.</p>
                  </div>
                </div>
                <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[24px] relative shrink-0 text-[14px] text-[color:var(--color\/foreground,#f5f1eb)] w-full" data-node-id="11:1258">
                  Rede:
                </p>
              </div>
              <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[24px] relative shrink-0 text-[14px] text-[color:var(--color\/text-secondary,#cfb28c)] w-full" data-node-id="11:1259">
                Cunhado na Ethereum com procedência imutável e metadados armazenados no IPFS.
              </p>
            </div>
            <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[24px] relative shrink-0 text-[14px] text-[color:var(--color\/foreground,#f5f1eb)] w-full" data-node-id="11:1260">
              Contrato:
            </p>
          </div>
          <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[24px] relative shrink-0 text-[14px] text-[color:var(--color\/text-secondary,#cfb28c)] w-full" data-node-id="11:1261">
            Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente pelos mercados compatíveis.
          </p>
        </div>
        <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[24px] relative shrink-0 text-[14px] text-[color:var(--color\/foreground,#f5f1eb)] w-full" data-node-id="11:1262">
          Direitos autorais:
        </p>
      </div>
      <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[24px] relative shrink-0 text-[14px] text-[color:var(--color\/text-secondary,#cfb28c)] w-full" data-node-id="11:1263">
        0x7A42...19E8 • Contrato inteligente ERC-721 verificado.
      </p>
    </div>
  );
}
```

## Metadados do Figma

These styles are contained in the design: Text/Accent: #E89B55, Body Large/17 Bold: Font(family: "font/family", style: Bold, size: 17, weight: 700, lineHeight: 16, letterSpacing: 0), Color/Primary: #D28A4C, Color/Foreground: #F5F1EB, Body Large/17 Regular · lh 16: Font(family: "font/family", style: Regular, size: 17, weight: 400, lineHeight: 16, letterSpacing: 0), Text/Secondary: #CFB28C, Body/14 Regular · lh 24: Font(family: "font/family", style: Regular, size: 14, weight: 400, lineHeight: 24, letterSpacing: 0), Body/14 Bold · lh 24: Font(family: "font/family", style: Bold, size: 14, weight: 700, lineHeight: 24, letterSpacing: 0).
