import { Search, X } from 'lucide-react'
import { useState } from 'react'
import { NftArt } from '@/components/nft/NftArt'
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import type { ArtName } from '@/lib/assets'
import { t } from '@/i18n'
import { cn } from '@/lib/utils'

// The Figma gallery shows 4 thumbnails of the same artwork (one art per NFT in the file).
const VIEWS = 4

export function NftGallery({ art, name }: { art: ArtName; name: string }) {
  const [active, setActive] = useState(0)
  return (
    // Tablet: keep the artwork at a readable size instead of stretching to 736 px.
    <div className="mx-auto flex w-full max-w-[520px] flex-col-reverse gap-4 lg:mx-0 lg:w-auto lg:max-w-none lg:flex-row lg:gap-7">
      <ul aria-label={t.detail.gallery} className="hidden gap-4 lg:flex lg:flex-col">
        {Array.from({ length: VIEWS }, (_, view) => `view-${view}`).map((key, view) => (
          <li key={key}>
            <button
              type="button"
              aria-label={t.detail.showImage(view + 1)}
              aria-pressed={active === view}
              onClick={() => setActive(view)}
              className={cn('block overflow-hidden rounded-md border', active === view ? 'border-primary' : 'border-transparent')}
            >
              <NftArt art={art} alt="" width={100} className="size-[100px]" />
            </button>
          </li>
        ))}
      </ul>
      <div className="relative lg:bg-card lg:p-5">
        <NftArt art={art} alt={name} width={444} priority className="w-full rounded-3xl lg:size-[404px]" />
        <Dialog>
          <DialogTrigger
            aria-label={t.detail.zoom}
            className="absolute top-[13px] right-3 hidden size-[30px] place-items-center rounded-full bg-ink/80 text-foreground hover:text-text-accent lg:grid"
          >
            <Search aria-hidden className="size-4" />
          </DialogTrigger>
          {/* Square art fitted to the window (both sides), never cropped by a short viewport. */}
          <DialogContent
            showCloseButton={false}
            className="w-[min(900px,calc(100vw-2rem),calc(100dvh-2rem))] max-w-none bg-card p-2 sm:max-w-none"
          >
            <DialogTitle className="sr-only">{name}</DialogTitle>
            <NftArt art={art} alt={name} width={900} className="w-full rounded-xl" />
            <DialogClose
              aria-label={t.auth.close}
              className="absolute top-4 right-4 grid size-9 place-items-center rounded-full bg-ink/80 text-foreground transition-colors hover:text-text-accent"
            >
              <X aria-hidden className="size-5" />
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
