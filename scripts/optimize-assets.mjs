// Builds public/assets from the Figma exports in design-src/assets (reproducible; run after re-exporting).
// NFT art → AVIF + WebP at responsive widths; SVG icons/logos copied as-is (deco-* become CSS, skipped).
import { copyFile, mkdir, readdir, rm } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SRC = 'design-src/assets'
const OUT = 'public/assets'
const WIDTHS = [256, 512, 900]

await rm(OUT, { recursive: true, force: true })
await mkdir(`${OUT}/nft`, { recursive: true })
await mkdir(`${OUT}/icons`, { recursive: true })

const files = await readdir(SRC)
for (const file of files) {
  const { name, ext } = path.parse(file)
  const src = path.join(SRC, file)
  if (ext === '.png' && name.startsWith('nft-')) {
    const slug = name.replace(/^nft-/, '')
    for (const width of WIDTHS) {
      const image = sharp(src).resize({ width })
      await image.clone().avif({ quality: 55 }).toFile(`${OUT}/nft/${slug}-${width}.avif`)
      await image.clone().webp({ quality: 78 }).toFile(`${OUT}/nft/${slug}-${width}.webp`)
    }
  } else if (ext === '.svg' && !name.startsWith('deco-')) {
    await copyFile(src, `${OUT}/icons/${file}`)
  }
}
console.log('assets written to', OUT)
