import { useQuery } from '@tanstack/react-query'
import { Link, Navigate, useNavigate } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Cart } from '@/contracts/cart'
import type { Profile } from '@/contracts/profile'
import type { Quote } from '@/contracts/quote'
import type { Wallet } from '@/contracts/wallet'
import { QuoteError } from '@/features/cart/components/QuoteError'
import { quoteQuery } from '@/features/cart/queries'
import { t } from '@/i18n'
import { announce } from '@/lib/announce'
import { isApiError } from '@/lib/api-error'
import type { Owner } from '@/lib/query-keys'
import { useZodForm } from '@/lib/zod-form'
import { type CheckoutFormOutput, checkoutFormSchema } from '../form'
import { StaleQuoteError, usePlaceOrder, useWalletConnection } from '../queries'
import { CollectorFields } from './CollectorFields'
import { OrderLines } from './OrderLines'
import { ReviewDialog } from './ReviewDialog'
import { SavedWalletPicker, WalletProviderPicker } from './WalletChooser'

/** What the buyer actually sees and agrees to; a new quote id with the same values needs no re-confirmation. */
const quoteSignature = (quote: Quote) =>
  JSON.stringify([
    quote.network,
    quote.totalEth,
    quote.networkFeeEth,
    quote.discountEth,
    quote.lines.map((line) => [line.nftId, line.editionId, line.quantity, line.unitPriceEth]),
  ])

interface CheckoutViewProps {
  userId: string
  owner: Owner
  cart: Cart
  wallets: Wallet[]
  profile: Profile
}

export function CheckoutView({ userId, owner, cart, wallets, profile }: CheckoutViewProps) {
  const navigate = useNavigate()
  const primary = wallets.find((wallet) => wallet.role === 'primary') ?? wallets[0]
  const form = useZodForm(checkoutFormSchema, {
    defaultValues: {
      displayName: profile.displayName,
      username: profile.username,
      email: profile.email,
      note: '',
      walletId: primary?.id ?? '',
      network: primary?.network ?? 'ethereum',
      provider: primary?.walletType ?? 'metamask',
    },
  })
  const network = checkoutFormSchema.shape.network.safeParse(form.watch('network')).data ?? 'ethereum'
  const quote = useQuery(quoteQuery(owner, network, cart.items.length > 0))
  const { connection, connect, disconnect } = useWalletConnection(userId)
  const placeOrder = usePlaceOrder(userId, owner)

  const [connectError, setConnectError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [staleNotice, setStaleNotice] = useState<string | null>(null)
  const confirmButton = useRef<HTMLButtonElement>(null)
  const [review, setReview] = useState<{ values: CheckoutFormOutput; signature: string } | null>(null)

  if (cart.items.length === 0) return <Navigate to="/cart" />

  const selectedWallet = wallets.find((wallet) => wallet.id === form.watch('walletId'))
  const isConnected = connection !== null && connection.walletId === form.watch('walletId') && connection.network === network

  const onConnect = () => {
    const values = form.getValues()
    const provider = checkoutFormSchema.shape.provider.safeParse(values.provider).data
    if (!values.walletId || !provider) return void form.trigger(['walletId', 'provider'])
    setConnectError(null)
    connect.mutate(
      { walletId: values.walletId, network, provider },
      {
        onError: (error) =>
          setConnectError(isApiError(error) && error.code === 'WALLET_REJECTED' ? t.checkout.rejected : t.form.genericError),
      },
    )
  }

  const onConfirm = form.handleSubmit((values) => {
    setSubmitError(null)
    if (!isConnected) return setConnectError(t.checkout.connectFirst)
    if (!quote.data) return
    setReview({ values, signature: quoteSignature(quote.data) })
  })

  const submitOrder = () => {
    if (!review || !quote.data) return
    // Values changed while the review was open (e.g. a realtime price update): require a new confirmation (P4).
    const signature = quoteSignature(quote.data)
    if (review.signature !== signature) return setReview({ ...review, signature })
    setSubmitError(null)
    const { values } = review
    placeOrder.mutate(
      {
        quoteId: quote.data.quoteId,
        walletId: values.walletId,
        network: values.network,
        buyer: { displayName: values.displayName, username: values.username, email: values.email, note: values.note || null },
      },
      {
        onSuccess: (result) => {
          setReview(null)
          void navigate({ to: '/orders/$orderId', params: { orderId: result.kind === 'created' ? result.order.id : result.orderId } })
        },
        onError: (error) => {
          if (error instanceof StaleQuoteError) {
            setReview(null)
            setStaleNotice(t.checkout.staleQuote)
            announce(t.checkout.staleQuote)
            return
          }
          if (isApiError(error) && error.code === 'WALLET_DISCONNECTED') {
            setReview(null)
            disconnect.reset()
            return setConnectError(t.checkout.disconnected)
          }
          setSubmitError(
            isApiError(error) && error.reason === 'timeout' ? t.checkout.timeout : isApiError(error) ? error.message : t.form.genericError,
          )
        },
      },
    )
  }

  return (
    <form noValidate onSubmit={onConfirm} className="flex flex-col gap-8 lg:flex-row lg:justify-between">
      {/* Figma: desktop = collector form, then wallet; mobile = wallet first (form collapsed). */}
      <div className="flex min-w-0 flex-col gap-8 lg:w-[763px]">
        <div className="order-2 lg:order-1">
          <CollectorFields form={form} />
        </div>
        <div className="order-1 lg:order-2">
          <SavedWalletPicker form={form} wallets={wallets} />
        </div>
      </div>

      <aside aria-labelledby="checkout-summary-title" className="flex flex-col gap-4 lg:w-[405px]">
        <h2 id="checkout-summary-title" className="text-lg font-bold">
          {t.checkout.yourNfts}
        </h2>
        {staleNotice && (
          <p role="alert" className="rounded border border-primary/60 bg-primary/10 p-3 text-sm" data-testid="stale-quote">
            {staleNotice}
          </p>
        )}
        {quote.isPending ? (
          <div aria-busy="true" className="flex flex-col gap-3">
            <span className="sr-only">{t.catalog.updating}</span>
            <Skeleton className="h-[70px] w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : quote.isError ? (
          <QuoteError error={quote.error} onRetry={() => void quote.refetch()} />
        ) : (
          <OrderLines quote={quote.data} />
        )}
        <Link to="/cart" className="text-center text-sm text-muted-foreground hover:text-text-accent">
          {t.checkout.couponHint}
        </Link>
        <WalletProviderPicker
          form={form}
          hasWallets={wallets.length > 0}
          connection={connection}
          connecting={connect.isPending}
          connectError={connectError}
          onConnect={onConnect}
          onDisconnect={() => selectedWallet && disconnect.mutate(selectedWallet.id)}
        />
        <Button
          ref={confirmButton}
          type="submit"
          disabled={!quote.data || placeOrder.isPending}
          className="h-[60px] rounded-full text-base font-bold lg:h-[45px] lg:rounded-lg"
        >
          {t.checkout.confirm}
        </Button>
      </aside>

      {review && quote.data && (
        <ReviewDialog
          open
          quote={quote.data}
          walletLabel={selectedWallet ? `${selectedWallet.alias} · ${t.walletTypes[review.values.provider]}` : ''}
          network={review.values.network}
          changed={review.signature !== quoteSignature(quote.data)}
          submitting={placeOrder.isPending}
          error={submitError}
          onSubmit={submitOrder}
          onClose={() => setReview(null)}
          returnFocusTo={confirmButton}
        />
      )}
    </form>
  )
}
