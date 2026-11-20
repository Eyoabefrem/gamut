import { readableOn } from './color'

export const toCSS = (c) => `:root {\n${c.map((h, i) => `  --color-${i + 1}: ${h};`).join('\n')}\n}`
export const toTailwind = (c) => `/* Tailwind v4: put this in your main CSS file */\n@theme {\n${c.map((h, i) => `  --color-palette-${i + 1}: ${h};`).join('\n')}\n}\n/* Then use classes like bg-palette-1 and text-palette-2 */`
export const toJSON = (c) => JSON.stringify(c, null, 2)

export function downloadPng(colors, name = 'palette') {
  const w = 1200, h = 500, cw = w / colors.length
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h
  const x = cv.getContext('2d')
  colors.forEach((hex, i) => {
    x.fillStyle = hex; x.fillRect(i * cw, 0, cw + 1, h)
    x.fillStyle = readableOn(hex); x.font = '600 28px sans-serif'; x.fillText(hex.toUpperCase(), i * cw + 24, h - 32)
  })
  cv.toBlob((b) => {
    const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `${name || 'palette'}.png`; a.click(); URL.revokeObjectURL(a.href)
  })
}
