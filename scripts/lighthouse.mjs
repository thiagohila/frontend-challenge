// Runs Lighthouse 3x per page/profile against the optimized build and reports the median.
// Usage: npm run build && npm run lighthouse   (starts/stops `vite preview` itself; BASE_URL targets another server)
import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import os from 'node:os'
import { chromium } from '@playwright/test'
import * as chromeLauncher from 'chrome-launcher'
import lighthouse from 'lighthouse'
import desktopConfig from 'lighthouse/core/config/desktop-config.js'

const PORT = 4174
const BASE_URL = process.env.BASE_URL ?? `http://localhost:${PORT}`
const RUNS = Number(process.env.LH_RUNS ?? 3)
const PAGES = { home: '/', detail: process.env.LH_DETAIL_PATH ?? '/nft/1' }
const PROFILES = { mobile: undefined, desktop: desktopConfig }
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo']
const OUT = 'docs/lighthouse'

const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)]

async function startPreview() {
  if (process.env.BASE_URL) return undefined
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })
  for (let i = 0; i < 50; i++) {
    try {
      if ((await fetch(BASE_URL)).ok) return server
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
  server.kill()
  throw new Error(`preview did not start on ${BASE_URL} — run \`npm run build\` first`)
}

await mkdir(OUT, { recursive: true })
const preview = await startPreview()
// CHROME_PATH > Playwright's Chromium (pinned version → reproducible on a clean checkout)
const chromePath = () => process.env.CHROME_PATH ?? chromium.executablePath()

const chrome = await chromeLauncher.launch({ chromePath: chromePath(), chromeFlags: ['--headless=new'] })
const summary = {
  baseUrl: BASE_URL,
  runs: RUNS,
  node: process.version,
  os: `${os.type()} ${os.release()} ${os.arch()}`,
  cpu: `${os.cpus()[0]?.model} x${os.cpus().length}`,
  memoryGb: Math.round(os.totalmem() / 1024 ** 3),
  results: {},
}

try {
  for (const [page, path] of Object.entries(PAGES)) {
    for (const [profile, config] of Object.entries(PROFILES)) {
      const runs = []
      for (let i = 1; i <= RUNS; i++) {
        const result = await lighthouse(
          BASE_URL + path,
          { port: chrome.port, output: ['html', 'json'], onlyCategories: CATEGORIES },
          config,
        )
        const [html, json] = result.report
        await writeFile(`${OUT}/${page}-${profile}-${i}.html`, html)
        await writeFile(`${OUT}/${page}-${profile}-${i}.json`, json)
        const { categories, audits } = result.lhr
        runs.push({
          ...Object.fromEntries(CATEGORIES.map((c) => [c, Math.round(categories[c].score * 100)])),
          LCP: Math.round(audits['largest-contentful-paint'].numericValue),
          CLS: Number(audits['cumulative-layout-shift'].numericValue.toFixed(3)),
          TBT: Math.round(audits['total-blocking-time'].numericValue),
          lighthouseVersion: result.lhr.lighthouseVersion,
          userAgent: result.lhr.environment.hostUserAgent,
          benchmarkIndex: result.lhr.environment.benchmarkIndex,
          throttling: result.lhr.configSettings.throttling,
          formFactor: result.lhr.configSettings.formFactor,
        })
      }
      const keys = [...CATEGORIES, 'LCP', 'CLS', 'TBT']
      summary.results[`${page}/${profile}`] = {
        ...Object.fromEntries(keys.map((k) => [k, median(runs.map((r) => r[k]))])),
        formFactor: runs[0].formFactor,
        throttling: runs[0].throttling,
        benchmarkIndex: median(runs.map((r) => r.benchmarkIndex)),
      }
      summary.lighthouseVersion = runs[0].lighthouseVersion
      summary.userAgent = runs[0].userAgent
    }
  }
} finally {
  chrome.kill()
  preview?.kill()
}

await writeFile(`${OUT}/summary.json`, JSON.stringify(summary, null, 2))
console.table(Object.fromEntries(Object.entries(summary.results).map(([k, { throttling: _t, ...v }]) => [k, v])))
