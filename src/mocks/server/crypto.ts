// Passwords are never stored in clear (REQUIREMENTS A8): PBKDF2-SHA256 + per-user salt via WebCrypto.
const ITERATIONS = 100_000

const toHex = (buffer: ArrayBuffer) => [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('')

export function randomSalt(): string {
  return toHex(crypto.getRandomValues(new Uint8Array(16)).buffer)
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode(salt), iterations: ITERATIONS },
    key,
    256,
  )
  return toHex(bits)
}

export async function verifyPassword(password: string, salt: string, expectedHash: string): Promise<boolean> {
  return (await hashPassword(password, salt)) === expectedHash
}

/** Stable hash of a request body, used to detect idempotency-key reuse with a different payload. */
export async function hashPayload(payload: unknown): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(payload)))
  return toHex(digest)
}
