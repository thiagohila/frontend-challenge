import type { SeedOptions } from './server/seed'

export type FailureResponse = { status: number } | 'network' | 'timeout'

export interface FailureRule {
  method: string // 'GET' | 'POST' | ... | '*'
  path: string // glob relative to /api, e.g. '/me/favorites/*'
  response: FailureResponse
  times?: number // omitted = persistent
}

export interface Scenario {
  description: string
  latency: number | readonly [number, number]
  seed?: SeedOptions
  failures?: readonly FailureRule[]
  /** Behaviour switches read by services (consumed once where noted). */
  flags?: {
    sessionTtlMs?: number
    registerConflict?: boolean
    allCouponsExpired?: boolean
    priceChangeOnCheckout?: boolean
    soldOutOnCheckout?: boolean
    orderTimeoutAfterCommit?: boolean
    paymentOutcome?: 'confirmed' | 'declined'
    walletRejects?: boolean
    walletDisconnectsAfterMs?: number
    forbidPrivate?: boolean
  }
}

const DEFAULT_LATENCY = [120, 400] as const

/** Deterministic scenarios (REQUIREMENTS M5). Select with `?scenario=<name>` or `window.__mock.setScenario`. */
export const scenarios = {
  default: { description: 'Sucesso: dados completos, latência normal', latency: DEFAULT_LATENCY },
  empty: { description: 'Catálogo vazio', latency: DEFAULT_LATENCY, seed: { emptyCatalog: true } },
  slow: { description: 'Rede lenta (2,5 s por requisição)', latency: 2_500 },
  jitter: { description: 'Latência variável (100–1800 ms): respostas fora de ordem', latency: [100, 1_800] },
  offline: { description: 'Sem conexão com o servidor', latency: 0, failures: [{ method: '*', path: '/*', response: 'network' }] },
  'server-error': {
    description: 'Falha 503 em todas as rotas',
    latency: DEFAULT_LATENCY,
    failures: [{ method: '*', path: '/*', response: { status: 503 } }],
  },
  'session-expired': { description: 'Sessões expiram 20 s após o login', latency: DEFAULT_LATENCY, flags: { sessionTtlMs: 20_000 } },
  'register-conflict': { description: 'Cadastro sempre em conflito (409)', latency: DEFAULT_LATENCY, flags: { registerConflict: true } },
  'coupon-expired': { description: 'Todos os cupons expirados', latency: DEFAULT_LATENCY, flags: { allCouponsExpired: true } },
  'price-change-checkout': {
    description: 'O preço muda na confirmação da compra',
    latency: DEFAULT_LATENCY,
    flags: { priceChangeOnCheckout: true },
  },
  'sold-out-checkout': {
    description: 'A edição esgota na confirmação da compra',
    latency: DEFAULT_LATENCY,
    flags: { soldOutOnCheckout: true },
  },
  'order-timeout': {
    description: 'Pedido criado, mas a resposta não chega (timeout); reenvio recupera o mesmo pedido',
    latency: DEFAULT_LATENCY,
    flags: { orderTimeoutAfterCommit: true },
  },
  'payment-declined': { description: 'Pagamento recusado', latency: DEFAULT_LATENCY, flags: { paymentOutcome: 'declined' } },
  'wallet-rejected': { description: 'A carteira recusa a conexão', latency: DEFAULT_LATENCY, flags: { walletRejects: true } },
  'wallet-disconnect': {
    description: 'A carteira desconecta 5 s após conectar',
    latency: DEFAULT_LATENCY,
    flags: { walletDisconnectsAfterMs: 5_000 },
  },
  'favorite-fail': {
    description: 'Favoritar falha (500)',
    latency: DEFAULT_LATENCY,
    failures: [{ method: '*', path: '/me/favorites/*', response: { status: 500 } }],
  },
  unauthorized: { description: 'Acesso não autorizado (403) em rotas privadas', latency: DEFAULT_LATENCY, flags: { forbidPrivate: true } },
} as const satisfies Record<string, Scenario>

export type ScenarioName = keyof typeof scenarios
export const scenarioNames = Object.keys(scenarios) as ScenarioName[]
export const isScenarioName = (value: string): value is ScenarioName => value in scenarios
