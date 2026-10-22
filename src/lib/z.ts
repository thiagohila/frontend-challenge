import { z } from 'zod'

/**
 * Single entry point for zod. v4 probes `new Function` (JIT) on first schema creation; our CSP forbids
 * eval (script-src 'self') and Chrome logs a CSP issue. Configuring here — in the module every schema
 * imports — guarantees the setting runs before any schema exists, whatever the bundler's chunk order.
 */
z.config({ jitless: true })

export { z }
