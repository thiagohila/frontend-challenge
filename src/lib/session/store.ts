import { useSyncExternalStore } from 'react'
import type { User } from '@/contracts/auth'
import { readStorage, removeStorage, writeStorage } from '@/lib/storage'

export type SessionState =
  | { status: 'unknown' }
  | { status: 'anonymous' }
  | { status: 'authenticated'; token: string; expiresAt: string; user: User }
  | { status: 'expired'; user: User }

const TOKEN_KEY = 'kurio:session'

interface PersistedSession {
  token: string
  expiresAt: string
  user: User
}

const persisted = readStorage<PersistedSession>('session', TOKEN_KEY)
let state: SessionState = persisted ? { status: 'authenticated', ...persisted } : { status: 'anonymous' }
const listeners = new Set<() => void>()

function setState(next: SessionState) {
  state = next
  for (const listener of listeners) listener()
}

export const session = {
  get: () => state,
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  token: () => (state.status === 'authenticated' ? state.token : null),
  userId: () => (state.status === 'authenticated' || state.status === 'expired' ? state.user.id : null),
  signIn(value: PersistedSession) {
    writeStorage('session', TOKEN_KEY, value)
    setState({ status: 'authenticated', ...value })
  },
  /** Server rejected the token mid-flow: keep the user so the UI can offer re-auth in place. */
  expire() {
    if (state.status !== 'authenticated') return
    removeStorage('session', TOKEN_KEY)
    setState({ status: 'expired', user: state.user })
  },
  updateUser(user: User) {
    if (state.status !== 'authenticated') return
    const next = { token: state.token, expiresAt: state.expiresAt, user }
    writeStorage('session', TOKEN_KEY, next)
    setState({ status: 'authenticated', ...next })
  },
  signOut() {
    removeStorage('session', TOKEN_KEY)
    setState({ status: 'anonymous' })
  },
}

export const useSession = () => useSyncExternalStore(session.subscribe, session.get, session.get)

/** User of the current (or expired-but-resumable) session — what private screens render for. */
export function useSessionUser(): User | null {
  const state = useSession()
  return state.status === 'authenticated' || state.status === 'expired' ? state.user : null
}
