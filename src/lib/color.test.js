import assert from 'node:assert/strict'
import { generate, contrast, readableOn, hslToHex, hexToHsl, simulate } from './color.js'

const HEX = /^#[0-9a-f]{6}$/
assert.equal(hslToHex(0, 100, 50), '#ff0000')
assert.equal(hslToHex(240, 100, 50), '#0000ff')
assert.ok(Math.abs(contrast('#000000', '#ffffff') - 21) < 0.01)
assert.equal(contrast('#777777', '#777777'), 1)
assert.equal(readableOn('#000000'), '#ffffff')
assert.equal(readableOn('#ffffff'), '#111111')

for (let t = 0; t < 2000; t++) {
  const n = 2 + Math.floor(Math.random() * 7)
  const first = generate(n)
  assert.equal(first.length, n)
  assert.ok(first.every((c) => HEX.test(c)))
  const locks = first.map(() => Math.random() < 0.5)
  const next = generate(n, first, locks)
  first.forEach((c, i) => { if (locks[i]) assert.equal(next[i], c) })
}
assert.deepEqual(hexToHsl('#ff0000'), [0, 100, 50])
assert.deepEqual(hexToHsl('#808080'), [0, 0, 50])
assert.equal(simulate('#336699', 'none'), '#336699')
for (const t of ['protanopia', 'deuteranopia', 'tritanopia']) {
  assert.ok(HEX.test(simulate('#e63946', t)))
  assert.ok(contrast('#808080', simulate('#808080', t)) < 1.1) // grays stay gray
}
assert.notEqual(simulate('#ff0000', 'protanopia'), '#ff0000')
console.log('All tests passed')
