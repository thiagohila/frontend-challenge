// Session-scoped resources (socket, subscriptions) register teardown here; run on sign-out / user switch (A5, RT6).
/** Receives the user whose session ended (null = anonymous). */
type Teardown = (userId: string | null) => void | Promise<void>
const teardowns = new Set<Teardown>()

export function onSessionEnd(teardown: Teardown) {
  teardowns.add(teardown)
  return () => {
    teardowns.delete(teardown)
  }
}

export async function endSessionResources(userId: string | null) {
  await Promise.allSettled([...teardowns].map((teardown) => teardown(userId)))
}
