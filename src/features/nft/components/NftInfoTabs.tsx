import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { NftDetail } from '@/contracts/nft'
import { t } from '@/i18n'

const triggerClass =
  // Must shrink + wrap: on 390px the long reviews label overflowed and widened the layout viewport (U10).
  'h-auto min-w-0 flex-initial whitespace-normal text-left rounded-none border-0 border-b-[3px] border-transparent -mb-px bg-transparent px-0 pb-2 text-base leading-5 font-normal text-foreground shadow-none lg:text-[17px] data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:font-bold data-[state=active]:text-text-accent data-[state=active]:shadow-none'

/** Details / reviews (Radix tabs: arrow-key navigation). Labels follow content (Figma had them swapped). */
export function NftInfoTabs({ nft }: { nft: NftDetail }) {
  return (
    <Tabs defaultValue="details" className="mt-16 gap-0 lg:mt-24">
      <TabsList
        aria-label={t.detail.tabsLabel}
        className="h-auto w-full justify-start gap-6 rounded-none border-b border-border bg-transparent p-0 lg:gap-8"
      >
        <TabsTrigger value="details" className={triggerClass}>
          {t.detail.detailsTab}
        </TabsTrigger>
        <TabsTrigger value="reviews" className={triggerClass}>
          {t.detail.reviewsTab(nft.rating.count)}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="details" className="mt-4 flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
        {nft.description.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
        <dl className="flex flex-col gap-4">
          <InfoRow term={t.detail.network} value={t.detail.networkText(t.networks[nft.network], nft.metadataStorage)} />
          <InfoRow
            term={t.detail.contract}
            value={t.detail.contractText(`${nft.contract.address.slice(0, 6)}...${nft.contract.address.slice(-4)}`, nft.contract.standard)}
          />
          <InfoRow term={t.detail.royalties} value={t.detail.royaltiesText(nft.royaltyPct)} />
        </dl>
      </TabsContent>
      <TabsContent value="reviews" className="mt-4 text-sm text-muted-foreground">
        {t.detail.reviewsSoon}
      </TabsContent>
    </Tabs>
  )
}

function InfoRow({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt className="font-bold text-foreground">{term}</dt>
      <dd>{value}</dd>
    </div>
  )
}
