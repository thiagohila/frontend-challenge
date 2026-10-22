import { useCallback, useRef, useState } from 'react'
import type { Wallet } from '@/contracts/wallet'
import { toFormValues, type WalletFormValues } from '../form'
import { WalletSection } from './WalletSection'

/**
 * Primary + secondary sections. "Igual à carteira principal" (on the secondary) is offered when a
 * primary exists or is being filled in, and copies the primary as it is right now — the unsaved
 * draft if its form is open, else the saved wallet.
 */
export function WalletsManager({ userId, email, wallets }: { userId: string; email: string; wallets: readonly Wallet[] }) {
  const primary = wallets.find((wallet) => wallet.role === 'primary')
  const secondary = wallets.find((wallet) => wallet.role === 'secondary')
  const [editingPrimary, setEditingPrimary] = useState(false)
  // Read on demand (checkbox click), not rendered: a ref avoids re-rendering the page on each keystroke.
  const primaryDraft = useRef<WalletFormValues | null>(null)

  const onPrimaryEditing = useCallback((editing: boolean) => {
    setEditingPrimary(editing)
    if (!editing) primaryDraft.current = null
  }, [])
  const onPrimaryDraft = useCallback((values: WalletFormValues) => {
    primaryDraft.current = values
  }, [])

  return (
    <div className="flex flex-col gap-10">
      <WalletSection
        userId={userId}
        email={email}
        walletRole="primary"
        wallet={primary}
        onEditingChange={onPrimaryEditing}
        onDraftChange={onPrimaryDraft}
      />
      <WalletSection
        userId={userId}
        email={email}
        walletRole="secondary"
        wallet={secondary}
        sameAsPrimary={{
          available: Boolean(primary) || editingPrimary,
          source: () => primaryDraft.current ?? (primary ? toFormValues(primary, email) : null),
        }}
      />
    </div>
  )
}
