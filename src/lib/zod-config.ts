import { z } from 'zod'

// zod v4 tries `new Function` (JIT) for faster parsing. Our CSP forbids eval (script-src 'self'), which
// zod survives but Chrome logs as a CSP issue (Lighthouse Best Practices). Opt out explicitly.
z.config({ jitless: true })
