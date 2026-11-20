// Pull the dominant colors out of image pixels. Pure function: pass in RGBA bytes (canvas getImageData().data).
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
const toHex = (rgb) => '#' + rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')

export function extractColors(data, k = 5) {
  // Group pixels into coarse color buckets (16 levels per channel), averaging each bucket.
  const buckets = new Map()
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue // skip transparent pixels
    const key = ((data[i] >> 4) << 8) | ((data[i + 1] >> 4) << 4) | (data[i + 2] >> 4)
    const b = buckets.get(key) || { n: 0, r: 0, g: 0, b: 0 }
    b.n++; b.r += data[i]; b.g += data[i + 1]; b.b += data[i + 2]
    buckets.set(key, b)
  }
  const cand = [...buckets.values()].map((b) => ({ n: b.n, rgb: [b.r / b.n, b.g / b.n, b.b / b.n] })).sort((a, b) => b.n - a.n)
  // Take the most common colors, but insist they differ; relax the rule if the image is not varied enough.
  const chosen = []
  for (let min = 70; chosen.length < k && min >= 0; min -= 15) {
    for (const c of cand) {
      if (chosen.length >= k) break
      if (!chosen.includes(c) && chosen.every((o) => dist(o.rgb, c.rgb) >= min)) chosen.push(c)
    }
  }
  return chosen.map((c) => toHex(c.rgb))
}
