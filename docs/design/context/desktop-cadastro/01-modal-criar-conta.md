# Desktop / Cadastro (9:1022) — Sign Up Modal (fundo = desktop-login/02-marketplace-page-fundo)

- Figma: file `uweCCvGGvM7N1rQTFUjwQ3`, node `70383:239`
- Screenshot de referência: `docs/design/frames/desktop-cadastro.png`
- Fonte: `get_design_context` (React+Tailwind de referência; **não é código final** — adaptar ao projeto). Assets já baixados em `design-src/assets/`.

## Código de referência

```tsx
const assetDir = "/design-src/assets"; // assets locais (URLs temporárias do Figma substituídas)
const imgX = `${assetDir}/icon-close-18.svg`;
const imgVector = `${assetDir}/logo-google-part-1.svg`;
const imgVector1 = `${assetDir}/logo-google-part-2.svg`;
const imgGroup = `${assetDir}/logo-google-part-3.svg`;
const imgVector2 = `${assetDir}/logo-google-part-4.svg`;
const imgVector3 = `${assetDir}/logo-google-part-5.svg`;
const imgVector4 = `${assetDir}/logo-google-part-6.svg`;
const imgVector5 = `${assetDir}/logo-google-part-7.svg`;
const imgFacebook1 = `${assetDir}/logo-facebook.svg`;
const imgHide = `${assetDir}/icon-eye-off.svg`;
const imgLine7 = `${assetDir}/deco-divider-179-left.svg`;
const imgLine8 = `${assetDir}/deco-divider-179-right.svg`;

function X({ className }: { className?: string }) {
  return (
    <div className={className || "relative size-[18px]"} data-node-id="9:947" data-name="X">
      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgX} />
    </div>
  );
}

type SocialButtonProps = {
  className?: string;
  provider?: "Google" | "Facebook";
};

function SocialButton({ className, provider = "Google" }: SocialButtonProps) {
  const isFacebook = provider === "Facebook";
  const isGoogle = provider === "Google";
  return (
    <div className={className || "border border-[var(--color\\/border,#3f2319)] border-solid content-stretch flex h-[40px] items-center justify-center overflow-clip relative rounded-[5px] w-[340px]"} id={isFacebook ? "node-70483_262" : "node-70483_256"}>
      <div className="content-stretch flex gap-[12px] items-center relative shrink-0" id={isFacebook ? "node-70483_258" : "node-70483_241"} data-name="Content">
        {isGoogle && (
          <>
            <div className="overflow-clip relative shrink-0 size-[20px]" data-node-id="70483:242" data-name="google 1">
              <div className="absolute contents inset-0" data-node-id="70483:243" data-name="Group">
                <div className="absolute inset-[57.68%_17.83%_0_7.11%]" data-node-id="70483:244" data-name="Vector">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector} />
                </div>
                <div className="absolute bottom-0 left-1/2 right-[17.83%] top-[71.33%]" data-node-id="70483:245" data-name="Vector">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector1} />
                </div>
                <div className="absolute contents inset-[24.69%_75.25%_24.69%_0]" data-node-id="70483:246" data-name="Connected_Home_1_">
                  <div className="absolute contents inset-[24.69%_75.25%_24.69%_0]" data-node-id="70483:247" data-name="Group">
                    <div className="absolute contents inset-[24.69%_75.25%_24.69%_0]" data-node-id="70483:248" data-name="Group">
                      <div className="absolute inset-[24.69%_75.25%_24.69%_0]" data-node-id="70483:249" data-name="Group">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-[38.28%_0_11.97%_47.07%]" data-node-id="70483:251" data-name="Vector">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector2} />
                </div>
                <div className="absolute bottom-[11.97%] left-1/2 right-0 top-[38.28%]" data-node-id="70483:252" data-name="Vector">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector3} />
                </div>
                <div className="absolute inset-[0_17.01%_57.68%_7.11%]" data-node-id="70483:253" data-name="Vector">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector4} />
                </div>
                <div className="absolute bottom-[70.51%] left-1/2 right-[17.01%] top-0" data-node-id="70483:254" data-name="Vector">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector5} />
                </div>
              </div>
            </div>
            <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium leading-[16px] relative shrink-0 text-[13px] text-[color:var(--color\/text-secondary,#cfb28c)] text-center whitespace-nowrap" data-node-id="70483:255">
              Continuar com Google
            </p>
          </>
        )}
        {isFacebook && (
          <>
            <div className="relative shrink-0 size-[20px]" data-node-id="70483:259" data-name="facebook 1">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFacebook1} />
            </div>
            <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium leading-[16px] relative shrink-0 text-[13px] text-[color:var(--color\/text-secondary,#cfb28c)] text-center whitespace-nowrap" data-node-id="70483:261">
              Continuar com Facebook
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function SignUpModal() {
  return (
    <div className="bg-[var(--color\/surface-card,#241612)] content-stretch flex flex-col items-start overflow-clip relative rounded-[8px] size-full" data-node-id="70383:239" data-name="Sign Up Modal">
      <div className="content-stretch flex flex-col items-center overflow-clip pt-[48px] relative shrink-0 w-full" data-node-id="70383:240" data-name="Modal Header">
        <div className="content-stretch flex flex-col gap-[40px] items-center px-[48px] relative shrink-0 w-full" data-node-id="70402:3570">
          <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0" data-node-id="9:1148">
            <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium leading-[16px] relative shrink-0 text-[20px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="9:1149">
              Entrar
            </p>
            <div className="flex flex-row items-center self-stretch" data-node-id="70410:4119">
              <div className="bg-[var(--color\/text-coral,#f0805f)] h-full relative shrink-0 w-px" />
            </div>
            <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Medium')] font-medium leading-[16px] relative shrink-0 text-[20px] text-[color:var(--color\/text-accent,#e89b55)] whitespace-nowrap" data-node-id="9:1150">
              Criar conta
            </p>
          </div>
          <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[16px] min-w-full relative shrink-0 text-[13px] text-[color:var(--color\/foreground,#f5f1eb)] text-center w-[min-content]" data-node-id="9:1152">
            Crie seu perfil de colecionador e conecte uma carteira quando quiser.
          </p>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip pt-[24px] px-[80px] relative shrink-0 w-full" data-node-id="70383:241" data-name="Form">
        <div className="border border-[var(--color\/border,#3f2319)] border-solid content-stretch flex h-[40px] items-center overflow-clip px-[16px] py-[12px] relative rounded-[5px] shrink-0 w-full" data-node-id="70383:242" data-name="Username Input">
          <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[16px] relative shrink-0 text-[14px] text-[color:var(--color\/secondary,#b39463)] whitespace-nowrap" data-node-id="9:1158">
            Nome de usuário
          </p>
        </div>
        <div className="border border-[var(--color\/border,#3f2319)] border-solid content-stretch flex h-[40px] items-center overflow-clip px-[16px] py-[12px] relative rounded-[5px] shrink-0 w-full" data-node-id="70383:243" data-name="Email Input">
          <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[16px] relative shrink-0 text-[14px] text-[color:var(--color\/secondary,#b39463)] whitespace-nowrap" data-node-id="9:1211">
            Digite seu e-mail
          </p>
        </div>
        <div className="border border-[var(--color\/border,#3f2319)] border-solid content-stretch flex h-[40px] items-center overflow-clip px-[16px] py-[12px] relative rounded-[5px] shrink-0 w-full" data-node-id="70383:244" data-name="Password Input">
          <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[16px] relative shrink-0 text-[14px] text-[color:var(--color\/secondary,#b39463)] whitespace-nowrap" data-node-id="9:1210">
            Senha
          </p>
          <div className="absolute inset-[calc(25%-0.5px)_calc(3.33%-0.93px)_calc(25%-0.5px)_calc(90%+0.8px)]" data-node-id="9:1167" data-name="Iconly/Curved/Hide">
            <div className="absolute inset-[17.71%_11.42%_16.57%_11.46%]" data-node-id="I9:1167;29221:4811" data-name="Hide">
              <div className="absolute inset-[-5.7%_-4.29%_-5.71%_-4.29%]">
                <img alt="" className="block max-w-none size-full" src={imgHide} />
              </div>
            </div>
          </div>
        </div>
        <div className="border border-[var(--color\/border,#3f2319)] border-solid content-stretch flex h-[40px] items-center overflow-clip px-[16px] py-[12px] relative rounded-[5px] shrink-0 w-full" data-node-id="70383:245" data-name="Confirm Password Input">
          <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[16px] relative shrink-0 text-[14px] text-[color:var(--color\/secondary,#b39463)] whitespace-nowrap" data-node-id="9:1213">
            Confirmar senha
          </p>
        </div>
      </div>
      <div className="content-stretch flex flex-col items-start overflow-clip pt-[24px] px-[80px] relative shrink-0 w-full" data-node-id="70383:246" data-name="CTA">
        <div className="bg-[var(--color\/primary,#d28a4c)] content-stretch flex h-[45px] items-center justify-center overflow-clip relative rounded-[5px] shrink-0 w-full" data-node-id="70383:247" data-name="Sign Up Button">
          <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Bold')] font-bold leading-[16px] relative shrink-0 text-[16px] text-[color:var(--color\/ink,#140d0a)] whitespace-nowrap" data-node-id="9:1168">
            Criar conta
          </p>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[16px] items-start overflow-clip pt-[24px] relative shrink-0 w-full" data-node-id="70383:248" data-name="Social">
        <div className="content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 w-full" data-node-id="70383:249" data-name="Divider">
          <div className="flex-[1_0_0] h-0 min-w-px relative" data-node-id="9:1169">
            <div className="absolute inset-[-1px_0_0_0]">
              <img alt="" className="block max-w-none size-full" src={imgLine7} />
            </div>
          </div>
          <p className="[word-break:break-word] font-[family-name:var(--font\/family,'Roboto_Mono:Regular')] font-normal leading-[16px] relative shrink-0 text-[13px] text-[color:var(--color\/foreground,#f5f1eb)] whitespace-nowrap" data-node-id="9:1153">
            Ou continue com
          </p>
          <div className="flex-[1_0_0] h-0 min-w-px relative" data-node-id="9:1170">
            <div className="absolute inset-[-1px_0_0_0]">
              <img alt="" className="block max-w-none size-full" src={imgLine8} />
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[16px] items-start px-[80px] relative shrink-0 w-full" data-node-id="70402:3596">
          <SocialButton className="border border-[var(--color\/border,#3f2319)] border-solid content-stretch flex h-[40px] items-center justify-center overflow-clip relative rounded-[5px] shrink-0 w-full" />
          <SocialButton className="border border-[var(--color\/border,#3f2319)] border-solid content-stretch flex h-[40px] items-center justify-center overflow-clip relative rounded-[5px] shrink-0 w-full" provider="Facebook" />
        </div>
      </div>
      <div className="absolute bg-[var(--color\/primary,#d28a4c)] h-[10px] left-0 top-[646px] w-[500px]" data-node-id="9:1230" />
      <X className="absolute inset-[1.98%_2.6%_95.27%_93.8%]" />
    </div>
  );
}
```

## Metadados do Figma

These styles are contained in the design: Color/Foreground: #F5F1EB, Title/20 Medium: Font(family: "font/family", style: Medium, size: 20, weight: 500, lineHeight: 16, letterSpacing: 0), Text/Coral: #F0805F, Text/Accent: #E89B55, Caption/13 Regular · lh 16: Font(family: "font/family", style: Regular, size: 13, weight: 400, lineHeight: 16, letterSpacing: 0), Color/Secondary: #B39463, Body/14 Regular · lh 16: Font(family: "font/family", style: Regular, size: 14, weight: 400, lineHeight: 16, letterSpacing: 0), Color/Ink: #140D0A, Body Large/16 Bold · lh 16: Font(family: "font/family", style: Bold, size: 16, weight: 700, lineHeight: 16, letterSpacing: 0), Color/Primary: #D28A4C, Color/Border: #3F2319, Logo/Google Green: #59C36A, Color/Success: #00A66C, Logo/Google Yellow: #FFDA2D, Logo/Google Blue: #4086F4, Logo/Blue: #4175DF, Logo/Orange: #FF641A, Text/Secondary: #CFB28C, Caption/13 Medium: Font(family: "font/family", style: Medium, size: 13, weight: 500, lineHeight: 16, letterSpacing: 0), Logo/Facebook: #3B5999, Color/Surface Card: #241612.

Component descriptions: The following components have usage descriptions or documentation links defined in Figma. These descriptions provide important context about the intended usage, best practices, and any constraints for each component. Follow these guidelines when implementing or using these components.

## Social Button
**Node ID:** 70483:263

Third-party sign-in button. Provider picks the brand mark and label. Always FILL width — the parent container owns the horizontal inset (80px inside the auth modals, 0 on the mobile screens).
