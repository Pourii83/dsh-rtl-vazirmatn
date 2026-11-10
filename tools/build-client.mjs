#!/usr/bin/env node
/**
 * Inlines the bundled Vazirmatn WOFF2 face into `client.template.js` and
 * writes the browser bundle the Host serves.
 *
 * Usage: node tools/build-client.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const fontPath = join(root, 'assets', 'Vazirmatn-Variable.woff2')
const templatePath = join(root, 'client.template.js')
const outputPath = join(root, 'client.js')
const PLACEHOLDER = '__VAZIRMATN_BASE64__'

const font = readFileSync(fontPath)
if (font.subarray(0, 4).toString('ascii') !== 'wOF2') {
  throw new Error(`Not a WOFF2 file: ${fontPath}`)
}

const template = readFileSync(templatePath, 'utf8')
if (!template.includes(PLACEHOLDER)) {
  throw new Error(`Template placeholder missing: ${templatePath}`)
}

const source = template.replace(PLACEHOLDER, font.toString('base64'))
writeFileSync(outputPath, source)
console.log(`Wrote ${outputPath} (${source.length} bytes, font ${font.length} bytes)`)
