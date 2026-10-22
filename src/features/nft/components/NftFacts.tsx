import { ComingSoon } from '@/components/layout/ComingSoon'
import type { NftDetail } from '@/contracts/nft'
import { t } from '@/i18n'
import { iconSrc, type IconName } from '@/lib/assets'

export function NftFacts({ nft }: { nft: NftDetail }) {
  return (
    <dl className="flex flex-col gap-3 text-sm text-muted-foreground">
      <div className="flex gap-1">
        <dt>{t.detail.tokenId}</dt>
        <dd>{nft.tokenId}</dd>
      </div>
      <div className="flex gap-1">
        <dt>{t.detail.collection}</dt>
        <dd>{nft.series}</dd>
      </div>
      <div className="flex gap-1">
        <dt>{t.detail.attributes}</dt>
        <dd>{nft.attributes.join(', ')}</dd>
      </div>
    </dl>
  )
}

/** Sharing is out of scope (S14): visible as designed, explains it is unavailable. */
const SHARE_TARGETS = [
  { icon: 'icon-share-linkedin', network: 'LinkedIn' },
  { icon: 'icon-share-mail', network: 'E-mail' },
  { icon: 'icon-share-twitter', network: 'X' },
] as const satisfies readonly { icon: IconName; network: string }[]

/** Same bordered 28 px button for every network (Figma glyphs inside), out of scope → "Em breve". */
export function ShareLinks() {
  return (
    <div className="hidden items-center gap-3 text-sm font-bold lg:flex">
      {t.detail.share}
      <span className="flex gap-2">
        {SHARE_TARGETS.map(({ icon, network }) => (
          <ComingSoon
            key={icon}
            aria-label={t.detail.shareOn(network)}
            className="grid size-7 place-items-center rounded-[5px] border border-primary transition-colors hover:bg-surface-raised"
          >
            <img src={iconSrc(icon)} alt="" className="max-h-4 max-w-4" />
          </ComingSoon>
        ))}
      </span>
    </div>
  )
}
