// Runs Lighthouse 3x per page/profile against `npm run preview` and reports the median.
// Usage: npm run build && npm run preview & npm run lighthouse  (BASE_URL overrides target)
import { mkdir, writeFile } from 'node:fs/promises'
import os from 'node:os'
import { chromium } from '@playwright/test'
import * as chromeLauncher from 'chrome-launcher'
import lighthouse from 'lighthouse'
import desktopConfig from 'lighthouse/core/config/desktop-config.js'

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4173'
const RUNS = Number(process.env.LH_RUNS ?? 3)
const PAGES = { home: '/', detail: process.env.LH_DETAIL_PATH ?? '/nft/1' }
const PROFILES = { mobile: undefined, desktop: desktopConfig }
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo']
const OUT = 'docs/lighthouse'

const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)]

await mkdir(OUT, { recursive: true })
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
}

await writeFile(`${OUT}/summary.json`, JSON.stringify(summary, null, 2))
console.table(
  Object.fromEntries(
    Object.entries(summary.results).map(([k, { throttling: _t, ...v }]) => [k, v]),
  ),
)
