import { useState, useEffect, useCallback, useRef } from 'react'
import { Lock, Unlock, X, Plus, Copy, Download, Link2, Save, ImagePlus } from 'lucide-react'
import Header from '../components/Header'
import { generate, readableOn, contrast, hexToHsl, hslToHex, simulate } from '../lib/color'
import { toCSS, toTailwind, toJSON, downloadPng } from '../lib/export'
import { savePalette } from '../lib/library'
import { extractColors } from '../lib/extract'
import { saveCloud } from '../lib/cloud'
import { useAuth } from '../lib/auth'

// A palette lives in the address bar (#264653-2a9d8f-...), so any link is shareable with no account.
const fromHash = () => {
  const c = location.hash.slice(1).split('-').filter((s) => /^[0-9a-f]{6}$/i.test(s)).map((s) => '#' + s.toLowerCase())
  return c.length >= 2 && c.length <= 8 ? c : null
}
const VISION = [['none', 'Normal vision'], ['protanopia', 'Protanopia'], ['deuteranopia', 'Deuteranopia'], ['tritanopia', 'Tritanopia']]
const FORMATS = { css: ['CSS', toCSS], tailwind: ['Tailwind v4', toTailwind], json: ['JSON', toJSON] }
const Panel = ({ title, children }) => (
  <section className="border-2 border-[var(--ink)] p-5"><h2 className="display text-2xl mb-4">{title}</h2>{children}</section>
)
const sel = 'border-2 border-[var(--ink)] bg-transparent px-3 py-2 font-semibold'

export default function Studio() {
  const { user } = useAuth()
  const [colors, setColors] = useState(() => fromHash() || generate(5))
  const [locks, setLocks] = useState(() => Array(colors.length).fill(false))
  const [pick, setPick] = useState(0)
  const [vision, setVision] = useState('none')
  const [fmt, setFmt] = useState('css')
  const [name, setName] = useState('')
  const [pair, setPair] = useState([0, 1])
  const [note, setNote] = useState('')

  const flash = (m) => { setNote(m); setTimeout(() => setNote(''), 2800) }
  const save = async () => {
    if (!user) { savePalette(name, colors); return flash('Saved in this browser. Log in to keep it everywhere.') }
    try { await saveCloud(name, colors); flash('Saved to your library') } catch (e) { flash(e.message) }
  }
  const fileRef = useRef(null)
  const fromImage = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/') || file.size > 15e6) return flash('Choose an image under 15 MB.')
    const url = URL.createObjectURL(file), img = new Image()
    img.onload = () => {
      const sc = Math.min(1, 160 / Math.max(img.width, img.height)), cv = document.createElement('canvas')
      cv.width = Math.max(1, Math.round(img.width * sc)); cv.height = Math.max(1, Math.round(img.height * sc))
      const cx = cv.getContext('2d'); cx.drawImage(img, 0, 0, cv.width, cv.height); URL.revokeObjectURL(url)
      const found = extractColors(cx.getImageData(0, 0, cv.width, cv.height).data, 5)
      if (found.length < 2) return flash('That image has too few colors to build a palette.')
      setColors(found); setLocks(found.map(() => false)); setPick(0); flash('Colors pulled from your image')
    }
    img.onerror = () => { URL.revokeObjectURL(url); flash('Could not read that image.') }
    img.src = url
  }
  const regen = useCallback(() => setColors((c) => generate(c.length, c, locks)), [locks])
  useEffect(() => { history.replaceState(null, '', '#' + colors.map((c) => c.slice(1)).join('-')) }, [colors])
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== 'Space' || /INPUT|TEXTAREA|SELECT|BUTTON/.test(e.target.tagName)) return
      e.preventDefault(); regen()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [regen])

  const n = colors.length
  const p = Math.min(pick, n - 1)
  const [a, b] = [Math.min(pair[0], n - 1), Math.min(pair[1], n - 1)]
  const setColor = (i, hex) => setColors(colors.map((c, j) => (j === i ? hex : c)))
  const add = () => { setColors(generate(n + 1, colors, [...colors.map(() => true), false])); setLocks([...locks, false]) }
  const remove = (i) => { setColors(colors.filter((_, j) => j !== i)); setLocks(locks.filter((_, j) => j !== i)); setPick(0) }
  const copy = async (text, msg = 'Copied') => { try { await navigator.clipboard.writeText(text); flash(msg) } catch { flash('Copy failed') } }

  const [h, s, l] = hexToHsl(colors[p])
  const ratio = contrast(colors[a], colors[b])
  const checks = [['AA normal text', 4.5], ['AA large text', 3], ['AAA normal text', 7], ['AAA large text', 4.5]]
  const code = FORMATS[fmt][1](colors)

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        <div className="flex flex-col md:flex-row border-2 border-[var(--ink)] md:h-[26rem]">
          {colors.map((hex, i) => {
            const shown = simulate(hex, vision), ink = readableOn(shown)
            return (
              <div key={i} onClick={() => setPick(i)} className="flex-1 min-h-28 flex flex-row md:flex-col justify-between items-center md:items-start p-4 cursor-pointer transition-colors duration-300" style={{ background: shown, color: ink, outline: p === i ? `4px solid ${ink}` : 'none', outlineOffset: -8 }}>
                <span className="flex md:flex-col gap-3">
                  <button onClick={(e) => { e.stopPropagation(); setLocks(locks.map((v, j) => (j === i ? !v : v))) }} aria-pressed={locks[i]} aria-label={`${locks[i] ? 'Unlock' : 'Lock'} color ${i + 1}`}>{locks[i] ? <Lock size={20} /> : <Unlock size={20} />}</button>
                  {n > 2 && <button onClick={(e) => { e.stopPropagation(); remove(i) }} aria-label={`Remove color ${i + 1}`} className="opacity-70 hover:opacity-100"><X size={20} /></button>}
                </span>
                <button onClick={(e) => { e.stopPropagation(); copy(hex.toUpperCase(), 'Hex copied') }} className="display text-2xl text-left" aria-label={`Copy ${hex}`}>{hex.slice(1).toUpperCase()}</button>
              </div>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-5">
          <button onClick={regen} className="btn">Generate</button>
          <button onClick={add} disabled={n >= 8} className="btn btn-ghost flex items-center gap-1 disabled:opacity-40"><Plus size={16} />Add color</button>
          <button onClick={() => fileRef.current.click()} className="btn btn-ghost flex items-center gap-1"><ImagePlus size={16} />From image</button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { fromImage(e.target.files[0]); e.target.value = '' }} />
          <select value={vision} onChange={(e) => setVision(e.target.value)} className={sel} aria-label="Color vision preview">{VISION.map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
          <button onClick={() => copy(location.href, 'Link copied')} className="btn btn-ghost flex items-center gap-1"><Link2 size={16} />Share link</button>
          <span className="flex gap-2 ml-auto">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Palette name" className={`${sel} w-40 font-normal`} aria-label="Palette name" />
            <button onClick={save} className="btn flex items-center gap-1"><Save size={16} />Save</button>
          </span>
        </div>
        <p className="mt-3 h-6 font-semibold" role="status">{note || (vision !== 'none' ? 'Preview only. Exports always use your real colors.' : '')}</p>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <Panel title="Edit color">
            <div className="flex items-center gap-3 mb-5">
              <span className="size-12 border-2 border-[var(--ink)]" style={{ background: colors[p] }} />
              <input key={colors[p]} defaultValue={colors[p].toUpperCase()} onBlur={(e) => /^#?[0-9a-f]{6}$/i.test(e.target.value.trim()) ? setColor(p, '#' + e.target.value.trim().replace('#', '').toLowerCase()) : (e.target.value = colors[p].toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && e.target.blur()} className={`${sel} w-32 uppercase`} aria-label="Hex value" />
            </div>
            {[['Hue', h, 360, (v) => hslToHex(v, s, l)], ['Saturation', s, 100, (v) => hslToHex(h, v, l)], ['Lightness', l, 100, (v) => hslToHex(h, s, v)]].map(([label, val, max, fn]) => (
              <label key={label} className="block mb-3 font-semibold">{label} <span style={{ color: 'var(--muted)' }}>{val}</span>
                <input type="range" min="0" max={max} value={val} onChange={(e) => setColor(p, fn(+e.target.value))} className="w-full accent-[var(--m)]" />
              </label>
            ))}
          </Panel>

          <Panel title="Contrast">
            <div className="flex gap-3 mb-4">
              {[0, 1].map((k) => (
                <select key={k} value={pair[k]} onChange={(e) => setPair(pair.map((v, j) => (j === k ? +e.target.value : v)))} className={`${sel} flex-1`} aria-label={k ? 'Background color' : 'Text color'}>
                  {colors.map((c, i) => <option key={i} value={i}>{k ? 'Background' : 'Text'} {c.toUpperCase()}</option>)}
                </select>
              ))}
            </div>
            <div className="p-5 mb-4 border-2 border-[var(--ink)]" style={{ background: colors[b], color: colors[a] }}>
              <p className="display text-3xl">Aa The quick fox</p><p className="mt-1">Body text sample at regular size.</p>
            </div>
            <p className="display text-4xl mb-3">{ratio.toFixed(2)}:1</p>
            <ul className="grid grid-cols-2 gap-2">
              {checks.map(([label, min]) => (
                <li key={label} className="px-3 py-2 font-semibold border-2 border-[var(--ink)]" style={ratio >= min ? { background: 'var(--y)', color: '#111' } : { opacity: 0.55 }}>{ratio >= min ? 'Pass' : 'Fail'}: {label}</li>
              ))}
            </ul>
          </Panel>

          <div className="md:col-span-2">
            <Panel title="Export">
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(FORMATS).map(([k, [label]]) => (
                  <button key={k} onClick={() => setFmt(k)} className={`px-4 py-2 font-bold border-2 border-[var(--ink)] ${fmt === k ? 'bg-[var(--ink)] text-[var(--paper)]' : ''}`}>{label}</button>
                ))}
                <button onClick={() => copy(code, 'Code copied')} className="btn !py-2 flex items-center gap-1 ml-auto"><Copy size={16} />Copy</button>
                <button onClick={() => downloadPng(colors, name)} className="btn btn-ghost !py-2 flex items-center gap-1"><Download size={16} />PNG</button>
              </div>
              <pre className="border-2 border-[var(--ink)] p-4 overflow-x-auto text-sm leading-relaxed"><code>{code}</code></pre>
            </Panel>
          </div>
        </div>
      </main>
    </div>
  )
}
