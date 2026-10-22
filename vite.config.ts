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
  ],
  define: { __APP_COMMIT__: JSON.stringify(commit) },
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
})
