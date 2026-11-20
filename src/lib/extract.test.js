import assert from 'node:assert/strict'
import { extractColors } from './extract.js'

const px = (r, g, b, a = 255, n = 1) => Array(n).fill([r, g, b, a]).flat()
const near = (hex, [r, g, b]) => { const n = parseInt(hex.slice(1), 16); return Math.hypot((n >> 16) - r, ((n >> 8) & 255) - g, (n & 255) - b) < 20 }

// 70% red, 30% blue
let found = extractColors(Uint8ClampedArray.from([...px(230, 30, 30, 255, 70), ...px(30, 30, 230, 255, 30)]), 5)
assert.equal(found.length, 2)
assert.ok(near(found[0], [230, 30, 30]), 'most common color comes first')
assert.ok(near(found[1], [30, 30, 230]))

// transparent pixels are ignored
found = extractColors(Uint8ClampedArray.from([...px(0, 255, 0, 0, 500), ...px(10, 10, 10, 255, 5)]), 5)
assert.equal(found.length, 1)

// respects k, and returns valid hex
const rand = Uint8ClampedArray.from({ length: 4 * 5000 }, (_, i) => (i % 4 === 3 ? 255 : Math.floor(Math.random() * 256)))
found = extractColors(rand, 5)
assert.equal(found.length, 5)
assert.ok(found.every((c) => /^#[0-9a-f]{6}$/.test(c)))
assert.equal(extractColors(rand, 3).length, 3)
console.log('Extract tests passed')
