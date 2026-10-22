// Session-scoped resources (socket, subscriptions) register teardown here; run on sign-out / user switch (A5, RT6).
type Teardown = () => void | Promise<void>
const teardowns = new Set<Teardown>()

export function onSessionEnd(teardown: Teardown) {
  teardowns.add(teardown)
  return () => {
    teardowns.delete(teardown)
  }
}

export async function endSessionResources() {
  await Promise.allSettled([...teardowns].map((teardown) => teardown()))
}
