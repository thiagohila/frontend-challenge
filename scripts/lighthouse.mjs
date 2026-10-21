// Runs Lighthouse 3x per page/profile against `npm run preview` and reports the median.
// Usage: npm run build && npm run preview & npm run lighthouse  (BASE_URL overrides target)
import { mkdir, writeFile } from 'node:fs/promises'
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
const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new'] })
const summary = { baseUrl: BASE_URL, runs: RUNS, node: process.version, results: {} }

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
          LCP: audits['largest-contentful-paint'].numericValue,
          CLS: audits['cumulative-layout-shift'].numericValue,
          TBT: audits['total-blocking-time'].numericValue,
          lighthouseVersion: result.lhr.lighthouseVersion,
          userAgent: result.lhr.environment.hostUserAgent,
        })
      }
      const keys = [...CATEGORIES, 'LCP', 'CLS', 'TBT']
      summary.results[`${page}/${profile}`] = Object.fromEntries(keys.map((k) => [k, median(runs.map((r) => r[k]))]))
      summary.lighthouseVersion = runs[0].lighthouseVersion
      summary.userAgent = runs[0].userAgent
    }
  }
} finally {
  chrome.kill()
}

await writeFile(`${OUT}/summary.json`, JSON.stringify(summary, null, 2))
console.table(summary.results)
