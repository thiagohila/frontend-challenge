import { ComingSoon } from '@/components/layout/ComingSoon'
import type { NftDetail } from '@/contracts/nft'
import { t } from '@/i18n'
import { iconSrc } from '@/lib/assets'

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
export function ShareLinks() {
  return (
    <div className="hidden items-center gap-3 text-sm font-bold lg:flex">
      {t.detail.share}
      {(['social-linkedin', 'icon-share-mail', 'social-twitter'] as const).map((icon) => (
        <ComingSoon
          key={icon}
          aria-label={t.detail.shareOn(icon.replace(/^(social|icon-share)-/, ''))}
          className="grid size-5 place-items-center"
        >
          <img src={iconSrc(icon)} alt="" width={16} height={16} />
        </ComingSoon>
      ))}
    </div>
  )
}
