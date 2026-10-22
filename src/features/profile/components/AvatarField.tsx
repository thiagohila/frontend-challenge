import { ImageIcon } from 'lucide-react'
import { useId, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { t } from '@/i18n'
import { announce } from '@/lib/announce'
import { isApiError } from '@/lib/api-error'
import { AVATAR_TYPES, checkAvatar, toAvatarDataUrl } from '@/lib/image'
import { useProfileMutations } from '../queries'

/** Avatar: change (validated + resized client-side, re-validated by the API) and remove (S11). */
export function AvatarField({ userId, avatarUrl }: { userId: string; avatarUrl: string | null }) {
  const input = useRef<HTMLInputElement>(null)
  const id = useId()
  const { setAvatar, removeAvatar } = useProfileMutations(userId)
  const [error, setError] = useState<string | null>(null)
  const busy = setAvatar.isPending || removeAvatar.isPending

  const onFile = async (file: File | undefined) => {
    if (!file) return
    setError(null)
    const problem = checkAvatar(file)
    if (problem) return setError(problem === 'type' ? t.profile.avatarType : t.profile.avatarSize)
    const dataUrl = await toAvatarDataUrl(file)
    setAvatar.mutate(dataUrl, {
      onSuccess: () => announce(t.profile.avatarUpdated),
      onError: (failure) => setError(isApiError(failure) ? failure.message : t.form.genericError),
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <span id={`${id}-label`} className="text-[15px] font-medium">
        {t.profile.avatar}
      </span>
      <div className="flex items-center gap-6">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={t.profile.avatarAlt}
            width={50}
            height={50}
            className="size-[50px] rounded-full object-cover"
            data-testid="avatar-image"
          />
        ) : (
          <span
            aria-hidden
            className="grid size-[50px] place-items-center rounded-full border border-border bg-surface-raised text-brand-secondary"
            data-testid="avatar-placeholder"
          >
            <ImageIcon className="size-5" />
          </span>
        )}
        <input
          ref={input}
          type="file"
          accept={AVATAR_TYPES.join(',')}
          className="sr-only"
          aria-labelledby={`${id}-label`}
          aria-describedby={`${id}-hint ${error ? `${id}-error` : ''}`}
          onChange={(event) => {
            void onFile(event.target.files?.[0])
            event.target.value = ''
          }}
          data-testid="avatar-input"
        />
        <Button type="button" onClick={() => input.current?.click()} disabled={busy} className="h-10 w-[98px] rounded-[3px] font-bold">
          {t.profile.change}
        </Button>
        {avatarUrl && (
          <Button
            type="button"
            variant="link"
            disabled={busy}
            onClick={() => removeAvatar.mutate(undefined, { onSuccess: () => announce(t.profile.avatarRemoved) })}
            className="text-foreground"
          >
            {t.profile.remove}
          </Button>
        )}
      </div>
      <p id={`${id}-hint`} className="text-xs text-muted-foreground">
        {t.profile.avatarHint}
      </p>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
