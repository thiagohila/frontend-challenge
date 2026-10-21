# Footer (componente compartilhado; idêntico em todas as telas desktop: instâncias 70493:1151, 70493:1607, 70493:2063, 70493:2519)

- Figma: file `uweCCvGGvM7N1rQTFUjwQ3`, node `70492:696`
- Screenshot de referência: `docs/design/frames/desktop-inicio.png`
- Fonte: `get_design_context` (React+Tailwind de referência; **não é código final** — adaptar ao projeto). Assets já baixados em `design-src/assets/`.

## Código de referência

```tsx
const assetDir = "/design-src/assets"; // assets locais (URLs temporárias do Figma substituídas)
const imgFrame108 = `${assetDir}/social-facebook.svg`;
const imgFrame109 = `${assetDir}/social-instagram.svg`;
const imgFrame110 = `${assetDir}/social-twitter.svg`;
const imgFrame111 = `${assetDir}/social-linkedin.svg`;
const imgFrame112 = `${assetDir}/social-youtube.svg`;

export default function Footer() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full" data-node-id="70492:696" data-name="Footer">
      <div className="bg-[var(--color\/surface-card,#241612)] content-stretch flex flex-col h-[250px] items-start p-[32px] relative shrink-0 w-full" data-node-id="I70492:696;70491:697">
        <div className="content-stretch flex items-end justify-between relative shrink-0 w-[1154px]" data-node-id="I70492:696;70491:698">
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px px-[16px] relative" data-node-id="I70492:696;70491:699">
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="I70492:696;70491:794">
              <div className="bg-[var(--color\/primary,#d28a4c)] content-stretch flex flex-col items-center justify-center relative rounded-[37px] shrink-0 size-[74px]" data-node-id="I70492:696;70491:795">
                <div className="[word-break:break-word] flex flex-col font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold justify-center leading-[0] relative shrink-0 text-[24px] text-[color:var(--color\/ink,#140d0a)] text-center whitespace-nowrap" data-node-id="I70492:696;70491:796">
                  <p className="leading-[normal]">W</p>
                </div>
              </div>
              <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] min-w-full relative shrink-0 text-[17px] text-[color:var(--color\/foreground,#f5f1eb)] w-[min-content]" data-node-id="I70492:696;70491:797">
                Segurança da carteira
              </p>
              <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[22px] relative shrink-0 text-[14px] text-[color:var(--color\/text-secondary,#cfb28c)] w-[204px]" data-node-id="I70492:696;70491:798">
                Proteja sua carteira e colecione arte digital verificada com confiança.
              </p>
            </div>
          </div>
          <div className="flex flex-row items-end self-stretch" data-node-id="I70492:696;70491:841">
            <div className="flex h-full items-center justify-center relative shrink-0 w-px" style={{ containerType: "size" }}>
              <div className="-rotate-90 flex-none w-[100cqh]">
                <div className="bg-[var(--color\/primary,#d28a4c)] h-px relative w-full" />
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col items-start justify-center px-[16px] relative shrink-0 w-[264.667px]" data-node-id="I70492:696;70491:842">
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="I70492:696;70491:843">
              <div className="bg-[var(--color\/primary,#d28a4c)] content-stretch flex flex-col items-center justify-center relative rounded-[37px] shrink-0 size-[74px]" data-node-id="I70492:696;70491:844">
                <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[normal] relative shrink-0 text-[24px] text-[color:var(--color\/ink,#140d0a)] whitespace-nowrap" data-node-id="I70492:696;70491:845">
                  C
                </p>
              </div>
              <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] min-w-full relative shrink-0 text-[17px] text-[color:var(--color\/foreground,#f5f1eb)] w-[min-content]" data-node-id="I70492:696;70491:846">
                Criadores em destaque
              </p>
              <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[22px] relative shrink-0 text-[14px] text-[color:var(--color\/text-secondary,#cfb28c)] w-[204px]" data-node-id="I70492:696;70491:847">
                Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.
              </p>
            </div>
          </div>
          <div className="flex flex-row items-end self-stretch" data-node-id="I70492:696;70491:959">
            <div className="flex h-full items-center justify-center relative shrink-0 w-px" style={{ containerType: "size" }}>
              <div className="-rotate-90 flex-none w-[100cqh]">
                <div className="bg-[var(--color\/primary,#d28a4c)] h-px relative w-full" />
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col items-start px-[16px] relative shrink-0 w-[264.667px]" data-node-id="I70492:696;70491:960">
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="I70492:696;70491:961">
              <div className="bg-[var(--color\/primary,#d28a4c)] content-stretch flex flex-col items-center justify-center relative rounded-[37px] shrink-0 size-[74px]" data-node-id="I70492:696;70491:962">
                <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[normal] relative shrink-0 text-[24px] text-[color:var(--color\/ink,#140d0a)] whitespace-nowrap" data-node-id="I70492:696;70491:963">
                  D
                </p>
              </div>
              <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] min-w-full relative shrink-0 text-[17px] text-[color:var(--color\/foreground,#f5f1eb)] w-[min-content]" data-node-id="I70492:696;70491:964">
                Alertas de lançamentos
              </p>
              <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[22px] relative shrink-0 text-[14px] text-[color:var(--color\/text-secondary,#cfb28c)] w-[204px]" data-node-id="I70492:696;70491:965">
                Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.
              </p>
            </div>
          </div>
          <div className="flex flex-row items-end self-stretch" data-node-id="I70492:696;70491:1232">
            <div className="flex h-full items-center justify-center relative shrink-0 w-px" style={{ containerType: "size" }}>
              <div className="-rotate-90 flex-none w-[100cqh]">
                <div className="bg-[var(--color\/primary,#d28a4c)] h-px relative w-full" />
              </div>
            </div>
          </div>
          <div className="flex flex-row items-end self-stretch" data-node-id="I70492:696;70491:1233">
            <div className="content-stretch flex flex-col gap-[12px] h-full items-center px-[16px] relative shrink-0 w-[357px]">
              <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-node-id="I70492:696;70491:1234">
                <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[18px] text-[color:var(--color\/foreground,#f5f1eb)] w-full" data-node-id="I70492:696;70491:1235">
                  Antecipe-se ao próximo lançamento
                </p>
                <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-node-id="I70492:696;70491:1236">
                  <div className="bg-[var(--color\/surface-dark,#38220f)] content-stretch drop-shadow-[0px_0px_10px_rgba(10,6,4,0.45)] flex h-[40px] items-center justify-between pl-[12px] py-[12px] relative rounded-[6px] shrink-0 w-full" data-node-id="I70492:696;70491:1237">
                    <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[16px] relative shrink-0 text-[14px] text-[color:var(--color\/secondary,#b39463)] whitespace-nowrap" data-node-id="I70492:696;70491:1238">
                      digite seu e-mail...
                    </p>
                    <div className="bg-[var(--color\/primary,#d28a4c)] content-stretch flex h-[40px] items-center justify-center pl-[16px] pr-[4px] py-[12px] relative rounded-br-[6px] rounded-tr-[6px] shrink-0 w-[85px]" data-node-id="I70492:696;70491:1239">
                      <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[18px] text-[color:var(--color\/ink,#140d0a)] whitespace-nowrap" data-node-id="I70492:696;70491:1240">
                        Enviar
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal h-[89px] leading-[22px] relative shrink-0 text-[13px] text-[color:var(--color\/text-secondary,#cfb28c)] w-full" data-node-id="I70492:696;70491:1241">
                Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="I70492:696;70491:1242">
        <div className="bg-[var(--color\/surface-dark,#38220f)] content-stretch flex flex-col h-[88px] items-start justify-center p-[32px] relative shrink-0 w-full" data-node-id="I70492:696;70491:1243">
          <div className="content-stretch flex flex-[1_0_0] gap-[92px] items-center min-h-px relative w-full" data-node-id="I70492:696;70491:1244">
            <div className="content-stretch flex flex-[1_0_0] items-center min-w-px overflow-clip py-[8px] relative" data-node-id="I70492:696;70491:1245" data-name="Logo">
              <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[normal] relative shrink-0 text-[14px] text-[color:var(--color\/foreground,#f5f1eb)] tracking-[1.4px] whitespace-nowrap" data-node-id="I70492:696;70491:1246">
                KURIO
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] h-full items-center min-w-px relative" data-node-id="I70492:696;70491:1247">
              <div className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[0] relative shrink-0 text-[14px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="I70492:696;70491:1248">
                <p className="leading-[22px] mb-0">Feito para colecionadores,</p>
                <p className="leading-[22px]">criadores e cultura</p>
              </div>
            </div>
            <div className="content-stretch flex flex-[1_0_0] items-center min-w-px relative" data-node-id="I70492:696;70491:1249">
              <a className="[word-break:break-word] block font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[0] relative shrink-0 text-[0px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" href="mailto:contact@besa.com" data-node-id="I70492:696;70491:1250" target="_blank">
                <p className="cursor-pointer font-['Roboto_Mono:Regular'] leading-[22px] text-[14px]" role="link" tabIndex="0">
                  contato@email.com
                </p>
              </a>
            </div>
            <div className="content-stretch flex items-center relative shrink-0 w-[228px]" data-node-id="I70492:696;70491:1251">
              <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[22px] relative shrink-0 text-[14px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="I70492:696;70491:1252">
                +55 11 4002 8922
              </p>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[6px] items-center relative shrink-0 w-full" data-node-id="I70492:696;70491:1253">
          <div className="bg-[var(--color\/surface-card,#241612)] content-stretch flex flex-col h-[236px] items-start p-[32px] relative shrink-0 w-full" data-node-id="I70492:696;70491:1254">
            <div className="content-stretch flex gap-[124px] items-start relative shrink-0 w-full" data-node-id="I70492:696;70491:1255">
              <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px relative text-[color:var(--color\/foreground,#f5f1eb)]" data-node-id="I70492:696;70491:1256">
                <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[18px] w-full" data-node-id="I70492:696;70491:1257">
                  Meu perfil
                </p>
                <div className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[0] relative shrink-0 text-[14px] w-full" data-node-id="I70492:696;70491:1258">
                  <p className="leading-[30px] mb-0">Meu perfil</p>
                  <p className="leading-[30px] mb-0">Minha coleção</p>
                  <p className="leading-[30px] mb-0">Atividade</p>
                  <p className="leading-[30px] mb-0">Estúdio do criador</p>
                  <p className="leading-[30px]">Lista de interesse</p>
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px relative text-[color:var(--color\/foreground,#f5f1eb)]" data-node-id="I70492:696;70491:1259">
                <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[18px] w-full" data-node-id="I70492:696;70491:1260">
                  Central de ajuda
                </p>
                <div className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[0] relative shrink-0 text-[14px] w-full" data-node-id="I70492:696;70491:1261">
                  <p className="leading-[30px] mb-0">Central de ajuda</p>
                  <p className="leading-[30px] mb-0">Como comprar NFTs</p>
                  <p className="leading-[30px] mb-0">Carteira e segurança</p>
                  <p className="leading-[30px] mb-0">Política do mercado</p>
                  <p className="leading-[30px]">Denunciar item</p>
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px relative text-[color:var(--color\/foreground,#f5f1eb)]" data-node-id="I70492:696;70491:1262">
                <p className="font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[18px] w-full" data-node-id="I70492:696;70491:1263">
                  Coleções
                </p>
                <div className="font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[0] relative shrink-0 text-[14px] w-full" data-node-id="I70492:696;70491:1264">
                  <p className="leading-[30px] mb-0">Arte digital</p>
                  <p className="leading-[30px] mb-0">Fotografia</p>
                  <p className="leading-[30px] mb-0">Música</p>
                  <p className="leading-[30px] mb-0">Arte 3D</p>
                  <p className="leading-[30px]">Utilidade</p>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-[228px]" data-node-id="I70492:696;70491:1265">
                <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-[190px]" data-node-id="I70492:696;70491:1266">
                  <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[18px] text-[color:var(--color\/foreground,#f5f1eb)] w-full" data-node-id="I70492:696;70491:1267">
                    Redes sociais
                  </p>
                  <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-node-id="I70492:696;70491:1268">
                    <div className="relative shrink-0 size-[30px]" data-node-id="I70492:696;70491:1269">
                      <div className="absolute inset-[-3.33%]">
                        <img alt="" className="block max-w-none size-full" src={imgFrame108} />
                      </div>
                    </div>
                    <div className="relative shrink-0 size-[30px]" data-node-id="I70492:696;70491:1271">
                      <div className="absolute inset-[-3.33%]">
                        <img alt="" className="block max-w-none size-full" src={imgFrame109} />
                      </div>
                    </div>
                    <div className="relative shrink-0 size-[30px]" data-node-id="I70492:696;70491:1273">
                      <div className="absolute inset-[-3.33%]">
                        <img alt="" className="block max-w-none size-full" src={imgFrame110} />
                      </div>
                    </div>
                    <div className="relative shrink-0 size-[30px]" data-node-id="I70492:696;70491:1275">
                      <div className="absolute inset-[-3.33%]">
                        <img alt="" className="block max-w-none size-full" src={imgFrame111} />
                      </div>
                    </div>
                    <div className="relative shrink-0 size-[30px]" data-node-id="I70492:696;70491:1277">
                      <div className="absolute inset-[-3.33%]">
                        <img alt="" className="block max-w-none size-full" src={imgFrame112} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="I70492:696;70491:1281">
                  <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[18px] text-[color:var(--color\/foreground,#f5f1eb)] w-full" data-node-id="I70492:696;70491:1282">
                    Carteiras compatíveis
                  </p>
                  <div className="bg-[var(--color\/surface-dark,#38220f)] border border-[var(--color\/border-soft,#55321f)] border-solid content-stretch flex h-[26px] items-center justify-center pl-[8px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-node-id="I70492:696;70491:1283">
                    <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[normal] relative shrink-0 text-[9px] text-[color:var(--color\/text-accent,#e89b55)] tracking-[0.1px] whitespace-pre" data-node-id="I70492:696;70491:1284">{`METAMASK  •  WALLETCONNECT  •  COINBASE`}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[30px] relative shrink-0 text-[14px] text-[color:var(--color\/foreground,#f5f1eb)] text-center w-full" data-node-id="I70492:696;70491:1285">
            © 2026 Kurio. Propriedade digital para todos.
          </p>
        </div>
      </div>
    </div>
  );
}
```

## Metadados do Figma

These styles are contained in the design: Color/Ink: #140D0A, Heading/24 Bold: Font(family: "font/family", style: Bold, size: 24, weight: 700, lineHeight: 100, letterSpacing: 0), Color/Primary: #D28A4C, Color/Foreground: #F5F1EB, Body Large/17 Bold: Font(family: "font/family", style: Bold, size: 17, weight: 700, lineHeight: 16, letterSpacing: 0), Text/Secondary: #CFB28C, Body/14 Regular · lh 22: Font(family: "font/family", style: Regular, size: 14, weight: 400, lineHeight: 22, letterSpacing: 0), Body Large/18 Bold · lh 16: Font(family: "font/family", style: Bold, size: 18, weight: 700, lineHeight: 16, letterSpacing: 0), Color/Secondary: #B39463, Body/14 Regular · lh 16: Font(family: "font/family", style: Regular, size: 14, weight: 400, lineHeight: 16, letterSpacing: 0), Color/Surface Dark: #38220F, Caption/13 Regular · lh 22: Font(family: "font/family", style: Regular, size: 13, weight: 400, lineHeight: 22, letterSpacing: 0), Color/Surface Card: #241612, Body/14 Bold · lh auto: Font(family: "font/family", style: Bold, size: 14, weight: 700, lineHeight: 100, letterSpacing: 10), Body/14 Regular · lh 30: Font(family: "font/family", style: Regular, size: 14, weight: 400, lineHeight: 30, letterSpacing: 0), Text/Accent: #E89B55, Tiny/9 Bold: Font(family: "font/family", style: Bold, size: 9, weight: 700, lineHeight: 100, letterSpacing: 0.10000000149011612), Color/Border Soft: #55321F.

Component descriptions: The following components have usage descriptions or documentation links defined in Figma. These descriptions provide important context about the intended usage, best practices, and any constraints for each component. Follow these guidelines when implementing or using these components.

## Footer
**Node ID:** 70491:1286

Desktop footer, 1200 wide: three feature medallions with a newsletter signup, the brand band with contact details, and four link columns with social and wallet chips. Drop as the last child of the screen with FILL width and HUG height. On screens with a modal scrim the footer must stay BELOW the scrim in paint order. Content is identical on every screen; no per-instance overrides expected.
