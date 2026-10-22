import { useState } from 'react'
import { networkSchema, type Network } from '@/contracts/common'
import { t } from '@/i18n'
import { mockControl } from '../control'
import type { ScenarioName } from '../scenarios'
import type { DbState } from '../server/db'
import { Field, PanelButton, Section, controlClassName } from './panel-ui'

type Run = (label: string, action: () => unknown) => Promise<void>

const scenarioNames = Object.keys(mockControl.scenarios) as ScenarioName[]
const isScenario = (value: string): value is ScenarioName => scenarioNames.some((name) => name === value)

export function ScenarioControls({ run, busy }: { run: Run; busy: boolean }) {
  const [scenario, setScenario] = useState<ScenarioName>(mockControl.scenario)
  const [latency, setLatency] = useState('')
  return (
    <Section title={t.mockPanel.scenario}>
      <Field label={t.mockPanel.scenario}>
        {(id) => (
          <select
            id={id}
            className={controlClassName}
            value={scenario}
            onChange={(event) => isScenario(event.target.value) && setScenario(event.target.value)}
          >
            {scenarioNames.map((name) => (
              <option key={name} value={name}>
                {name} — {mockControl.scenarios[name]}
              </option>
            ))}
          </select>
        )}
      </Field>
      <div className="flex gap-2">
        <PanelButton disabled={busy} onClick={() => void run(t.mockPanel.apply, () => mockControl.setScenario(scenario))}>
          {t.mockPanel.apply}
        </PanelButton>
        <PanelButton disabled={busy} onClick={() => void run(t.mockPanel.reset, () => mockControl.reset())}>
          {t.mockPanel.reset}
        </PanelButton>
      </div>
      <Field label={t.mockPanel.latency} hint={t.mockPanel.latencyHint}>
        {(id, describedBy) => (
          <input
            id={id}
            aria-describedby={describedBy}
            type="number"
            min={0}
            step={100}
            inputMode="numeric"
            className={controlClassName}
            value={latency}
            onChange={(event) => setLatency(event.target.value)}
          />
        )}
      </Field>
      <PanelButton
        disabled={busy}
        onClick={() => void run(t.mockPanel.setLatency, () => mockControl.setLatency(latency === '' ? null : Math.max(0, Number(latency))))}
      >
        {t.mockPanel.setLatency}
      </PanelButton>
    </Section>
  )
}

/** Price and stock changes go through the server's single write path: REST + `nft.updated` (M9). */
export function CatalogControls({ snapshot, run, busy }: { snapshot: DbState; run: Run; busy: boolean }) {
  const [nftId, setNftId] = useState(snapshot.nfts[0]?.id ?? '')
  const nft = snapshot.nfts.find((candidate) => candidate.id === nftId)
  const [price, setPrice] = useState('')
  const [editionId, setEditionId] = useState('')
  const [available, setAvailable] = useState('')
  const edition = nft?.editions.find((candidate) => candidate.id === editionId) ?? nft?.editions[0]

  if (!nft) return null
  return (
    <Section title={t.mockPanel.nft}>
      <Field label={t.mockPanel.nft}>
        {(id) => (
          <select
            id={id}
            className={controlClassName}
            value={nft.id}
            onChange={(event) => {
              setNftId(event.target.value)
              setEditionId('')
            }}
          >
            {snapshot.nfts.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.name} #{String(candidate.number).padStart(3, '0')} · {candidate.priceEth} ETH
              </option>
            ))}
          </select>
        )}
      </Field>
      <Field label={t.mockPanel.price}>
        {(id) => (
          <input
            id={id}
            inputMode="decimal"
            placeholder={nft.priceEth}
            className={controlClassName}
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
        )}
      </Field>
      <PanelButton
        disabled={busy || !/^\d+(\.\d+)?$/.test(price)}
        onClick={() => void run(t.mockPanel.setPrice, () => mockControl.updateNft(nft.id, { priceEth: price }))}
      >
        {t.mockPanel.setPrice}
      </PanelButton>
      <div className="grid grid-cols-2 gap-2">
        <Field label={t.mockPanel.edition}>
          {(id) => (
            <select id={id} className={controlClassName} value={edition?.id ?? ''} onChange={(event) => setEditionId(event.target.value)}>
              {nft.editions.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.label} ({candidate.available})
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field label={t.mockPanel.available}>
          {(id) => (
            <input
              id={id}
              type="number"
              min={0}
              inputMode="numeric"
              placeholder={String(edition?.available ?? '')}
              className={controlClassName}
              value={available}
              onChange={(event) => setAvailable(event.target.value)}
            />
          )}
        </Field>
      </div>
      <PanelButton
        disabled={busy || !edition || available === ''}
        onClick={() =>
          edition &&
          void run(t.mockPanel.setStock, () =>
            mockControl.updateNft(nft.id, { editions: [{ id: edition.id, available: Number(available) }] }),
          )
        }
      >
        {t.mockPanel.setStock}
      </PanelButton>
    </Section>
  )
}

export function FeeControls({ run, busy }: { run: Run; busy: boolean }) {
  const [network, setNetwork] = useState<Network>('ethereum')
  const [fee, setFee] = useState('')
  return (
    <Section title={t.mockPanel.networkFee}>
      <div className="grid grid-cols-2 gap-2">
        <Field label={t.mockPanel.network}>
          {(id) => (
            <select
              id={id}
              className={controlClassName}
              value={network}
              onChange={(event) => setNetwork(networkSchema.parse(event.target.value))}
            >
              {networkSchema.options.map((option) => (
                <option key={option} value={option}>
                  {t.networks[option]}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field label={t.mockPanel.networkFee}>
          {(id) => (
            <input id={id} inputMode="decimal" className={controlClassName} value={fee} onChange={(event) => setFee(event.target.value)} />
          )}
        </Field>
      </div>
      <PanelButton
        disabled={busy || !/^\d+(\.\d+)?$/.test(fee)}
        onClick={() => void run(t.mockPanel.setFee, () => mockControl.setNetworkFee(network, fee))}
      >
        {t.mockPanel.setFee}
      </PanelButton>
    </Section>
  )
}

export function RealtimeAndOrders({ snapshot, run, busy }: { snapshot: DbState; run: Run; busy: boolean }) {
  const pending = snapshot.orders.filter((order) => order.status === 'pending')
  return (
    <>
      <Section title={t.mockPanel.realtime}>
        <p className="text-xs">{t.mockPanel.connections(mockControl.socketConnections())}</p>
        <div className="flex flex-wrap gap-2">
          <PanelButton disabled={busy} onClick={() => void run(t.mockPanel.dropSocket, () => mockControl.dropConnection())}>
            {t.mockPanel.dropSocket}
          </PanelButton>
          <PanelButton disabled={busy} onClick={() => void run(t.mockPanel.expireSession, () => mockControl.expireSession())}>
            {t.mockPanel.expireSession}
          </PanelButton>
        </div>
      </Section>
      <Section title={t.mockPanel.orders}>
        {pending.length === 0 ? (
          <p className="text-xs">{t.mockPanel.noOrders}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {pending.map((order) => (
              <li key={order.id} className="flex items-center justify-between gap-2 text-xs">
                <span className="truncate">
                  {order.id} · {order.receipt.totalEth} ETH
                </span>
                <span className="flex gap-1">
                  <PanelButton
                    disabled={busy}
                    onClick={() => void run(`${t.mockPanel.confirm} ${order.id}`, () => mockControl.resolveOrder(order.id, 'confirmed'))}
                  >
                    {t.mockPanel.confirm}
                  </PanelButton>
                  <PanelButton
                    disabled={busy}
                    onClick={() => void run(`${t.mockPanel.decline} ${order.id}`, () => mockControl.resolveOrder(order.id, 'declined'))}
                  >
                    {t.mockPanel.decline}
                  </PanelButton>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  )
}
