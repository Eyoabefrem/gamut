// Color math for Gamut. No dependencies.
const clamp = (n, a, b) => Math.min(b, Math.max(a, n))
const rand = (a, b) => a + Math.random() * (b - a)

export function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360; s = clamp(s, 0, 100) / 100; l = clamp(l, 0, 100) / 100
  const k = (n) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return '#' + [f(0), f(8), f(4)].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('')
}
export const hexToRgb = (hex) => { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255] }

// WCAG relative luminance and contrast ratio (1 to 21).
export function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
export const readableOn = (hex) => (contrast(hex, '#111111') >= contrast(hex, '#ffffff') ? '#111111' : '#ffffff')

// Hue offsets for a few classic harmonies.
const HARMONIES = [[0, 20, 40, -20, -40], [0, 180, 30, 210, -30], [0, 120, 240, 20, 140], [0, 150, 210, 30, -30], [0, 60, 120, 180, 240]]

// Make `count` colors. Anything locked keeps its current color.
export function generate(count = 5, current = [], locks = []) {
  const base = rand(0, 360)
  const offs = HARMONIES[Math.floor(Math.random() * HARMONIES.length)]
  // Spread lightness evenly so every palette has real contrast, then shuffle the order.
  const lights = Array.from({ length: count }, (_, i) => 20 + (60 * i) / Math.max(1, count - 1) + rand(-5, 5))
  for (let i = lights.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [lights[i], lights[j]] = [lights[j], lights[i]] }
  return lights.map((l, i) => (locks[i] && current[i] ? current[i] : hslToHex(base + offs[i % offs.length] + rand(-6, 6), rand(35, 85), l)))
}

export function hexToHsl(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255)
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min, l = (max + min) / 2
  let h = 0, s = 0
  if (d) {
    s = d / (1 - Math.abs(2 * l - 1))
    h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4
    h = (h * 60 + 360) % 360
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)]
}

// Color-vision simulation (Machado et al. 2009, full severity), applied in linear RGB. An approximation, not a diagnosis.
const MATRICES = {
  protanopia: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deuteranopia: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
  tritanopia: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.3039]],
}
const toLin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
const toSrgb = (v) => (v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055)
export function simulate(hex, type) {
  const m = MATRICES[type]
  if (!m) return hex
  const lin = hexToRgb(hex).map((v) => toLin(v / 255))
  const out = m.map((row) => clamp(toSrgb(clamp(row[0] * lin[0] + row[1] * lin[1] + row[2] * lin[2], 0, 1)), 0, 1))
  return '#' + out.map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('')
}
