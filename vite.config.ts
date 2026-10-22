import { execSync } from 'node:child_process'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// Deployed version = delivered code (REQUIREMENTS D2): commit is shown in the footer and /version.json.
const commit = (() => {
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7)
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return 'dev'
  }
})()

/**
 * The mock server chunk is imported dynamically after the app boots; preloading it from the HTML lets it
 * download in parallel with the app instead of after it (data — and the LCP card image — arrive sooner).
 */
const preloadMockServer = (): Plugin => ({
  name: 'preload-mock-server',
  apply: 'build',
  transformIndexHtml: {
    order: 'post',
    handler(_html, context) {
      if (process.env.VITE_ENABLE_MOCKS === 'false' || !context.bundle) return []
      const chunk = Object.values(context.bundle).find(
        (output) => output.type === 'chunk' && output.facadeModuleId?.endsWith('src/mocks/browser.ts'),
      )
      return chunk ? [{ tag: 'link', attrs: { rel: 'modulepreload', href: `/${chunk.fileName}` }, injectTo: 'head' }] : []
    },
  },
})

const versionFile = (): Plugin => ({
  name: 'version-file',
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ commit }) })
  },
})

export default defineConfig({
  plugins: [
    // must run before react()
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      // Also split pending/error/notFound components: by default they stay in the entry chunk and drag
      // their imports (e.g. the whole NFT detail view) into the critical path (L2, REVIEW-LOG B8).
      codeSplittingOptions: {
        defaultBehavior: [['component'], ['pendingComponent'], ['errorComponent'], ['notFoundComponent']],
      },
    }),
    react(),
    tailwindcss(),
    versionFile(),
    preloadMockServer(),
  ],
  define: { __APP_COMMIT__: JSON.stringify(commit) },
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
})
